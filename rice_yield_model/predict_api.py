# predict_api.py
# Flask app that receives frontend payloads and returns model prediction + diagnostics.
# Enhanced: returns units and display-ready values for each used feature.

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import os
from datetime import datetime
import json
import traceback

# ----------------------------
# CONFIG - change paths if needed
# ----------------------------
MODEL_PATH = "outputs/model.joblib"
FEATURES_CSV = "outputs/model_feature_names.csv"
SUMMARY_STATS_CSV = "outputs/summary_stats.csv"    # optional
METRICS_JSON = "outputs/model_metrics.json"       # optional
SUBMISSIONS_LOG = "submissions_log.csv"
PORT = int(os.environ.get("PREDICT_API_PORT", 8000))

# ----------------------------
# Initialize app
# ----------------------------
app = Flask(__name__)
CORS(app)  # allow all origins by default; change in production

# ----------------------------
# Validate model exists and load
# ----------------------------
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model not found at {MODEL_PATH}. Place saved model there before starting API.")

model = joblib.load(MODEL_PATH)

# ----------------------------
# Load feature names
# ----------------------------
if os.path.exists(FEATURES_CSV):
    try:
        model_feature_names = list(pd.read_csv(FEATURES_CSV, header=None).iloc[:, 0].astype(str).values)
    except Exception:
        raise RuntimeError("Failed to read FEATURES_CSV. Ensure it's a single-column CSV with feature names in correct order.")
else:
    # try to infer from model (if sklearn estimator with feature_names_in_)
    model_feature_names = getattr(model, "feature_names_in_", None)
    if model_feature_names is None:
        raise FileNotFoundError("Feature names not found. Provide outputs/model_feature_names.csv or use a model with feature_names_in_.")
    model_feature_names = list(model_feature_names)

# ----------------------------
# Load summary defaults for fallback filling
# ----------------------------
summary_defaults = {}
if os.path.exists(SUMMARY_STATS_CSV):
    try:
        df_s = pd.read_csv(SUMMARY_STATS_CSV)
        if df_s.shape[0] > 1:
            df_s = pd.DataFrame(df_s.mean()).T
        summary_defaults = df_s.iloc[0].to_dict()
    except Exception:
        summary_defaults = {}

# ----------------------------
# Load metrics if available
# ----------------------------
model_metrics = {}
if os.path.exists(METRICS_JSON):
    try:
        with open(METRICS_JSON, "r") as fh:
            model_metrics = json.load(fh)
    except Exception:
        model_metrics = {}

# ----------------------------
# Helper utilities
# ----------------------------
def safe_float(x):
    """Convert to python float or return np.nan."""
    try:
        return float(x)
    except Exception:
        return np.nan

def to_py_scalar(x):
    """Convert numpy scalar to native python type for JSON safety."""
    if isinstance(x, (np.floating, np.float32, np.float64)):
        return float(x)
    if isinstance(x, (np.integer, np.int32, np.int64)):
        return int(x)
    return x

def build_feature_row(payload: dict, feature_order: list):
    """
    Build a DataFrame with a single row in the exact feature order required by the model.
    Fill missing fields with summary_defaults when available, else NaN.
    Returns (df_row, warnings_list)
    """
    row = {}
    warnings = []
    for f in feature_order:
        # allow some common synonyms mapping (makes frontend easier)
        val = None
        if f in payload:
            val = payload.get(f)
        else:
            alt_keys = {
                "area": ["area", "area_ha", "land_area", "land_area_ha", "landArea"],
                "Season_Rainfall_sum": ["season_rain_sum","Season_Rainfall_sum","seasonal_rainfall_sum","rain_sum","season_rainfall_sum"],
                "Season_Rainfall_mean": ["season_rain_mean","rain_mean","seasonal_rainfall_mean"],
                "Season_Tmean_mean": ["season_tmean","tmean","season_tmean"],
                "Season_Tmax_mean": ["season_tmax","tmax"],
                "Season_Tmin_mean": ["season_tmin","tmin"],
                "Season_Humidity_mean": ["season_humidity", "humidity", "rh"]
            }
            for canonical, alts in alt_keys.items():
                if f == canonical:
                    for a in alts:
                        if a in payload:
                            val = payload.get(a)
                            break
        # final value check
        if val is None:
            if f in summary_defaults and not pd.isna(summary_defaults[f]):
                row[f] = float(summary_defaults[f])
                warnings.append(f"feature '{f}' filled from historical summary defaults")
            else:
                row[f] = np.nan
                warnings.append(f"feature '{f}' missing and no default available")
        else:
            row[f] = safe_float(val)
    df = pd.DataFrame([row], columns=feature_order)
    return df, warnings

def save_submission_record(payload: dict, features_df: pd.DataFrame, prediction: float, warnings_list: list):
    """Append submission record to SUBMISSIONS_LOG CSV (best-effort)."""
    try:
        rec = {
            "timestamp": datetime.utcnow().isoformat(),
            "prediction_MT_per_HA": float(prediction)
        }
        # flatten payload keys (stringify dict/list values)
        for k, v in payload.items():
            if isinstance(v, (dict, list)):
                rec[f"payload_{k}"] = json.dumps(v)
            else:
                rec[f"payload_{k}"] = v
        # add used features
        for col in features_df.columns:
            val = features_df.loc[0, col]
            rec[f"feat_{col}"] = None if pd.isna(val) else float(val)
        rec["warnings"] = "|".join(warnings_list) if warnings_list else ""
        df_row = pd.DataFrame([rec])
        if os.path.exists(SUBMISSIONS_LOG):
            df_old = pd.read_csv(SUBMISSIONS_LOG)
            df_new = pd.concat([df_old, df_row], ignore_index=True)
            df_new.to_csv(SUBMISSIONS_LOG, index=False)
        else:
            df_row.to_csv(SUBMISSIONS_LOG, index=False)
    except Exception:
        traceback.print_exc()

# ----------------------------
# Example health endpoint
# ----------------------------
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "model_loaded": os.path.exists(MODEL_PATH),
        "n_features": len(model_feature_names),
        "model_metrics_available": bool(model_metrics)
    })

# ----------------------------
# Main prediction endpoint
# ----------------------------
@app.route("/predict", methods=["POST"])
def predict():
    """
    Expected JSON payload example:
    {
      "land_area": 1.5,
      "unit": "Hectares",   # optional - if "Acres" we'll convert to hectares
      "season_tmean": 29.8,
      "season_tmax": 33.5,
      "season_tmin": 24.1,
      "season_rain_sum": 450,
      "season_rain_mean": 56.25,
      "humidity": 72.5,
      "year": 2024
    }
    """
    try:
        payload = request.get_json(force=True)
    except Exception:
        return jsonify({"error": "Invalid JSON payload"}), 400

    warnings = []

    # ----------------------------
    # Normalize area + units (accept many keys)
    # ----------------------------
    area_val = None
    for k in ("land_area", "area", "area_ha", "landArea"):
        if k in payload:
            area_val = payload.get(k)
            break

    original_area_unit = payload.get("unit", payload.get("unit_of_area", "Hectares"))
    original_area_unit_label = original_area_unit if isinstance(original_area_unit, str) else "Hectares"

    if area_val is None:
        return jsonify({"error": "Missing required field: land_area (or area, area_ha)"}), 400
    try:
        area_val = float(area_val)
    except Exception:
        return jsonify({"error": "Invalid numeric land_area"}), 400

    # Convert acres -> hectares if user passed Acres
    if isinstance(original_area_unit_label, str) and original_area_unit_label.lower().startswith("acre"):
        # store original acres for display, convert to hectares for model
        area_in_acres = area_val
        area_val = area_val * 0.404686  # acres -> hectares
        warnings.append("area converted from Acres to Hectares (normalized for model)")
    else:
        area_in_acres = None

    # Put normalized area into payload under key 'area' (model feature expects hectares)
    payload["area"] = area_val

    # ----------------------------
    # Build feature row (ordered)
    # ----------------------------
    feature_row, fb_warnings = build_feature_row(payload, model_feature_names)
    warnings.extend(fb_warnings)

    # ----------------------------
    # Fill remaining NaNs using summary defaults or column means
    # ----------------------------
    if feature_row.isna().any(axis=None):
        for col in feature_row.columns:
            if pd.isna(feature_row.loc[0, col]):
                if col in summary_defaults and not pd.isna(summary_defaults[col]):
                    feature_row.loc[0, col] = float(summary_defaults[col])
                    warnings.append(f"filled {col} with summary default")
        if feature_row.isna().any(axis=None):
            # last resort - fill with column mean
            feature_row = feature_row.fillna(feature_row.mean().values)
            warnings.append("filled remaining missing features with column means (fallback)")

    # ----------------------------
    # Add units mapping & formatted values for frontend display
    # ----------------------------
    FEATURE_UNITS = {
        "Season_Humidity_mean": "%",
        "Season_Rainfall_mean": "mm",
        "Season_Rainfall_sum": "mm",
        "Season_Tmax_mean": "°C",
        "Season_Tmean_mean": "°C",
        "Season_Tmin_mean": "°C",
        "area": "ha"
    }

    used_values = {}
    used_values_with_units = {}

    for c in feature_row.columns:
        raw_val = feature_row.loc[0, c]
        if pd.isna(raw_val):
            used_values[c] = None
            used_values_with_units[c] = None
            continue

        # store numeric raw value (python float)
        used_values[c] = to_py_scalar(raw_val)

        unit = FEATURE_UNITS.get(c, "")
        # Formatting and display
        if c == "area":
            # area is stored in hectares in feature_row; show both ha and acres if original was acres
            ha_val = float(raw_val)
            ha_display = f"{ha_val:.3f}"
            if area_in_acres is not None:
                # original was passed in acres; compute accurate acres display from normalized ha
                acres_from_ha = ha_val * 2.47105381
                used_values_with_units[c] = {
                    "value_ha": float(f"{ha_val:.6f}"),
                    "display": f"{ha_display} ha ({acres_from_ha:.2f} acres)",
                    "unit": "ha",
                    "original_unit": original_area_unit_label
                }
            else:
                used_values_with_units[c] = {
                    "value_ha": float(f"{ha_val:.6f}"),
                    "display": f"{ha_display} ha",
                    "unit": "ha",
                    "original_unit": original_area_unit_label
                }
        else:
            # numeric formatting: one decimal for display, but keep full numeric value in `value`
            val_float = float(raw_val)
            display = f"{val_float:.1f}" + (f" {unit}" if unit else "")
            used_values_with_units[c] = {
                "value": float(f"{val_float:.6f}"),
                "display": display,
                "unit": unit if unit else None
            }

    feature_units = {k: FEATURE_UNITS.get(k, "") for k in feature_row.columns}

    # ----------------------------
    # Predict with model
    # ----------------------------
    try:
        try:
            pred = model.predict(feature_row)[0]
        except Exception:
            # some saved pipelines expect numpy array
            pred = model.predict(feature_row.values)[0]
        pred = float(pred)
    except Exception as e:
        return jsonify({"error": f"Model prediction failed: {str(e)}"}), 500

    # ----------------------------
    # Build response
    # ----------------------------
    response = {
        "predicted_yield_MT_per_HA": pred,
        "used_feature_values": {c: (None if pd.isna(feature_row.loc[0, c]) else to_py_scalar(feature_row.loc[0, c])) for c in feature_row.columns},
        "used_feature_values_with_units": used_values_with_units,
        "feature_units": feature_units,
        "model_info": {
            "model_file": os.path.basename(MODEL_PATH),
            "n_features_expected": len(model_feature_names),
            "model_metrics": model_metrics
        },
        "warnings": warnings,
        "timestamp_utc": datetime.utcnow().isoformat()
    }

    # ----------------------------
    # Optionally include feature importances
    # ----------------------------
    try:
        if hasattr(model, "feature_importances_"):
            fi = list(zip(model_feature_names, list(model.feature_importances_)))
            fi_sorted = sorted(fi, key=lambda x: -abs(x[1]))
            response["feature_importances"] = [{"feature": f, "importance": to_py_scalar(v)} for f, v in fi_sorted]
    except Exception:
        # swallow any issues here
        pass

    # Save submission record (best-effort)
    try:
        save_submission_record(payload, feature_row, pred, warnings)
    except Exception:
        pass

    return jsonify(response), 200

# ----------------------------
# Run app
# ----------------------------
if __name__ == "__main__":
    print(f"Starting predict_api on port {PORT} (model {MODEL_PATH})")
    app.run(host="0.0.0.0", port=PORT)

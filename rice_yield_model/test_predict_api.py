# predict_api.py
# Flask app that receives frontend payloads and returns model prediction + diagnostics.
#
# Usage:
#   1) Put your trained model (joblib) at outputs/model.joblib
#   2) Put outputs/model_feature_names.csv (one column, no header) with X.columns order used in training
#   3) Optionally put outputs/summary_stats.csv (single row or many rows - will use means) for defaults
#   4) Optionally put outputs/model_metrics.json containing saved metrics (MAE, RMSE, R2 etc.)
#   5) Run: python predict_api.py
#
# Endpoint:
#   POST /predict
#   Accepts JSON payload (see example below). Returns JSON response with prediction & diagnostics.
#
# Notes:
# - This code makes reasonable best-effort defaults; adjust to your project specifics.

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
# Load model and metadata at startup
# ----------------------------
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model not found at {MODEL_PATH}. Place saved model there before starting API.")

model = joblib.load(MODEL_PATH)

# load feature names
if os.path.exists(FEATURES_CSV):
    try:
        model_feature_names = list(pd.read_csv(FEATURES_CSV, header=None).iloc[:,0].astype(str).values)
    except Exception:
        raise RuntimeError("Failed to read FEATURES_CSV. Ensure it's a single-column CSV with feature names in correct order.")
else:
    # try to infer from model (if sklearn pipeline saved feature_names_in_)
    model_feature_names = getattr(model, "feature_names_in_", None)
    if model_feature_names is None:
        raise FileNotFoundError("Feature names not found. Provide outputs/model_feature_names.csv or use a model with feature_names_in_.")
    model_feature_names = list(model_feature_names)

# load summary defaults for fallback filling
summary_defaults = {}
if os.path.exists(SUMMARY_STATS_CSV):
    try:
        df_s = pd.read_csv(SUMMARY_STATS_CSV)
        if df_s.shape[0] > 1:
            df_s = pd.DataFrame(df_s.mean()).T
        summary_defaults = df_s.iloc[0].to_dict()
    except Exception:
        summary_defaults = {}

# load metrics if available
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
    try:
        return float(x)
    except Exception:
        return np.nan

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
        # e.g., "area" or "area_ha" or "land_area"
        val = None
        # direct match
        if f in payload:
            val = payload.get(f)
        else:
            # check common alternates
            alt_keys = {
                "area": ["area", "area_ha", "land_area", "land_area_ha"],
                "Season_Rainfall_sum": ["season_rain_sum","Season_Rainfall_sum","seasonal_rainfall_sum","rain_sum"],
                "Season_Rainfall_mean": ["season_rain_mean","rain_mean"],
                "Season_Tmean_mean": ["season_tmean","tmean"],
                "Season_Tmax_mean": ["season_tmax","tmax"],
                "Season_Tmin_mean": ["season_tmin","tmin"],
                "Season_Humidity_mean": ["season_humidity", "humidity"],
            }
            for canonical, alts in alt_keys.items():
                if f == canonical:
                    for a in alts:
                        if a in payload:
                            val = payload.get(a)
                            break
        # final value check
        if val is None:
            # try summary_defaults fallback
            if f in summary_defaults and not pd.isna(summary_defaults[f]):
                row[f] = float(summary_defaults[f])
                warnings.append(f"feature '{f}' filled from historical summary defaults")
            else:
                row[f] = np.nan
                warnings.append(f"feature '{f}' missing and no default available")
        else:
            # convert units if necessary (e.g., area unit passed as 'unit': 'Acres')
            # The frontend may send 'unit' separately; we handle it later above
            row[f] = safe_float(val)
    df = pd.DataFrame([row], columns=feature_order)
    return df, warnings

def save_submission_record(payload: dict, features_df: pd.DataFrame, prediction: float, warnings_list: list):
    """Append submission record to SUBMISSIONS_LOG CSV."""
    try:
        rec = {
            "timestamp": datetime.utcnow().isoformat(),
            "prediction_MT_per_HA": float(prediction)
        }
        # flatten payload keys (stringify complex items like dicts)
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
        # never break the API because of logging; swallow exceptions
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
    Expected JSON payload structure (example):
    {
      "land_area": 1.5,
      "unit": "Hectares",   # optional - if "Acres" we'll convert to hectares
      "region": "Lumbini",
      "location": "Ward-3",
      "rice_type": "Improved",
      "humidity": 72.5,    # optional
      "soil_ph": 6.3,      # optional
      "phosphorus": 20,    # optional
      "nitrogen": 200,     # optional
      "organic": 3.5,      # optional
      "water_source": "Irrigation",
      "season_rain_sum": 350.2,   # optional (fallback to summary_defaults)
      "season_rain_mean": 40.2,
      "season_tmean": 29.8,
      "season_tmax": 33.5,
      "season_tmin": 24.1,
      "year": 2024
    }
    """
    try:
        payload = request.get_json(force=True)
    except Exception:
        return jsonify({"error": "Invalid JSON payload"}), 400

    warnings = []
    # Normalize some keys and units
    # Make sure we have an area value and convert acres->hectares if needed
    # Accept keys: land_area, area, area_ha
    area_val = None
    for k in ("land_area","area","area_ha","landArea"):
        if k in payload:
            area_val = payload.get(k)
            break
    unit = payload.get("unit", payload.get("unit_of_area", "Hectares"))
    if area_val is None:
        return jsonify({"error": "Missing required field: land_area (or area, area_ha)"}), 400
    try:
        area_val = float(area_val)
    except Exception:
        return jsonify({"error": "Invalid numeric land_area"}), 400
    if isinstance(unit, str) and unit.lower().startswith("acre"):
        area_val = area_val * 0.404686  # convert acres -> hectares
        warnings.append("area converted from Acres to Hectares")

    # insert normalized area back into payload as 'area' which our feature builder might expect
    payload["area"] = area_val

    # Build feature row (order = model_feature_names)
    feature_row, fb_warnings = build_feature_row(payload, model_feature_names)
    warnings.extend(fb_warnings)

    # If there are NaNs still, try column-wise fill with summary_defaults mean or model expects numeric fill
    if feature_row.isna().any(axis=None):
        # attempt to fill with summary_defaults if present, else column mean fallback
        for col in feature_row.columns:
            if pd.isna(feature_row.loc[0,col]):
                if col in summary_defaults and not pd.isna(summary_defaults[col]):
                    feature_row.loc[0,col] = float(summary_defaults[col])
                    warnings.append(f"filled {col} with summary default")
        # final fallback: fill remaining NaNs with column means (best-effort)
        if feature_row.isna().any(axis=None):
            feature_row = feature_row.fillna(feature_row.mean().values)
            warnings.append("filled remaining missing features with column means (fallback)")

    # Predict
    try:
        # model may be pipeline; pass DataFrame or numpy array
        try:
            pred = model.predict(feature_row)[0]
        except Exception:
            pred = model.predict(feature_row.values)[0]
    except Exception as e:
        return jsonify({"error": f"Model prediction failed: {str(e)}"}), 500

    # Build response
    response = {
        "predicted_yield_MT_per_HA": float(pred),
        "used_feature_values": {c: (None if pd.isna(feature_row.loc[0,c]) else float(feature_row.loc[0,c])) for c in feature_row.columns},
        "model_info": {
            "model_file": os.path.basename(MODEL_PATH),
            "n_features_expected": len(model_feature_names),
            "model_metrics": model_metrics  # may be empty
        },
        "warnings": warnings,
        "timestamp_utc": datetime.utcnow().isoformat()
    }

    # Optionally include feature importances for tree models
    try:
        if hasattr(model, "feature_importances_"):
            fi = list(zip(model_feature_names, list(model.feature_importances_)))
            fi_sorted = sorted(fi, key=lambda x: -abs(x[1]))
            response["feature_importances"] = [{"feature": f, "importance": float(v)} for f,v in fi_sorted]
    except Exception:
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

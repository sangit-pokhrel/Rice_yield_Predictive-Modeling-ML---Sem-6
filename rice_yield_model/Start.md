python -m uvicorn predict_flask_api:app --reload --port 8000

The server response structure will be 

{
    "predicted_yield_MT_per_HA": 3.669252795815297,
    "used_feature_values": {
        "Season_Rainfall_sum": 450.0,
        "Season_Rainfall_mean": 56.25,
        "Season_Tmean_mean": 29.8,
        "Season_Tmax_mean": 33.5,
        "Season_Tmin_mean": 24.1,
        "Season_Humidity_mean": 72.5,
        "area": 1.5
    },
    "used_feature_values_with_units": {
        "Season_Rainfall_sum": {
            "value": 450.0,
            "display": "450.0 mm",
            "unit": "mm"
        },
        "Season_Rainfall_mean": {
            "value": 56.25,
            "display": "56.2 mm",
            "unit": "mm"
        },
        "Season_Tmean_mean": {
            "value": 29.8,
            "display": "29.8 °C",
            "unit": "°C"
        },
        "Season_Tmax_mean": {
            "value": 33.5,
            "display": "33.5 °C",
            "unit": "°C"
        },
        "Season_Tmin_mean": {
            "value": 24.1,
            "display": "24.1 °C",
            "unit": "°C"
        },
        "Season_Humidity_mean": {
            "value": 72.5,
            "display": "72.5 %",
            "unit": "%"
        },
        "area": {
            "value_ha": 1.5,
            "display": "1.500 ha",
            "unit": "ha",
            "original_unit": "Hectares"
        }
    },
    "feature_units": {
        "Season_Rainfall_sum": "mm",
        "Season_Rainfall_mean": "mm",
        "Season_Tmean_mean": "°C",
        "Season_Tmax_mean": "°C",
        "Season_Tmin_mean": "°C",
        "Season_Humidity_mean": "%",
        "area": "ha"
    },
    "model_info": {
        "model_file": "model.joblib",
        "n_features_expected": 7,
        "model_metrics": {
            "LinearRegression": {
                "Train_MAE": 0.3263810820282308,
                "Test_MAE": 0.811824648831675,
                "Train_RMSE": 0.4305576347858245,
                "Test_RMSE": 0.9088132158822623,
                "Train_R2": 0.5802348009221083,
                "Test_R2": -13.021317768414193,
                "AccuracyLikePct": 77.76409468306244
            },
            "Ridge": {
                "Train_MAE": 0.33341137261377857,
                "Test_MAE": 0.8433800000520042,
                "Train_RMSE": 0.4339959144927386,
                "Test_RMSE": 0.9199748256488506,
                "Train_R2": 0.5735038419564443,
                "Test_R2": -13.36783893831556,
                "AccuracyLikePct": 77.49100391631613
            },
            "Lasso": {
                "Train_MAE": 0.4873469387755103,
                "Test_MAE": 1.144285714285714,
                "Train_RMSE": 0.6645506384169744,
                "Test_RMSE": 1.1697418169696023,
                "Train_R2": 0.0,
                "Test_R2": -22.228416019955656,
                "AccuracyLikePct": 71.37996253482272
            },
            "RandomForest": {
                "Train_MAE": 0.15271785714285682,
                "Test_MAE": 0.7826714285714286,
                "Train_RMSE": 0.19601504360999533,
                "Test_RMSE": 0.9612480915827243,
                "Train_R2": 0.9129993198280946,
                "Test_R2": -14.68593985067907,
                "AccuracyLikePct": 76.48117217378865
            },
            "XGBoost": {
                "Train_MAE": 0.0004722367014203493,
                "Test_MAE": 0.8993780081612723,
                "Train_RMSE": 0.0006735103609451223,
                "Test_RMSE": 1.1302508363161687,
                "Train_R2": 0.9999989728534706,
                "Test_R2": -20.686488600566996,
                "AccuracyLikePct": 72.34618715759112
            }
        }
    },
    "warnings": [],
    "timestamp_utc": "2025-11-27T18:39:11.935201",
    "feature_importances": [
        {
            "feature": "Season_Tmean_mean",
            "importance": 0.4539697501882467
        },
        {
            "feature": "Season_Tmax_mean",
            "importance": 0.19915414511662158
        },
        {
            "feature": "Season_Humidity_mean",
            "importance": 0.15218956096211564
        },
        {
            "feature": "Season_Rainfall_sum",
            "importance": 0.06354945671757925
        },
        {
            "feature": "Season_Rainfall_mean",
            "importance": 0.05811092053520214
        },
        {
            "feature": "area",
            "importance": 0.038625549194839466
        },
        {
            "feature": "Season_Tmin_mean",
            "importance": 0.034400617285395396
        }
    ]
}
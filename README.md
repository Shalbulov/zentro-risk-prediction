# Zentro Credit Risk Prediction

Machine learning pipeline for predicting loan default risk (Fannie Mae dataset).

## Description

- Classical ML pipeline for credit application scoring.
- Uses RandomForestClassifier with built-in preprocessing (SimpleImputer, StandardScaler).
- Features are preprocessed with one-hot encoding (booleans and numerics).
- Pipeline is saved in the file `zentro_rf_pipeline.joblib`.

## Usage

1. **Model Training**
   - Model training and pipeline serialization are already completed. The trained pipeline is available in `zentro_rf_pipeline.joblib`.

2. **Scoring New Clients**
   ```python
   import pandas as pd
   import joblib

   pipeline = joblib.load('zentro_rf_pipeline.joblib')
   new_clients = pd.read_csv('clients_test.csv')
   proba = pipeline.predict_proba(new_clients)[:, 1]
   new_clients['default_proba'] = proba
   print(new_clients[['Loan Identifier', 'default_proba']])


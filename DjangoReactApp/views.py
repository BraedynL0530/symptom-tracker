from django.shortcuts import render
from django.http import JsonResponse
from django.conf import settings
import json
import os
import joblib
import numpy as np
from django.views.decorators.csrf import csrf_exempt

# Create your views here.

BASE_DIR = os.path.dirname(__file__)
MODEL_DIR = os.path.join(BASE_DIR, 'models')
model = joblib.load(os.path.join(MODEL_DIR, 'xgboost_model.pkl'))
mlb = joblib.load(os.path.join(MODEL_DIR, 'mlb_encoder.pkl'))
label_encoder = joblib.load(os.path.join(MODEL_DIR, 'label_encoder.pkl'))

@csrf_exempt #temp
def predict(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            symptoms  = data.get('symptoms')

            if not symptoms:
                return JsonResponse({'error': 'No symptoms provided'}, status=400)

            #Uses saved MultiLabelBinarizer to correct input
            encoded_input = mlb.transform([symptoms]) #must be a list

            # Predict with XGBoost
            prediction = model.predict(encoded_input)
            disease = label_encoder.inverse_transform(prediction)[0]

            return JsonResponse({'prediction': disease})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


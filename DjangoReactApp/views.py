from django.shortcuts import render
from django.http import JsonResponse
from django.conf import settings
import json
import os
import joblib
import numpy as np
from django.views.decorators.csrf import csrf_exempt
from catboost import CatBoostClassifier
# Create your views here.

BASE_DIR = os.path.dirname(__file__)
MODEL_DIR = os.path.join(BASE_DIR, 'models')
model = CatBoostClassifier()
model = joblib.load(os.path.join(MODEL_DIR, 'catboost_model.pkl'))
mlb = joblib.load(os.path.join(MODEL_DIR, 'mlb.pkl'))
label_encoder = joblib.load(os.path.join(MODEL_DIR, 'le.pkl'))


print("Known symptoms in MLB:", mlb.classes_)


@csrf_exempt #temp
def predict(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            symptoms  = data.get('symptoms')
            symptoms = [s.strip().lower() for s in symptoms]

            if not symptoms:
                return JsonResponse({'error': 'No symptoms provided'}, status=400)

            #Uses saved MultiLabelBinarizer to correct input
            encoded_input = mlb.transform([symptoms]) #must be a list


            probs = model.predict_proba(encoded_input)[0]

            # Gets top 5 predictions sorted by probability descending
            top_5 = sorted(
                zip(label_encoder.inverse_transform(np.arange(len(probs))), probs),
                key=lambda x: -x[1]
            )[:5]

            # Format top predictions as a list of dicts
            top_predictions = [{'disease': name, 'confidence': float(f"{conf:.4f}")} for name, conf in top_5]


            if top_predictions[0]['confidence'] < 0.2:
                return JsonResponse({
                    'prediction': 'Model is unsure, try adding more symptoms',
                    'top_predictions': top_predictions
                })

            return JsonResponse({
                'predictions': top_predictions
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


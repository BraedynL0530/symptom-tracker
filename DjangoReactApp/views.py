from django.shortcuts import render
from django.http import JsonResponse,FileResponse

from django.conf import settings
import json
import os
import joblib
import numpy as np
from fpdf import FPDF
from django.views.decorators.csrf import csrf_exempt
from catboost import CatBoostClassifier

#Load model and encoders
BASE_DIR = os.path.dirname(__file__)
MODEL_DIR = os.path.join(BASE_DIR, 'models')
model = CatBoostClassifier()
model = joblib.load(os.path.join(MODEL_DIR, 'catboost_model.pkl'))
mlb = joblib.load(os.path.join(MODEL_DIR, 'mlb.pkl'))
label_encoder = joblib.load(os.path.join(MODEL_DIR, 'le.pkl'))


@csrf_exempt #temp
def exportPdf(request):
    data = json.loads(request.body)
    symptoms = data.get('symptoms')

    #Exports pdf
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt="Medical Prediction Report", ln=True, align="C")
    pdf.cell(200, 10, txt="Symptoms:", ln=True)
    for sym in symptoms:
        sym = sym.replace('_', ' ')
        pdf.cell(200, 10, txt=f"- {sym}", ln=True)

    temp_dir = os.path.join(BASE_DIR, 'temp')
    os.makedirs(temp_dir, exist_ok=True)
    pdf_path = os.path.join(temp_dir, "symptom_report.pdf")
    pdf.output(pdf_path)
    return FileResponse(open(pdf_path, 'rb'), as_attachment=True, filename="symptom_report.pdf")


@csrf_exempt #temp
def predict(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            symptoms  = data.get('symptoms')
            symptoms = [s.strip().lower() for s in symptoms]

            if not symptoms:
                return JsonResponse({'error': 'No symptoms provided'}, status=400)

            #Uses saved mlb to correct input
            encoded_input = mlb.transform([symptoms]) #must be a list


            probs = model.predict_proba(encoded_input)[0]

            #Gets top 5 predictions sorted by probability descending
            top_5 = sorted(
                zip(label_encoder.inverse_transform(np.arange(len(probs))), probs),
                key=lambda x: -x[1]
            )[:5]

            #Format top predictions as a list of dicts
            top_predictions = [{'disease': name, 'confidence': float(f"{conf:.4f}")} for name, conf in top_5]




            return JsonResponse({
                'predictions': top_predictions
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
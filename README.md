# 🩺 Symptom Tracker (w/ ML Diagnosis)

This web app lets users select symptoms, receive possible disease predictions using a trained machine learning model, and export the results as a downloadable PDF. **not a replacement for real medical advice.**

---
[Demo-Gif]("D:\Pycharm\DjangoReact\demo\Demo.gif")
## 🚀 Features

- ✅ Select symptoms by category
- 🧠 Predict likely diseases using a CatBoost ML model
- 📄 Download a PDF report with symptoms (for medical consultations)
- 🔐 Backend powered by Django + REST API
- 💻 Frontend built in React
- ⚙️ MultiLabelBinarizer and LabelEncoder support for accurate encoding

---

## How It Works

1. You select symptoms from categorized tabs.
2. The frontend sends them to a trained ML model (CatBoost) via API.
3. Backend returns top predictions with confidence scores.
4. Optionally export symptoms + predictions as a PDF report.

---

##  Tech Stack

| Layer      | Tech                  |
|------------|------------------------|
| Frontend   | React, JavaScript, CSS |
| Backend    | Django, Django REST    |
| ML Model   | CatBoost, Scikit-learn |
| PDF Export | `fpdf2`                |
| Deployment | Heroku (coming soon)   |

---

## Model ipynb:

[SymptomModel](https://colab.research.google.com/drive/1GiuKZHifoPUQC5KNYKnRHb9nlPLONFa5?usp=sharing)

---

## Setup Instructions

```bash
# Backend
cd backend/
pip install -r requirements.txt
python manage.py runserver

# Frontend
cd frontend/
npm install
npm start

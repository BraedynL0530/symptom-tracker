from django.urls import path
from . import views

urlpatterns = [
    path('api/predict/', views.predict, name='predict'),
    path('api/exportpdf/', views.exportPdf, name='pdf')
]
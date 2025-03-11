   # neon_serpent/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.quantum_coil, name='quantum_coil'),
]
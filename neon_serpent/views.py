   # neon_serpent/views.py
from django.shortcuts import render

def quantum_coil(request):
    return render(request, 'neon_serpent/index.html')
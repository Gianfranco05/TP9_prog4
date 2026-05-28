from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
import mercadopago
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/pagos", tags=["pagos"])

ACCESS_TOKEN = os.getenv("MERCADOPAGO_ACCESS_TOKEN")

if not ACCESS_TOKEN:
    raise RuntimeError("Falta configurar MERCADOPAGO_ACCESS_TOKEN en el archivo .env")

sdk = mercadopago.SDK(ACCESS_TOKEN)

class CursoParaPago(BaseModel):
    titulo: str
    precio: float

@router.get("/retorno")
def retorno_mercadopago():
    
    return RedirectResponse(url="http://localhost:5173/cursos")


@router.post("/crear-preferencia")
def crear_preferencia(curso: CursoParaPago):
    backend_url = os.getenv("NGROK_URL_BACKEND", "http://localhost:8000").strip().rstrip("/")
    
    
    url_retorno = f"{backend_url}/pagos/retorno"
    
    print(f"URL enviada a MP (Backend): {url_retorno}") 

    preference_data = {
        "items": [
            {
                "title": curso.titulo,
                "quantity": 1,
                "unit_price": curso.precio,
                "currency_id": "ARS"
            }
        ],
        "back_urls": {
            "success": url_retorno,
            "failure": url_retorno,
            "pending": url_retorno
        },
        "auto_return": "approved"
    }

    try:
        preference_response = sdk.preference().create(preference_data)
        
        if "status" in preference_response and preference_response["status"] >= 400:
             raise Exception(preference_response["response"]["message"])

        preference = preference_response["response"]
        
        return {
            "id": preference["id"],
            "init_point": preference["init_point"]
        }
    except Exception as e:
        print(f"ERROR GIGANTE: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al conectar con Mercado Pago: {str(e)}")
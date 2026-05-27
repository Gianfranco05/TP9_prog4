from fastapi import APIRouter, HTTPException
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

@router.post("/crear-preferencia")
def crear_preferencia(curso: CursoParaPago):
    
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    
    url_retorno = f"{frontend_url}/cursos" 

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
        preference = preference_response["response"]
        
        return {
            "id": preference["id"],
            "init_point": preference["init_point"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al conectar con Mercado Pago: {str(e)}")
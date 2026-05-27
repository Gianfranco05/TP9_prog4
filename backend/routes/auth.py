from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Usuario
from schemas import LoginRequest, LoginResponse
import jwt
import datetime

SECRET_KEY = "clave_secreta_tp7"
ALGORITHM = "HS256"

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=LoginResponse)
def login(datos: LoginRequest, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(
        Usuario.username == datos.username,
        Usuario.password == datos.password
    ).first()

    if not usuario:
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    payload = {
        "sub": usuario.username,
        "rol": usuario.rol,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=8)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    return LoginResponse(token=token, username=usuario.username, rol=usuario.rol)
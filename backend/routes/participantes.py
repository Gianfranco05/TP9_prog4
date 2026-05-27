from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from database import get_db
from models import Participante
from schemas import ParticipanteCreate, ParticipanteOut
from typing import List, Optional
import jwt

SECRET_KEY = "clave_secreta_tp7"
ALGORITHM = "HS256"

router = APIRouter(prefix="/participantes", tags=["participantes"])

def verificar_token(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token requerido")
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")

def solo_admin(payload: dict = Depends(verificar_token)):
    if payload.get("rol") != "ADMIN":
        raise HTTPException(status_code=403, detail="Se requiere rol ADMIN")
    return payload

def serializar(p: Participante) -> ParticipanteOut:
    return ParticipanteOut(
        id=p.id,
        nombre=p.nombre,
        email=p.email,
        edad=p.edad,
        pais=p.pais,
        modalidad=p.modalidad,
        tecnologias=p.tecnologias.split(",") if p.tecnologias else [],
        nivel=p.nivel,
        aceptaTerminos=p.acepta_terminos,
    )

@router.get("/", response_model=List[ParticipanteOut])
def obtener_participantes(db: Session = Depends(get_db), payload: dict = Depends(verificar_token)):
    participantes = db.query(Participante).filter(Participante.activo == True).all()  # noqa: E712
    return [serializar(p) for p in participantes]

@router.post("/", response_model=ParticipanteOut)
def crear_participante(datos: ParticipanteCreate, db: Session = Depends(get_db), payload: dict = Depends(solo_admin)):
    nuevo = Participante(
        nombre=datos.nombre,
        email=datos.email,
        edad=datos.edad,
        pais=datos.pais,
        modalidad=datos.modalidad,
        tecnologias=",".join(datos.tecnologias),
        nivel=datos.nivel,
        acepta_terminos=datos.aceptaTerminos,
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return serializar(nuevo)

@router.put("/{id}", response_model=ParticipanteOut)
def editar_participante(id: int, datos: ParticipanteCreate, db: Session = Depends(get_db), payload: dict = Depends(solo_admin)):
    participante = db.query(Participante).filter(Participante.id == id, Participante.activo == True).first()
    if not participante:
        raise HTTPException(status_code=404, detail="Participante no encontrado")
    participante.nombre = datos.nombre
    participante.email = datos.email
    participante.edad = datos.edad
    participante.pais = datos.pais
    participante.modalidad = datos.modalidad
    participante.tecnologias = ",".join(datos.tecnologias)
    participante.nivel = datos.nivel
    participante.acepta_terminos = datos.aceptaTerminos
    db.commit()
    db.refresh(participante)
    return serializar(participante)

@router.post("/resetear")
def resetear_participantes(db: Session = Depends(get_db), payload: dict = Depends(solo_admin)):
    # Reset persistente usando borrado logico: no se eliminan filas, se marcan inactivas.
    cantidad = db.query(Participante).filter(Participante.activo == True).update(  # noqa: E712
        {Participante.activo: False},
        synchronize_session=False,
    )
    db.commit()
    return {"mensaje": "Datos reseteados correctamente", "participantes_inactivados": cantidad}

@router.delete("/{id}")
def eliminar_participante(id: int, db: Session = Depends(get_db), payload: dict = Depends(solo_admin)):
    participante = db.query(Participante).filter(Participante.id == id, Participante.activo == True).first()
    if not participante:
        raise HTTPException(status_code=404, detail="Participante no encontrado")
    participante.activo = False
    db.commit()
    return {"mensaje": "Participante eliminado lógicamente"}
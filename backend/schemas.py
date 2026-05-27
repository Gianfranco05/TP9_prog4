from pydantic import BaseModel
from typing import List

class ParticipanteCreate(BaseModel):
    nombre: str
    email: str
    edad: int
    pais: str
    modalidad: str
    tecnologias: List[str]
    nivel: str
    aceptaTerminos: bool

class ParticipanteOut(BaseModel):
    id: int
    nombre: str
    email: str
    edad: int
    pais: str
    modalidad: str
    tecnologias: List[str]
    nivel: str
    aceptaTerminos: bool

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    token: str
    username: str
    rol: str
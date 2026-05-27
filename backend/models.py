from sqlalchemy import Column, Integer, String, Boolean
from database import Base

class Participante(Base):
    __tablename__ = "participantes"

    id              = Column(Integer, primary_key=True, index=True)
    nombre          = Column(String(100))
    email           = Column(String(100))
    edad            = Column(Integer)
    pais            = Column(String(50))
    modalidad       = Column(String(50))
    tecnologias     = Column(String(255))
    nivel           = Column(String(50))
    acepta_terminos = Column(Boolean, default=True)
    activo          = Column(Boolean, default=True, nullable=False)

class Usuario(Base):
    __tablename__ = "usuarios_db"

    id       = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True)
    password = Column(String(255))
    rol      = Column(String(50))
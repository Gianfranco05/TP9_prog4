from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, SessionLocal
from sqlalchemy import inspect, text
from models import Usuario
from routes.participantes import router as participantes_router
from routes.auth import router as auth_router
from routes.pagos import router as pagos_router

Base.metadata.create_all(bind=engine)


def migrar_borrado_logico_participantes():
    """
    Agrega la columna activo si la tabla ya existía antes de esta corrección.
    Esto permite hacer borrado lógico sin perder datos anteriores.
    """
    inspector = inspect(engine)
    tablas = inspector.get_table_names()

    if "participantes" not in tablas:
        return

    columnas = [columna["name"] for columna in inspector.get_columns("participantes")]
    if "activo" not in columnas:
        with engine.begin() as conexion:
            conexion.execute(text("ALTER TABLE participantes ADD COLUMN activo BOOLEAN NOT NULL DEFAULT TRUE"))


def crear_usuarios_por_defecto():
    db = SessionLocal()
    try:
        usuarios = [
            {"username": "admin", "password": "admin123", "rol": "ADMIN"},
            {"username": "consulta", "password": "consulta123", "rol": "CONSULTA"},
        ]

        for datos_usuario in usuarios:
            existe = db.query(Usuario).filter(Usuario.username == datos_usuario["username"]).first()
            if not existe:
                db.add(Usuario(**datos_usuario))

        db.commit()
    finally:
        db.close()


migrar_borrado_logico_participantes()
crear_usuarios_por_defecto()

app = FastAPI(title="TP8 - Participantes API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(participantes_router)
app.include_router(pagos_router)
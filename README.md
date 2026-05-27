# 🛒 TP9 - Gestión de Participantes e Integración con Mercado Pago

Este proyecto consiste en un sistema de gestión de participantes con un catálogo de cursos integrado con **Checkout Pro de Mercado Pago**.  
Está dividido en:

- 🔧 **Backend:** FastAPI + Python
- 💻 **Frontend:** React + Vite
- 🗄️ **Base de Datos:** MySQL

---

# 📋 Requisitos Previos

Asegúrate de tener instalado en tu computadora:

- **Python 3.8+**
- **Node.js** (versión 16 o superior)
- **MySQL** (puedes usar XAMPP o MySQL Server standalone)
- **Ngrok** *(opcional, para pruebas con URLs de retorno de Mercado Pago)*

---

# 🗄️ Configuración de la Base de Datos

1. Inicia tu servidor MySQL.
   - Por ejemplo desde XAMPP o desde el servicio local de MySQL.

2. Crea una base de datos llamada `tp4_db`.

```sql
CREATE DATABASE tp4_db;
```

---

# ⚙️ 1. Configuración e Inicio del Backend (FastAPI)

El backend expone la API REST, gestiona la base de datos y se comunica de forma segura con la SDK de Mercado Pago.

---

## 📦 Instalación

Abre una terminal y navega a la carpeta del backend:

```bash
cd backend
```

### Crear y activar entorno virtual

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### Mac / Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

---

## 📥 Instalar dependencias

```bash
pip install -r requirements.txt
```

---

## 🔑 Configuración de Variables de Entorno (`.env`)

Crea un archivo llamado `.env` dentro de la carpeta `backend/` basándote en `.env.example`.

### backend/.env

```env
# Token de prueba de Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=TEST-TU-TOKEN-AQUI

# URL del Frontend
# Si usas Ngrok para el frontend, cámbialo aquí
FRONTEND_URL=http://localhost:5173

# Credenciales de Base de Datos
# Si usas XAMPP por defecto puedes dejar root sin contraseña
DATABASE_URL=mysql+pymysql://root:tu_contraseña@localhost:3306/tp4_db
```

---

## ▶️ Ejecución del Backend

Levanta el servidor con Uvicorn:

```bash
uvicorn main:app --reload
```

El backend estará disponible en:

```txt
http://localhost:8000
```

---

## ℹ️ Nota Importante

La primera vez que se ejecute el backend se crearán automáticamente:

- Las tablas de la base de datos
- Los usuarios por defecto

### Usuarios creados automáticamente

| Rol | Usuario | Contraseña |
|---|---|---|
| Administrador | admin | admin123 |
| Consulta | consulta | consulta123 |

---

# 💻 2. Configuración e Inicio del Frontend (React + Vite)

---

## 📦 Instalación

Abre otra terminal y navega a la carpeta del frontend:

```bash
cd frontend
```

Instala las dependencias:

```bash
npm install
```

---

## 🔑 Configuración de Variables de Entorno (`.env`)

Crea un archivo `.env` en la raíz del frontend (donde se encuentra el `package.json`).

### frontend/.env

```env
VITE_API_URL=http://localhost:8000
```

> Si usas Ngrok para exponer el backend, reemplaza esta URL por la proporcionada por Ngrok.

---

## ▶️ Ejecución del Frontend

Inicia el servidor de desarrollo:

```bash
npm run dev
```

El frontend estará disponible en:

```txt
http://localhost:5173
```

---

# 💳 3. Configuración de Mercado Pago y Ngrok

---

## 🔐 Obtener el Access Token de Mercado Pago

1. Ingresa a Mercado Pago Developers.
2. Inicia sesión con tu cuenta de Mercado Pago.
3. Ve a:
   - **Tus integraciones**
   - **Crear aplicación**
4. En el panel izquierdo selecciona:
   - **Credenciales de prueba**
5. Copia el **Access Token** que comienza con:

```txt
TEST-
```

6. Pégalo en:

```env
backend/.env
```

En la variable:

```env
MERCADOPAGO_ACCESS_TOKEN=
```

---

# 🌐 Uso de Ngrok (Opcional)

Mercado Pago necesita una URL pública para redirigir al usuario después del pago.

---

## ▶️ Exponer el Frontend con Ngrok

Ejecuta:

```bash
ngrok http 5173
```

Ngrok generará una URL similar a:

```txt
https://a1b2c3d4.ngrok.app
```

---

## 🔄 Actualizar el `.env` del Backend

Reemplaza:

```env
FRONTEND_URL=http://localhost:5173
```

Por:

```env
FRONTEND_URL=https://a1b2c3d4.ngrok.app
```

---

## 🔁 Reiniciar el Backend

Después de modificar el `.env`, reinicia el backend para aplicar los cambios.

---

# 🔐 Usuarios de Prueba

Puedes iniciar sesión con las siguientes credenciales:

## 👨‍💼 Administrador

Permisos:
- Crear
- Editar
- Eliminar

```txt
Usuario: admin
Contraseña: admin123
```

---

## 👀 Usuario Consulta

Permisos:
- Solo lectura

```txt
Usuario: consulta
Contraseña: consulta123
```

---

# 🚀 Tecnologías Utilizadas

## Backend
- Python
- FastAPI
- SQLAlchemy
- PyMySQL
- Mercado Pago SDK

## Frontend
- React
- Vite
- JavaScript
- CSS

## Base de Datos
- MySQL

---

# 📁 Estructura General del Proyecto

```txt
project/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── .env
│   └── ...
│
└── README.md
```

---

# ✅ Estado del Proyecto

✔️ Gestión de participantes  
✔️ Integración con Mercado Pago Checkout Pro  
✔️ Login con roles  
✔️ CRUD completo  
✔️ Integración Frontend + Backend  
✔️ Configuración mediante variables de entorno
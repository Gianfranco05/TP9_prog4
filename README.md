# 🛒 TP9 - Gestión de Participantes e Integración con Mercado Pago

Este proyecto consiste en un sistema de gestión de participantes con un catálogo de cursos integrado con **Checkout Pro de Mercado Pago**.  
Está dividido en un backend con **FastAPI (Python)** y un frontend con **React + Vite**.

> **Nota Arquitectónica sobre el Flujo de Pago:**  
> Para cumplir con las políticas de seguridad estrictas de Mercado Pago (que exige URLs con `https://`) y evitar la pérdida de sesión en React por el salto de dominios, esta arquitectura implementa un **túnel al backend**.  
> Mercado Pago redirige al usuario hacia nuestro Backend a través de Ngrok, y el Backend se encarga de hacer un `Redirect` automático hacia el Frontend en `localhost`.  
> Este es el estándar en la industria para pasarelas de pago.

---

# 📋 Requisitos Previos

Asegúrate de tener instalado en tu computadora:

- **Python 3.8+**
- **Node.js** (versión 16 o superior)
- **MySQL** (Puedes usar XAMPP o MySQL Server standalone)
- **Ngrok** (Para la URL de retorno segura de Mercado Pago)

---

# 🗄️ Configuración de la Base de Datos

1. Inicia tu servidor MySQL.

2. Crea una base de datos llamada `tp4_db`.

```sql
CREATE DATABASE tp4_db;
```

---

# ⚙️ 1. Configuración e Inicio del Backend (FastAPI)

El backend expone la API REST, gestiona la base de datos y orquesta de forma segura la creación de la Preferencia en Mercado Pago.

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
# Token de prueba o producción de Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=TEST-TU-TOKEN-AQUI

# URL segura generada por Ngrok (APUNTANDO AL PUERTO 8000 DEL BACKEND)
NGROK_URL_BACKEND=https://tu-url.ngrok.app

# Credenciales de Base de Datos
# Si usas XAMPP por defecto, déjalo como root:@localhost
DATABASE_URL=mysql+pymysql://root:tu_contraseña@localhost:3306/tp4_db
```

---

## ▶️ Ejecución del Backend

Levanta el servidor con Uvicorn:

```bash
uvicorn main:app --reload
```

El backend estará corriendo en:

```txt
http://localhost:8000
```

---

# 💻 2. Configuración e Inicio del Frontend (React + Vite)

---

## 📦 Instalación

Abre otra terminal y navega a la carpeta del frontend:

```bash
cd frontend
```

Instala las dependencias de Node:

```bash
npm install
```

---

## 🔑 Configuración de Variables de Entorno (`.env`)

Crea un archivo llamado `.env` en la raíz de la carpeta frontend:

### frontend/.env

```env
# El frontend siempre se comunicará de forma local con el backend
VITE_API_URL=http://localhost:8000
```

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

# 💳 3. Guía de Configuración de Ngrok

Mercado Pago necesita saber a qué URL segura redirigir al usuario cuando el pago se aprueba o rechaza.  
Expondremos nuestro Backend a internet usando Ngrok.

---

## ▶️ Exponer el Backend con Ngrok

Abre una nueva terminal y ejecuta:

```bash
ngrok http 8000
```

Ngrok generará una URL similar a:

```txt
https://a1b2c3d4.ngrok-free.dev
```

---

## 🔄 Configurar el `.env`

Pega esa URL en:

```env
backend/.env
```

En la variable:

```env
NGROK_URL_BACKEND=
```

---

## 🔁 Reiniciar el Backend

Después de modificar el `.env`, reinicia Uvicorn para aplicar los cambios.

---

# 🚀 Cómo Probar el Sistema (Flujo Completo)

Para garantizar que el navegador mantenga la sesión guardada y evitar errores de CORS:

1. Asegúrate de tener ejecutándose:
   - Vite
   - Uvicorn
   - Ngrok

2. Abre el navegador e ingresa estrictamente a:

```txt
http://localhost:5173
```

3. Inicia sesión con las credenciales de prueba.

4. Navega a la pestaña de Cursos (Mercado Pago) y simula una compra.

5. Al finalizar:
   - Mercado Pago devolverá la conexión al túnel de Ngrok
   - El backend realizará automáticamente el redirect
   - Volverás al frontend local manteniendo la sesión intacta

---

# 🔐 Usuarios de Prueba Generados Automáticamente

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
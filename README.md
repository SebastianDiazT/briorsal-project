# Briorsal Project

**Briorsal Project** es una plataforma web integral diseñada para la gestión corporativa y la presentación de portafolios de servicios. Este sistema permite administrar proyectos, clientes, servicios y la información general de la empresa a través de un panel administrativo privado, mientras expone una interfaz pública moderna para los visitantes.

El repositorio opera como un **Monorepo** que integra una API REST en Django (Backend) y una aplicación SPA en React (Frontend).

---

## 🚀 Tecnologías

### Backend (API)
* **Lenguaje:** Python
* **Framework:** Django & Django REST Framework
* **Base de Datos:** SQLite (Entorno de desarrollo)
* **Autenticación:** JWT / Session Auth

### Frontend (Cliente)
* **Lenguaje:** TypeScript
* **Framework:** React
* **Build Tool:** Vite
* **Estilos:** Tailwind CSS
* **Estado:** Redux Toolkit
* **HTTP Client:** RTK Query / Axios

---

## 📂 Estructura del Proyecto

```text
briorsal-project/
├── backend/                # API Django
│   ├── apps/               # Módulos: Projects, Company, Contact, Users
│   ├── core/               # Configuración del proyecto (settings, urls)
│   ├── manage.py           # Entry point de Django
│   └── requirements.txt    # Dependencias Python
│
├── frontend/               # Cliente React
│   ├── src/
│   │   ├── features/       # Lógica por dominio (Auth, Services, etc.)
│   │   ├── components/     # UI Kit y componentes compartidos
│   │   ├── pages/          # Vistas (Admin & Públicas)
│   │   └── store/          # Configuración Redux
│   ├── package.json        # Dependencias NPM
│   └── vite.config.ts      # Configuración Vite
└── README.md
```

## 🛠️ Instalación y Configuración

Sigue estos pasos para ejecutar el proyecto localmente. Necesitarás tener instalados **Python**, **Node.js** y **Git**.

### 1. Backend (Django)

```bash
# 1. Entra a la carpeta del backend
cd backend

# 2. Crea y activa el entorno virtual
# Windows:
python -m venv venv
venv\Scripts\activate
# Mac/Linux:
python3 -m venv venv
source venv/bin/activate

# 3. Instala las dependencias
pip install -r requirements.txt

# 4. Aplica las migraciones
python manage.py migrate

# 5. (Opcional) Crea un superusuario para el admin
python manage.py createsuperuser

# 6. Ejecuta el servidor
python manage.py runserver
```

El backend correrá en: http://127.0.0.1:8000

### 2. Frontend (React)

Abre una **nueva terminal** en la raíz del proyecto.

```bash
# 1. Entra a la carpeta del frontend
cd frontend

# 2. Instala las dependencias
npm install

# 3. Configura las variables de entorno
# Crea un archivo .env en la carpeta frontend/ con el siguiente contenido:
echo "VITE_API_URL=[http://127.0.0.1:8000](http://127.0.0.1:8000)" > .env

# 4. Ejecuta el servidor de desarrollo
npm run dev
```
El frontend correrá en: http://localhost:5173 (o el puerto que indique la consola)

## ✨ Funcionalidades

### 🏢 Panel Administrativo (Privado)
* **Dashboard:** Resumen de métricas.
* **Proyectos:** CRUD completo con soporte para galería de imágenes y videos.
* **Servicios:** Gestión del catálogo de servicios ofrecidos.
* **Clientes:** Administración de logos de clientes y testimonios.
* **Empresa:** Edición de información "Sobre Nosotros", logos y datos de contacto.
* **Mensajes:** Bandeja de entrada para los leads del formulario de contacto.

### 🌐 Sitio Público
* **Home:** Landing page con carrusel de destacados y estadísticas.
* **Portafolio:** Galería filtrable de proyectos.
* **Detalle de Proyecto:** Vista profunda con especificaciones técnicas y galería.
* **Contacto:** Formulario funcional integrado con el backend.

---

## 📦 Comandos Útiles

**Backend:**
* Crear nuevas migraciones: `python manage.py makemigrations`
* Ejecutar tests: `python manage.py test`

**Frontend:**
* Construir para producción: `npm run build`
* Previsualizar build: `npm run preview`
* Linting: `npm run lint`

---

## 📄 Licencia

Este proyecto está bajo la Licencia especificada en el archivo `LICENSE`.


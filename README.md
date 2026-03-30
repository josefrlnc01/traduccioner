<div align="center">
Para acceder a la aplicación y probar todas las funcionalidades 
el dia de la votación puedes usar la siguiente cuenta con el plan Business activo:


Email: demo@audwave.app
Contraseña: audwave2026

Para la hackaton de CubePath NodeMailer estará desactivado por falta de tiempo para su implementación final, pero en el flujo final de producción real estará presente para su uso en autenticación del usuario en registro y cambio de contraseña.

Tests E2E implementados con Playwright para verificar flujo de creación de cuenta y login y para verificar recepción de transcripción de archivo/video de youtube.
Tests unitarios implementados con Vitest para comprobar formatos de documentos exportables, middleware de autenticación y servicio de archivos guardados en BD.


# 🎵 AudWave

### Transcripción y traducción de audio con IA de precisión profesional

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![OpenAI](https://img.shields.io/badge/OpenAI-Whisper-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com)


<img width="1893" height="904" alt="Screenshot 2026-03-29 165953" src="https://github.com/user-attachments/assets/22de35b0-847e-4bf3-bbf9-d120406a789d" />

<img width="1894" height="895" alt="Screenshot 2026-03-29 170748" src="https://github.com/user-attachments/assets/d8f001ab-e35b-4c73-8770-a053defd2f09" />

<img width="1881" height="895" alt="Screenshot 2026-03-29 170847" src="https://github.com/user-attachments/assets/3fcdda81-6d53-44fe-8baa-bf3d2a140ff9" />


</div>

---

## ✨ ¿Qué es AudWave?

AudWave es una aplicación web de transcripción y traducción de audio impulsada por inteligencia artificial. Convierte cualquier archivo de audio/vídeo o enlace de YouTube en texto estructurado con timestamps, corrección semántica automática y soporte de múltiples idiomas — todo en cuestión de segundos.

Diseñada para **periodistas, creadores de contenido, traductores y profesionales** que necesitan transcripciones de calidad sin fricciones.

---

## 🚀 Funcionalidades principales

| Funcionalidad | Descripción |
|---|---|
| 🎙️ **Transcripción con Whisper** | Conversión de audio a texto usando Whisper v1 de OpenAI con timestamps por segmento |
| 🤖 **Corrección semántica con GPT-4** | GPT-4o-mini mejora la puntuación y corrige errores de transcripción automáticamente |
| 🌍 **Traducción multiidioma** | Traduce tus segmentos a Español, Inglés, Francés e Italiano y más manteniendo los timestamps |
| 📄 **Exportación en múltiples formatos** | Descarga en PDF, SRT (subtítulos), TXT y más |
| 📺 **Soporte de YouTube** | Pega cualquier enlace de YouTube y transcribe directamente sin descargar nada |
| 💾 **Historial de transcripciones** | Guarda, gestiona y accede a tus transcripciones anteriores en cualquier momento |
| 🔐 **Autenticación completa** | Login con email/contraseña o Google (Firebase Auth) + JWT |
| ⏱️ **Timestamps por segmento** | Cada segmento incluye su marca de tiempo de inicio y fin |

---

## 🖥️ Demo

> Flujo completo: subida de archivo → transcripción → traducción → descarga

```
1. Sube tu archivo (MP3, MP4, WAV, M4A) o pega un link de YouTube
2. Haz click en "Transcribir"
3. Visualiza la transcripción con timestamps en tiempo real
4. Elige un idioma y traduce con un click
5. Descarga en el formato que necesites (PDF, SRT, TXT)
```

---

## 🛠️ Stack tecnológico

### Frontend
```
React 19          → UI reactiva con hooks modernos
TypeScript        → tipado estático en todo el proyecto
TailwindCSS       → estilos utility-first
Framer Motion     → animaciones fluidas (stagger, fade, scale)
React Query       → gestión de estado del servidor y caché
React Hook Form   → formularios con validación
Shadcn/UI         → componentes accesibles (Dialog, Dropdown, etc)
Zod               → validación de esquemas
React Router v7   → navegación client-side
```

### Backend
```
Node.js + Express → servidor REST API
TypeScript        → tipado estático
MongoDB + Mongoose → base de datos NoSQL
JWT               → autenticación con access token + refresh token en cookie httpOnly
Multer            → gestión de subida de archivos
ffmpeg + yt-dlp   → descarga y conversión de audio de YouTube
```

### Servicios externos
```
OpenAI Whisper    → transcripción de audio
OpenAI GPT-4o     → corrección semántica del texto transcrito
Google Translate  → traducción multiidioma de segmentos
Firebase Auth     → autenticación con Google
```

### Infraestructura
```
CubePath          → servidor backend (VPS Linux con Docker)
Vercel            → hosting del frontend
MongoDB Atlas     → base de datos en la nube
```

---

## 📁 Arquitectura del proyecto

El proyecto está organizado con una arquitectura **feature-based** tanto en frontend como en backend, separando responsabilidades por dominio funcional.

```
audwave/
├── frontend/                          # React + TypeScript
│   └── src/
│       ├── features/
│       │   ├── auth/                  # Login, registro, tokens
│       │   │   ├── api/
│       │   │   ├── components/
│       │   │   ├── hooks/
│       │   │   ├── pages/
│       │   │   └── schemas/
│       │   ├── transcription/         # Formulario, output, guardados
│       │   │   ├── api/
│       │   │   ├── components/
│       │   │   ├── pages/
│       │   │   └── types/
│       │   ├── document/              # Generación PDF, SRT
│       │   └── token/                 # Refresh token hook
│       ├── pages/
│       │   └── landing/               # Landing page pública
│       └── shared/                    # Componentes y utils reutilizables
│
└── backend/                           # Node.js + Express + TypeScript
    └── src/
        └── modules/
            ├── auth/                  # JWT, Google Auth, tokens
            ├── user/                  # Gestión de cuenta
            ├── file/                  # Archivos del dispositivo
            ├── youtube-video/         # Integración YouTube
            ├── transcription/         # Servicio Whisper
            ├── translation/           # Google Translate
            ├── document/              # Generación PDF/SRT
            ├── saveds/                # Historial de transcripciones
            ├── quota/                 # Control de minutos por usuario/IP
            └── errors/                # AppError tipado
```

---

## ⚙️ Instalación y configuración local

### Prerrequisitos

- Node.js 20+
- MongoDB (local o Atlas)
- ffmpeg instalado en el sistema
- yt-dlp instalado en el sistema
- Cuenta en OpenAI con API key
- Proyecto en Google Cloud con Translation API activada
- Proyecto en Firebase con Authentication activado

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/audwave.git
cd audwave
```

### 2. Configurar el Backend

```bash
cd backend
npm install
```

Crea un archivo `.env` en la carpeta `backend/`:

```env
# Servidor
PORT=4000
NODE_ENV=development

# Base de datos
MONGO_URI=mongodb://localhost:27017/audwave

# JWT
ACCESS_TOKEN_SECRET=tu_access_token_secret_muy_seguro
REFRESH_TOKEN_SECRET=tu_refresh_token_secret_muy_seguro

# OpenAI
OPENAI_API_KEY=sk-...

# Google Cloud
GOOGLE_APPLICATION_CREDENTIALS=./credentials.json
PROJECT_ID=tu-proyecto-id
GOOGLE_API_KEY=tu-google-api-key

# Firebase Admin
FIREBASE_PROJECT_ID=tu-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu@email.com
EMAIL_PASS=tu-app-password

# FFmpeg
FFMPEG_PATH_LOCAL=C:\\ffmpeg\\bin\\ffmpeg.exe   # Windows local
FFMPEG_PATH=/usr/bin/ffmpeg                      # Linux producción
```

```bash
npm run dev
```

### 3. Configurar el Frontend

```bash
cd frontend
npm install
```

Crea un archivo `.env` en la carpeta `frontend/`:

```env
VITE_API_URL=http://localhost:4000
VITE_FIREBASE_KEY=tu-firebase-api-key
```

```bash
npm run dev
```

---

## 🐳 Despliegue con Docker (producción)

El backend incluye soporte completo para Docker, lo que resuelve la instalación de ffmpeg y yt-dlp en producción automáticamente.

```dockerfile
FROM node:20

# Instalar ffmpeg y yt-dlp
RUN apt-get update && apt-get install -y ffmpeg
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
    -o /usr/local/bin/yt-dlp && chmod a+rx /usr/local/bin/yt-dlp

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE 4000
CMD ["node", "dist/api/server.js"]
```

```bash
docker build -t audwave-backend .
docker run -p 4000:4000 --env-file .env audwave-backend
```

---

## 🔒 Seguridad

- **Refresh token en cookie httpOnly** — el token de refresco nunca es accesible desde JavaScript
- **Access token de corta duración** — expira cada 10 minutos
- **Rotación de refresh tokens** — cada refresco genera un nuevo token e invalida el anterior
- **Google Auth verificado en servidor** — los datos de usuario de Google se extraen del token verificado por Firebase Admin, nunca del body del cliente
- **Separación de proveedores** — cuentas Google y cuentas locales están correctamente separadas
- **Control de cuota por usuario + IP** — doble capa de protección contra abuso
- **AppError tipado** — errores de negocio e infraestructura correctamente separados con status codes HTTP apropiados
- **Validación con Zod** — todos los inputs del usuario son validados antes de procesarse

---

## 📊 Planes y límites

| | **Básico** | **Pro** | **Business** |
|---|:---:|:---:|:---:|
| Precio | $0/mes | $6/mes | $15/mes |
| Minutos de transcripción | 6 min | 3 horas | 10 horas |
| Idiomas de traducción | — | Sin límite | Sin límite |
| Exportación PDF |  ✅ | ✅ | ✅ |
| Exportación CSV |  ✅ | ✅ | ✅ |
| Exportación SRT/TXT |  ✅ | ✅ | ✅ |
| Exportación VTT |  ✅ | ✅ | ✅ |
| Exportación DOCX |  ❌ | ❌ | ✅ |
| Exportación CSV |  ❌ | ❌ | ✅ |
| Exportación JSON |  ❌ | ❌ | ✅ |
| Historial guardado | ✅ | ✅ | ✅ |
| Resumen IA | ❌ | ❌ | ✅ |

---

## 🗺️ Roadmap

- [ ] Implementación de cola para procesamiento de archivos pesados
- [ ] Integración de pagos con Stripe

---

## 🏗️ Desplegado en CubePath

Este proyecto está desplegado en **[CubePath](https://midu.link/cubepath)** como parte de la Hackatón de midudev 2026.

> CubePath proporciona el servidor VPS Linux donde corre el backend con ffmpeg, yt-dlp y todos los servicios necesarios para el procesamiento de audio.

---

## 👨‍💻 Autor

**José María Sánchez Serna**

Desarrollado como proyecto fullstack autodidacta y participante en la **Hackatón CubePath 2026** organizada por midudev.

---

## 📄 Licencia

MIT © 2026 AudWave — José María Sánchez Serna

---

<div align="center">

Hecho con ❤️

**[⬆ Volver arriba](#-audwave)**

</div>

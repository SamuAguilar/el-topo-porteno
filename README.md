# El Topo Porteño — Frontend

Plataforma web desarrollada para **El Topo Porteño**, empresa de servicios de excavación de pozos en Buenos Aires, Argentina.

**Materias:** Taller de Desarrollo de Aplicaciones & Programación de Aplicaciones Web III  
**Alumnos (Taller de Desarrollo de Aplicaciones):** Aguilar, Samuel Ezequiel - Zanetta, Augusto  
**Alumno (Programación de Aplicaciones Web III):** Zanetta, Augusto

---

## Descripción técnica

### Propósito
Digitalizar y centralizar los procesos clave de la empresa: captación de clientes potenciales mediante un formulario de solicitud online, administración de la cartera de clientes y seguimiento del ciclo de vida de cada trabajo desde su inicio hasta el cierre.

### Problemática que resuelve
La empresa gestionaba sus presupuestos y consultas de forma completamente manual. El dueño elaboraba y enviaba cada presupuesto de forma individual, sin registro centralizado de clientes ni visibilidad sobre el estado de los trabajos en curso. Esta plataforma automatiza la captación de consultas y centraliza la gestión comercial y operativa.

### Perfil de usuario destinatario
- **Cliente final:** persona que necesita excavación, zanjeo o limpieza de pozos. Accede al sitio público desde cualquier dispositivo, completa el formulario y deja sus datos para ser contactado.
- **Administrador:** dueño o personal autorizado de la empresa. Gestiona contactos (leads/clientes), convierte clientes y hace seguimiento de trabajos desde el panel privado.

---

## Arquitectura y estructura de carpetas

```
client/
└── src/
├── assets/ # Logo e imágenes estáticas
├── layouts/
│ ├── PublicLayout.jsx # Marco del sitio público (Header + Outlet + Footer)
│ └── AdminLayout.jsx # Marco del panel admin (Sidebar + Outlet)
├── components/
│ ├── auth/
│ │ └── ProtectedRoute.jsx # Guard de rutas protegidas (verifica JWT)
│ ├── layout/ # Componentes globales de estructura
│ │ ├── Header.jsx
│ │ └── Footer.jsx
│ ├── settings/ # Secciones de la landing page
│ │ ├── Hero.jsx
│ │ ├── Features.jsx
│ │ ├── FAQ.jsx
│ │ ├── Form.jsx # Formulario de contacto (conectado a API)
│ │ └── Chatbot.jsx # Chatbot interactivo con árbol de decisión
│ └── ui/ # Design system — componentes reutilizables
│ ├── Button.jsx
│ ├── Card.jsx
│ ├── Input.jsx
│ ├── KpiCard.jsx # Tarjeta de indicador con estado de carga
│ ├── Badge.jsx # Etiqueta de estado para tablas
│ └── DataTable.jsx # Tabla genérica con carga, vacío y columnas configurables
├── pages/
│ ├── public/
│ │ └── Home.jsx # Landing page
│ └── admin/
│ ├── Login.jsx # Formulario de acceso al panel
│ ├── Dashboard.jsx # KPIs + tabla de trabajos en curso
│ ├── GestionContactos.jsx # Leads y clientes unificados (tabs, filtros, cambio de estado)
│ ├── ClienteDetalle.jsx # Detalle de cliente con sus trabajos (y creación de nuevo trabajo)
│ ├── Trabajos.jsx # Lista de todos los trabajos con filtros y cambio de estado
│ └── TrabajoDetalle.jsx # Detalle de trabajo, historial, edición de precio/estado y observaciones
├── routes/
│ └── AppRouter.jsx # Definición de rutas con React Router DOM v6
├── services/
│ └── api.js # Fetch wrapper con interceptor Bearer token
└── utils/
└── formatters.js # Formatos de fecha, normalización de estados

server/
├── src/
│ ├── config/
│ │ └── db.js # Pool de conexiones MySQL (mysql2/promise)
│ ├── controllers/
│ │ ├── authController.js # Login y generación de JWT
│ │ ├── clientesController.js # CRUD de clientes
│ │ ├── dashboardController.js # Estadísticas para el panel
│ │ ├── leadsController.js # CRUD de leads y cambio de estado
│ │ └── trabajosController.js # CRUD de trabajos, historial, observaciones y eliminación
│ ├── middleware/
│ │ ├── auth.js # Verificación de token JWT
│ │ ├── rateLimit.js # Limitación de intentos de login (express-rate-limit)
│ │ └── validaciones.js # Manejo de errores de express-validator
│ ├── models/
│ │ └── LeadModel.js # Modelo de datos (si aplica)
│ └── routes/
│ ├── authRoutes.js # POST /api/auth/login
│ ├── clientesRoutes.js # GET/POST/PUT /api/clientes
│ ├── dashboardRoutes.js # GET /api/dashboard/stats
│ ├── leadsRoutes.js # GET/POST /api/leads, PUT estado
│ └── trabajosRoutes.js # CRUD completo de trabajos + historial + eliminación de historial
├── .env.example
├── database.sql # Script de creación de la base de datos
├── index.js # Punto de entrada del servidor
└── package.json
```

---

## Design System

Paleta de colores definida como variables CSS globales en `index.css` y aplicada mediante clases de Tailwind en todos los componentes:

| Variable | Valor | Uso |
|---|---|---|
| `--color-bg` | `#0B0B0B` | Fondo principal del sitio |
| `--color-bg-secondary` | `#1F2937` | Cards, header mobile, secciones alternas |
| `--color-border` | `#374151` | Bordes de inputs y separadores |
| `--color-muted` | `#6B7280` | Textos secundarios y placeholders |
| `--color-accent` | `#F59E0B` | Botones CTA, bordes destacados, acentos |
| `--color-accent-dark` | `#D97706` | Hover de elementos amarillos |
| `--color-white` | `#FFFFFF` | Textos principales |

**Tipografía:** Inter (sistema) — alta legibilidad, estética moderna.

### Componentes y variantes

**Button**
| Variante | Descripción |
|---|---|
| `primary` | Fondo amarillo, texto negro — acción principal |
| `secondary` | Fondo gris oscuro — acción secundaria |
| `outline` | Borde amarillo, relleno al hover |
| `danger` | Fondo rojo — acciones destructivas |

Tamaños disponibles: `sm`, `md`, `lg`

**Card**
| Variante | Descripción |
|---|---|
| `default` | Fondo gris oscuro, borde sutil |
| `highlighted` | Borde amarillo — elemento destacado |
| `dark` | Fondo negro — para secciones con fondo claro |

Props opcionales: `icon`, `subtitle`

**Input**
- Con o sin `label`
- Estado de `error` con mensaje en rojo
- Tipos configurables: `text`, `email`, `tel`, `password`

**KpiCard**
- Indicador numérico con borde de color izquierdo
- Estados: `loading` (esqueleto), normal
- Props: `label`, `value`, `sub`, `color`, `loading`

**Badge**
- Etiqueta de estado con color de fondo y texto personalizables
- Props: `estado`, `config` (mapa de colores)

**DataTable**
- Tabla genérica con columnas configurables
- Maneja estados: `loading`, vacío (`emptyMessage`), datos
- Soporta `render` por columna y `onRowClick`
- Props: `columns`, `data`, `loading`, `emptyMessage`, `keyExtractor`, `onRowClick`

---

## Funcionalidades implementadas

- ✅ Landing page con formulario de contacto funcional (`POST /api/leads`)
- ✅ Chatbot interactivo con árbol de decisión integrado en la landing
- ✅ Autenticación completa (login JWT, ruta protegida, logout)
- ✅ Bloqueo de login por intentos fallidos (rate limiting)
- ✅ Dashboard con KPIs desde API (`/api/dashboard/stats`)
- ✅ Gestión unificada de leads y clientes con pestañas y cambio de estado
- ✅ Conversión automática de lead a cliente al cambiar a "Cerrado exitoso"
- ✅ CRUD visual de trabajos con filtros y cambio de estado
- ✅ Detalle de trabajo con historial de cambios, observaciones y edición de precio
- ✅ Detalle de cliente con sus trabajos y creación de nuevo trabajo
- ✅ Componentes reutilizables: KpiCard, Badge, DataTable, Button, Input, Card
- ✅ Protección de rutas del panel admin con verificación de token JWT

---

## Stack tecnológico

| Tecnología | Rol |
|---|---|
| React 18 | UI y componentes |
| Vite 5 | Build tool y servidor de desarrollo |
| Tailwind CSS 4 | Estilos y design system |
| React Router DOM v6 | Navegación entre rutas |
| Fetch API (nativo) | Consumo de API REST con interceptor Bearer |
| PropTypes | Validación de tipos en componentes |

---

## Guía de instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/el-topo-porteno.git
cd el-topo-porteno/client

# 2. Instalar dependencias
npm install

# 3. Ejecutar en desarrollo
npm run dev
```

La app queda disponible en `http://localhost:5173`

### Rutas disponibles

| Ruta | Vista |
|---|---|
| `/` | Landing page pública |
| `/admin` | Login del panel administrativo |
| `/admin/dashboard` | Panel administrativo (en desarrollo) |

---

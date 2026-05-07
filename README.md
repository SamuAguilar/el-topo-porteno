# El Topo Porteño — Frontend

Plataforma web desarrollada para **El Topo Porteño**, empresa de servicios de excavación de pozos en Buenos Aires, Argentina.

**Materias:** Taller de Desarollo de Aplicaciones & Programación de Aplicaciones Web III
**Alumnos (Taller de Desarollo de Aplicaciones):** Aguilar, Samuel Ezequiel - Zanetta, Augusto
**Alumno (Programación de Aplicaciones Web III):** Zanetta, Augusto

---

## Descripción técnica

### Propósito
Digitalizar y centralizar los procesos clave de la empresa: captación de clientes potenciales mediante un formulario de solicitud online, administración de la cartera de clientes y seguimiento del ciclo de vida de cada trabajo desde su inicio hasta el cierre.

### Problemática que resuelve
La empresa gestionaba sus presupuestos y consultas de forma completamente manual. El dueño elaboraba y enviaba cada presupuesto de forma individual, sin registro centralizado de clientes ni visibilidad sobre el estado de los trabajos en curso. Esta plataforma automatiza la captación de consultas y centraliza la gestión comercial y operativa.

### Perfil de usuario destinatario
- **Cliente final:** persona que necesita excavación, zanjeo o limpieza de pozos. Accede al sitio público desde cualquier dispositivo, completa el formulario y deja sus datos para ser contactado.
- **Administrador:** dueño o personal autorizado de la empresa. Gestiona leads, convierte clientes y hace seguimiento de trabajos desde el panel privado.

---

## Arquitectura y estructura de carpetas Frontend

```
client/
├── src/                  # Logo e imágenes estáticas
│   ├── assets/                  # Logo e imágenes estáticas
│   ├── components/
│   │   ├── layout/              # Componentes globales de estructura
│   │   │   ├── Header.jsx       # Navegación sticky con menú responsive
│   │   │   └── Footer.jsx       # Footer con links y datos de contacto
│   │   ├── settings/            # Secciones de la landing page
│   │   │   ├── Hero.jsx         # Sección principal con CTA
│   │   │   ├── Features.jsx     # Grilla de servicios con cards
│   │   │   └── FAQ.jsx          # Acordeón de preguntas frecuentes
│   │   └── ui/                  # Design system — componentes reutilizables
│            ├── Button.jsx       # 4 variantes × 3 tamaños
│            ├── Card.jsx         # 3 variantes con icon y subtitle opcionales
│            └── Input.jsx        # Con label, error y tipo configurable
│   ├── pages/
│   │   ├── public/
│   │   │   └── Home.jsx         # Landing page + showcase de componentes
│   │   └── admin/
│           ├── Login.jsx        # Pantalla de acceso al panel
│           └── Dashboard.jsx    # Panel administrativo (próxima fase)
│   ├── routes/
│       └── AppRouter.jsx        # Definición de rutas con React Router DOM
│   ├── services/
│       └── api.js               # Configuración de Axios (próxima fase)
    └── utils/
        └── formatters.js        # Utilidades de formato (próxima fase)
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

---

## Objetivos alcanzados en esta fase

- ✅ Landing page completa: Header, Hero, Servicios, FAQ y Footer
- ✅ Contenido real del proyecto (El Topo Porteño, servicios de excavación)
- ✅ Design system con paleta, tipografía y variables CSS globales
- ✅ Componentes reutilizables con múltiples variantes (Button, Card, Input)
- ✅ Catálogo de componentes (showcase) al final de la landing
- ✅ Navegación responsive con menú hamburguesa en mobile
- ✅ FAQ con acordeón interactivo (useState)
- ✅ Rutas configuradas con React Router DOM (`/`, `/admin`, `/admin/dashboard`)
- ✅ Arquitectura modular lista para escalar al panel administrativo

---

## Stack tecnológico

| Tecnología | Rol |
|---|---|
| React 18 | UI y componentes |
| Vite 5 | Build tool y servidor de desarrollo |
| Tailwind CSS 3 | Estilos y design system |
| React Router DOM | Navegación entre rutas |
| Axios | Consumo de API REST (próxima fase) |

---

## Guía de instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/el-topo-porteno.git
cd el-topo-porteno/client

# 2. Instalar dependencias
npm install

# 3. Instalar Tailwind y PostCSS (si no están instalados)
npm install -D tailwindcss postcss autoprefixer

# 4. Instalar React Router DOM (si no está instalado)
npm install react-router-dom

# 5. Ejecutar en desarrollo
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

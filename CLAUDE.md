# CLAUDE.md — Página Web Grupo Trono v2

> Contexto de trabajo para Claude Code. Actualizado: 2026-05-26.

---

## Qué es este proyecto

Sitio web corporativo de **Grupo Trono** — holding tecnológico colombiano con 5 filiales.
Propósito: presencia de marca, captación de clientes, SEO orgánico en Colombia y Latinoamérica.

- **URL producción:** https://www.grupotrono.com
- **Repo GitHub:** https://github.com/DevAndresM/Grupo-Trono-pagina-web (privado, usuario: DevAndresM)
- **Hosting:** GitHub Pages con dominio personalizado via `CNAME`
- **Preview local:** `python -m http.server 3900` en la raíz del proyecto

---

## Stack técnico

| Capa | Tecnología |
|------|-----------|
| HTML | Estático puro, sin generadores ni frameworks |
| CSS | Un solo archivo `css/styles.css` — variables CSS, no preprocesadores |
| JS | Un solo archivo `js/main.js` — vanilla JS, sin dependencias |
| Fuentes | Google Fonts: Cinzel (headings) + Inter (cuerpo) |
| Hosting | GitHub Pages (rama `main`) |
| DNS | CNAME apuntando `www.grupotrono.com` a `DevAndresM.github.io` |

**Sin npm, sin webpack, sin frameworks.** Todo se sirve directamente como archivos estáticos.

---

## Estructura de archivos

```
/
├── index.html                          # Página principal
├── nosotros/index.html                 # Equipo e historia
├── portafolio/index.html               # Proyectos realizados
├── contacto/index.html                 # Formulario de contacto
├── videos/index.html                   # Galería de videos
├── blog/index.html                     # Listado de blog
├── blog/articulo-ejemplo/index.html    # Artículo de blog
├── servicios/
│   ├── productions/index.html
│   ├── hardware/index.html
│   ├── software/index.html
│   ├── security/index.html
│   └── games/index.html
├── css/styles.css                      # Todos los estilos (versión actual: ?v=6)
├── js/main.js                          # Todo el JS (versión actual: ?v=4)
├── sitemap.xml                         # Sitemap para Google (12 URLs)
├── robots.txt                          # Permite indexación total + apunta al sitemap
├── CNAME                               # www.grupotrono.com
├── img/
│   ├── logo-grupo-trono.png            # Logo principal (usado en OG image)
│   ├── logo-grupo-trono-nav.png        # Logo navbar (versión compacta)
│   ├── favicon.png
│   ├── crown-*.png                     # Íconos de corona por filial (gt, games, hardware, etc.)
│   ├── logo-trono-*.png               # Logos individuales de filiales
│   ├── clientes/                       # 7 logos de clientes
│   │   ├── aon.png
│   │   ├── toyota.png
│   │   ├── brick-abogados.png          # Navy→white convertido, naranja preservado
│   │   ├── embajada-eeuu.png           # Fondo blanco removido (transparente)
│   │   ├── embajada-corea.png          # Fondo blanco removido (transparente)
│   │   ├── lilipink.png
│   │   └── itbf.png                    # Recortado de 1920x1080 → 1343x715
│   ├── personal/                       # Fotos del equipo (andres, elio, ediberto, lorena)
│   ├── mini/                           # Imágenes de servicios por categoría
│   │   ├── gm-*.jpg                    # Trono Games (5 fotos)
│   │   ├── hw-*.jpg                    # Trono Hardware (5 fotos)
│   │   ├── prod-*.jpg                  # Trono Productions (5 fotos)
│   │   ├── sec-*.jpg                   # Trono Security (5 fotos)
│   │   └── sw-*.jpg                    # Trono Software (5 fotos)
│   ├── social/                         # Logos oficiales de redes sociales
│   │   ├── instagram.svg
│   │   ├── facebook.png
│   │   ├── youtube.svg
│   │   ├── linkedin.png
│   │   └── tiktok.svg
│   └── whatsapp.svg                    # Logo oficial WhatsApp (botón flotante + footer)
└── .claude/                            # Archivos de sesión de Claude Code
```

---

## Decisiones de arquitectura

### URLs limpias (sin `.html`)
Cada página es `pagename/index.html`. GitHub Pages sirve `index.html` al acceder a `/pagename/` sin extensión. **No existe configuración de servidor** — funciona por convención de GitHub Pages.

### Rutas absolutas en assets
Todos los assets usan rutas absolutas: `/css/styles.css`, `/img/...`, `/js/main.js`.  
Esto permite que páginas en subdirectorios profundos (`/servicios/hardware/`) accedan a los mismos assets sin rutas relativas frágiles.

### Cache busting manual
CSS: `<link rel="stylesheet" href="/css/styles.css?v=6" />`  
JS: `<script src="/js/main.js?v=4"></script>`  
**Al modificar CSS o JS: incrementar la versión en TODOS los HTML** (12 archivos).

```bash
# Comando para actualizar la versión en todos los HTML
# Buscar: ?v=6  →  Reemplazar: ?v=7
```

### Carrusel de clientes — posicionamiento absoluto
El carrusel NO usa flexbox ni scroll. Cada `.cliente-item` tiene `position: absolute`. El JS asigna `left` directamente:
- Centro (activo): `left: 50%`
- Anterior: `left: 16.667%`
- Siguiente: `left: 83.333%`
- Ocultos: `left: 50%` con `opacity: 0` y `transition: none`

Esto garantiza que cualquier logo puede estar en cualquier posición sin depender del orden en el DOM.

### Protección de imágenes (3 capas)
1. **CSS:** `img { -webkit-user-drag: none; pointer-events: none; }` + overlay `::after` en avatares
2. **HTML:** `draggable="false"` en fotos del equipo
3. **JS:** listener `contextmenu` + `dragstart` en todas las imágenes al cargar

### Active link en navbar
Se usa `window.location.pathname` (no `window.location.href`) para detectar la página actual. Se normalizan trailing slashes con `.replace(/\/+$/, '')`.

---

## SEO — Estado actual

### Implementado ✅
- `sitemap.xml` en raíz con 12 URLs, prioridades y `lastmod`
- `robots.txt` con `Allow: /` y referencia al sitemap
- Todas las páginas tienen: `<title>`, `<meta description>`, `<meta keywords>`, `<link rel="canonical">`, Open Graph completo (`og:locale: es_CO`), Twitter Card
- `index.html`: Schema.org **Organization** JSON-LD (5 filiales con `hasOfferCatalog`)
- `index.html`: Schema.org **WebSite** JSON-LD con `SearchAction` (Sitelinks Search Box)
- Páginas de servicio: Schema.org **Service** JSON-LD individual
- `og:image` apunta a `/img/logo-grupo-trono.png` en todas las páginas
  - ⚠️ Usar URL absoluta (`https://www.grupotrono.com/img/logo-grupo-trono.png`) — actualmente relativa en páginas internas

### Pendiente — acciones manuales del usuario ⏳
1. **Google Search Console**: search.google.com/search-console → añadir propiedad `grupotrono.com` → verificar via DNS TXT → enviar sitemap
2. **Google Business Profile**: business.google.com → crear perfil "Grupo Trono" con dirección colombiana

---

## Integraciones — Estado de placeholders

Estos valores son **placeholders** que el usuario debe reemplazar registrándose en cada servicio:

| Placeholder | Archivo(s) | Servicio | Acción |
|-------------|-----------|----------|--------|
| `57000000000` | 12 archivos HTML (24 ocurrencias) | Número WhatsApp Business | Reemplazar con número real de WhatsApp Business |
| `https://formspree.io/f/TU_ID_AQUI` | `contacto/index.html` | Formspree | Registrarse en formspree.io → crear form → copiar endpoint |
| `href="#"` en redes sociales footer | Todos los HTML | Redes sociales | Reemplazar con URLs reales de perfiles |
| `href="#"` en Privacidad/Términos footer | Todos los HTML | — | Crear páginas o links externos |

### Registro requerido (por el usuario, no Claude)
- **Formspree** (formspree.io) — formulario de contacto funcional, plan gratuito disponible
- **WhatsApp Business** — activar número real, vincular a la cuenta de WhatsApp Business API o usar wa.me simple
- Perfiles sociales: Instagram, Facebook, YouTube, LinkedIn, TikTok — reemplazar `href="#"` una vez creados/verificados

---

## Lo que está completado ✅

- [x] Diseño completo del sitio (dark theme, paleta dorada, tipografía Cinzel/Inter)
- [x] 12 páginas HTML: home, nosotros, portafolio, contacto, videos, blog, artículo de blog, 5 páginas de servicio
- [x] Navbar responsiva con menú hamburguesa en móvil
- [x] Carrusel de clientes con 7 logos, soporte touch + mouse drag, dots de navegación
- [x] 7 logos de clientes procesados para fondo oscuro (transparencias, colores reales)
- [x] Sección de estadísticas con contador animado
- [x] Sección de equipo (4 miembros) con fotos protegidas
- [x] Formulario de contacto asíncrono (listo para Formspree)
- [x] Footer con redes sociales (logos oficiales SVG/PNG) y botón flotante WhatsApp
- [x] Protección de imágenes en todo el sitio (no drag, no right-click, no nueva pestaña)
- [x] URLs limpias sin `.html` (estructura de subdirectorios)
- [x] Rutas absolutas en todos los assets
- [x] Cache busting con `?v=N` en CSS y JS
- [x] Active link detection en navbar para todas las páginas
- [x] Animaciones de entrada con IntersectionObserver (clase `.animar`)
- [x] Indicador de scroll en hero — posicionado al fondo en móvil
- [x] SEO completo: sitemap, robots, Schema.org, OG, Twitter Cards, canonical, keywords
- [x] Dominio personalizado `www.grupotrono.com` via GitHub Pages + CNAME
- [x] 2 commits pendientes de push en GitHub Desktop (push manual requerido)

---

## Lo que falta ⏳

### Alta prioridad
- [x] **Push a GitHub** — subido
- [x] **Número de WhatsApp real** — reemplazado en los 12 HTML
- [x] **Formspree** — endpoint real configurado en `contacto/index.html`
- [x] **URLs de redes sociales** — reemplazadas en footers de todos los HTML
- [ ] **Google Search Console** — verificación + envío de sitemap (acción manual usuario)

### Media prioridad
- [ ] **og:image con URL absoluta** en páginas internas — actualmente usa `/img/logo-grupo-trono.png` (relativa), Facebook/LinkedIn no la leerán correctamente. Debe ser `https://www.grupotrono.com/img/logo-grupo-trono.png`
- [ ] **Logos Trono Net y Trono Energy** — placeholders en navbar marcados como "Pronto", esperando diseñador
- [ ] **Fotos reales de portafolio** — actualmente usa placeholders de imagen
- [ ] **Artículos de blog reales** — `blog/articulo-ejemplo/` es un demo
- [ ] **Política de privacidad y Términos** — páginas legales requeridas por ley colombiana (Habeas Data)

### Baja prioridad / futuro
- [ ] **Newsletter/suscripción** — integrar Brevo o Mailchimp en sección de blog
- [ ] **Google Analytics** — agregar GA4 para métricas de tráfico
- [ ] **Página de videos** — actualmente tiene video de Rick Astley como demo
- [ ] **Portafolio real** — poblar con proyectos reales de Grupo Trono
- [ ] **Favicon optimizado** — 32x32 y 192x192 versiones + `apple-touch-icon`

---

## Comandos frecuentes

```bash
# Preview local
cd "C:\Users\andre\OneDrive\Documentos\Grupo Trono\Trono Software\Proyectos\Pagina WEB grupo trono v2"
python -m http.server 3900
# → http://localhost:3900

# Git status
git status
git log --oneline -5

# Commit estándar
git add <archivos>
git commit -m "feat/fix/refactor: descripción"
# Push: usar GitHub Desktop (autenticación PAT via Windows Credential Manager)

# Reemplazar número de WhatsApp en todos los HTML (cuando esté disponible el número real)
# En PowerShell:
Get-ChildItem -Recurse -Filter "*.html" | ForEach-Object {
  (Get-Content $_.FullName) -replace '57000000000', 'NUMERO_REAL' | Set-Content $_.FullName
}

# Actualizar versión de cache CSS/JS (incrementar N)
Get-ChildItem -Recurse -Filter "*.html" | ForEach-Object {
  (Get-Content $_.FullName) -replace 'styles\.css\?v=6', 'styles.css?v=7' | Set-Content $_.FullName
}
```

---

## Notas de seguridad

- **Nunca poner tokens de GitHub en el chat.** El PAT anterior fue revocado por GitHub por exposición en conversación. Autenticar siempre via GitHub Desktop o terminal directamente.
- El archivo `.gitignore` excluye `.DS_Store`, `Thumbs.db`, `.vscode/`, `*.tmp`, `*.bak`.
- `.claude/settings.local.json` (si existe) está en `.gitignore` — no se sube al repo.

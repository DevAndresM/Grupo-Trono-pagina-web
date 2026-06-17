# CLAUDE.md — Página Web Grupo Trono v2

> Contexto de trabajo para Claude Code. Actualizado: 2026-06-17.

---

## Qué es este proyecto

Sitio web corporativo de **Grupo Trono** — holding tecnológico colombiano con 7 filiales (Productions, Hardware, Software, Security, Games, Net, Energy).
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
├── privacidad/index.html               # Política de Privacidad (Habeas Data)
├── terminos/index.html                 # Términos de Uso
├── servicios/
│   ├── productions/index.html
│   ├── hardware/index.html
│   ├── software/index.html
│   ├── security/index.html
│   ├── games/index.html
│   ├── net/index.html                  # Trono Net — infraestructura y telecomunicaciones
│   └── energy/index.html               # Trono Energy — energías renovables (solar)
├── css/styles.css                      # Todos los estilos
├── js/main.js                          # Todo el JS (incluye acordeón FAQ)
├── sitemap.xml                         # Sitemap para Google (14 URLs)
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
- `index.html`: Schema.org **Organization** JSON-LD (7 filiales con `hasOfferCatalog`)
- `index.html`: Schema.org **WebSite** JSON-LD con `SearchAction` (Sitelinks Search Box)
- Páginas de servicio: Schema.org **Service** JSON-LD individual
- `og:image` apunta a `/img/logo-grupo-trono.png` en todas las páginas
  - ⚠️ Usar URL absoluta (`https://www.grupotrono.com/img/logo-grupo-trono.png`) — actualmente relativa en páginas internas

### Pendiente — acciones manuales del usuario ⏳
1. **Google Search Console**: search.google.com/search-console → añadir propiedad `grupotrono.com` → verificar via DNS TXT → enviar sitemap
2. **Google Business Profile**: business.google.com → crear perfil "Grupo Trono" con dirección colombiana

---

## Integraciones — Estado de placeholders

Estado real de las integraciones (verificado en código, 2026-06-15):

| Integración | Archivo(s) | Estado |
|-------------|-----------|--------|
| **Número WhatsApp / teléfono** | 12 archivos HTML | ✅ `573161366932` propagado en TODAS las páginas (botón flotante, footer, `tel:`). Texto visible: `+57 316 136 6932` |
| **Formspree** | `contacto/index.html` | ✅ Conectado — endpoint real `https://formspree.io/f/maqkzndy` |
| **Páginas legales** | `privacidad/`, `terminos/` | ✅ Creadas (Habeas Data) y enlazadas en footers + checkbox del form |
| **URLs redes sociales** | Todos los HTML (footers) | ⏳ PENDIENTE — siguen en `href="#"`. **El usuario aún NO ha creado las redes sociales** (Instagram, Facebook, YouTube, LinkedIn, TikTok). Las creará y pasará las URLs después para reemplazar los `href="#"` de una sola vez |

### Registro requerido (por el usuario, no Claude)
- ✅ **Formspree** — cuenta creada, endpoint `maqkzndy` ya conectado
- ✅ **WhatsApp** — número real `573161366932` en todo el sitio
- ⏳ **Perfiles sociales** — Instagram, Facebook, YouTube, LinkedIn, TikTok: NO creados aún. Pendiente que el usuario los cree y pase las URLs para reemplazar `href="#"` en los footers

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
- [x] **Google Search Console** — verificación + envío de sitemap + indexación solicitada para las 11 páginas internas (2026-06-11). Avisos GSC (2026-06-15): (1) "Página con redirección" = `http://grupotrono.com/` y `http://www.grupotrono.com/` — son las versiones HTTP que redirigen a HTTPS, comportamiento normal de GitHub Pages; validación iniciada en GSC. (2) "Página alternativa con etiqueta canónica" = `?s={search_term_string}` del SearchAction (ya eliminado del Schema.org); validación iniciada el 11/6. Ambas se resolverán solas en días.

### Media prioridad
- [x] **og:image con URL absoluta** — verificado (2026-06-12): todos los 12 HTML ya tienen `https://www.grupotrono.com/img/logo-grupo-trono.png`
- [x] **Número WhatsApp real** — `573161366932` propagado a las 12 páginas (2026-06-15). Antes solo estaba en `index.html`
- [x] **Formspree conectado** — endpoint `https://formspree.io/f/maqkzndy` en `contacto/index.html` (2026-06-15)
- [x] **Política de privacidad y Términos** — creadas en `privacidad/` y `terminos/` (Ley 1581/2012 + Decreto 1377/2013), enlazadas en footers + checkbox del form (2026-06-15)
- [x] **Trono Net y Trono Energy como filiales reales** (2026-06-15) — creadas `servicios/net/` (infraestructura y telecomunicaciones) y `servicios/energy/` (energías renovables, solar como pilar). Integradas en nav (con coronas `trono_net_corona.png`/`trono_energy_corona.png`), footers (16 HTML), home (tarjetas + stat 7 + Schema.org), nosotros (árbol corporativo), contacto (selector) y sitemap. Ya NO son "Pronto".
- [x] **Equipo (nosotros)** actualizado (2026-06-15) — orden Elio · Andrés · Ediberto + Lorena. Cargos: Elio "Ingeniero de redes y líder en energías", Andrés "Ingeniero de Software · CEO", Ediberto "Líder de relaciones comerciales", Lorena "Directora creativa". Todos en dorado.
- [x] **Responsive** (2026-06-15) — grids inline que no colapsaban ahora usan clase `.resp-grid` (+ `.resp-grid-feat`) con media query `!important` a ≤768px.
- [ ] **URLs redes sociales** — ⏳ usuario aún no crea las redes; pendiente reemplazar `href="#"` en footers cuando pase las URLs. (Bug resuelto: `facebook.png`/`linkedin.png` tenían fondo opaco → cuadrado blanco con el filtro del footer; reemplazados por `facebook.svg`/`linkedin.svg` transparentes.)
- [x] **Imágenes mini de servicios** (2026-06-15) — Net/Energy con 12 fotos reales en sus tiles (estilo `mini-img` como las demás). Reemplazadas además hw-camera, hw-printer, sw-qr, sec-cctv, gm-gamif. Todas **CC0/dominio público** (uso comercial libre, sin atribución) descargadas vía API de Openverse. El usuario puede sustituirlas por fotos propias cuando quiera.
- [x] **FAQ animada, banner "Muchas más +", botones sociales en color oficial, bug nav del blog** (2026-06-15).
- [x] **Logo estirado en Net/Energy** (2026-06-17) — `.servicio-nombre-logo` tenía `width: 100%` que forzaba el logo a ocupar todo el ancho del contenedor, distorsionando logos más compactos. Corregido a `width: auto` (bounded por `max-width: 520px` y `max-height: 180px`).
- [ ] **Fotos reales de portafolio** — actualmente usa placeholders de imagen
- [ ] **Artículos de blog reales** — `blog/articulo-ejemplo/` es un demo. ⚠️ Bug pendiente: el nav "Blog" apunta a `/` y los artículos enlazan a `articulo-ejemplo.html` (deberían ser `/blog/` y `/blog/articulo-ejemplo/`).

### Baja prioridad / futuro
- [ ] **Newsletter/suscripción** — integrar Brevo o Mailchimp en sección de blog
- [x] **Google Analytics GA4** — ID `G-H5ZJLZ0YP8` instalado en los 12 HTML (2026-06-11). Administradores: mmgamingdev@gmail.com + grupotrono@gmail.com (2026-06-12).
- [x] **Google Ads** — Cuenta #217-744-3743 creada (mmgamingdev@gmail.com). Campaña "Máximo rendimiento" configurada (2026-06-12): 3 títulos, 1 título largo, 2 descripciones, 20 imágenes, 2 logos, 20 temas de búsqueda, Colombia, Español, presupuesto COP20,000/día, estrategia Conversiones. Optimization score: 87.7%. **PENDIENTE LANZAR**: clic en "Enviar" en paso de pago (cargará COP50,000 en Mastercard •••• 2310 + gasto diario de COP20,000). Oferta activa: invierte USD350 → recibe USD350 en crédito (válida hasta 11 ago 2026). **Pendiente post-lanzamiento**: agregar grupotrono@gmail.com como admin (bloqueado hasta completar billing).
- [ ] **Página de videos** — actualmente tiene video de Rick Astley como demo
- [ ] **Portafolio real** — poblar con proyectos reales de Grupo Trono
- [ ] **Favicon optimizado** — 32x32 y 192x192 versiones + `apple-touch-icon`

---

## Despliegue / Hosting (GitHub Pages)

**El hosting es GitHub Pages (gratuito).** El sitio se publica automáticamente al hacer push a la rama `main` del repo `https://github.com/DevAndresM/Grupo-Trono-pagina-web`. El dominio `www.grupotrono.com` apunta ahí vía `CNAME`.

### Flujo de publicación (lo usa Andres)
1. Guardar los cambios en archivos (lo hace Claude Code).
2. **Commit + push con GitHub Desktop** (autenticación PAT vía Windows Credential Manager — NO meter tokens en el chat).
3. GitHub Pages reconstruye y publica en 1–2 min. Verificar en `https://www.grupotrono.com`.

> **Regla:** Claude edita archivos localmente; **Andres hace el commit/push manual desde GitHub Desktop**. Claude solo debe confirmar explícitamente cuándo los cambios están listos para commitear (todos los archivos guardados y verificados).

### Estado actual para push
✅ **Listo para commit/push** (2026-06-15): WhatsApp propagado, Formspree conectado, páginas legales creadas y enlazadas, CSS `.legal-doc` añadido. Todo verificado sirviendo local con `python -m http.server` (200 OK en `/privacidad/`, `/terminos/`, `/contacto/`).

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

## Notas técnicas

- **⚠️ Codificación al editar HTML en lote con PowerShell 5.1.** Los HTML del proyecto están en UTF-8 (algunos con BOM, otros sin BOM). `Get-Content -Raw` en PowerShell 5.1 lee los archivos **sin BOM** como Windows-1252 y, al reescribir con `Set-Content -Encoding UTF8`, corrompe las tildes (`í`→`Ã­`). **Usar siempre .NET** para reemplazos masivos:
  ```powershell
  $enc = New-Object System.Text.UTF8Encoding($true)   # UTF-8 con BOM
  Get-ChildItem -Recurse -Filter *.html | ForEach-Object {
    $c = [System.IO.File]::ReadAllText($_.FullName)    # autodetecta BOM, asume UTF-8
    $c = $c.Replace('viejo','nuevo')
    [System.IO.File]::WriteAllText($_.FullName, $c, $enc)
  }
  ```
  Tras cualquier edición en lote, verificar: `grep -rl "Ã©\|Ã­\|Ã³\|Ã±" --include=*.html .` debe dar 0.
- **Footers no uniformes.** Los footers de `blog/index.html` y `blog/articulo-ejemplo/` tienen un formato distinto al resto (listaban menos filiales). Revisar ambos formatos al hacer cambios globales de footer.

## Notas de seguridad

- **Nunca poner tokens de GitHub en el chat.** El PAT anterior fue revocado por GitHub por exposición en conversación. Autenticar siempre via GitHub Desktop o terminal directamente.
- El archivo `.gitignore` excluye `.DS_Store`, `Thumbs.db`, `.vscode/`, `*.tmp`, `*.bak`.
- `.claude/settings.local.json` (si existe) está en `.gitignore` — no se sube al repo.

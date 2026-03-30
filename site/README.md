# Sitio Web — Power BI Consulting
## Sitio estático de 4 páginas: Landing · Notebooks · Quiénes Somos · Contacto

---

## 📁 Estructura del sitio

```
site/
├── index.html          ← Landing page (presentación de ventas)
├── notebooks.html      ← Visor interactivo de Jupyter notebooks
├── nosotros.html       ← Quiénes Somos / trayectoria
├── contacto.html       ← Contacto (WhatsApp, correo, LinkedIn)
├── css/
│   └── style.css       ← Estilos compartidos
├── js/
│   └── main.js         ← JavaScript compartido
└── assets/             ← Coloca aquí tu logo y foto de perfil
    ├── logo.png        ← (crea este archivo)
    ├── foto-perfil.jpg ← (crea este archivo)
    └── notebooks/      ← (opcional) notebooks estáticos
```

---

## ✏️ Pasos para personalizar (antes de desplegar)

Busca `[EDITA` en todos los archivos HTML. Las secciones marcadas son:

| Placeholder              | Descripción                                |
|--------------------------|--------------------------------------------|
| `[NOMBRE DEL SITIO]`     | El nombre de tu sitio/marca                |
| `[Nombre.]`              | Tu nombre en la nav y footer               |
| `[Nombre de tu empresa]` | Nombre legal o comercial para el copyright |
| `[TU_NUMERO]`            | Número WhatsApp en formato internacional   |
| `[TU_CORREO]`            | tu@correo.com                              |
| `[TU_USUARIO_LINKEDIN]`  | Usuario de LinkedIn (sin la URL completa)  |
| `[Tu Nombre Completo]`   | En la página Quiénes Somos                 |
| `[X]+`, `[AÑO]`, etc.   | Métricas y fechas de tu trayectoria        |

**Logo**: Coloca tu logo como `assets/logo.png` y descomenta la línea del `<img>` en el nav.

**Foto de perfil**: Coloca tu foto como `assets/foto-perfil.jpg` y descomenta la línea en nosotros.html.

---

## 🚀 Opciones de despliegue gratuito (recomendadas por facilidad)

### ⭐ OPCIÓN 1 — GitHub Pages (MÁS RECOMENDADA, 100% gratis)

**Límites**: 1 GB de almacenamiento, 100 GB/mes de ancho de banda. Más que suficiente.

1. Crea una cuenta en [github.com](https://github.com) si no tienes una.
2. Crea un nuevo repositorio público llamado `tu-nombre.github.io` (o cualquier nombre).
3. Sube todos los archivos del sitio (arrastra la carpeta `site/` al repositorio).
4. Ve a **Settings → Pages → Source → Deploy from a branch → main / root**.
5. Tu sitio estará en `https://tu-nombre.github.io` en ~2 minutos.

**Para dominio personalizado** (ej: `tuempresa.com`):
- Agrega un archivo `CNAME` en la raíz con solo el dominio: `tuempresa.com`
- Configura un registro DNS tipo CNAME apuntando a `tu-nombre.github.io`

```bash
# Si usas Git en terminal:
git init
git add .
git commit -m "Sitio web inicial"
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

---

### ⭐ OPCIÓN 2 — Netlify (Drag & Drop, 100% gratis)

**Límites**: 100 GB/mes, deployments ilimitados, HTTPS automático.

1. Ve a [netlify.com](https://netlify.com) y crea una cuenta gratis.
2. En el dashboard, arrastra la carpeta `site/` a la zona de "drag and drop".
3. ¡Listo! Obtienes una URL tipo `algo-random.netlify.app` en segundos.
4. Para dominio personalizado: **Domain Management → Add custom domain**.

**Para updates futuros**: reconecta con GitHub o vuelve a hacer drag & drop.

---

### OPCIÓN 3 — Cloudflare Pages (Ilimitado, 100% gratis)

**Límites**: **Sin límite de ancho de banda**. El más generoso del mercado.

1. Ve a [pages.cloudflare.com](https://pages.cloudflare.com).
2. Conecta con GitHub o sube archivos directamente.
3. Build settings: Framework preset = **None**, output directory = `.` (o la raíz).
4. Deploy. URL tipo `tu-proyecto.pages.dev`.

---

### OPCIÓN 4 — Digital Ocean App Platform (tu opción original)

**Tier gratuito**: 3 sitios estáticos, 1 GB/mes, sin necesidad de tarjeta de crédito para el free tier.

1. Crea una cuenta en [digitalocean.com](https://digitalocean.com).
2. Ve a **Apps → Create App → GitHub** (conecta tu repositorio).
3. Selecciona: **Static Site**.
4. Source Directory: `/site` (o raíz si subiste los archivos sueltos).
5. Output Directory: `/` (vacío para sitios estáticos HTML puro).
6. Haz clic en **Launch App**.

```
⚠️ Nota: Digital Ocean requiere tarjeta de crédito para activar la cuenta,
   aunque el tier estático es gratuito. Netlify y GitHub Pages no requieren
   tarjeta de crédito en absoluto.
```

---

## 📓 Cómo funciona el visor de Notebooks

La página `notebooks.html` permite cargar cualquier notebook de Jupyter exportado como HTML.

**Para exportar desde Jupyter**:
```bash
jupyter nbconvert --to html mi_analisis.ipynb
# Genera: mi_analisis.html
```

Luego arrastra el `.html` a la zona de carga en el sitio. Los archivos se cargan localmente en el navegador — **no se suben a ningún servidor**, por lo que son privados y seguros. Los notebooks se mantienen disponibles durante la sesión del navegador.

**Para notebooks fijos/públicos** (que siempre estén disponibles en el sitio):
1. Coloca el `.html` exportado en `assets/notebooks/`
2. Descomenta la sección "Notebooks Destacados" en `notebooks.html`
3. Actualiza los paths correspondientes

---

## 🎨 Personalizar colores (branding)

Abre `css/style.css` y edita las variables al inicio del archivo:

```css
:root {
  --brand-navy:  #1A3A5C;  /* Color principal oscuro */
  --brand-gold:  #F2A900;  /* Color de acento / llamada a acción */
  --brand-dark:  #0A1929;  /* Fondos muy oscuros */
  /* ... */
}
```

---

## 📱 Notas técnicas

- **100% estático**: No requiere servidor, base de datos ni backend.
- **Responsive**: Funciona en móvil, tablet y escritorio.
- **Sin dependencias NPM**: Solo Google Fonts (CDN) y CSS/JS vanilla.
- **Accesibilidad**: Roles ARIA, navegación por teclado, contraste adecuado.
- **Performance**: Sin librerías pesadas — carga en &lt;2s en conexión normal.
- **SEO básico**: Meta tags en cada página. Agrega Open Graph tags para compartir en redes.

---

## 🆘 Soporte

Para preguntas sobre el código o personalización, revisa los comentarios
`<!-- ═══ EDITA: ... ═══ -->` directamente en los archivos HTML.

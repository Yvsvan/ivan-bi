/* ─── main.js ─── */

// ── Navbar scroll effect ──────────────────────────────────────
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Mobile menu toggle ────────────────────────────────────────
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
toggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  const bars = toggle.querySelectorAll('span');
  bars[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
  bars[1].style.opacity   = isOpen ? '0' : '1';
  bars[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
});
navLinks?.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

// ── Scroll reveal ─────────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── Active nav link ───────────────────────────────────────────
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

// ── Accordion objections ──────────────────────────────────────
document.querySelectorAll('.obj-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.closest('.obj-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.obj-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// ── Bar chart animation ───────────────────────────────────────
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.bar').forEach(bar => {
        const h = bar.dataset.h;
        bar.style.height = '0';
        requestAnimationFrame(() => {
          bar.style.transition = 'height 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
          bar.style.height = h;
        });
      });
      barObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.chart-bars')?.forEach(el => barObserver.observe(el));

// ── Before/After Table ────────────────────────────────────────
(function initBATable() {
  const baRowsContainer = document.getElementById('ba-rows');
  if (!baRowsContainer) return;

  const rows = [
    {
      before: 'Reportes estáticos en Excel (replicación de datos)',
      after: 'Dashboard en tiempo real interactivo'
    },
    {
      before: 'Ciclo de actualización manual cada semana',
      after: 'Datos actualizados cada hora (configurable)'
    },
    {
      before: 'Un analista dedica 15h/semana a extracción + transformación manual',
      after: 'Automatización completa, 0 toques manuales'
    },
    {
      before: 'Imposible hacer análisis ad-hoc en 30 min',
      after: 'Cualquier pregunta respondida en segundos'
    },
    {
      before: 'Riesgo alto de inconsistencia entre departamentos',
      after: 'Una sola versión de la verdad para toda la organización'
    }
  ];

  baRowsContainer.innerHTML = rows.map(row => `
    <div class="ba-row reveal">
      <div class="ba-before">${row.before}</div>
      <div class="ba-mid">→</div>
      <div class="ba-after">${row.after}</div>
    </div>
  `).join('');

  // Observe new reveal elements
  baRowsContainer.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// ── Load external notebook ───────────────────────────────────
function loadExternalNb(path) {
  const nbViewer = document.getElementById('nb-viewer');
  if (!nbViewer) return;
  nbViewer.innerHTML = `<iframe src="${path}" title="Notebook"></iframe>`;
  nbViewer.style.display = 'block';
  nbViewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Notebook viewer ───────────────────────────────────────────
(function initNotebooks() {
  const uploadZone  = document.getElementById('nb-upload-zone');
  const fileInput   = document.getElementById('nb-file-input');
  const nbList      = document.getElementById('nb-list');
  const nbViewer    = document.getElementById('nb-viewer');
  const nbEmpty     = document.getElementById('nb-empty');

  if (!uploadZone) return;

  // Storage key
  const STORAGE_KEY = 'pbi_notebooks_v1';
  let notebooks = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');
  // notebooks: [{name, url, size, date}]

  function render() {
    nbList.innerHTML = '';
    if (notebooks.length === 0) {
      nbList.style.display = 'none';
      return;
    }
    nbList.style.display = 'flex';
    notebooks.forEach((nb, idx) => {
      const item = document.createElement('div');
      item.className = 'nb-item';
      item.innerHTML = `
        <div class="nb-item-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg></div>
        <div>
          <div class="nb-item-name">${nb.name}</div>
          <div class="nb-item-meta">${nb.size}  ·  ${nb.date}</div>
        </div>
        <div class="nb-item-actions">
          <button class="nb-btn-sm" data-view="${idx}">Ver ↗</button>
          <button class="nb-btn-sm danger" data-del="${idx}">✕</button>
        </div>`;
      nbList.appendChild(item);
    });

    nbList.querySelectorAll('[data-view]').forEach(btn => {
      btn.addEventListener('click', () => loadNotebook(parseInt(btn.dataset.view)));
    });
    nbList.querySelectorAll('[data-del]').forEach(btn => {
      btn.addEventListener('click', () => deleteNotebook(parseInt(btn.dataset.del)));
    });
  }

  function loadNotebook(idx) {
    const nb = notebooks[idx];
    document.querySelectorAll('.nb-item').forEach((el, i) =>
      el.classList.toggle('active', i === idx));
    nbEmpty.style.display = 'none';
    nbViewer.innerHTML = `<iframe src="${nb.url}" title="${nb.name}"></iframe>`;
    nbViewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function deleteNotebook(idx) {
    const nb = notebooks[idx];
    URL.revokeObjectURL(nb.url);
    notebooks.splice(idx, 1);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(
      notebooks.map(n => ({ ...n, url: n.url }))
    ));
    render();
    nbViewer.innerHTML = '';
    nbEmpty.style.display = 'block';
  }

  function handleFiles(files) {
    Array.from(files).forEach(file => {
      if (!file.name.endsWith('.html') && !file.name.endsWith('.htm')) {
        alert(`"${file.name}" no es un archivo HTML. Por favor exporta tu notebook desde Jupyter/nbconvert primero.`);
        return;
      }
      const url  = URL.createObjectURL(file);
      const size = file.size > 1048576
        ? (file.size / 1048576).toFixed(1) + ' MB'
        : Math.round(file.size / 1024) + ' KB';
      notebooks.push({
        name: file.name,
        url,
        size,
        date: new Date().toLocaleDateString('es-MX', { day:'2-digit', month:'short', year:'numeric' })
      });
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(notebooks));
      render();
      loadNotebook(notebooks.length - 1);
    });
  }

  uploadZone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', e => handleFiles(e.target.files));

  uploadZone.addEventListener('dragover', e => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
  });
  uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
  uploadZone.addEventListener('drop', e => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
  });

  render();
})();

/* ─── interactivo.js ─── */

// ── Scroll Progress Bar ───────────────────────────────────────
(function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
    bar.setAttribute('aria-valuenow', Math.round(pct));
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

// ── Number Counter Animation ──────────────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('.number-counter');
  if (!counters.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      obs.unobserve(e.target);
      const el = e.target;
      const target = parseFloat(el.dataset.target || el.textContent);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const duration = parseInt(el.dataset.duration || 1800);
      const decimals = parseInt(el.dataset.decimals || 0);
      let start = null;
      function step(ts) {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const val = target * eased;
        el.textContent = prefix + val.toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.3 });
  counters.forEach(el => obs.observe(el));
})();

// ── Tilt Card Effect ──────────────────────────────────────────
(function initTilt() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

// ── Quiz ──────────────────────────────────────────────────────
(function initQuiz() {
  const quizEl = document.getElementById('quiz');
  if (!quizEl) return;

  let answers = {};
  const steps = quizEl.querySelectorAll('.quiz-step');
  const segs  = quizEl.querySelectorAll('.quiz-progress-seg');

  function showStep(n) {
    steps.forEach((s, i) => s.classList.toggle('active', i === n));
    segs.forEach((s, i)  => s.classList.toggle('done', i <= n));
  }

  quizEl.querySelectorAll('.quiz-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      const step = parseInt(btn.closest('.quiz-step').dataset.step);
      answers[step] = parseInt(btn.dataset.val);
      if (step < steps.length - 2) {
        showStep(step + 1);
      } else {
        segs.forEach(s => s.classList.add('done'));
        showResult();
      }
    });
  });

  function showResult() {
    const q1 = answers[0] ?? 0;
    const q2 = answers[1] ?? 0;
    const q3 = answers[2] ?? 0;
    const rec = calcRecommendation(q1, q2, q3);
    const resultStep = quizEl.querySelector('.quiz-step:last-child');
    const resultEl = quizEl.querySelector('.quiz-result-wrap');
    if (resultEl) {
      const map = {
        pulso:     { emoji: '⚡', name: 'Pulso', color: '#06B6D4', desc: 'Su primer dashboard en 7 días. Ideal para micro-PYMEs que quieren ver sus datos en una pantalla antes de comprometerse con una solución más grande. Inversión: $5,000 – $9,000 MXN.' },
        express:   { emoji: '🚀', name: 'Reporte Express', color: '#14B8A6', desc: 'Un dashboard ejecutivo publicado en Power BI Service en 2 semanas. Perfecto para directores que quieren ver sus KPIs actualizados automáticamente. Inversión: $15,000 – $25,000 MXN.' },
        starter:   { emoji: '🌱', name: 'Starter', color: '#6366F1', desc: 'Una área de su empresa completamente transformada con 3-5 reportes interconectados. Ideal para empresas de 20-50 empleados. Inversión: $40,000 – $70,000 MXN.' },
        pro:       { emoji: '⭐', name: 'Professional', color: '#F2A900', desc: 'Sistema de inteligencia para toda la empresa. Multi-área, modelo estrella, RLS y 3 tracks de capacitación. El sweet spot para PYMEs de 50-150 empleados. Inversión: $80,000 – $140,000 MXN.' },
        cap:       { emoji: '🎓', name: 'Capacitación', color: '#EC4899', desc: 'Workshops y bootcamps in-company de Power BI. Desde un taller de 8 horas hasta preparación para la certificación PL-300. Modalidad presencial o remota.' },
        retainer:  { emoji: '🔄', name: 'Retainer', color: '#10B981', desc: 'Contrato mensual de horas para evolución continua de su solución BI ya existente. Respuesta garantizada y sesión semanal de alineación. Planes desde $9,000 MXN/mes.' },
      };
      const r = map[rec];
      resultEl.innerHTML = `
        <div class="quiz-result-emoji">${r.emoji}</div>
        <div class="quiz-result-label">Recomendación para usted</div>
        <div class="quiz-result-name" style="color:${r.color}">${r.name}</div>
        <p class="quiz-result-desc">${r.desc}</p>
        <a href="contacto.html" class="btn btn-primary btn-lg">Agendar diagnóstico gratuito →</a>
        <br>
        <button class="quiz-restart" onclick="document.querySelector('[data-quiz-restart]').click()">Responder de nuevo</button>`;
    }
    if (resultStep) showStep(parseInt(resultStep.dataset.step));
  }

  const restartTrigger = quizEl.querySelector('[data-quiz-restart]');
  if (restartTrigger) {
    restartTrigger.addEventListener('click', () => {
      answers = {};
      showStep(0);
    });
  }

  function calcRecommendation(q1, q2, q3) {
    if (q2 === 5) return 'cap';
    if (q1 === 3 || q2 === 4) return 'retainer';
    if (q2 === 0) return 'pulso';
    if (q2 === 1) return 'express';
    if (q2 === 2) return 'starter';
    if (q2 === 3) return 'pro';
    if (q3 === 0 && q2 <= 1) return 'pulso';
    return 'express';
  }

  showStep(0);
})();

// ── ROI Calculator con sliders ────────────────────────────────
(function initROI() {
  const calc = document.getElementById('roiCalc');
  if (!calc) return;

  const sliderPersonas = calc.querySelector('#roi-personas');
  const sliderHoras    = calc.querySelector('#roi-horas');
  const sliderCosto    = calc.querySelector('#roi-costo');
  const badgePersonas  = document.getElementById('badge-personas');
  const badgeHoras     = document.getElementById('badge-horas');
  const badgeCosto     = document.getElementById('badge-costo');
  const resultEl       = document.getElementById('roi-result-num');
  const subEl          = document.getElementById('roi-result-sub');

  function fmt(n) {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency', currency: 'MXN', maximumFractionDigits: 0
    }).format(n);
  }

  function update() {
    const personas = parseFloat(sliderPersonas?.value) || 3;
    const horas    = parseFloat(sliderHoras?.value)    || 8;
    const costo    = parseFloat(sliderCosto?.value)    || 150;

    if (badgePersonas) badgePersonas.textContent = personas;
    if (badgeHoras)    badgeHoras.textContent    = horas + ' h';
    if (badgeCosto)    badgeCosto.textContent    = '$' + costo;

    const anual   = personas * horas * 52 * costo * 0.80;
    const mensual = anual / 12;

    if (resultEl) resultEl.textContent = fmt(anual);
    if (subEl)    subEl.textContent    = 'Ahorro mensual estimado: ' + fmt(mensual);
  }

  [sliderPersonas, sliderHoras, sliderCosto].forEach(slider => {
    if (slider) slider.addEventListener('input', update);
  });
  update();
})();

// ── Tier Accordion ────────────────────────────────────────────
(function initTierAccordion() {
  document.querySelectorAll('.tier-acc-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.tier-acc-item');
      const wasOpen = item.classList.contains('open');
      item.closest('.tier-accordion')
          ?.querySelectorAll('.tier-acc-item')
          .forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
})();

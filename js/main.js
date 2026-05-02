/* ============================================================
   GRUPO TRONO — JavaScript Principal
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Navegación móvil ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks  = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('abierto');
      navLinks.classList.toggle('abierto');
    });

    // Cerrar al hacer clic en un enlace
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('abierto');
        navLinks.classList.remove('abierto');
      });
    });
  }

  /* ---------- Nav scrolled ---------- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Marcar enlace activo ---------- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || href.endsWith(currentPath))) {
      link.classList.add('activo');
    }
  });

  /* ---------- Animaciones de entrada (Intersection Observer) ---------- */
  const animarEls = document.querySelectorAll('.animar');
  if (animarEls.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    animarEls.forEach(el => observer.observe(el));
  }

  /* ---------- Contador animado (stats) ---------- */
  const statNums = document.querySelectorAll('.stat-numero[data-target]');
  if (statNums.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        let start    = 0;
        const step   = Math.ceil(target / 60);
        const timer  = setInterval(() => {
          start += step;
          if (start >= target) {
            el.textContent = target + suffix;
            clearInterval(timer);
          } else {
            el.textContent = start + suffix;
          }
        }, 25);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.5 });

    statNums.forEach(el => counterObserver.observe(el));
  }

  /* ---------- Filtros de portafolio ---------- */
  const filtros    = document.querySelectorAll('.filtro-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (filtros.length > 0) {
    filtros.forEach(btn => {
      btn.addEventListener('click', () => {
        filtros.forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');

        const filtro = btn.dataset.filtro;
        portfolioItems.forEach(item => {
          const mostrar = filtro === 'todos' || item.dataset.categoria === filtro;
          item.style.opacity = mostrar ? '1' : '0.2';
          item.style.transform = mostrar ? 'scale(1)' : 'scale(0.95)';
          item.style.pointerEvents = mostrar ? 'all' : 'none';
        });
      });
    });
  }

  /* ---------- Formulario de contacto ---------- */
  const form = document.getElementById('form-contacto');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btnEnviar = form.querySelector('button[type="submit"]');
      const mensajeDiv = document.getElementById('form-resultado');

      // Estado de carga
      btnEnviar.disabled = true;
      btnEnviar.textContent = 'Enviando...';

      const datos = {
        nombre:   form.nombre.value.trim(),
        email:    form.email.value.trim(),
        telefono: form.telefono?.value.trim() || '',
        empresa:  form.empresa?.value.trim() || '',
        servicio: form.servicio?.value || '',
        mensaje:  form.mensaje.value.trim(),
        fecha:    new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' })
      };

      try {
        // Envío via Formspree — reemplazar ACTION_URL con tu endpoint de Formspree
        const ACTION_URL = form.getAttribute('action');

        const response = await fetch(ACTION_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(datos)
        });

        if (response.ok) {
          mostrarMensaje(mensajeDiv, 'exito',
            '✓ Mensaje enviado. Nos pondremos en contacto muy pronto.');
          form.reset();
        } else {
          throw new Error('Error en el servidor');
        }
      } catch (err) {
        mostrarMensaje(mensajeDiv, 'error',
          '✗ Hubo un problema al enviar. Por favor escríbenos directamente a contacto@grupotrono.com');
      } finally {
        btnEnviar.disabled = false;
        btnEnviar.textContent = 'Enviar mensaje';
      }
    });
  }

  function mostrarMensaje(el, tipo, texto) {
    if (!el) return;
    el.className = 'form-mensaje ' + tipo;
    el.textContent = texto;
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setTimeout(() => { el.className = 'form-mensaje'; }, 6000);
  }

  /* ---------- Año actual en footer ---------- */
  const yearEl = document.getElementById('anio-actual');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Carrusel Clientes ---------- */
  const track   = document.getElementById('clientesTrack');
  const dotsEl  = document.getElementById('clientesDots');
  if (track) {
    const items   = Array.from(track.querySelectorAll('.cliente-item'));
    const dots    = dotsEl ? Array.from(dotsEl.querySelectorAll('.cliente-dot')) : [];
    const total   = items.length;
    let current   = 0;
    let timer     = null;

    function renderCarrusel(idx) {
      items.forEach((item, i) => {
        item.classList.remove('estado-centro', 'estado-lateral', 'estado-oculto');
        const prev = (idx - 1 + total) % total;
        const next = (idx + 1) % total;
        if (i === idx)  item.classList.add('estado-centro');
        else if (i === prev || i === next) item.classList.add('estado-lateral');
        else item.classList.add('estado-oculto');
      });
      dots.forEach((d, i) => d.classList.toggle('activo', i === idx));
    }

    function avanzar() {
      current = (current + 1) % total;
      renderCarrusel(current);
    }

    function startTimer() {
      clearInterval(timer);
      timer = setInterval(avanzar, 3000);
    }

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        current = parseInt(dot.dataset.i);
        renderCarrusel(current);
        startTimer();
      });
    });

    // Soporte swipe táctil
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        current = diff > 0 ? (current + 1) % total : (current - 1 + total) % total;
        renderCarrusel(current);
        startTimer();
      }
    });

    // Soporte arrastre con mouse
    let mouseStartX = 0;
    let arrastrando  = false;
    track.addEventListener('mousedown', e => {
      arrastrando  = true;
      mouseStartX  = e.clientX;
      track.style.cursor = 'grabbing';
      e.preventDefault();
    });
    window.addEventListener('mousemove', e => {
      if (!arrastrando) return;
      e.preventDefault();
    });
    window.addEventListener('mouseup', e => {
      if (!arrastrando) return;
      arrastrando = false;
      track.style.cursor = 'grab';
      const diff = mouseStartX - e.clientX;
      if (Math.abs(diff) > 40) {
        current = diff > 0 ? (current + 1) % total : (current - 1 + total) % total;
        renderCarrusel(current);
        startTimer();
      }
    });
    track.addEventListener('mouseleave', () => {
      if (arrastrando) {
        arrastrando = false;
        track.style.cursor = 'grab';
      }
    });

    renderCarrusel(current);
    startTimer();
  }

});

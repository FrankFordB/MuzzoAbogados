// Mobile menu toggle and sticky header niceties
(function(){
  const btn = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.menu');
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  if(btn && menu){
    const toggle = () => {
      const open = !menu.classList.contains('open');
      menu.classList.toggle('open', open);
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('nav-open', open);
    };
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', toggle);
    // Cerrar al seleccionar una opción o presionar Escape
    menu.addEventListener('click', (e)=>{
      const target = e.target;
      if(target && target.closest('a')){
        menu.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      }
    });
    window.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape'){
        menu.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      }
    });
  }

const navBaja = document.querySelector('.navbar');
  const onScrolling = () => {
    if(!navBaja) return;
    if(window.scrollY > 5){
      navBaja.style.top = '0';
      navBaja.style.margin = '0';
    } else {
      navBaja.style.top = '';
      navBaja.style.margin = '';
    }
  };
  window.addEventListener('scroll', onScrolling, {passive:true});
  onScrolling();

  const nav = document.querySelector('.navbar');
  const onScroll = () => {
    if(!nav) return;
    if(window.scrollY > 10){
      nav.style.boxShadow = '0 6px 20px rgba(0,0,0,.25)';
    } else {
      nav.style.boxShadow = 'none';
    }
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // Blog slider on homepage
  const slider = document.querySelector('[data-slider]');
  if (slider){
    const track = slider.querySelector('[data-track]');
    const prev = slider.querySelector('[data-prev]');
    const next = slider.querySelector('[data-next]');

    const scrollStep = () => track.clientWidth; // scroll by viewport width of slider
    const scrollToDir = (dir) => {
      track.scrollBy({left: dir * scrollStep(), behavior:'smooth'});
    };
    prev?.addEventListener('click', ()=> scrollToDir(-1));
    next?.addEventListener('click', ()=> scrollToDir(1));

    // Keyboard support when slider focused
    slider.addEventListener('keydown', (e)=>{
      if(e.key === 'ArrowLeft') scrollToDir(-1);
      if(e.key === 'ArrowRight') scrollToDir(1);
    });

    // Drag to scroll (mouse/touch via Pointer Events)
    let isDown = false;
    let hasDragged = false;
    let startX = 0;
    let startScroll = 0;
    const onPointerDown = (e)=>{
      isDown = true;
      hasDragged = false;
      startX = e.clientX;
      startScroll = track.scrollLeft;
    };
    const onPointerMove = (e)=>{
      if(!isDown) return;
      const dx = e.clientX - startX;
      if(!hasDragged && Math.abs(dx) > 4){
        hasDragged = true;
        track.classList.add('dragging');
        track.setPointerCapture?.(e.pointerId);
      }
      if(hasDragged){
        track.scrollLeft = startScroll - dx;
      }
    };
    const onPointerUp = (e)=>{
      isDown = false;
      if(hasDragged){
        track.classList.remove('dragging');
        track.releasePointerCapture?.(e.pointerId);
      }
    };
    track.addEventListener('pointerdown', onPointerDown);
    track.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    track.addEventListener('pointerleave', onPointerUp);

    // Mouse wheel to scroll horizontally
    const onWheel = (e)=>{
      if(Math.abs(e.deltaY) > Math.abs(e.deltaX)){
        track.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };
    track.addEventListener('wheel', onWheel, {passive:false});

    // Update buttons disabled state
    const updateButtons = () => {
      const atStart = track.scrollLeft <= 2;
      const max = track.scrollWidth - track.clientWidth - 2;
      const atEnd = track.scrollLeft >= max;
      prev?.setAttribute('aria-disabled', String(atStart));
      next?.setAttribute('aria-disabled', String(atEnd));
    };
    track.addEventListener('scroll', updateButtons, {passive:true});
    window.addEventListener('resize', updateButtons);
    updateButtons();
  }

  // Contact form validation (basic, client-side only)
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    const fields = {
      name: form.querySelector('[name="name"]'),
      email: form.querySelector('[name="email"]'),
      message: form.querySelector('[name="message"]')
    };
    
    if (!fields.name || !fields.email || !fields.message) return;

    const setError = (el, msg) => {
      const field = el.closest('.field');
      field?.classList.toggle('invalid', Boolean(msg));
      const err = field?.querySelector('.error');
      if(err) err.textContent = msg || '';
    };

    const validate = () => {
      let ok = true;
      if(!fields.name.value.trim()){ setError(fields.name, 'Ingrese su nombre'); ok = false; } else setError(fields.name);
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value);
      if(!emailOk){ setError(fields.email, 'Correo inválido'); ok = false; } else setError(fields.email);
      if(fields.message.value.trim().length < 10){ setError(fields.message, 'Cuéntenos un poco más (10+ caracteres)'); ok = false; } else setError(fields.message);
      return ok;
    };

    form.addEventListener('submit', (e)=>{
      if(!validate()) {
        e.preventDefault();
        return;
      }
    });

      form.addEventListener('input', (e)=>{
        const t = e.target;
        if(!(t instanceof HTMLElement)) return;
        if(t.name === 'name') setError(fields.name);
        if(t.name === 'email') setError(fields.email);
        if(t.name === 'message') setError(fields.message);
      });
    });

    // WhatsApp floating button behaviour
    const waBtn = document.getElementById('whatsapp-fab');
    if(waBtn){
      // Cambia aquí al número destino sin signo + (ej: 56966089888)
      const phone = '56966089888';
      const defaultMsg = 'Hola, quisiera hacer una consulta sobre mi caso. ¿Podrían ayudarme?';
      waBtn.addEventListener('click', (ev)=>{
        ev.preventDefault();
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(defaultMsg)}`;
        // Abrir en nueva pestaña para WhatsApp Web; en movil abrirá app si corresponde
        window.open(url, '_blank');
      });
      // teclado: Enter/Space
      waBtn.addEventListener('keydown', (ev)=>{
        if(ev.key === 'Enter' || ev.key === ' '){ ev.preventDefault(); waBtn.click(); }
      });
    }

  })();

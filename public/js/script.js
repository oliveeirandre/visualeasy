document.addEventListener('DOMContentLoaded', function () {
  // Bloqueio de contexto (anti-download simples) CSP Safe
  document.querySelectorAll('img').forEach(function (img) {
    img.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    img.setAttribute('draggable', 'false');
    img.addEventListener('dragstart', function (e) { e.preventDefault(); });
    img.style.webkitUserSelect = 'none';
    img.style.userSelect = 'none';
  });
  document.querySelectorAll('iframe').forEach(function (iframe) {
    iframe.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  });

  // Toggle do Menu Mobile
  const menuToggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("menu");
  const menuOverlay = document.getElementById("menu-overlay");
  const bar1 = document.getElementById("bar-1");
  const bar2 = document.getElementById("bar-2");
  const bar3 = document.getElementById("bar-3");
  const menuLinks = menu.querySelectorAll("a");

  function toggleMenu() {
    const isOpen = menu.classList.contains("translate-x-0");
    if (isOpen) {
      menu.classList.remove("translate-x-0");
      menu.classList.add("translate-x-full");
      menuOverlay.classList.add("opacity-0");
      setTimeout(() => { menuOverlay.classList.add("hidden"); }, 300);
      bar1.classList.remove("rotate-45", "top-2.5");
      bar2.classList.remove("opacity-0");
      bar3.classList.remove("-rotate-45", "top-2.5");
      document.body.classList.remove("overflow-hidden", "md:overflow-auto");
      menuToggle.setAttribute('aria-expanded', 'false');
    } else {
      menu.classList.remove("translate-x-full");
      menu.classList.add("translate-x-0");
      menuOverlay.classList.remove("hidden");
      setTimeout(() => { menuOverlay.classList.remove("opacity-0"); }, 10);
      bar1.classList.add("rotate-45", "top-2.5");
      bar2.classList.add("opacity-0");
      bar3.classList.add("-rotate-45", "top-2.5");
      document.body.classList.add("overflow-hidden", "md:overflow-auto");
      menuToggle.setAttribute('aria-expanded', 'true');
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", toggleMenu);
    menuOverlay.addEventListener("click", toggleMenu);
    menuLinks.forEach(link => {
      link.addEventListener("click", () => { if (window.innerWidth < 768) toggleMenu(); });
    });
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      menu.classList.remove("translate-x-0", "translate-x-full");
      menuOverlay.classList.add("hidden", "opacity-0");
      bar1.classList.remove("rotate-45", "top-2.5");
      bar2.classList.remove("opacity-0");
      bar3.classList.remove("-rotate-45", "top-2.5");
      document.body.classList.remove("overflow-hidden");
      if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  const logo = document.getElementById("logo");
  if (logo) {
    logo.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }



  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    const btn = item.querySelector('.faq-question');
    if (btn) {
      btn.addEventListener('click', function () {
        const isActive = item.classList.contains('active');
        // Fecha todos
        faqItems.forEach(function (other) {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        });
        // Abre o clicado (se não estava aberto)
        if (!isActive) {
          item.classList.add('active');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  // Scroll Reveal (Intersection Observer para animações)
  const revealElements = document.querySelectorAll('section, .carousel-container');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal', 'revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(function (el) {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  }

  // Inicializar Swipers se carregados
  if (typeof Swiper !== 'undefined') {
    initializeSwipers();
  } else {
    window.onload = function () {
      if (typeof Swiper !== 'undefined') initializeSwipers();
    }
  }

  // Custom Lazy Load baseado em interação e timeout para resolver os clones do Swiper loop
  let isMediaLoaded = false;
  function loadDeferredMedia() {
    if (isMediaLoaded) return;
    isMediaLoaded = true;

    // Captura orginais e clones feitos dinamicamente
    document.querySelectorAll('img[data-src], img[data-srcset], iframe[data-src]').forEach((el) => {
      if (el.dataset.src) {
        el.src = el.dataset.src;
        el.removeAttribute('data-src');
      }
      if (el.dataset.srcset) {
        el.srcset = el.dataset.srcset;
        el.removeAttribute('data-srcset');
      }
    });

    if (typeof Swiper !== 'undefined') {
      const swipers = document.querySelectorAll('.swiper');
      swipers.forEach(swiperEl => {
        if (swiperEl.swiper) swiperEl.swiper.update();
      });
    }
  }

  ['scroll', 'mousemove', 'touchstart', 'click'].forEach(evt => {
    document.addEventListener(evt, loadDeferredMedia, { once: true, passive: true });
  });

  setTimeout(loadDeferredMedia, 2000);
});

// Função de Inicialização do Swiper
function initializeSwipers() {
  const thumbsSwiper = new Swiper('.main-thumbs-swiper', {
    spaceBetween: 5,
    slidesPerView: 3,
    loop: true,
    centeredSlides: true,
    slideToClickedSlide: true,
    breakpoints: { 640: { slidesPerView: 5 }, 768: { slidesPerView: 7 } }
  });

  const isMobile = window.innerWidth < 769;
  const mainSwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    speed: 800,
    autoplay: { delay: 5000, disableOnInteraction: false },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    a11y: { prevSlideMessage: 'Imagem anterior', nextSlideMessage: 'Próxima imagem' },
    breakpoints: { 768: { slidesPerView: 3, spaceBetween: 5 } }
  };
  if (isMobile) mainSwiperOptions.thumbs = { swiper: thumbsSwiper };

  const mainSwiper = new Swiper('.main-swiper', mainSwiperOptions);
  if (isMobile) {
    mainSwiper.on('slideChange', function () {
      thumbsSwiper.slideToLoop(mainSwiper.realIndex, 300, true);
    });
  }

  const multiImageOptions = {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 5,
    slidesPerGroup: 1,
    loopFillGroupWithBlank: true,
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    breakpoints: { 640: { slidesPerView: 2, spaceBetween: 5 }, 1024: { slidesPerView: 4, spaceBetween: 5 } }
  };

  const dualImageOptions = {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 5,
    slidesPerGroup: 1,
    loopFillGroupWithBlank: true,
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    breakpoints: { 640: { slidesPerView: 1, spaceBetween: 5 }, 1024: { slidesPerView: 2, spaceBetween: 5 } }
  };

  new Swiper('.fachada-swiper', multiImageOptions);
  new Swiper('.interiores-swiper', multiImageOptions);
  new Swiper('.areas-externas-swiper', multiImageOptions);
  new Swiper('.plantas-swiper', dualImageOptions);
  new Swiper('.tour-swiper', {
    ...dualImageOptions,
    navigation: { nextEl: '.tour-swiper .swiper-button-next', prevEl: '.tour-swiper .swiper-button-prev' }
  });
}

// Lógica do Modal de Imagem
(function () {
  let currentImages = null;
  let currentIndex = 0;
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const imageLoadingProgress = document.querySelector('.image-loading-progress');
  const swipeArea = document.querySelector('#imageModal .swipe-area');
  const btnPrev = document.getElementById('modalPrev');
  const btnNext = document.getElementById('modalNext');
  const btnClose = document.getElementById('modalClose');

  if (modalImage) {
    modalImage.addEventListener('load', function () {
      imageLoadingProgress.style.width = '100%';
      setTimeout(() => { imageLoadingProgress.style.width = '0%'; }, 300);
    });
    modalImage.addEventListener('error', function () {
      imageLoadingProgress.style.width = '0%';
    });
  }

  document.addEventListener('click', function (e) {
    const trigger = e.target.closest('.modal-trigger');
    if (trigger && modal) {
      e.preventDefault();
      const swiperClass = trigger.getAttribute('data-swiper-modal');
      const container = document.querySelector('.' + swiperClass);
      if (!container) return;
      const allImages = container.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate) img');
      currentImages = Array.from(allImages);
      const clickedSrc = trigger.src;
      currentIndex = currentImages.findIndex(function (img) { return img.src === clickedSrc; });
      if (currentImages.length === 0 || currentIndex === -1) {
        currentImages = [trigger];
        currentIndex = 0;
      }
      imageLoadingProgress.style.width = '0%';
      modalImage.src = currentImages[currentIndex].src;
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyNavigation);
    }
  });

  function closeModal() {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleKeyNavigation);
  }

  function showPrev() {
    if (!currentImages || currentImages.length === 0) return;
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    imageLoadingProgress.style.width = '0%';
    modalImage.src = currentImages[currentIndex].src;
  }

  function showNext() {
    if (!currentImages || currentImages.length === 0) return;
    currentIndex = (currentIndex + 1) % currentImages.length;
    imageLoadingProgress.style.width = '0%';
    modalImage.src = currentImages[currentIndex].src;
  }

  function handleKeyNavigation(event) {
    if (event.key === 'ArrowLeft') showPrev();
    else if (event.key === 'ArrowRight') showNext();
    else if (event.key === 'Escape') closeModal();
  }

  if (btnPrev) btnPrev.addEventListener('click', showPrev);
  if (btnNext) btnNext.addEventListener('click', showNext);
  if (btnClose) btnClose.addEventListener('click', closeModal);

  if (modalImage) {
    let startX = 0;
    let currentDragX = 0;
    let isDragging = false;

    function handleDragStart(e) {
      if (e.type === 'mousedown') e.preventDefault(); // Evita drag nativo
      startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      isDragging = true;
      modalImage.classList.add('dragging');
      modalImage.style.transform = `translateX(0px)`;
    }

    function handleDragMove(e) {
      if (!isDragging) return;
      const currentX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      currentDragX = currentX - startX;
      // Aplica o movimento imediatamente acompanhando o dedo/mouse
      modalImage.style.transform = `translateX(${currentDragX}px)`;
    }

    function handleDragEnd() {
      if (!isDragging) return;
      isDragging = false;
      modalImage.classList.remove('dragging');

      const threshold = window.innerWidth * 0.15 > 50 ? window.innerWidth * 0.15 : 50;

      if (Math.abs(currentDragX) > threshold) {
        // Arrasta completamente para fora da tela para concluir a transição
        const direction = currentDragX > 0 ? 1 : -1;
        modalImage.style.transform = `translateX(${direction * window.innerWidth}px)`;

        setTimeout(() => {
          if (direction > 0) showPrev();
          else showNext();

          // Posiciona a nova imagem vindo do lado oposto (sem transição)
          modalImage.classList.add('dragging');
          modalImage.style.transform = `translateX(${-direction * window.innerWidth}px)`;

          // Força o navegador a renderizar o frame
          void modalImage.offsetWidth;

          // Desliza para o centro (com transição restaurada)
          modalImage.classList.remove('dragging');
          modalImage.style.transform = `translateX(0px)`;
        }, 200); // timing para casar com a velocidade do drag de saída
      } else {
        // Se arrastou pouco, solta e volta pro meio num snap
        modalImage.style.transform = `translateX(0px)`;
      }
      currentDragX = 0;
    }

    // Eventos de Toque (Mobile)
    modalImage.addEventListener('touchstart', handleDragStart, { passive: true });
    modalImage.addEventListener('touchmove', handleDragMove, { passive: true });
    modalImage.addEventListener('touchend', handleDragEnd);
    modalImage.addEventListener('touchcancel', handleDragEnd);

    // Eventos de Mouse (Desktop)
    modalImage.addEventListener('mousedown', handleDragStart);
    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
  }
  if (modal) {
    // Fecha ao clicar no fundo escuro (não no modal-content)
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
  }
})();

// Lógica do Player de Vídeo
(function () {
  const videos = [
    { mp4: "public/assets/video/video-1.mp4", webm: "public/assets/video/video-1.webm", poster: "public/assets/video/thumbnail-video-1.jpg" },
    { mp4: "public/assets/video/video-2.mp4", webm: "public/assets/video/video-2.webm", poster: "public/assets/video/thumbnail-video-2.jpg" },
    { mp4: "public/assets/video/video-3.mp4", webm: "public/assets/video/video-3.webm", poster: "public/assets/video/thumbnail-video-3.jpg" },
    { mp4: "public/assets/video/video-4.mp4", webm: "public/assets/video/video-4.webm", poster: "public/assets/video/thumbnail-video-4.jpg" }
  ];
  let currentVideoIndex = 0;
  const videoPlayer = document.getElementById("videoPlayer");
  const loadingSpinner = document.querySelector(".video-loading-spinner");
  const btnNextVideo = document.getElementById("nextVideo");
  const btnPrevVideo = document.getElementById("prevVideo");

  if (videoPlayer && btnNextVideo && btnPrevVideo) {
    const mp4Source = videoPlayer.querySelector('source[type="video/mp4"]');
    const webmSource = videoPlayer.querySelector('source[type="video/webm"]');

    function changeVideo(index) {
      videoPlayer.pause();
      loadingSpinner.classList.remove('hidden');
      currentVideoIndex = index;
      mp4Source.src = videos[index].mp4;
      webmSource.src = videos[index].webm;
      videoPlayer.poster = videos[index].poster;
      videoPlayer.load();
    }

    function navigateVideo(direction) {
      let newIndex = direction === "next" ? (currentVideoIndex + 1) % videos.length : (currentVideoIndex - 1 + videos.length) % videos.length;
      changeVideo(newIndex);
    }

    btnNextVideo.addEventListener("click", () => navigateVideo("next"));
    btnPrevVideo.addEventListener("click", () => navigateVideo("prev"));
    videoPlayer.addEventListener('loadeddata', function () { loadingSpinner.classList.add('hidden'); });
    videoPlayer.addEventListener('error', function () { loadingSpinner.classList.add('hidden'); });
  }
})();

// Lógica do Formulário e WhatsApp
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("orcamento-form");
  const submitSuccess = document.getElementById("submitSuccess");
  const submitError = document.getElementById("submitError");
  const loadingSpinner = document.getElementById("loadingSpinner");
  const submitBtn = document.getElementById("submitBtn");

  // Validação WhatsApp
  (function () {
    const input = document.getElementById('whatsapp_input');
    const hidden = document.getElementById('whatsapp');
    const err = document.getElementById('whatsapp_error');
    const assumeBRIfNoDDI = true;

    function formatDisplay(value) {
      let v = value.replace(/[^\d+]/g, '');
      if (!v.startsWith('+') && assumeBRIfNoDDI) v = '+55' + v;

      if (v.startsWith('+55')) {
        const digits = v.replace(/\D/g, '').slice(2);
        let ddd = digits.slice(0, 2);
        let rest = digits.slice(2, 11);
        let out = '+55';
        if (ddd) out += ' (' + ddd + ')';
        if (rest) {
          if (rest.length <= 4) out += ' ' + rest;
          else if (rest.length <= 8) out += ' ' + rest.slice(0, rest.length - 4) + '-' + rest.slice(-4);
          else out += ' ' + rest.slice(0, 5) + '-' + rest.slice(5, 9);
        }
        return out.trim();
      }
      return v;
    }

    function normalizeE164(viewValue) {
      let v = viewValue.trim();
      if (!v.startsWith('+') && assumeBRIfNoDDI) v = '+55 ' + v;
      v = v.replace(/[^\d+]/g, '');
      if (!v.startsWith('+')) return null;
      const digits = v.replace(/\D/g, '');
      if (digits.length < 8) return null;
      return '+' + digits;
    }

    window.validateWhatsapp = function () {
      if (!input) return true;
      input.value = formatDisplay(input.value);
      const e164 = normalizeE164(input.value);
      const valid = e164 && /^\+\d{8,15}$/.test(e164);

      if (valid) {
        hidden.value = e164;
        err.style.display = 'none';
        input.classList.remove('input-error');
      } else {
        hidden.value = '';
        if (input.value.length > 0) {
          err.style.display = 'block';
          input.classList.add('input-error');
        }
      }
      return valid;
    }

    if (input) {
      input.addEventListener('input', window.validateWhatsapp);
      input.addEventListener('blur', window.validateWhatsapp);
    }
  })();

  // Montar Link WhatsApp
  function buildWaLinkFromForm(formObj) {
    const myNumber = '5519996996756';
    const linhas = [
      'Olá, Visual Easy 3D!',
      'Enviei uma solicitação de orçamento pelo site e gostaria de continuar por aqui.',
      formObj.nome ? `Meu nome: ${formObj.nome}` : null,
      formObj.incorporadora ? `Incorporadora: ${formObj.incorporadora}` : null,
      '',
      'Podem me orientar sobre os próximos passos?'
    ].filter(Boolean).join('\n');
    return `https://wa.me/${myNumber}?text=${encodeURIComponent(linhas)}`;
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      // Honeypot check (bots preenchem campos ocultos)
      const honeypot = document.getElementById('website_url');
      if (honeypot && honeypot.value.length > 0) {
        // Silenciosamente rejeita (bot detectado)
        submitSuccess.style.display = "block";
        form.reset();
        return;
      }

      if (typeof window.validateWhatsapp === 'function' && !window.validateWhatsapp()) {
        const input = document.getElementById('whatsapp_input');
        if (input) { input.focus(); input.classList.add('input-error'); }
        const err = document.getElementById('whatsapp_error');
        if (err) err.style.display = 'block';
        return;
      }

      submitSuccess.style.display = "none";
      submitError.style.display = "none";
      loadingSpinner.style.display = "inline-block";
      if (submitBtn) submitBtn.disabled = true;

      const formObj = {};
      const formData = new FormData(form);
      for (let [key, value] of formData.entries()) {
        if (key !== 'itens[]' && key !== 'website_url') formObj[key] = value;
      }
      const checkedItems = form.querySelectorAll('input[name="itens[]"]:checked');
      formObj.itens = Array.from(checkedItems).map(cb => cb.value);

      const jsonDataToSend = new FormData();
      jsonDataToSend.append('json', JSON.stringify(formObj));

      const waBtn = document.getElementById('waFollowUpBtn');

      const processSuccess = () => {
        if (submitBtn) submitBtn.disabled = false;
        loadingSpinner.style.display = "none";
        submitSuccess.style.display = "block";
        submitError.style.display = "none";
        form.reset();

        if (typeof gtag === "function") {
          gtag('event', 'enviar_orcamento', { 'event_category': 'Formulário', 'event_label': 'Orçamento' });
        }
        submitSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

        if (waBtn) {
          const waUrl = buildWaLinkFromForm(formObj);
          waBtn.href = waUrl;
          waBtn.style.display = 'inline-block';
          if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            setTimeout(() => { window.location.href = waUrl; }, 1500);
          }
        }
      };

      fetch("https://script.google.com/macros/s/AKfycbzxrIGqOE2imrwZspLytuY0w0MR5MB9MsyZpg4ESPzDzKgAw7x7A0kw1pyS-tLv3H2-/exec", {
        method: "POST",
        mode: "no-cors",
        body: jsonDataToSend,
      })
        .then(() => {
          processSuccess();
        })
        .catch((err) => {
          console.warn("Redirecionamento bloqueado pelo CSP, mas dados foram enviados com sucesso ao Google:", err);
          processSuccess();
        });
    });
  }
});

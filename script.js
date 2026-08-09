/* ============================================
   Landing Page - 80 Riscos para Pano de Prato
   JavaScript Principal
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Carrosséis
  const carousels = document.querySelectorAll('.carousel');
  
  carousels.forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const dots = carousel.querySelectorAll('.carousel-dot');
    
    if (!track || slides.length === 0) return;

    // Atualiza o estado dos dots com base na rolagem
    const updateCarouselState = () => {
      const scrollPosition = track.scrollLeft;
      const slideWidth = slides[0].offsetWidth;
      
      // Calcula o índice atual baseado na posição de rolagem
      const currentIndex = Math.round(scrollPosition / slideWidth);
      
      // Atualiza a classe ativa dos dots
      dots.forEach((dot, index) => {
        if (dot) {
          dot.classList.toggle('active', index === currentIndex);
        }
      });
    };

    // Ouve o evento de scroll da track (usando passivo para performance)
    track.addEventListener('scroll', updateCarouselState, { passive: true });

    // Controle: Botão Anterior
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const slideWidth = slides[0].offsetWidth;
        track.scrollBy({ left: -slideWidth, behavior: 'smooth' });
      });
    }

    // Controle: Botão Próximo
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const slideWidth = slides[0].offsetWidth;
        track.scrollBy({ left: slideWidth, behavior: 'smooth' });
      });
    }

    // Controle: Dots de navegação
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        const slideWidth = slides[0].offsetWidth;
        track.scrollTo({ left: slideWidth * index, behavior: 'smooth' });
      });
    });
  });

  // 2. FAQ Acordeão
  const faqList = document.querySelector('.faq-list');
  const faqItems = document.querySelectorAll('.faq-item');

  // Usando delegação de eventos para melhor performance
  if (faqList) {
    faqList.addEventListener('click', (e) => {
      const questionBtn = e.target.closest('.faq-question');
      if (!questionBtn) return;

      const currentItem = questionBtn.closest('.faq-item');
      const isAlreadyActive = currentItem.classList.contains('active');

      // Fecha todos os itens abertos
      faqItems.forEach(item => item.classList.remove('active'));

      // Se o item clicado não estava ativo, abre ele
      if (!isAlreadyActive) {
        currentItem.classList.add('active');
      }
    });
  }

  // 3. Animações de Scroll
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fadeElements = document.querySelectorAll('.fade-in');

  if (prefersReducedMotion) {
    // Exibe imediatamente para usuários que preferem movimentos reduzidos
    fadeElements.forEach(el => el.classList.add('visible'));
  } else {
    // Utiliza IntersectionObserver para animar ao rolar
    const fadeObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Anima apenas uma vez por elemento
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(el => fadeObserver.observe(el));
  }

  // 4. Smooth Scroll para âncoras internas
  const smoothLinks = document.querySelectorAll('a[href^="#"]');
  
  smoothLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      // Ignora links vazios
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // 5. Lazy Loading (Imagens)
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        // Substitui o source e remove o data-attribute
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
        observer.unobserve(img); // Para de observar a imagem após carregar
      }
    });
  }, {
    rootMargin: '200px 0px 200px 0px'
  });

  lazyImages.forEach(img => imageObserver.observe(img));

});

document.addEventListener("DOMContentLoaded", () => {
    const carousels = document.querySelectorAll(".a4-carousel");

    carousels.forEach((carousel) => {
        const viewport = carousel.querySelector(".a4-carousel-viewport");
        const track = carousel.querySelector(".a4-carousel-track");

        if (!viewport || !track) {
            return;
        }

        /*
         * Remove clones que possam ter ficado no HTML.
         */
        track
            .querySelectorAll(".a4-carousel-clone")
            .forEach((clone) => clone.remove());

        const originalSlides = Array.from(
            track.querySelectorAll(":scope > .a4-carousel-slide")
        );

        if (originalSlides.length === 0) {
            return;
        }

        /*
         * Velocidade em pixels por segundo.
         * Aumente para acelerar.
         */
        const speed = Number(carousel.dataset.speed) || 35;

        let currentPosition = 0;
        let cycleWidth = 0;

        let animationFrameId = null;
        let previousTimestamp = null;
        let resizeTimeout = null;

        let previousViewportWidth = viewport.clientWidth;
        let documentIsHidden = document.hidden;

        function removeControls() {
            carousel
                .querySelectorAll(
                    ".a4-carousel-btn, " +
                    ".a4-carousel-prev, " +
                    ".a4-carousel-next, " +
                    ".a4-carousel-dots"
                )
                .forEach((element) => element.remove());
        }

        function removeClones() {
            track
                .querySelectorAll(".a4-carousel-clone")
                .forEach((clone) => clone.remove());
        }

        function createClone(slide) {
            const clone = slide.cloneNode(true);

            clone.classList.add("a4-carousel-clone");
            clone.setAttribute("aria-hidden", "true");

            clone
                .querySelectorAll(
                    "a, button, input, textarea, select, [tabindex]"
                )
                .forEach((element) => {
                    element.setAttribute("tabindex", "-1");
                });

            return clone;
        }

        function appendCloneSet() {
            const fragment = document.createDocumentFragment();

            originalSlides.forEach((slide) => {
                fragment.appendChild(createClone(slide));
            });

            track.appendChild(fragment);
        }

        function getGap() {
            const trackStyle = window.getComputedStyle(track);

            const parsedGap = parseFloat(
                trackStyle.columnGap || trackStyle.gap || "0"
            );

            return Number.isFinite(parsedGap) ? parsedGap : 0;
        }

        function calculateCycleWidth() {
            const firstOriginal = originalSlides[0];

            const firstClone = track.querySelector(
                ":scope > .a4-carousel-clone"
            );

            if (!firstOriginal || !firstClone) {
                cycleWidth = 0;
                return;
            }

            /*
             * A distância entre a primeira imagem original
             * e a primeira imagem clonada corresponde exatamente
             * à largura das seis imagens mais os espaços.
             */
            cycleWidth =
                firstClone.offsetLeft -
                firstOriginal.offsetLeft;

            /*
             * Plano alternativo caso offsetLeft retorne zero.
             */
            if (cycleWidth <= 0) {
                const gap = getGap();

                cycleWidth = originalSlides.reduce(
                    (total, slide) => {
                        return (
                            total +
                            slide.getBoundingClientRect().width +
                            gap
                        );
                    },
                    0
                );
            }
        }

        function createCopies() {
            removeClones();

            /*
             * Primeira cópia completa das seis imagens.
             */
            appendCloneSet();

            calculateCycleWidth();

            if (cycleWidth <= 0) {
                return false;
            }

            /*
             * Adiciona outra cópia para garantir que nunca
             * apareça um espaço vazio no final.
             */
            appendCloneSet();

            /*
             * Adiciona mais conjuntos se a tela for muito larga.
             */
            let safetyCounter = 0;

            while (
                track.scrollWidth <
                    viewport.clientWidth + cycleWidth * 2 &&
                safetyCounter < 10
            ) {
                appendCloneSet();
                safetyCounter += 1;
            }

            return true;
        }

        function renderPosition() {
            track.style.transform =
                `translate3d(-${currentPosition}px, 0, 0)`;
        }

       function normalizePosition() {
    if (cycleWidth <= 0) {
        return;
    }

    if (currentPosition >= cycleWidth) {
        currentPosition %= cycleWidth;
    }
}
      
        function animate(timestamp) {
            if (previousTimestamp === null) {
                previousTimestamp = timestamp;
            }

            const elapsedMilliseconds =
                timestamp - previousTimestamp;

            previousTimestamp = timestamp;

            /*
             * Limita intervalos grandes quando o navegador
             * reduz temporariamente a animação.
             */
            const elapsedSeconds =
                Math.min(elapsedMilliseconds, 100) / 1000;

            if (
                !documentIsHidden &&
                cycleWidth > 0
            ) {
                currentPosition += speed * elapsedSeconds;

                normalizePosition();
                renderPosition();
            }

            animationFrameId =
                window.requestAnimationFrame(animate);
        }

        function startAnimation() {
            if (animationFrameId !== null) {
                return;
            }

            previousTimestamp = null;

            animationFrameId =
                window.requestAnimationFrame(animate);
        }

        function stopAnimation() {
            if (animationFrameId !== null) {
                window.cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }

            previousTimestamp = null;
        }

        function rebuildCarousel() {
            const oldCycleWidth = cycleWidth;

            const progress =
                oldCycleWidth > 0
                    ? currentPosition / oldCycleWidth
                    : 0;

            stopAnimation();

            track.style.transform = "translate3d(0, 0, 0)";

            const successfullyCreated = createCopies();

            if (!successfullyCreated) {
                /*
                 * Tenta novamente no próximo ciclo de renderização
                 * caso o layout ainda não esteja pronto.
                 */
                window.requestAnimationFrame(() => {
                    window.requestAnimationFrame(rebuildCarousel);
                });

                return;
            }

            currentPosition = progress * cycleWidth;

            normalizePosition();
            renderPosition();
            startAnimation();
        }

        document.addEventListener("visibilitychange", () => {
            documentIsHidden = document.hidden;
            previousTimestamp = null;
        });

        /*
         * No mobile, a barra do navegador altera a altura da tela.
         * O carrossel só é reconstruído se a largura realmente mudar.
         */
        window.addEventListener("resize", () => {
            const currentViewportWidth = viewport.clientWidth;

            const widthDifference = Math.abs(
                currentViewportWidth - previousViewportWidth
            );

            if (widthDifference < 5) {
                return;
            }

            previousViewportWidth = currentViewportWidth;

            window.clearTimeout(resizeTimeout);

            resizeTimeout = window.setTimeout(() => {
                rebuildCarousel();
            }, 200);
        });

        removeControls();

        /*
         * Espera dois ciclos de renderização para garantir
         * que o CSS e as larguras já estejam aplicados.
         */
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                rebuildCarousel();
            });
        });
    });
});

/* ==========================================================================
   CARROSSEL: COMPARAÇÃO RISCO X RESULTADO
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const carousels = document.querySelectorAll(
        "[data-comparison-carousel]"
    );

    carousels.forEach(function (carousel) {

        const track = carousel.querySelector(
            "[data-comparison-track]"
        );

        const cards = Array.from(
            carousel.querySelectorAll(
                "[data-comparison-card]"
            )
        );

        const previousButton = carousel.querySelector(
            "[data-comparison-prev]"
        );

        const nextButton = carousel.querySelector(
            "[data-comparison-next]"
        );

        const dotsContainer = carousel.querySelector(
            "[data-comparison-dots]"
        );

        if (
            !track ||
            cards.length === 0 ||
            !previousButton ||
            !nextButton ||
            !dotsContainer
        ) {
            return;
        }


        /* ==================================================
           CONFIGURAÇÃO
           ================================================== */

        const AUTOPLAY_TIME = 5000;
        const RESTART_DELAY = 8000;

        let currentIndex = 0;

        let autoplayInterval = null;
        let restartTimeout = null;

        let touchStartX = 0;


        /* ==================================================
           DOTS
           ================================================== */

        dotsContainer.innerHTML = "";

        const dots = cards.map(function (_, index) {

            const dot = document.createElement("button");

            dot.type = "button";

            dot.className = "comparison-dot";

            dot.setAttribute(
                "aria-label",
                "Ver comparação " + String(index + 1)
            );

            dot.addEventListener("click", function () {

                goToSlide(index);

                restartAutoplay();

            });

            dotsContainer.appendChild(dot);

            return dot;
        });


        /* ==================================================
           TROCA DE SLIDE
           ================================================== */

        function goToSlide(index) {

            /*
             * Autoplay pode circular.
             */

            if (index >= cards.length) {
                index = 0;
            }

            if (index < 0) {
                index = cards.length - 1;
            }

            currentIndex = index;

            track.style.transform =
                "translate3d(-" +
                currentIndex * 100 +
                "%, 0, 0)";

            updateControls();
        }


        /* ==================================================
           CONTROLES
           ================================================== */

        function updateControls() {

            dots.forEach(function (dot, index) {

                const isActive =
                    index === currentIndex;

                dot.classList.toggle(
                    "is-active",
                    isActive
                );

                dot.setAttribute(
                    "aria-current",
                    isActive
                        ? "true"
                        : "false"
                );
            });


            /*
             * As setas continuam habilitadas porque
             * o carrossel é circular.
             */

            previousButton.disabled = false;
            nextButton.disabled = false;
        }


        /* ==================================================
           AUTOPLAY
           ================================================== */

        function stopAutoplay() {

            if (autoplayInterval !== null) {

                window.clearInterval(
                    autoplayInterval
                );

                autoplayInterval = null;
            }
        }


        function startAutoplay() {

            stopAutoplay();

            /*
             * Respeita preferência por menos movimento.
             */

            if (
                window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches
            ) {
                return;
            }

            autoplayInterval =
                window.setInterval(
                    function () {

                        goToSlide(
                            currentIndex + 1
                        );

                    },
                    AUTOPLAY_TIME
                );
        }


        /*
         * Quando o usuário mexe no carrossel,
         * espera 8 segundos antes de voltar
         * ao autoplay.
         */

        function restartAutoplay() {

            stopAutoplay();

            if (restartTimeout !== null) {

                window.clearTimeout(
                    restartTimeout
                );
            }

            restartTimeout =
                window.setTimeout(
                    function () {

                        startAutoplay();

                    },
                    RESTART_DELAY
                );
        }


        /* ==================================================
           SETA ANTERIOR
           ================================================== */

        previousButton.addEventListener(
            "click",
            function () {

                goToSlide(
                    currentIndex - 1
                );

                restartAutoplay();
            }
        );


        /* ==================================================
           SETA PRÓXIMA
           ================================================== */

        nextButton.addEventListener(
            "click",
            function () {

                goToSlide(
                    currentIndex + 1
                );

                restartAutoplay();
            }
        );


        /* ==================================================
           TECLADO
           ================================================== */

        carousel.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "ArrowLeft"
                ) {

                    event.preventDefault();

                    goToSlide(
                        currentIndex - 1
                    );

                    restartAutoplay();
                }


                if (
                    event.key === "ArrowRight"
                ) {

                    event.preventDefault();

                    goToSlide(
                        currentIndex + 1
                    );

                    restartAutoplay();
                }
            }
        );


        /* ==================================================
           SWIPE MOBILE
           ================================================== */

        track.addEventListener(
            "touchstart",
            function (event) {

                touchStartX =
                    event.changedTouches[0].clientX;

                stopAutoplay();
            },
            {
                passive: true
            }
        );


        track.addEventListener(
            "touchend",
            function (event) {

                const touchEndX =
                    event.changedTouches[0].clientX;

                const distance =
                    touchStartX - touchEndX;


                /*
                 * Movimento pequeno:
                 * não muda o slide.
                 */

                if (
                    Math.abs(distance) < 40
                ) {

                    restartAutoplay();

                    return;
                }


                /*
                 * Swipe para esquerda.
                 */

                if (distance > 0) {

                    goToSlide(
                        currentIndex + 1
                    );
                }


                /*
                 * Swipe para direita.
                 */

                else {

                    goToSlide(
                        currentIndex - 1
                    );
                }


                restartAutoplay();
            },
            {
                passive: true
            }
        );


        /* ==================================================
           PAUSA AO PASSAR O MOUSE
           ================================================== */

        carousel.addEventListener(
            "mouseenter",
            function () {

                stopAutoplay();
            }
        );


        carousel.addEventListener(
            "mouseleave",
            function () {

                startAutoplay();
            }
        );


        /* ==================================================
           PAUSA QUANDO BOTÃO/DOT RECEBE FOCO
           ================================================== */

        carousel.addEventListener(
            "focusin",
            function () {

                stopAutoplay();
            }
        );


        carousel.addEventListener(
            "focusout",
            function () {

                restartAutoplay();
            }
        );


        /* ==================================================
           ABA DO NAVEGADOR
           ================================================== */

        document.addEventListener(
            "visibilitychange",
            function () {

                if (document.hidden) {

                    stopAutoplay();

                } else {

                    startAutoplay();
                }
            }
        );


        /* ==================================================
           INICIALIZAÇÃO
           ================================================== */

        goToSlide(0);

        startAutoplay();

    });

});

function iniciarContadorOferta() {

    const countdownElement = document.getElementById("countdown");

    // Se não encontrar o contador, não executa
    if (!countdownElement) {
        console.error("Elemento #countdown não encontrado.");
        return;
    }

    function atualizarContador() {

        const agora = new Date();

        // Cria a próxima meia-noite
        const proximaMeiaNoite = new Date(
            agora.getFullYear(),
            agora.getMonth(),
            agora.getDate() + 1,
            0,
            0,
            0,
            0
        );

        // Diferença em milissegundos
        const diferenca = proximaMeiaNoite.getTime() - agora.getTime();

        // Converte para segundos
        const totalSegundos = Math.max(
            0,
            Math.floor(diferenca / 1000)
        );

        const horas = Math.floor(totalSegundos / 3600);

        const minutos = Math.floor(
            (totalSegundos % 3600) / 60
        );

        const segundos = totalSegundos % 60;

        const horasFormatadas = String(horas).padStart(2, "0");
        const minutosFormatados = String(minutos).padStart(2, "0");
        const segundosFormatados = String(segundos).padStart(2, "0");

        countdownElement.textContent =
            `${horasFormatadas}:${minutosFormatados}:${segundosFormatados}`;
    }

    // Executa imediatamente
    atualizarContador();

    // Atualiza a cada segundo
    setInterval(atualizarContador, 1000);
}


/*
Como script.js está sendo carregado com "defer",
o HTML já estará carregado quando isso executar.
*/
iniciarContadorOferta();

/* ==================================================
   DATA DA OFERTA DOS BÔNUS
================================================== */

function atualizarDataBonus() {

    const bonusDates = document.querySelectorAll(".bonus-date");

    if (!bonusDates.length) return;

    const hoje = new Date();

    const dia = String(hoje.getDate()).padStart(2, "0");
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const ano = hoje.getFullYear();

    const dataFormatada = `${dia}/${mes}/${ano}`;

    bonusDates.forEach((elemento) => {
        elemento.textContent = dataFormatada;
    });

}

atualizarDataBonus();


/* =========================================================
   MODAIS - TERMOS DE USO E POLÍTICA DE PRIVACIDADE
========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  const openTerms = document.getElementById('openTerms');
  const openPrivacy = document.getElementById('openPrivacy');

  const termsModal = document.getElementById('termsModal');
  const privacyModal = document.getElementById('privacyModal');

  const closeTerms = document.getElementById('closeTerms');
  const closePrivacy = document.getElementById('closePrivacy');


  /* =======================================================
     FUNÇÃO PARA ABRIR MODAL
  ======================================================= */

  function openModal(modal) {

    if (!modal) {
      return;
    }

    modal.classList.add('active');

    modal.setAttribute(
      'aria-hidden',
      'false'
    );

    document.body.style.overflow = 'hidden';

  }


  /* =======================================================
     FUNÇÃO PARA FECHAR MODAL
  ======================================================= */

  function closeModal(modal) {

    if (!modal) {
      return;
    }

    modal.classList.remove('active');

    modal.setAttribute(
      'aria-hidden',
      'true'
    );


    /*
      Só libera novamente o scroll se
      nenhum outro modal estiver aberto.
    */

    const modalAberto =
      document.querySelector('.legal-modal.active');

    if (!modalAberto) {
      document.body.style.overflow = '';
    }

  }


  /* =======================================================
     ABRIR TERMOS DE USO
  ======================================================= */

  if (openTerms && termsModal) {

    openTerms.addEventListener(
      'click',
      function (event) {

        event.preventDefault();

        openModal(termsModal);

      }
    );

  }


  /* =======================================================
     ABRIR POLÍTICA DE PRIVACIDADE
  ======================================================= */

  if (openPrivacy && privacyModal) {

    openPrivacy.addEventListener(
      'click',
      function (event) {

        event.preventDefault();

        openModal(privacyModal);

      }
    );

  }


  /* =======================================================
     FECHAR TERMOS PELO X
  ======================================================= */

  if (closeTerms && termsModal) {

    closeTerms.addEventListener(
      'click',
      function () {

        closeModal(termsModal);

      }
    );

  }


  /* =======================================================
     FECHAR PRIVACIDADE PELO X
  ======================================================= */

  if (closePrivacy && privacyModal) {

    closePrivacy.addEventListener(
      'click',
      function () {

        closeModal(privacyModal);

      }
    );

  }


  /* =======================================================
     FECHAR CLICANDO FORA DO CONTEÚDO
  ======================================================= */

  if (termsModal) {

    termsModal.addEventListener(
      'click',
      function (event) {

        if (event.target === termsModal) {

          closeModal(termsModal);

        }

      }
    );

  }


  if (privacyModal) {

    privacyModal.addEventListener(
      'click',
      function (event) {

        if (event.target === privacyModal) {

          closeModal(privacyModal);

        }

      }
    );

  }


  /* =======================================================
     FECHAR COM ESC
  ======================================================= */

  document.addEventListener(
    'keydown',
    function (event) {

      if (event.key !== 'Escape') {
        return;
      }


      if (
        termsModal &&
        termsModal.classList.contains('active')
      ) {

        closeModal(termsModal);

      }


      if (
        privacyModal &&
        privacyModal.classList.contains('active')
      ) {

        closeModal(privacyModal);

      }

    }
  );

});

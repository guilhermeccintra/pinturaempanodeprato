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

        function normalizePosition() { if (cycleWidth <= 0) { return; } /* * Quando completa as seis imagens, volta para * a posição visualmente equivalente na cópia. * * Essa alteração não é perceptível porque os conjuntos * são idênticos. */ if (currentPosition >= cycleWidth) { currentPosition %= cycleWidth; }
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

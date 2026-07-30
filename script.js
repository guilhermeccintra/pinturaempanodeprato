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
         * Seleciona apenas os slides originais.
         * Clones criados anteriormente não entram nessa lista.
         */
        const originalSlides = Array.from(
            track.children
        ).filter((slide) => {
            return (
                slide.classList.contains("a4-carousel-slide") &&
                !slide.classList.contains("a4-carousel-clone")
            );
        });

        if (originalSlides.length === 0) {
            return;
        }

        /*
         * Velocidade em pixels por segundo.
         */
        const speed = Number(carousel.dataset.speed) || 35;

        let currentPosition = 0;
        let cycleWidth = 0;

        let animationFrame = null;
        let previousTimestamp = null;

        let previousViewportWidth = viewport.clientWidth;
        let resizeTimeout = null;

        let isPaused = false;
        let isRebuilding = false;

        function removeOldControls() {
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

        function getTrackGap() {
            const styles = window.getComputedStyle(track);
            const gap = parseFloat(styles.columnGap || styles.gap);

            return Number.isFinite(gap) ? gap : 0;
        }

        function calculateCycleWidth() {
            const gap = getTrackGap();

            /*
             * Soma a largura real das seis imagens originais
             * e os espaços existentes entre elas.
             */
            const slidesWidth = originalSlides.reduce(
                (total, slide) => {
                    return total + slide.getBoundingClientRect().width;
                },
                0
            );

            cycleWidth =
                slidesWidth + gap * originalSlides.length;
        }

        function appendOriginalSetAsClones() {
            const fragment = document.createDocumentFragment();

            originalSlides.forEach((slide) => {
                fragment.appendChild(createClone(slide));
            });

            track.appendChild(fragment);
        }

        function createCopies() {
            removeClones();

            calculateCycleWidth();

            if (cycleWidth <= 0) {
                return;
            }

            /*
             * Adiciona pelo menos duas cópias completas.
             * Assim, sempre existe conteúdo depois da última imagem.
             */
            appendOriginalSetAsClones();
            appendOriginalSetAsClones();

            /*
             * Caso o carrossel seja muito largo, adiciona mais conjuntos.
             */
            let safetyCounter = 0;

            while (
                track.scrollWidth <
                    viewport.clientWidth + cycleWidth * 2 &&
                safetyCounter < 10
            ) {
                appendOriginalSetAsClones();
                safetyCounter += 1;
            }
        }

        function updatePosition() {
            track.style.transform =
                `translate3d(-${currentPosition}px, 0, 0)`;
        }

        function normalizePosition() {
            if (cycleWidth <= 0) {
                return;
            }

            /*
             * Retira apenas um ciclo completo da posição.
             *
             * Como o novo ponto representa exatamente a mesma imagem,
             * a troca não é visível.
             */
            while (currentPosition >= cycleWidth) {
                currentPosition -= cycleWidth;
            }

            while (currentPosition < 0) {
                currentPosition += cycleWidth;
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
             * Evita avanço grande depois de a aba ficar inativa.
             */
            const elapsedSeconds =
                Math.min(elapsedMilliseconds, 100) / 1000;

            if (
                !isPaused &&
                !isRebuilding &&
                cycleWidth > 0
            ) {
                currentPosition += speed * elapsedSeconds;

                normalizePosition();
                updatePosition();
            }

            animationFrame =
                window.requestAnimationFrame(animate);
        }

        function startAnimation() {
            if (animationFrame !== null) {
                return;
            }

            previousTimestamp = null;

            animationFrame =
                window.requestAnimationFrame(animate);
        }

        function stopAnimation() {
            if (animationFrame !== null) {
                window.cancelAnimationFrame(animationFrame);
                animationFrame = null;
            }

            previousTimestamp = null;
        }

        function rebuildCarousel({
            preservePosition = true
        } = {}) {
            if (isRebuilding) {
                return;
            }

            isRebuilding = true;

            const previousCycleWidth = cycleWidth;
            let progress = 0;

            /*
             * Preserva o ponto atual durante mudanças reais de largura.
             */
            if (
                preservePosition &&
                previousCycleWidth > 0
            ) {
                progress =
                    currentPosition / previousCycleWidth;
            }

            createCopies();

            if (preservePosition && cycleWidth > 0) {
                currentPosition = progress * cycleWidth;
            } else {
                currentPosition = 0;
            }

            normalizePosition();
            updatePosition();

            previousTimestamp = null;
            isRebuilding = false;
        }

        /*
         * Pausa somente quando a aba fica oculta.
         */
        document.addEventListener("visibilitychange", () => {
            isPaused = document.hidden;
            previousTimestamp = null;
        });

        /*
         * Reconstrói apenas quando a largura realmente muda.
         *
         * Mudanças na altura causadas pela barra do navegador mobile
         * são ignoradas.
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
                rebuildCarousel({
                    preservePosition: true
                });
            }, 200);
        });

        /*
         * Aguarda todas as imagens originais carregarem.
         */
        const imagePromises = originalSlides
            .map((slide) => slide.querySelector("img"))
            .filter(Boolean)
            .map((image) => {
                if (image.complete) {
                    return Promise.resolve();
                }

                return new Promise((resolve) => {
                    image.addEventListener("load", resolve, {
                        once: true
                    });

                    image.addEventListener("error", resolve, {
                        once: true
                    });
                });
            });

        removeOldControls();

        Promise.all(imagePromises).then(() => {
            createCopies();

            currentPosition = 0;
            updatePosition();
            startAnimation();
        });
    });
});

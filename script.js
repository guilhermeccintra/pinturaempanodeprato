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

        const originalSlides = Array.from(
            track.querySelectorAll(".a4-carousel-slide")
        );

        if (originalSlides.length === 0) {
            return;
        }

        /*
         * Velocidade do movimento em pixels por segundo.
         *
         * Aumente para passar mais rápido.
         * Diminua para passar mais devagar.
         */
        const speed = Number(carousel.dataset.speed) || 35;

        let animationFrame = null;
        let previousTimestamp = null;
        let currentPosition = 0;
        let cycleWidth = 0;
        let resizeTimeout = null;
        let isPaused = false;

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

            /*
             * Evita elementos focáveis dentro dos clones.
             */
            clone
                .querySelectorAll(
                    "a, button, input, textarea, select, [tabindex]"
                )
                .forEach((element) => {
                    element.setAttribute("tabindex", "-1");
                });

            return clone;
        }

        function createCopies() {
            removeClones();

            /*
             * Adiciona uma cópia completa inicialmente.
             */
            originalSlides.forEach((slide) => {
                track.appendChild(createClone(slide));
            });

            /*
             * A distância entre a primeira imagem original
             * e a primeira imagem clonada representa um ciclo completo.
             */
            const firstOriginal = originalSlides[0];
            const firstClone = track.querySelector(".a4-carousel-clone");

            if (!firstOriginal || !firstClone) {
                return;
            }

            cycleWidth =
                firstClone.offsetLeft -
                firstOriginal.offsetLeft;

            /*
             * Cria mais cópias caso o conteúdo original seja menor
             * que a largura visível do carrossel.
             */
            let safetyCounter = 0;

            while (
                track.scrollWidth <
                    viewport.clientWidth + cycleWidth * 2 &&
                safetyCounter < 20
            ) {
                originalSlides.forEach((slide) => {
                    track.appendChild(createClone(slide));
                });

                safetyCounter += 1;
            }
        }

        function updatePosition() {
            track.style.transform =
                `translate3d(-${currentPosition}px, 0, 0)`;
        }

        function animate(timestamp) {
            if (previousTimestamp === null) {
                previousTimestamp = timestamp;
            }

            const elapsedSeconds =
                (timestamp - previousTimestamp) / 1000;

            previousTimestamp = timestamp;

            if (!isPaused && cycleWidth > 0) {
                currentPosition += speed * elapsedSeconds;

                /*
                 * Ao completar um ciclo, retorna à posição equivalente.
                 *
                 * Como as imagens estão duplicadas, essa mudança
                 * é visualmente imperceptível.
                 */
                if (currentPosition >= cycleWidth) {
                    currentPosition %= cycleWidth;
                }

                updatePosition();
            }

            animationFrame = window.requestAnimationFrame(animate);
        }

        function startAnimation() {
            if (animationFrame !== null) {
                return;
            }

            previousTimestamp = null;
            animationFrame = window.requestAnimationFrame(animate);
        }

        function stopAnimation() {
            if (animationFrame !== null) {
                window.cancelAnimationFrame(animationFrame);
                animationFrame = null;
            }

            previousTimestamp = null;
        }

        function rebuildCarousel() {
            stopAnimation();

            currentPosition = 0;
            track.style.transform = "translate3d(0, 0, 0)";

            createCopies();
            updatePosition();
            startAnimation();
        }

        /*
         * Para a animação quando a aba não está visível.
         */
        document.addEventListener("visibilitychange", () => {
            isPaused = document.hidden;
            previousTimestamp = null;
        });

        /*
         * Recalcula o carrossel quando a tela muda de tamanho.
         */
let previousViewportWidth = window.innerWidth;

window.addEventListener("resize", () => {
    const currentViewportWidth = window.innerWidth;
    const widthDifference = Math.abs(
        currentViewportWidth - previousViewportWidth
    );

    /*
     * Ignora pequenas alterações causadas pela interface
     * do navegador mobile.
     */
    if (widthDifference < 5) {
        return;
    }

    previousViewportWidth = currentViewportWidth;

    window.clearTimeout(resizeTimeout);

    resizeTimeout = window.setTimeout(() => {
        rebuildCarousel();
    }, 200);
});

        /*
         * Recalcula depois que as imagens terminarem de carregar.
         */
        const images = track.querySelectorAll("img");

        images.forEach((image) => {
            if (!image.complete) {
                image.addEventListener(
                    "load",
                    () => {
                        rebuildCarousel();
                    },
                    { once: true }
                );
            }
        });

        removeOldControls();

        requestAnimationFrame(() => {
            createCopies();
            updatePosition();
            startAnimation();
        });
    });
});

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
        const dotsContainer = carousel.querySelector(".a4-carousel-dots");

        if (!viewport || !track) {
            return;
        }

        const originalSlides = Array.from(
            track.querySelectorAll(".a4-carousel-slide")
        );

        if (originalSlides.length === 0) {
            return;
        }

        const autoplayDelay = 3500;
        const transitionDuration = 600;

        let visibleSlides = 1;
        let currentIndex = 0;
        let autoplayInterval = null;
        let isTransitioning = false;
        let resizeTimeout = null;

        function getVisibleSlides() {
            if (window.innerWidth <= 600) {
                return 1;
            }

            if (window.innerWidth <= 900) {
                return 2;
            }

            return 3;
        }

        function getAllSlides() {
            return Array.from(
                track.querySelectorAll(".a4-carousel-slide")
            );
        }

        function removeClones() {
            track
                .querySelectorAll(".a4-carousel-clone")
                .forEach((clone) => clone.remove());
        }

        function createClones() {
            removeClones();

            visibleSlides = Math.min(
                getVisibleSlides(),
                originalSlides.length
            );

            const firstSlides = originalSlides.slice(0, visibleSlides);
            const lastSlides = originalSlides.slice(-visibleSlides);

            /*
             * Clona os últimos slides e coloca no começo.
             * O reverse mantém a ordem visual correta ao usar prepend.
             */
            lastSlides
                .slice()
                .reverse()
                .forEach((slide) => {
                    const clone = slide.cloneNode(true);

                    clone.classList.add("a4-carousel-clone");
                    clone.setAttribute("aria-hidden", "true");

                    track.prepend(clone);
                });

            /*
             * Clona os primeiros slides e coloca no final.
             */
            firstSlides.forEach((slide) => {
                const clone = slide.cloneNode(true);

                clone.classList.add("a4-carousel-clone");
                clone.setAttribute("aria-hidden", "true");

                track.appendChild(clone);
            });
        }

        function getSlideDistance() {
            const slides = getAllSlides();

            if (slides.length < 2) {
                return slides[0]?.getBoundingClientRect().width || 0;
            }

            return slides[1].offsetLeft - slides[0].offsetLeft;
        }

        function updateTrack(animate = true) {
            const slideDistance = getSlideDistance();

            track.style.transition = animate
                ? `transform ${transitionDuration}ms ease`
                : "none";

            track.style.transform =
                `translate3d(-${currentIndex * slideDistance}px, 0, 0)`;

            updateDots();
        }

        function jumpWithoutAnimation(index) {
            currentIndex = index;

            track.style.transition = "none";

            const slideDistance = getSlideDistance();

            track.style.transform =
                `translate3d(-${currentIndex * slideDistance}px, 0, 0)`;

            /*
             * Força o navegador a aplicar imediatamente
             * a posição sem transição.
             */
            void track.offsetWidth;

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    track.style.transition =
                        `transform ${transitionDuration}ms ease`;

                    isTransitioning = false;
                    updateDots();
                });
            });
        }

        function getRealIndex() {
            return (
                (currentIndex - visibleSlides) %
                    originalSlides.length +
                originalSlides.length
            ) % originalSlides.length;
        }

        function nextSlide() {
            if (isTransitioning) {
                return;
            }

            isTransitioning = true;
            currentIndex += 1;

            updateTrack(true);
        }

        function goToRealSlide(index) {
            if (isTransitioning) {
                return;
            }

            isTransitioning = true;
            currentIndex = visibleSlides + index;

            updateTrack(true);
        }

        function createDots() {
            if (!dotsContainer) {
                return;
            }

            dotsContainer.innerHTML = "";

            originalSlides.forEach((_, index) => {
                const dot = document.createElement("button");

                dot.type = "button";
                dot.className = "a4-carousel-dot";
                dot.setAttribute(
                    "aria-label",
                    `Ir para a imagem ${index + 1}`
                );

                dot.addEventListener("click", () => {
                    goToRealSlide(index);
                    restartAutoplay();
                });

                dotsContainer.appendChild(dot);
            });

            updateDots();
        }

        function updateDots() {
            if (!dotsContainer) {
                return;
            }

            const realIndex = getRealIndex();

            const dots = dotsContainer.querySelectorAll(
                ".a4-carousel-dot"
            );

            dots.forEach((dot, index) => {
                dot.classList.toggle(
                    "active",
                    index === realIndex
                );
            });
        }

        function startAutoplay() {
            if (
                carousel.dataset.autoplay !== "true" ||
                originalSlides.length <= visibleSlides
            ) {
                return;
            }

            stopAutoplay();

            autoplayInterval = window.setInterval(() => {
                nextSlide();
            }, autoplayDelay);
        }

        function stopAutoplay() {
            if (autoplayInterval !== null) {
                window.clearInterval(autoplayInterval);
                autoplayInterval = null;
            }
        }

        function restartAutoplay() {
            stopAutoplay();
            startAutoplay();
        }

        track.addEventListener("transitionend", (event) => {
            if (
                event.target !== track ||
                event.propertyName !== "transform"
            ) {
                return;
            }

            /*
             * Quando chega aos clones do final,
             * reposiciona silenciosamente nos slides reais.
             *
             * Visualmente:
             * última imagem → clone da primeira → primeira real.
             */
            if (
                currentIndex >=
                originalSlides.length + visibleSlides
            ) {
                jumpWithoutAnimation(visibleSlides);
                return;
            }

            /*
             * Proteção para navegação no sentido contrário,
             * caso ela seja adicionada futuramente.
             */
            if (currentIndex < visibleSlides) {
                jumpWithoutAnimation(
                    originalSlides.length + currentIndex
                );
                return;
            }

            isTransitioning = false;
            updateDots();
        });

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                stopAutoplay();
            } else {
                startAutoplay();
            }
        });

        window.addEventListener("resize", () => {
            window.clearTimeout(resizeTimeout);

            resizeTimeout = window.setTimeout(() => {
                const realIndex = getRealIndex();

                stopAutoplay();
                isTransitioning = false;

                createClones();

                currentIndex = visibleSlides + realIndex;

                createDots();
                jumpWithoutAnimation(currentIndex);
                startAutoplay();
            }, 150);
        });

        /*
         * Remove completamente os botões antigos.
         */
        carousel
            .querySelectorAll(
                ".a4-carousel-btn, .a4-carousel-prev, .a4-carousel-next"
            )
            .forEach((button) => button.remove());

        /*
         * Montagem inicial do carrossel.
         */
        createClones();

        /*
         * O índice inicial começa depois dos clones
         * colocados no início.
         */
        currentIndex = visibleSlides;

        createDots();

        requestAnimationFrame(() => {
            jumpWithoutAnimation(currentIndex);
            startAutoplay();
        });
    });
});

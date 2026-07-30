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

        let currentIndex = 0;
        let visibleSlides = 1;
        let autoplayInterval = null;
        let isTransitioning = false;

        function getVisibleSlides() {
            if (window.innerWidth <= 600) {
                return 1;
            }

            if (window.innerWidth <= 900) {
                return 2;
            }

            return 3;
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

            lastSlides
                .slice()
                .reverse()
                .forEach((slide) => {
                    const clone = slide.cloneNode(true);
                    clone.classList.add("a4-carousel-clone");
                    clone.setAttribute("aria-hidden", "true");
                    track.prepend(clone);
                });

            firstSlides.forEach((slide) => {
                const clone = slide.cloneNode(true);
                clone.classList.add("a4-carousel-clone");
                clone.setAttribute("aria-hidden", "true");
                track.appendChild(clone);
            });
        }

        function getAllSlides() {
            return Array.from(
                track.querySelectorAll(".a4-carousel-slide")
            );
        }

        function getSlideDistance() {
            const allSlides = getAllSlides();

            if (allSlides.length < 2) {
                return allSlides[0]?.getBoundingClientRect().width || 0;
            }

            return allSlides[1].offsetLeft - allSlides[0].offsetLeft;
        }

        function setTrackPosition(animate = true) {
            const slideDistance = getSlideDistance();

            track.style.transition = animate
                ? `transform ${transitionDuration}ms ease`
                : "none";

            track.style.transform = `translateX(
                -${(currentIndex + visibleSlides) * slideDistance}px
            )`;

            if (!animate) {
                track.offsetHeight;
                track.style.transition =
                    `transform ${transitionDuration}ms ease`;
            }

            updateDots();
        }

        function goToSlide(index) {
            if (isTransitioning) {
                return;
            }

            currentIndex = index;
            isTransitioning = true;
            setTrackPosition(true);
        }

        function nextSlide() {
            goToSlide(currentIndex + 1);
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
                    if (isTransitioning) {
                        return;
                    }

                    goToSlide(index);
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

            const normalizedIndex =
                ((currentIndex % originalSlides.length) +
                    originalSlides.length) %
                originalSlides.length;

            const dots = dotsContainer.querySelectorAll(
                ".a4-carousel-dot"
            );

            dots.forEach((dot, index) => {
                dot.classList.toggle(
                    "active",
                    index === normalizedIndex
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
            if (event.propertyName !== "transform") {
                return;
            }

            if (currentIndex >= originalSlides.length) {
                currentIndex = 0;
                setTrackPosition(false);
            } else if (currentIndex < 0) {
                currentIndex = originalSlides.length - 1;
                setTrackPosition(false);
            }

            isTransitioning = false;
        });

        carousel.addEventListener("mouseenter", stopAutoplay);
        carousel.addEventListener("mouseleave", startAutoplay);

        carousel.addEventListener("focusin", stopAutoplay);
        carousel.addEventListener("focusout", startAutoplay);

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                stopAutoplay();
            } else {
                startAutoplay();
            }
        });

        let resizeTimeout = null;

        window.addEventListener("resize", () => {
            window.clearTimeout(resizeTimeout);

            resizeTimeout = window.setTimeout(() => {
                stopAutoplay();

                currentIndex =
                    ((currentIndex % originalSlides.length) +
                        originalSlides.length) %
                    originalSlides.length;

                createClones();
                createDots();
                setTrackPosition(false);
                startAutoplay();
            }, 150);
        });

        // Remove completamente eventuais botões antigos.
        carousel
            .querySelectorAll(".a4-carousel-prev, .a4-carousel-next")
            .forEach((button) => button.remove());

        createClones();
        createDots();

        requestAnimationFrame(() => {
            setTrackPosition(false);
            startAutoplay();
        });
    });
});

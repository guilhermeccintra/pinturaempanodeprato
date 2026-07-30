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
        const slides = Array.from(
            carousel.querySelectorAll(".a4-carousel-slide")
        );

        const previousButton = carousel.querySelector(".a4-carousel-prev");
        const nextButton = carousel.querySelector(".a4-carousel-next");
        const dotsContainer = carousel.querySelector(".a4-carousel-dots");

        if (
            !viewport ||
            !track ||
            slides.length === 0 ||
            !previousButton ||
            !nextButton
        ) {
            return;
        }

        let currentIndex = 0;
        let autoplayInterval = null;
        const autoplayDelay = 3500;

        function getVisibleSlides() {
            if (window.innerWidth <= 600) {
                return 1;
            }

            if (window.innerWidth <= 900) {
                return 2;
            }

            return 3;
        }

        function getMaximumIndex() {
            return Math.max(0, slides.length - getVisibleSlides());
        }

        function getSlideDistance() {
            if (slides.length < 2) {
                return slides[0]?.getBoundingClientRect().width || 0;
            }

            return (
                slides[1].offsetLeft -
                slides[0].offsetLeft
            );
        }

        function updateCarousel() {
            const maximumIndex = getMaximumIndex();

            if (currentIndex > maximumIndex) {
                currentIndex = maximumIndex;
            }

            const slideDistance = getSlideDistance();

            track.style.transform =
                `translateX(-${currentIndex * slideDistance}px)`;

            updateDots();
        }

        function goToSlide(index) {
            const maximumIndex = getMaximumIndex();

            if (index > maximumIndex) {
                currentIndex = 0;
            } else if (index < 0) {
                currentIndex = maximumIndex;
            } else {
                currentIndex = index;
            }

            updateCarousel();
        }

        function createDots() {
            if (!dotsContainer) {
                return;
            }

            dotsContainer.innerHTML = "";

            const totalDots = getMaximumIndex() + 1;

            for (let index = 0; index < totalDots; index += 1) {
                const dot = document.createElement("button");

                dot.type = "button";
                dot.className = "a4-carousel-dot";
                dot.setAttribute(
                    "aria-label",
                    `Ir para a posição ${index + 1}`
                );

                dot.addEventListener("click", () => {
                    goToSlide(index);
                    restartAutoplay();
                });

                dotsContainer.appendChild(dot);
            }

            updateDots();
        }

        function updateDots() {
            if (!dotsContainer) {
                return;
            }

            const dots = dotsContainer.querySelectorAll(".a4-carousel-dot");

            dots.forEach((dot, index) => {
                dot.classList.toggle("active", index === currentIndex);
            });
        }

        function startAutoplay() {
            if (
                carousel.dataset.autoplay !== "true" ||
                slides.length <= getVisibleSlides()
            ) {
                return;
            }

            stopAutoplay();

            autoplayInterval = window.setInterval(() => {
                goToSlide(currentIndex + 1);
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

        previousButton.addEventListener("click", () => {
            goToSlide(currentIndex - 1);
            restartAutoplay();
        });

        nextButton.addEventListener("click", () => {
            goToSlide(currentIndex + 1);
            restartAutoplay();
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

        window.addEventListener("resize", () => {
            currentIndex = Math.min(currentIndex, getMaximumIndex());
            createDots();
            updateCarousel();
            restartAutoplay();
        });

        createDots();
        updateCarousel();
        startAutoplay();
    });
});

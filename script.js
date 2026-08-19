/* ============================================
   Landing Page - Pintura em Pano de Prato
   JavaScript Principal - Otimizado
   ============================================ */


document.addEventListener("DOMContentLoaded", function () {


/* ==================================================
   1. CARROSSEL COMPARAÇÃO
   RISCO X RESULTADO
   ================================================== */


const comparisonCarousels = document.querySelectorAll(
    "[data-comparison-carousel]"
);


comparisonCarousels.forEach(function (carousel) {


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


        dot.addEventListener(
            "click",
            function () {

                goToSlide(index);

                restartAutoplay();

            }
        );


        dotsContainer.appendChild(dot);


        return dot;

    });




    /* ==================================================
       TROCA DE SLIDE
       ================================================== */


    function goToSlide(index) {


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


            const active =
                index === currentIndex;


            dot.classList.toggle(
                "is-active",
                active
            );


            dot.setAttribute(
                "aria-current",
                active ? "true" : "false"
            );


        });


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
       SETAS
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


            if (event.key === "ArrowLeft") {


                event.preventDefault();


                goToSlide(
                    currentIndex - 1
                );


                restartAutoplay();


            }



            if (event.key === "ArrowRight") {


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



            if (
                Math.abs(distance) < 40
            ) {


                restartAutoplay();


                return;


            }




            if (distance > 0) {


                goToSlide(
                    currentIndex + 1
                );


            } else {


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
       PAUSA INTELIGENTE
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





    /*
       Pausa quando o usuário troca de aba
    */


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







/* ==================================================
   2. FAQ ACORDEÃO
   ================================================== */


document.addEventListener(
    "DOMContentLoaded",
    function () {



        const faqList =
            document.querySelector(
                ".faq-list"
            );



        const faqItems =
            document.querySelectorAll(
                ".faq-item"
            );




        if (!faqList) {

            return;

        }





        faqList.addEventListener(
            "click",
            function (event) {


                const question =
                    event.target.closest(
                        ".faq-question"
                    );



                if (!question) {

                    return;

                }




                const currentItem =
                    question.closest(
                        ".faq-item"
                    );



                const alreadyActive =
                    currentItem.classList.contains(
                        "active"
                    );




                faqItems.forEach(
                    function (item) {


                        item.classList.remove(
                            "active"
                        );


                    }
                );





                if (!alreadyActive) {


                    currentItem.classList.add(
                        "active"
                    );


                }


            }
        );



    }
);







/* ==================================================
   3. ANIMAÇÕES DE SCROLL
   ================================================== */


document.addEventListener(
    "DOMContentLoaded",
    function () {


        const prefersReducedMotion =
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;



        const fadeElements =
            document.querySelectorAll(
                ".fade-in"
            );




        if (prefersReducedMotion) {


            fadeElements.forEach(
                function (element) {


                    element.classList.add(
                        "visible"
                    );


                }
            );


            return;


        }





        const fadeObserver =
            new IntersectionObserver(
                function (entries, observer) {


                    entries.forEach(
                        function (entry) {


                            if (
                                entry.isIntersecting
                            ) {


                                entry.target.classList.add(
                                    "visible"
                                );



                                observer.unobserve(
                                    entry.target
                                );


                            }


                        }
                    );


                },
                {
                    threshold: 0.1,
                    rootMargin:
                        "0px 0px -50px 0px"
                }
            );





        fadeElements.forEach(
            function (element) {


                fadeObserver.observe(
                    element
                );


            }
        );



    }
);



/* ==================================================
   4. SMOOTH SCROLL
   ================================================== */


document.addEventListener(
    "DOMContentLoaded",
    function () {


        const smoothLinks =
            document.querySelectorAll(
                'a[href^="#"]'
            );



        smoothLinks.forEach(
            function (link) {


                link.addEventListener(
                    "click",
                    function (event) {


                        const targetId =
                            this.getAttribute(
                                "href"
                            );



                        if (
                            targetId === "#" ||
                            targetId === ""
                        ) {

                            return;

                        }




                        const targetElement =
                            document.querySelector(
                                targetId
                            );



                        if (targetElement) {


                            event.preventDefault();



                            targetElement.scrollIntoView(
                                {
                                    behavior:
                                        "smooth"
                                }
                            );


                        }


                    }
                );


            }
        );


    }
);







/* ==================================================
   5. LAZY LOADING DE IMAGENS
   ================================================== */


document.addEventListener(
    "DOMContentLoaded",
    function () {



        const lazyImages =
            document.querySelectorAll(
                "img[data-src]"
            );



        if (!lazyImages.length) {

            return;

        }




        const imageObserver =
            new IntersectionObserver(
                function (entries, observer) {


                    entries.forEach(
                        function (entry) {


                            if (
                                entry.isIntersecting
                            ) {


                                const img =
                                    entry.target;



                                img.src =
                                    img.getAttribute(
                                        "data-src"
                                    );



                                img.removeAttribute(
                                    "data-src"
                                );



                                observer.unobserve(
                                    img
                                );


                            }


                        }
                    );


                },
                {
                    rootMargin:
                        "200px 0px 200px 0px"
                }
            );





        lazyImages.forEach(
            function (image) {


                imageObserver.observe(
                    image
                );


            }
        );


    }
);







/* ==================================================
   6. CONTADOR DA OFERTA
   ================================================== */


function iniciarContadorOferta() {


    const countdownElement =
        document.getElementById(
            "countdown"
        );



    if (!countdownElement) {

        return;

    }





    function atualizarContador() {


        const agora =
            new Date();



        const proximaMeiaNoite =
            new Date(
                agora.getFullYear(),
                agora.getMonth(),
                agora.getDate() + 1,
                0,
                0,
                0,
                0
            );



        const diferenca =
            proximaMeiaNoite.getTime()
            -
            agora.getTime();



        const totalSegundos =
            Math.max(
                0,
                Math.floor(
                    diferenca / 1000
                )
            );



        const horas =
            Math.floor(
                totalSegundos / 3600
            );



        const minutos =
            Math.floor(
                (totalSegundos % 3600) / 60
            );



        const segundos =
            totalSegundos % 60;




        countdownElement.textContent =
            `${String(horas).padStart(2,"0")}:` +
            `${String(minutos).padStart(2,"0")}:` +
            `${String(segundos).padStart(2,"0")}`;


    }





    atualizarContador();



    setInterval(
        atualizarContador,
        1000
    );


}



iniciarContadorOferta();







/* ==================================================
   7. DATA DOS BÔNUS
   ================================================== */


function atualizarDataBonus() {


    const bonusDates =
        document.querySelectorAll(
            ".bonus-date"
        );



    if (!bonusDates.length) {

        return;

    }





    const hoje =
        new Date();



    const dia =
        String(
            hoje.getDate()
        ).padStart(
            2,
            "0"
        );



    const mes =
        String(
            hoje.getMonth() + 1
        ).padStart(
            2,
            "0"
        );



    const ano =
        hoje.getFullYear();




    const dataFormatada =
        `${dia}/${mes}/${ano}`;




    bonusDates.forEach(
        function (elemento) {


            elemento.textContent =
                dataFormatada;


        }
    );


}



atualizarDataBonus();







/* ==================================================
   8. MODAIS
   TERMOS E PRIVACIDADE
   ================================================== */


document.addEventListener(
    "DOMContentLoaded",
    function () {


        const openTerms =
            document.getElementById(
                "openTerms"
            );


        const openPrivacy =
            document.getElementById(
                "openPrivacy"
            );


        const termsModal =
            document.getElementById(
                "termsModal"
            );


        const privacyModal =
            document.getElementById(
                "privacyModal"
            );


        const closeTerms =
            document.getElementById(
                "closeTerms"
            );


        const closePrivacy =
            document.getElementById(
                "closePrivacy"
            );





        function openModal(modal) {


            if (!modal) {

                return;

            }



            modal.classList.add(
                "active"
            );



            modal.setAttribute(
                "aria-hidden",
                "false"
            );



            document.body.style.overflow =
                "hidden";


        }






        function closeModal(modal) {


            if (!modal) {

                return;

            }



            modal.classList.remove(
                "active"
            );



            modal.setAttribute(
                "aria-hidden",
                "true"
            );



            const modalAberto =
                document.querySelector(
                    ".legal-modal.active"
                );



            if (!modalAberto) {


                document.body.style.overflow =
                    "";


            }


        }






        if (openTerms && termsModal) {


            openTerms.addEventListener(
                "click",
                function(event) {


                    event.preventDefault();

                    openModal(
                        termsModal
                    );


                }
            );


        }






        if (openPrivacy && privacyModal) {


            openPrivacy.addEventListener(
                "click",
                function(event) {


                    event.preventDefault();

                    openModal(
                        privacyModal
                    );


                }
            );


        }






        if (closeTerms && termsModal) {


            closeTerms.addEventListener(
                "click",
                function() {


                    closeModal(
                        termsModal
                    );


                }
            );


        }






        if (closePrivacy && privacyModal) {


            closePrivacy.addEventListener(
                "click",
                function() {


                    closeModal(
                        privacyModal
                    );


                }
            );


        }






        if (termsModal) {


            termsModal.addEventListener(
                "click",
                function(event) {


                    if (
                        event.target === termsModal
                    ) {


                        closeModal(
                            termsModal
                        );


                    }


                }
            );


        }






        if (privacyModal) {


            privacyModal.addEventListener(
                "click",
                function(event) {


                    if (
                        event.target === privacyModal
                    ) {


                        closeModal(
                            privacyModal
                        );


                    }


                }
            );


        }






        document.addEventListener(
            "keydown",
            function(event) {


                if (
                    event.key !== "Escape"
                ) {

                    return;

                }



                if (
                    termsModal &&
                    termsModal.classList.contains(
                        "active"
                    )
                ) {


                    closeModal(
                        termsModal
                    );


                }



                if (
                    privacyModal &&
                    privacyModal.classList.contains(
                        "active"
                    )
                ) {


                    closeModal(
                        privacyModal
                    );


                }


            }
        );



    }
);

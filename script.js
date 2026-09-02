/* ==========================================================
   CARROSSEL DE COMPARAÇÃO
   COMPATÍVEL COM HTML ATUAL
========================================================== */


document.addEventListener(
    "DOMContentLoaded",
    function(){


        const carousel =
            document.querySelector(
                "[data-comparison-carousel]"
            );


        if(!carousel) return;



        const track =
            carousel.querySelector(
                "[data-comparison-track]"
            );


        const cards =
            carousel.querySelectorAll(
                "[data-comparison-card]"
            );


        const prevButton =
            carousel.querySelector(
                "[data-comparison-prev]"
            );


        const nextButton =
            carousel.querySelector(
                "[data-comparison-next]"
            );


        const dotsContainer =
            carousel.querySelector(
                "[data-comparison-dots]"
            );



        if(
            !track ||
            !cards.length
        ){

            return;

        }



        let currentIndex = 0;

        let autoPlayTimer;



        function updateCarousel(){


            track.style.transform =
                "translateX(-" +
                (currentIndex * 100) +
                "%)";


            if(dotsContainer){


                const dots =
                    dotsContainer.querySelectorAll(
                        "button"
                    );


                dots.forEach(
                    function(dot,index){


                        dot.classList.toggle(
                            "active",
                            index === currentIndex
                        );


                    }
                );


            }


        }





        function goToSlide(index){


            if(index < 0){


                currentIndex =
                    cards.length - 1;


            }
            else if(
                index >= cards.length
            ){


                currentIndex = 0;


            }
            else{


                currentIndex = index;


            }


            updateCarousel();


        }





        function createDots(){


            if(!dotsContainer)
                return;


            dotsContainer.innerHTML = "";


            cards.forEach(
                function(_,index){


                    const dot =
                        document.createElement(
                            "button"
                        );


                    dot.type =
                        "button";


                    dot.className =
                        "comparison-dot";


                    dot.setAttribute(
                        "aria-label",
                        "Ir para comparação " +
                        (index + 1)
                    );


                    if(index === 0){


                        dot.classList.add(
                            "active"
                        );


                    }


                    dot.addEventListener(
                        "click",
                        function(){


                            goToSlide(index);

                            restartAutoPlay();


                        }
                    );


                    dotsContainer.appendChild(
                        dot
                    );


                }
            );


        }





        function startAutoPlay(){


            stopAutoPlay();


            autoPlayTimer =
                setInterval(
                    function(){


                        goToSlide(
                            currentIndex + 1
                        );


                    },
                    5000
                );


        }





        function stopAutoPlay(){


            if(autoPlayTimer){


                clearInterval(
                    autoPlayTimer
                );


                autoPlayTimer = null;


            }


        }





        function restartAutoPlay(){


            stopAutoPlay();

            startAutoPlay();


        }





        if(nextButton){


            nextButton.addEventListener(
                "click",
                function(){


                    goToSlide(
                        currentIndex + 1
                    );


                    restartAutoPlay();


                }
            );


        }





        if(prevButton){


            prevButton.addEventListener(
                "click",
                function(){


                    goToSlide(
                        currentIndex - 1
                    );


                    restartAutoPlay();


                }
            );


        }





        carousel.addEventListener(
            "mouseenter",
            stopAutoPlay
        );


        carousel.addEventListener(
            "mouseleave",
            startAutoPlay
        );





        let touchStartX = 0;



        track.addEventListener(
            "touchstart",
            function(event){


                touchStartX =
                    event.changedTouches[0].screenX;


            },
            {
                passive:true
            }
        );





        track.addEventListener(
            "touchend",
            function(event){


                const touchEndX =
                    event.changedTouches[0].screenX;



                if(
                    touchStartX - touchEndX > 50
                ){


                    goToSlide(
                        currentIndex + 1
                    );


                }



                if(
                    touchEndX - touchStartX > 50
                ){


                    goToSlide(
                        currentIndex - 1
                    );


                }


                restartAutoPlay();


            },
            {
                passive:true
            }
        );





        createDots();

        updateCarousel();

        startAutoPlay();



    }
);





/* ==========================================================
   FAQ ACORDEÃO
========================================================== */


document.addEventListener(
    "DOMContentLoaded",
    function(){


        const faqList =
            document.querySelector(
                ".faq-list"
            );


        const faqItems =
            document.querySelectorAll(
                ".faq-item"
            );


        if(!faqList){

            return;

        }



        faqList.addEventListener(
            "click",
            function(event){


                const question =
                    event.target.closest(
                        ".faq-question"
                    );


                if(!question){

                    return;

                }



                const currentItem =
                    question.closest(
                        ".faq-item"
                    );


                const aberto =
                    currentItem.classList.contains(
                        "active"
                    );



                faqItems.forEach(
                    function(item){


                        item.classList.remove(
                            "active"
                        );


                        const button =
                            item.querySelector(
                                ".faq-question"
                            );


                        if(button){

                            button.setAttribute(
                                "aria-expanded",
                                "false"
                            );

                        }


                    }
                );



                if(!aberto){


                    currentItem.classList.add(
                        "active"
                    );


                    question.setAttribute(
                        "aria-expanded",
                        "true"
                    );


                }


            }
        );


    }
);

/* ==========================================================
   ANIMAÇÕES DE ENTRADA
========================================================== */


document.addEventListener(
    "DOMContentLoaded",
    function(){


        const elementos =
            document.querySelectorAll(
                ".fade-in"
            );


        if(!elementos.length){

            return;

        }



        const reduzirMovimento =
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            )
            .matches;



        if(reduzirMovimento){


            elementos.forEach(
                function(element){


                    element.classList.add(
                        "visible"
                    );


                }
            );


            return;


        }




        /*
         * Fallback para navegadores antigos.
         */

        if(
            !("IntersectionObserver" in window)
        ){


            elementos.forEach(
                function(element){


                    element.classList.add(
                        "visible"
                    );


                }
            );


            return;

        }





        const observer =
            new IntersectionObserver(
                function(entries, observer){


                    entries.forEach(
                        function(entry){


                            if(
                                entry.isIntersecting
                            ){


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
                    threshold:0.1,

                    rootMargin:
                        "0px 0px -50px 0px"
                }
            );





        elementos.forEach(
            function(element){


                observer.observe(
                    element
                );


            }
        );



    }
);





/* ==========================================================
   SMOOTH SCROLL
========================================================== */


document.addEventListener(
    "DOMContentLoaded",
    function(){


        const links =
            document.querySelectorAll(
                'a[href^="#"]'
            );



        links.forEach(
            function(link){


                link.addEventListener(
                    "click",
                    function(event){


                        const id =
                            this.getAttribute(
                                "href"
                            );



                        /*
                         * Ignora links vazios.
                         */

                        if(
                            id === "#" ||
                            id === ""
                        ){

                            return;

                        }





                        let destino = null;



                        /*
                         * Evita erro caso exista
                         * href inválido.
                         */

                        try {


                            destino =
                                document.querySelector(
                                    id
                                );


                        } catch(error) {


                            return;


                        }





                        if(destino){


                            event.preventDefault();



                            destino.scrollIntoView(
                                {

                                    behavior:
                                        window.matchMedia(
                                            "(prefers-reduced-motion: reduce)"
                                        ).matches

                                        ? "auto"

                                        : "smooth"

                                }
                            );


                        }



                    }
                );


            }
        );



    }
);

/* ==========================================================
   MODAIS
   TERMOS DE USO + POLÍTICA DE PRIVACIDADE
========================================================== */


document.addEventListener(
    "DOMContentLoaded",
    function(){


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



        function openModal(modal){


            if(!modal){

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





        function closeModal(modal){


            if(!modal){

                return;

            }



            modal.classList.remove(
                "active"
            );


            modal.setAttribute(
                "aria-hidden",
                "true"
            );



            const outroModalAberto =
                document.querySelector(
                    ".legal-modal.active"
                );



            if(!outroModalAberto){


                document.body.style.overflow =
                    "";


            }


        }





        /*
         * ABRIR TERMOS
         */


        if(
            openTerms &&
            termsModal
        ){


            openTerms.addEventListener(
                "click",
                function(event){


                    event.preventDefault();


                    openModal(
                        termsModal
                    );


                }
            );


        }





        /*
         * ABRIR PRIVACIDADE
         */


        if(
            openPrivacy &&
            privacyModal
        ){


            openPrivacy.addEventListener(
                "click",
                function(event){


                    event.preventDefault();


                    openModal(
                        privacyModal
                    );


                }
            );


        }





        /*
         * FECHAR PELO X
         */


        if(
            closeTerms &&
            termsModal
        ){


            closeTerms.addEventListener(
                "click",
                function(){


                    closeModal(
                        termsModal
                    );


                }
            );


        }





        if(
            closePrivacy &&
            privacyModal
        ){


            closePrivacy.addEventListener(
                "click",
                function(){


                    closeModal(
                        privacyModal
                    );


                }
            );


        }





        /*
         * FECHAR CLICANDO FORA
         */


        if(termsModal){


            termsModal.addEventListener(
                "click",
                function(event){


                    if(
                        event.target ===
                        termsModal
                    ){


                        closeModal(
                            termsModal
                        );


                    }


                }
            );


        }





        if(privacyModal){


            privacyModal.addEventListener(
                "click",
                function(event){


                    if(
                        event.target ===
                        privacyModal
                    ){


                        closeModal(
                            privacyModal
                        );


                    }


                }
            );


        }





        /*
         * FECHAR COM ESC
         */


        document.addEventListener(
            "keydown",
            function(event){


                if(
                    event.key !==
                    "Escape"
                ){

                    return;

                }



                if(
                    termsModal &&
                    termsModal.classList.contains(
                        "active"
                    )
                ){


                    closeModal(
                        termsModal
                    );


                }





                if(
                    privacyModal &&
                    privacyModal.classList.contains(
                        "active"
                    )
                ){


                    closeModal(
                        privacyModal
                    );


                }


            }
        );



    }
);

/* ==========================================================
   TRACKING — CHECKOUT DIRETO

   Substitui:
   - OFERTA SURPRESA — ENVELOPES
   - POPUP DE DESCONTO
   - REVELAÇÃO DE OFERTA

   Agora:
   CTA → Checkout direto Hotmart
   Tracking → clique real no botão
========================================================== */


document.addEventListener(
    "DOMContentLoaded",
    function(){


        const checkoutButtons =
            document.querySelectorAll(
                ".btn-primary"
            );



        if(!checkoutButtons.length){

            return;

        }




        checkoutButtons.forEach(
            function(button){


                button.addEventListener(
                    "click",
                    function(){


                        /*
                         * GOOGLE ADS — CONVERSÃO
                         * Dispara no clique do CTA.
                         *
                         * InitiateCheckout (Meta) e
                         * begin_checkout (GA4) são
                         * enviados pela Hotmart ao
                         * chegar no checkout.
                         */

                        if(
                            typeof gtag === "function"
                        ){


                            gtag(

                                "event",

                                "conversion",

                                {

                                    'send_to':
                                        'AW-18379872794/tOsJCOvXo98cEJq0mrxE',

                                    'value':
                                        27.90,

                                    'currency':
                                        'BRL'

                                }

                            );


                        }


                    }
                );


            }
        );



    }
);





/* ==========================================================
   FIM DO SCRIPT.JS
========================================================== */

/* ==========================================================
   CARROSSEL DE COMPARAÇÃO
   VERSÃO COMPATÍVEL COM HTML/CSS ORIGINAL
========================================================== */


document.addEventListener(
    "DOMContentLoaded",
    function () {



        const carousel =
            document.querySelector(
                ".carousel"
            );



        if (!carousel) return;



        const track =
            carousel.querySelector(
                ".carousel-track"
            );



        const slides =
            carousel.querySelectorAll(
                ".carousel-slide"
            );



        const prevButton =
            carousel.querySelector(
                ".carousel-prev"
            );



        const nextButton =
            carousel.querySelector(
                ".carousel-next"
            );



        const dotsContainer =
            carousel.querySelector(
                ".carousel-dots"
            );



        if (
            !track ||
            !slides.length
        ) return;



        let currentIndex = 0;



        let autoPlayTimer;





        /*
        ======================================
        CRIAR DOTS
        ======================================
        */


        function createDots(){


            if(!dotsContainer)
                return;



            dotsContainer.innerHTML = "";



            slides.forEach(
                function(_, index){



                    const dot =
                        document.createElement(
                            "button"
                        );



                    dot.type =
                        "button";



                    dot.className =
                        "carousel-dot";



                    dot.setAttribute(
                        "aria-label",
                        "Ir para imagem " + (index + 1)
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



                        }
                    );



                    dotsContainer.appendChild(
                        dot
                    );



                }
            );


        }






        /*
        ======================================
        ATUALIZAR POSIÇÃO
        ======================================
        */


        function updateCarousel(){



            const slideWidth =
                carousel.clientWidth;



            track.scrollTo({

                left:
                currentIndex * slideWidth,

                behavior:
                "smooth"

            });





            const dots =
                dotsContainer
                ?
                dotsContainer.querySelectorAll(
                    ".carousel-dot"
                )
                :
                [];



            dots.forEach(
                function(dot,index){



                    dot.classList.toggle(
                        "active",
                        index === currentIndex
                    );



                }
            );



        }






        /*
        ======================================
        IR PARA SLIDE
        ======================================
        */


        function goToSlide(index){



            if(index < 0){

                currentIndex =
                    slides.length - 1;


            }
            else if(
                index >= slides.length
            ){

                currentIndex = 0;


            }
            else {


                currentIndex = index;


            }



            updateCarousel();



        }






        /*
        ======================================
        SETAS
        ======================================
        */


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






        /*
        ======================================
        AUTOPLAY
        ======================================
        */


        function startAutoPlay(){


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


            clearInterval(
                autoPlayTimer
            );


        }





        function restartAutoPlay(){


            stopAutoPlay();

            startAutoPlay();


        }






        /*
        ======================================
        PAUSAR AO PASSAR MOUSE
        ======================================
        */


        carousel.addEventListener(
            "mouseenter",
            function(){

                stopAutoPlay();

            }
        );



        carousel.addEventListener(
            "mouseleave",
            function(){

                startAutoPlay();

            }
        );







        /*
        ======================================
        SWIPE MOBILE
        ======================================
        */


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







        /*
        ======================================
        RESIZE
        ======================================
        */


        window.addEventListener(
            "resize",
            function(){


                updateCarousel();


            }
        );






        /*
        ======================================
        INICIALIZAÇÃO
        ======================================
        */


        createDots();

        updateCarousel();

        startAutoPlay();



    }
);

/* ==========================================================
   TIMER DA OFERTA
   RESET AUTOMÁTICO À MEIA-NOITE
========================================================== */


function iniciarContadorOferta(){


    const countdownElement =
        document.getElementById(
            "countdown"
        );



    if(!countdownElement){

        return;

    }





    function atualizarContador(){



        const agora =
            new Date();




        const meiaNoite =
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
            meiaNoite.getTime()
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








/* ==========================================================
   DATA DOS BÔNUS
========================================================== */


function atualizarDataBonus(){



    const bonusDates =
        document.querySelectorAll(
            ".bonus-date"
        );



    if(!bonusDates.length){

        return;

    }





    const hoje =
        new Date();




    const dia =
        String(
            hoje.getDate()
        )
        .padStart(
            2,
            "0"
        );



    const mes =
        String(
            hoje.getMonth() + 1
        )
        .padStart(
            2,
            "0"
        );



    const ano =
        hoje.getFullYear();




    const data =
        `${dia}/${mes}/${ano}`;





    bonusDates.forEach(
        function(element){

            element.textContent =
                data;

        }
    );



}



atualizarDataBonus();








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


                    }
                );





                if(!aberto){


                    currentItem.classList.add(
                        "active"
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



                        if(
                            id === "#" ||
                            id === ""
                        ){

                            return;

                        }





                        const destino =
                            document.querySelector(
                                id
                            );



                        if(destino){



                            event.preventDefault();



                            destino.scrollIntoView(
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







        /* ==============================
           ABRIR TERMOS
        ============================== */


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








        /* ==============================
           ABRIR PRIVACIDADE
        ============================== */


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








        /* ==============================
           FECHAR PELO X
        ============================== */


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








        /* ==============================
           FECHAR CLICANDO FORA
        ============================== */


        if(termsModal){



            termsModal.addEventListener(
                "click",
                function(event){



                    if(
                        event.target === termsModal
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
                        event.target === privacyModal
                    ){



                        closeModal(
                            privacyModal
                        );



                    }



                }
            );



        }








        /* ==============================
           FECHAR COM ESC
        ============================== */


        document.addEventListener(
            "keydown",
            function(event){



                if(
                    event.key !== "Escape"
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
   FIM DO SCRIPT.JS
========================================================== */

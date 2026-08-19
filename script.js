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



            const cardWidth =
                carousel.querySelector(
                    "[data-comparison-card]"
                ).offsetWidth;



            track.scrollTo({

                left:
                currentIndex * cardWidth,

                behavior:
                "smooth"

            });





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

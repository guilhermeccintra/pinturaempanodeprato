/* ==========================================================
   SCRIPT.JS OTIMIZADO
   Mantém:
   - Carrossel comparação
   - Setas
   - Dots
   - Autoplay
   - Swipe
   ========================================================== */


document.addEventListener("DOMContentLoaded", function () {


/* ==========================================================
   CARROSSEL DE COMPARAÇÃO
========================================================== */


document.addEventListener("DOMContentLoaded", function () {


const comparisonCarousel =
    document.querySelector(
        "[data-comparison-carousel]"
    );


if (!comparisonCarousel) return;



const comparisonTrack =
    comparisonCarousel.querySelector(
        "[data-comparison-track]"
    );



const comparisonSlides =
    comparisonCarousel.querySelectorAll(
        "[data-comparison-card]"
    );



const comparisonPrev =
    comparisonCarousel.querySelector(
        "[data-comparison-prev]"
    );



const comparisonNext =
    comparisonCarousel.querySelector(
        "[data-comparison-next]"
    );



const comparisonDots =
    comparisonCarousel.querySelector(
        "[data-comparison-dots]"
    );




if (
    !comparisonTrack ||
    !comparisonSlides.length
) return;



let currentSlide = 0;

let autoPlay;



function updateCarousel(){


    comparisonTrack.style.transform =
        `translateX(-${currentSlide * 100}%)`;



    if(comparisonDots){


        const dots =
            comparisonDots.querySelectorAll(
                "button"
            );


        dots.forEach(
            (dot,index)=>{


                dot.classList.toggle(
                    "active",
                    index === currentSlide
                );


            }
        );

    }



}




function goToSlide(index){



    if(index < 0){

        currentSlide =
            comparisonSlides.length - 1;


    }
    else if(
        index >= comparisonSlides.length
    ){

        currentSlide = 0;


    }
    else{


        currentSlide = index;


    }



    updateCarousel();



}





function nextSlide(){

    goToSlide(
        currentSlide + 1
    );

}



function previousSlide(){

    goToSlide(
        currentSlide - 1
    );

}





/* ==============================
   BOTÕES
============================== */


if(comparisonNext){


    comparisonNext.addEventListener(
        "click",
        function(){

            nextSlide();

            restartAutoPlay();

        }
    );


}



if(comparisonPrev){


    comparisonPrev.addEventListener(
        "click",
        function(){

            previousSlide();

            restartAutoPlay();

        }
    );


}




/* ==============================
   DOTS
============================== */


if(comparisonDots){


    comparisonDots.innerHTML = "";



    comparisonSlides.forEach(
        function(_,index){


            const dot =
                document.createElement(
                    "button"
                );


            dot.type = "button";


            dot.setAttribute(
                "aria-label",
                `Ver comparação ${index + 1}`
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



            comparisonDots.appendChild(dot);


        }
    );


}





/* ==============================
   AUTOPLAY
============================== */


function startAutoPlay(){


    autoPlay =
        setInterval(
            function(){

                nextSlide();

            },
            5000
        );


}



function stopAutoPlay(){


    clearInterval(autoPlay);


}



function restartAutoPlay(){


    stopAutoPlay();

    startAutoPlay();


}





comparisonCarousel.addEventListener(
    "mouseenter",
    stopAutoPlay
);



comparisonCarousel.addEventListener(
    "mouseleave",
    startAutoPlay
);




/* ==============================
   SWIPE MOBILE
============================== */


let touchStart = 0;


comparisonTrack.addEventListener(
    "touchstart",
    function(e){

        touchStart =
            e.changedTouches[0].screenX;

    },
    {
        passive:true
    }
);



comparisonTrack.addEventListener(
    "touchend",
    function(e){


        const touchEnd =
            e.changedTouches[0].screenX;



        if(
            touchStart - touchEnd > 50
        ){

            nextSlide();

        }



        if(
            touchEnd - touchStart > 50
        ){

            previousSlide();

        }



        restartAutoPlay();


    },
    {
        passive:true
    }
);




updateCarousel();

startAutoPlay();



});

   
/* ==========================================================
   TIMER DA OFERTA
========================================================== */


document.addEventListener("DOMContentLoaded", function () {


const countdownElement =
    document.getElementById("countdown");


if (countdownElement) {


    const TIMER_DURATION =
        15 * 60;


    let remainingTime =
        TIMER_DURATION;



    function updateCountdown() {


        const minutes =
            Math.floor(
                remainingTime / 60
            );


        const seconds =
            remainingTime % 60;



        countdownElement.textContent =
            `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;



        if (remainingTime <= 0) {


            remainingTime =
                TIMER_DURATION;


        }
        else {


            remainingTime--;

        }


    }



    updateCountdown();


    setInterval(
        updateCountdown,
        1000
    );


}




/* ==========================================================
   DATA DINÂMICA DOS BÔNUS
========================================================== */


const dateElements =
    document.querySelectorAll(
        "[data-current-date]"
    );



if (dateElements.length) {


    const today =
        new Date();



    const formattedDate =
        today.toLocaleDateString(
            "pt-BR"
        );



    dateElements.forEach(
        function(element){

            element.textContent =
                formattedDate;

        }
    );


}




/* ==========================================================
   FAQ ACORDEÃO
========================================================== */


const faqItems =
    document.querySelectorAll(
        ".faq-item"
    );



if (faqItems.length) {


    faqItems.forEach(
        function(item){



            const question =
                item.querySelector(
                    ".faq-question"
                );



            if (!question) return;



            question.addEventListener(
                "click",
                function(){


                    const isActive =
                        item.classList.contains(
                            "active"
                        );



                    faqItems.forEach(
                        function(other){

                            other.classList.remove(
                                "active"
                            );

                        }
                    );



                    if (!isActive) {


                        item.classList.add(
                            "active"
                        );


                    }


                }
            );



        }
    );


}



});

/* ==========================================================
   MODAIS
   TERMOS DE USO + POLÍTICA DE PRIVACIDADE
========================================================== */


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


            if (!modal) return;



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


            if (!modal) return;



            modal.classList.remove(
                "active"
            );



            modal.setAttribute(
                "aria-hidden",
                "true"
            );



            const anyModalOpen =
                document.querySelector(
                    ".legal-modal.active"
                );



            if (!anyModalOpen) {


                document.body.style.overflow =
                    "";


            }


        }





        /* ==============================
           ABRIR TERMOS
        ============================== */


        if (
            openTerms &&
            termsModal
        ) {


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


        if (
            openPrivacy &&
            privacyModal
        ) {


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
           FECHAR X
        ============================== */


        if (
            closeTerms &&
            termsModal
        ) {


            closeTerms.addEventListener(
                "click",
                function(){


                    closeModal(
                        termsModal
                    );


                }
            );


        }





        if (
            closePrivacy &&
            privacyModal
        ) {


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


        if (termsModal) {


            termsModal.addEventListener(
                "click",
                function(event){


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
                function(event){


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





        /* ==============================
           FECHAR COM ESC
        ============================== */


        document.addEventListener(
            "keydown",
            function(event){


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



/* ==========================================================
   FIM DO SCRIPT
========================================================== */

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



/* ==========================================================
   OFERTA SURPRESA — ENVELOPES
   Cole este bloco NO FINAL do script.js atual

   LÓGICA:
   - Qualquer envelope escolhido = 44% OFF
   - Um dos restantes = 22% OFF
   - O outro = SEM DESCONTO
   - Preço original = R$ 49,90
   - Preço final = R$ 27,94
   - Resultado permanece durante a sessão
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ======================================================
       CONFIGURAÇÃO
       ====================================================== */

    const OFFER_CONFIG = {
        originalPrice: 49.90,
        finalPrice: 27.94,
        winnerDiscount: 44,
        secondaryDiscount: 22,

        /*
         * Checkout atual da sua landing.
         *
         * IMPORTANTE:
         * o preço efetivamente cobrado é definido na Hotmart.
         * Este JS apenas encaminha o cliente.
         */
        checkoutUrl:
            "https://pay.hotmart.com/S106956139O?checkoutMode=10",

        storageKey:
            "pano_prato_oferta_revelada_v1"
    };


    /* ======================================================
       ELEMENTOS PRINCIPAIS
       ====================================================== */

    const modal =
        document.querySelector(".discount-modal");

    if (!modal) {
        console.warn(
            "Modal da oferta não encontrado. Verifique o index.html."
        );
        return;
    }


    const dialog =
        modal.querySelector(".discount-modal__dialog");

    const closeButton =
        modal.querySelector(".discount-modal__close");

    const envelopes =
        Array.from(
            modal.querySelectorAll(".discount-envelope")
        );

    const results =
        modal.querySelector(".discount-results");

    const resultCards =
        Array.from(
            modal.querySelectorAll(".discount-result-card")
        );

    const checkoutButton =
        modal.querySelector(".discount-checkout");


    /*
     * Procura todos os botões/links criados no HTML
     * para abrir a oferta.
     */
    const offerTriggers =
        Array.from(
            document.querySelectorAll(
                ".discount-trigger, [data-discount-trigger]"
            )
        );


    /* ======================================================
       VALIDAÇÃO
       ====================================================== */

    if (!dialog) {
        console.warn(
            "Caixa interna do modal não encontrada."
        );
        return;
    }

    if (envelopes.length !== 3) {
        console.warn(
            "A oferta precisa possuir exatamente 3 envelopes."
        );
    }


    /* ======================================================
       ESTADO
       ====================================================== */

    let selectedIndex = null;
    let previousActiveElement = null;


    /* ======================================================
       UTILITÁRIOS
       ====================================================== */

    function shuffle(array) {

        const copy = array.slice();

        for (
            let i = copy.length - 1;
            i > 0;
            i--
        ) {

            const j =
                Math.floor(
                    Math.random() * (i + 1)
                );

            [
                copy[i],
                copy[j]
            ] = [
                copy[j],
                copy[i]
            ];
        }

        return copy;
    }


    function safeSessionGet() {

        try {

            return sessionStorage.getItem(
                OFFER_CONFIG.storageKey
            );

        } catch (error) {

            return null;
        }
    }


    function safeSessionSet(value) {

        try {

            sessionStorage.setItem(
                OFFER_CONFIG.storageKey,
                value
            );

        } catch (error) {

            /*
             * Se sessionStorage estiver bloqueado,
             * a oferta continua funcionando normalmente.
             */
        }
    }


    function safeParseJSON(value) {

        if (!value) {
            return null;
        }

        try {

            return JSON.parse(value);

        } catch (error) {

            return null;
        }
    }


    /* ======================================================
       PRESERVAÇÃO DOS PARÂMETROS DA URL
       ======================================================

       Se o visitante chegou com UTM, fbclid, gclid etc.,
       copiamos os parâmetros para o checkout.

       Isso é complementar ao tracking.js e NÃO o modifica.
       ====================================================== */

    function buildCheckoutUrl() {

        try {

            const checkout =
                new URL(
                    OFFER_CONFIG.checkoutUrl,
                    window.location.href
                );

            const currentParams =
                new URLSearchParams(
                    window.location.search
                );


            currentParams.forEach(
                function (value, key) {

                    /*
                     * Não sobrescreve parâmetros que já
                     * estejam definidos no checkout.
                     */
                    if (
                        !checkout.searchParams.has(key)
                    ) {

                        checkout.searchParams.set(
                            key,
                            value
                        );
                    }
                }
            );


            return checkout.toString();

        } catch (error) {

            return OFFER_CONFIG.checkoutUrl;
        }
    }


    /* ======================================================
       ATUALIZA O LINK DO CHECKOUT
       ====================================================== */

    function updateCheckoutLink() {

        if (!checkoutButton) {
            return;
        }


        checkoutButton.setAttribute(
            "href",
            buildCheckoutUrl()
        );


        /*
         * Mantemos um <a href> real.
         * Isso é importante para scripts externos que
         * trabalham com links de checkout.
         */
        checkoutButton.setAttribute(
            "rel",
            "noopener"
        );
    }


    updateCheckoutLink();


    /* ======================================================
       ABRIR MODAL
       ====================================================== */

    function openDiscountModal() {

        previousActiveElement =
            document.activeElement;


        modal.classList.add("active");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );


        /*
         * Evita que a landing role por trás do popup.
         */
        document.body.style.overflow =
            "hidden";


        /*
         * Se a pessoa já ganhou durante esta sessão,
         * mostramos diretamente o resultado.
         */
        const storedResult =
            getStoredResult();


        if (storedResult) {

            restoreResult(
                storedResult
            );

        } else {

            resetOffer();
        }


        /*
         * Foco inicial acessível.
         */
        window.setTimeout(
            function () {

                if (
                    storedResult &&
                    checkoutButton
                ) {

                    checkoutButton.focus();

                } else if (
                    envelopes[0]
                ) {

                    envelopes[0].focus();

                } else if (
                    closeButton
                ) {

                    closeButton.focus();
                }

            },
            80
        );
    }


    /* ======================================================
       FECHAR MODAL
       ====================================================== */

    function closeDiscountModal() {

        modal.classList.remove("active");

        modal.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.style.overflow =
            "";


        if (
            previousActiveElement &&
            typeof previousActiveElement.focus ===
                "function"
        ) {

            previousActiveElement.focus();
        }
    }


    /* ======================================================
       RESET VISUAL
       ====================================================== */

    function resetOffer() {

        selectedIndex = null;


        envelopes.forEach(
            function (envelope) {

                envelope.classList.remove(
                    "is-selected"
                );

                envelope.classList.remove(
                    "is-open"
                );

                envelope.disabled = false;

                envelope.removeAttribute(
                    "aria-pressed"
                );
            }
        );


        resultCards.forEach(
            function (card) {

                card.classList.remove(
                    "is-winner"
                );

                card.removeAttribute(
                    "data-result"
                );
            }
        );


        if (results) {

            results.classList.remove(
                "active"
            );

            results.setAttribute(
                "aria-hidden",
                "true"
            );
        }
    }


    /* ======================================================
       SALVAR RESULTADO
       ====================================================== */

    function saveResult(
        winnerIndex,
        distribution
    ) {

        const data = {

            winnerIndex:
                winnerIndex,

            distribution:
                distribution,

            winnerDiscount:
                OFFER_CONFIG.winnerDiscount,

            secondaryDiscount:
                OFFER_CONFIG.secondaryDiscount,

            originalPrice:
                OFFER_CONFIG.originalPrice,

            finalPrice:
                OFFER_CONFIG.finalPrice
        };


        safeSessionSet(
            JSON.stringify(data)
        );
    }


    /* ======================================================
       RECUPERAR RESULTADO
       ====================================================== */

    function getStoredResult() {

        const data =
            safeParseJSON(
                safeSessionGet()
            );


        if (!data) {
            return null;
        }


        /*
         * Validação simples para impedir dados antigos
         * ou inconsistentes.
         */
        if (
            typeof data.winnerIndex !==
                "number" ||
            !Array.isArray(
                data.distribution
            ) ||
            data.distribution.length !== 3
        ) {

            return null;
        }


        return data;
    }


    /* ======================================================
       TEXTO DE CADA RESULTADO
       ====================================================== */

    function resultLabel(type) {

        switch (type) {

            case "winner":

                return (
                    OFFER_CONFIG.winnerDiscount +
                    "% OFF"
                );


            case "secondary":

                return (
                    OFFER_CONFIG.secondaryDiscount +
                    "% OFF"
                );


            default:

                return "SEM DESCONTO";
        }
    }


    /* ======================================================
       MOSTRAR RESULTADOS NOS 3 CARDS
       ====================================================== */

    function renderResults(
        winnerIndex,
        distribution
    ) {

        selectedIndex =
            winnerIndex;


        envelopes.forEach(
            function (envelope, index) {

                const isWinner =
                    index === winnerIndex;


                envelope.classList.toggle(
                    "is-selected",
                    isWinner
                );


                envelope.classList.add(
                    "is-open"
                );


                envelope.disabled =
                    true;


                envelope.setAttribute(
                    "aria-pressed",
                    isWinner
                        ? "true"
                        : "false"
                );
            }
        );


        resultCards.forEach(
            function (card, index) {

                const resultType =
                    distribution[index];


                card.textContent =
                    resultLabel(
                        resultType
                    );


                card.setAttribute(
                    "data-result",
                    resultType
                );


                card.classList.toggle(
                    "is-winner",
                    resultType ===
                        "winner"
                );
            }
        );


        if (results) {

            results.classList.add(
                "active"
            );

            results.setAttribute(
                "aria-hidden",
                "false"
            );
        }


        updateCheckoutLink();
    }


    /* ======================================================
       ESCOLHA DO ENVELOPE
       ====================================================== */

    function chooseEnvelope(index) {

        /*
         * Impede uma segunda escolha.
         */
        if (
            selectedIndex !== null
        ) {

            return;
        }


        selectedIndex =
            index;


        /*
         * O envelope clicado SEMPRE recebe 44%.
         *
         * Os outros dois recebem aleatoriamente:
         * 22% e SEM DESCONTO.
         */
        const otherResults =
            shuffle([
                "secondary",
                "none"
            ]);


        const distribution =
            new Array(3);


        distribution[index] =
            "winner";


        let otherResultIndex = 0;


        for (
            let i = 0;
            i < 3;
            i++
        ) {

            if (i === index) {
                continue;
            }


            distribution[i] =
                otherResults[
                    otherResultIndex
                ];


            otherResultIndex++;
        }


        /*
         * Primeiro destacamos o envelope escolhido.
         */
        envelopes.forEach(
            function (
                envelope,
                envelopeIndex
            ) {

                envelope.disabled =
                    true;


                if (
                    envelopeIndex ===
                    index
                ) {

                    envelope.classList.add(
                        "is-selected"
                    );
                }
            }
        );


        /*
         * Pequeno intervalo deixa a revelação
         * mais natural visualmente.
         */
        window.setTimeout(
            function () {

                renderResults(
                    index,
                    distribution
                );


                saveResult(
                    index,
                    distribution
                );


                /*
                 * No celular, garante que o resultado
                 * fique visível sem jogar a pessoa
                 * para fora do popup.
                 */
                if (results) {

                    results.scrollIntoView({
                        behavior:
                            window.matchMedia(
                                "(prefers-reduced-motion: reduce)"
                            ).matches
                                ? "auto"
                                : "smooth",

                        block:
                            "nearest"
                    });
                }

            },
            420
        );
    }


    /* ======================================================
       RESTAURAR OFERTA JÁ GANHA
       ====================================================== */

    function restoreResult(data) {

        renderResults(
            data.winnerIndex,
            data.distribution
        );
    }


    /* ======================================================
       BOTÕES QUE ABREM O POPUP
       ====================================================== */

    offerTriggers.forEach(
        function (trigger) {

            trigger.addEventListener(
                "click",
                function (event) {

                    /*
                     * O CTA da landing não navega direto
                     * para a Hotmart.
                     */
                    event.preventDefault();


                    openDiscountModal();
                }
            );
        }
    );


    /* ======================================================
       CLIQUE NOS ENVELOPES
       ====================================================== */

    envelopes.forEach(
        function (envelope, index) {

            envelope.addEventListener(
                "click",
                function () {

                    chooseEnvelope(
                        index
                    );
                }
            );
        }
    );


    /* ======================================================
       FECHAR PELO X
       ====================================================== */

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeDiscountModal
        );
    }


    /* ======================================================
       FECHAR CLICANDO NO FUNDO
       ====================================================== */

    modal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === modal
            ) {

                closeDiscountModal();
            }
        }
    );


    /* ======================================================
       TECLADO — ESC + TRAVA DE FOCO
       ====================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                !modal.classList.contains(
                    "active"
                )
            ) {

                return;
            }


            /* ESC */

            if (
                event.key === "Escape"
            ) {

                closeDiscountModal();

                return;
            }


            /* TAB */

            if (
                event.key !== "Tab"
            ) {

                return;
            }


            const focusable =
                Array.from(
                    modal.querySelectorAll(
                        [
                            "button:not([disabled])",
                            "a[href]",
                            '[tabindex]:not([tabindex="-1"])'
                        ].join(",")
                    )
                ).filter(
                    function (element) {

                        return (
                            element.offsetParent !==
                            null
                        );
                    }
                );


            if (
                !focusable.length
            ) {

                return;
            }


            const first =
                focusable[0];

            const last =
                focusable[
                    focusable.length - 1
                ];


            if (
                event.shiftKey &&
                document.activeElement ===
                    first
            ) {

                event.preventDefault();

                last.focus();

            } else if (
                !event.shiftKey &&
                document.activeElement ===
                    last
            ) {

                event.preventDefault();

                first.focus();
            }
        }
    );


    /* ======================================================
       ATUALIZA O CTA DA LANDING APÓS A PESSOA GANHAR
       ====================================================== */

    function updateTriggersIfOfferAlreadyRevealed() {

        const stored =
            getStoredResult();


        if (!stored) {
            return;
        }


        offerTriggers.forEach(
            function (trigger) {

                /*
                 * Só altera o texto do botão.
                 * Não mexe nas classes nem no tracking.
                 */
                const textElement =
                    trigger.querySelector(
                        "[data-discount-trigger-text]"
                    );


                if (textElement) {

                    textElement.textContent =
                        "VER MEU DESCONTO";

                } else {

                    trigger.textContent =
                        "VER MEU DESCONTO";
                }
            }
        );
    }


    updateTriggersIfOfferAlreadyRevealed();


    /*
     * Quando a pessoa escolhe um envelope,
     * atualizamos também os CTAs da página.
     */
    envelopes.forEach(
        function (envelope) {

            envelope.addEventListener(
                "click",
                function () {

                    window.setTimeout(
                        updateTriggersIfOfferAlreadyRevealed,
                        500
                    );
                }
            );
        }
    );

});

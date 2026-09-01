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


            /*
             * Evita criar mais de um timer
             * simultaneamente.
             */
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



        /*
         * Suporte a swipe no celular.
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
         * Inicialização.
         *
         * Aqui os dots são efetivamente criados.
         */
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
                         * Evita erro caso exista algum
                         * href que não seja um seletor válido.
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
                    ".legal-modal.active, .discount-modal.active"
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



        /* ==============================
           FECHAR COM ESC
        ============================== */


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
   OFERTA SURPRESA — ENVELOPES

   LÓGICA:
   - Qualquer envelope escolhido = 44% OFF
   - Um dos restantes = 22% OFF
   - O outro = SEM DESCONTO
   - Preço original = R$ 49,90
   - Preço final = R$ 27,94
   - Resultado permanece durante a sessão
========================================================== */


document.addEventListener(
    "DOMContentLoaded",
    function(){


        /* ======================================================
           CONFIGURAÇÃO
        ====================================================== */


        const OFFER_CONFIG = {

            originalPrice: 49.90,

            finalPrice: 27.94,

            winnerDiscount: 44,

            secondaryDiscount: 22,


            /*
             * O preço efetivamente cobrado
             * continua sendo definido na Hotmart.
             *
             * Este script apenas encaminha
             * a pessoa para o checkout.
             */
            checkoutUrl:
                "https://pay.hotmart.com/S106956139O?checkoutMode=10",


            storageKey:
                "pano_prato_oferta_revelada_v1"

        };



        /* ======================================================
           TRACKING DO FUNIL DA OFERTA

           META:
           Browser + CAPI recebem o mesmo eventID.

           GA4:
           também recebe cada microconversão.

           Cada estágio é registrado uma única vez
           por sessão para evitar duplicação ao
           fechar e reabrir o popup.
        ====================================================== */


        function trackOfferEventOnce(
            eventName,
            customData = {}
        ){


            const eventStorageKey =
                OFFER_CONFIG.storageKey +
                "_event_" +
                eventName;



            /*
             * Impede que o mesmo estágio seja
             * contabilizado várias vezes
             * durante a mesma sessão.
             */
            try {


                if(
                    sessionStorage.getItem(
                        eventStorageKey
                    ) === "1"
                ){


                    return;


                }


                sessionStorage.setItem(
                    eventStorageKey,
                    "1"
                );


            } catch(error){


                /*
                 * Se o navegador bloquear
                 * sessionStorage, não interrompe
                 * a experiência.
                 */


            }



            /*
             * Mesmo eventID para Browser + CAPI.
             */
            const eventId =

                typeof generateMetaEventId ===
                    "function"

                    ? generateMetaEventId(
                        eventName
                    )

                    : (
                        eventName +
                        "_" +
                        Date.now() +
                        "_" +
                        Math.random()
                            .toString(36)
                            .substring(2, 12)
                    );



            const metaData =
                Object.assign(
                    {

                        content_name:
                            "120 Riscos para Pintura em Pano de Prato",

                        content_ids:
                            [
                                "120-riscos-pano-de-prato"
                            ],

                        content_type:
                            "product",

                        currency:
                            "BRL",

                        value:
                            OFFER_CONFIG.finalPrice

                    },

                    customData

                );



            /* ==============================
               META PIXEL — BROWSER
            ============================== */


            if(
                typeof fbq ===
                "function"
            ){


                fbq(
                    "trackCustom",
                    eventName,
                    metaData,
                    {
                        eventID:
                            eventId
                    }
                );


            }



            /* ==============================
               META CAPI — SERVER
            ============================== */


            if(
                typeof sendMetaCapi ===
                "function"
            ){


                sendMetaCapi(
                    eventName,
                    eventId,
                    metaData
                );


            }



            /* ==============================
               GOOGLE ANALYTICS 4
            ============================== */


            if(
                typeof gtag ===
                "function"
            ){


                gtag(
                    "event",
                    eventName,
                    Object.assign(
                        {

                            currency:
                                "BRL",

                            value:
                                OFFER_CONFIG.finalPrice

                        },

                        customData

                    )
                );


            }


        }



        /* ======================================================
           ELEMENTOS PRINCIPAIS DA OFERTA
        ====================================================== */


        const modal =
            document.querySelector(
                ".discount-modal"
            );


        /*
         * Se o modal não existir, somente
         * a funcionalidade da oferta é ignorada.
         *
         * O restante do script já foi inicializado
         * normalmente.
         */
        if(!modal){


            console.warn(
                "Modal da oferta não encontrado."
            );


            return;


        }



        const dialog =
            modal.querySelector(
                ".discount-modal__dialog"
            );


        const closeButton =
            modal.querySelector(
                ".discount-modal__close"
            );


        const envelopes =
            Array.from(
                modal.querySelectorAll(
                    ".discount-envelope"
                )
            );


        const results =
            modal.querySelector(
                ".discount-results"
            );


        const resultCards =
            Array.from(
                modal.querySelectorAll(
                    ".discount-result-card"
                )
            );


        const checkoutButton =
            modal.querySelector(
                ".discount-checkout"
            );



        /*
         * Todos os CTAs da landing que
         * devem abrir o popup.
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


        if(!dialog){


            console.warn(
                "Caixa interna do modal da oferta não encontrada."
            );


            return;


        }


        if(
            envelopes.length !== 3
        ){


            console.warn(
                "A oferta precisa possuir exatamente 3 envelopes."
            );


        }



        /* ======================================================
           ESTADO DA OFERTA
        ====================================================== */


        let selectedIndex =
            null;


        let previousActiveElement =
            null;



        /* ======================================================
           UTILITÁRIO — EMBARALHAR
        ====================================================== */


        function shuffle(array){


            const copy =
                array.slice();


            for(
                let i =
                    copy.length - 1;

                i > 0;

                i--
            ){


                const j =
                    Math.floor(
                        Math.random() *
                        (i + 1)
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



        /* ======================================================
           SESSION STORAGE
        ====================================================== */


        function safeSessionGet(){


            try {


                return sessionStorage.getItem(
                    OFFER_CONFIG.storageKey
                );


            } catch(error){


                return null;


            }


        }



        function safeSessionSet(value){


            try {


                sessionStorage.setItem(
                    OFFER_CONFIG.storageKey,
                    value
                );


            } catch(error){


                /*
                 * A oferta continua funcionando
                 * mesmo sem sessionStorage.
                 */


            }


        }



        function safeParseJSON(value){


            if(!value){


                return null;


            }


            try {


                return JSON.parse(
                    value
                );


            } catch(error){


                return null;


            }


        }

           /* ======================================================
           PRESERVAÇÃO DOS PARÂMETROS DA URL
        ====================================================== */


        function buildCheckoutUrl(){


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
                    function(value, key){


                        /*
                         * Não sobrescreve parâmetros
                         * que já existam no checkout.
                         */
                        if(
                            !checkout.searchParams.has(
                                key
                            )
                        ){


                            checkout.searchParams.set(
                                key,
                                value
                            );


                        }


                    }
                );


                return checkout.toString();


            } catch(error){


                return OFFER_CONFIG.checkoutUrl;


            }


        }



        /* ======================================================
           ATUALIZA LINK DO CHECKOUT
        ====================================================== */


        function updateCheckoutLink(){


            if(!checkoutButton){


                return;


            }


            checkoutButton.setAttribute(
                "href",
                buildCheckoutUrl()
            );


            /*
             * Mantemos um link <a> real.
             *
             * Não usamos window.location aqui para
             * preservar compatibilidade com scripts
             * externos de tracking/checkout.
             */
            checkoutButton.setAttribute(
                "rel",
                "noopener"
            );


        }



        updateCheckoutLink();



        /* ======================================================
           TRACKING — CLIQUE PARA O CHECKOUT
        ====================================================== */


        if(checkoutButton){


            checkoutButton.addEventListener(
                "click",
                function(){


                    /*
                     * IMPORTANTE:
                     * não usamos preventDefault.
                     *
                     * O evento é registrado e o link
                     * continua normalmente para Hotmart.
                     */
                    trackOfferEventOnce(
                        "CheckoutClick",
                        {

                            offer_stage:
                                "checkout_click",

                            discount_percent:
                                OFFER_CONFIG
                                    .winnerDiscount,

                            original_price:
                                OFFER_CONFIG
                                    .originalPrice,

                            final_price:
                                OFFER_CONFIG
                                    .finalPrice

                        }
                    );


                }
            );


        }



        /* ======================================================
           RECUPERAR RESULTADO SALVO
        ====================================================== */


        function getStoredResult(){


            const data =
                safeParseJSON(
                    safeSessionGet()
                );


            if(!data){


                return null;


            }


            /*
             * Validação básica para impedir que
             * dados antigos ou incompletos
             * quebrem a oferta.
             */
            if(
                typeof data.winnerIndex !==
                    "number" ||

                !Array.isArray(
                    data.distribution
                ) ||

                data.distribution.length !==
                    3
            ){


                return null;


            }


            /*
             * O índice precisa ser 0, 1 ou 2.
             */
            if(
                data.winnerIndex < 0 ||
                data.winnerIndex > 2
            ){


                return null;


            }


            return data;


        }



        /* ======================================================
           SALVAR RESULTADO
        ====================================================== */


        function saveResult(
            winnerIndex,
            distribution
        ){


            const data = {


                winnerIndex:
                    winnerIndex,


                distribution:
                    distribution,


                winnerDiscount:
                    OFFER_CONFIG
                        .winnerDiscount,


                secondaryDiscount:
                    OFFER_CONFIG
                        .secondaryDiscount,


                originalPrice:
                    OFFER_CONFIG
                        .originalPrice,


                finalPrice:
                    OFFER_CONFIG
                        .finalPrice


            };


            safeSessionSet(
                JSON.stringify(
                    data
                )
            );


        }



        /* ======================================================
           RESET VISUAL DA OFERTA
        ====================================================== */


        function resetOffer(){


            selectedIndex =
                null;


            envelopes.forEach(
                function(envelope){


                    envelope.classList.remove(
                        "is-selected"
                    );


                    envelope.classList.remove(
                        "is-open"
                    );


                    envelope.disabled =
                        false;


                    envelope.removeAttribute(
                        "aria-pressed"
                    );


                }
            );


            resultCards.forEach(
                function(card){


                    card.classList.remove(
                        "is-winner"
                    );


                    card.removeAttribute(
                        "data-result"
                    );


                    /*
                     * Limpa qualquer resultado
                     * anterior antes de uma nova
                     * renderização.
                     */
                    card.textContent =
                        "";


                }
            );


            if(results){


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
           TEXTO DE CADA RESULTADO
        ====================================================== */


        function resultLabel(type){


            switch(type){


                case "winner":


                    return (
                        OFFER_CONFIG
                            .winnerDiscount +
                        "% OFF"
                    );


                case "secondary":


                    return (
                        OFFER_CONFIG
                            .secondaryDiscount +
                        "% OFF"
                    );


                default:


                    return "SEM DESCONTO";


            }


        }



        /* ======================================================
           RENDERIZAR RESULTADOS
        ====================================================== */


        function renderResults(
            winnerIndex,
            distribution
        ){


            selectedIndex =
                winnerIndex;



            /*
             * Atualiza visual dos envelopes.
             */
            envelopes.forEach(
                function(
                    envelope,
                    index
                ){


                    const isWinner =
                        index ===
                        winnerIndex;


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



            /*
             * Preenche os três cards:
             *
             * 44% OFF
             * 22% OFF
             * SEM DESCONTO
             */
            resultCards.forEach(
                function(
                    card,
                    index
                ){


                    const resultType =
                        distribution[
                            index
                        ];


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



            /*
             * Mostra o bloco com:
             *
             * VOCÊ ENCONTROU
             * 44% DE DESCONTO
             * R$ 27,94
             * botão para checkout
             */
            if(results){


                results.classList.add(
                    "active"
                );


                results.setAttribute(
                    "aria-hidden",
                    "false"
                );


            }



            /*
             * Atualiza novamente para garantir
             * UTMs e identificadores presentes
             * na URL atual.
             */
            updateCheckoutLink();


        }



        /* ======================================================
           RESTAURAR OFERTA JÁ REVELADA
        ====================================================== */


        function restoreResult(data){


            renderResults(
                data.winnerIndex,
                data.distribution
            );


        }



        /* ======================================================
           ABRIR POPUP
        ====================================================== */


        function openDiscountModal(){


            previousActiveElement =
                document.activeElement;



            /*
             * MICROCONVERSÃO:
             * pessoa clicou no CTA e abriu
             * efetivamente a oferta.
             */
            trackOfferEventOnce(
                "DiscountModalOpen",
                {

                    offer_stage:
                        "modal_open"

                }
            );



            modal.classList.add(
                "active"
            );


            modal.setAttribute(
                "aria-hidden",
                "false"
            );


            /*
             * Bloqueia scroll da landing
             * enquanto o popup estiver aberto.
             */
            document.body.style.overflow =
                "hidden";



            const storedResult =
                getStoredResult();



            /*
             * Se já escolheu um envelope nesta
             * sessão, não fazemos um novo sorteio.
             */
            if(storedResult){


                restoreResult(
                    storedResult
                );


            } else {


                resetOffer();


            }



            /*
             * Foco acessível.
             */
            window.setTimeout(
                function(){


                    if(
                        storedResult &&
                        checkoutButton
                    ){


                        checkoutButton.focus();


                    } else if(
                        envelopes[0]
                    ){


                        envelopes[0].focus();


                    } else if(
                        closeButton
                    ){


                        closeButton.focus();


                    }


                },
                80
            );


        }



        /* ======================================================
           FECHAR POPUP
        ====================================================== */


        function closeDiscountModal(){


            modal.classList.remove(
                "active"
            );


            modal.setAttribute(
                "aria-hidden",
                "true"
            );



            /*
             * Só libera o scroll caso nenhum
             * outro modal legal esteja aberto.
             */
            const legalModalOpen =
                document.querySelector(
                    ".legal-modal.active"
                );


            if(!legalModalOpen){


                document.body.style.overflow =
                    "";


            }



            /*
             * Retorna o foco para o CTA
             * que abriu o popup.
             */
            if(
                previousActiveElement &&
                typeof previousActiveElement.focus ===
                    "function"
            ){


                previousActiveElement.focus();


            }


        }



        /* ======================================================
           CTAs QUE ABREM O POPUP
        ====================================================== */


        offerTriggers.forEach(
            function(trigger){


                trigger.addEventListener(
                    "click",
                    function(event){


                        /*
                         * Impede o CTA de navegar diretamente.
                         * A navegação para Hotmart só acontece
                         * depois da revelação do desconto.
                         */
                        event.preventDefault();


                        openDiscountModal();


                    }
                );


            }
        );



        /* ======================================================
           FECHAR PELO X
        ====================================================== */


        if(closeButton){


            closeButton.addEventListener(
                "click",
                function(){


                    closeDiscountModal();


                }
            );


        }



        /* ======================================================
           FECHAR CLICANDO NO FUNDO
        ====================================================== */


        modal.addEventListener(
            "click",
            function(event){


                if(
                    event.target ===
                        modal
                ){


                    closeDiscountModal();


                }


            }
        );

           /* ======================================================
           ESCOLHA DO ENVELOPE
        ====================================================== */


        function chooseEnvelope(index){


            /*
             * Impede segunda escolha.
             */
            if(
                selectedIndex !== null
            ){


                return;


            }



            /*
             * Validação adicional do índice.
             */
            if(
                index < 0 ||
                index >= envelopes.length
            ){


                return;


            }



            selectedIndex =
                index;



            /*
             * MICROCONVERSÃO:
             * visitante escolheu efetivamente
             * um dos três envelopes.
             */
            trackOfferEventOnce(
                "DiscountEnvelopeSelected",
                {

                    offer_stage:
                        "envelope_selected",

                    envelope_number:
                        index + 1

                }
            );



            /*
             * REGRA DA OFERTA:
             *
             * O envelope escolhido sempre recebe:
             * 44% OFF
             *
             * Os outros dois recebem:
             * 22% OFF
             * SEM DESCONTO
             *
             * A posição dos dois resultados
             * restantes é aleatória.
             */
            const otherResults =
                shuffle(
                    [
                        "secondary",
                        "none"
                    ]
                );



            const distribution =
                new Array(3);



            distribution[index] =
                "winner";



            let otherResultIndex =
                0;



            for(
                let i = 0;
                i < 3;
                i++
            ){


                if(
                    i === index
                ){


                    continue;


                }


                distribution[i] =
                    otherResults[
                        otherResultIndex
                    ];


                otherResultIndex++;


            }



            /*
             * Bloqueia os três envelopes
             * imediatamente para impedir
             * duplo clique.
             */
            envelopes.forEach(
                function(
                    envelope,
                    envelopeIndex
                ){


                    envelope.disabled =
                        true;


                    if(
                        envelopeIndex ===
                            index
                    ){


                        envelope.classList.add(
                            "is-selected"
                        );


                    }


                }
            );



            /*
             * Pequeno delay visual antes
             * da revelação.
             */
            window.setTimeout(
                function(){


                    /*
                     * Revela os três resultados.
                     */
                    renderResults(
                        index,
                        distribution
                    );



                    /*
                     * Guarda o resultado durante
                     * esta sessão.
                     */
                    saveResult(
                        index,
                        distribution
                    );



                    /*
                     * MICROCONVERSÃO:
                     *
                     * Aqui a pessoa efetivamente
                     * visualizou:
                     *
                     * 44% DE DESCONTO
                     * R$ 27,94
                     */
                    trackOfferEventOnce(
                        "DiscountRevealed",
                        {

                            offer_stage:
                                "discount_revealed",

                            discount_percent:
                                OFFER_CONFIG
                                    .winnerDiscount,

                            original_price:
                                OFFER_CONFIG
                                    .originalPrice,

                            final_price:
                                OFFER_CONFIG
                                    .finalPrice

                        }
                    );



                    /*
                     * No celular, posiciona
                     * suavemente o resultado
                     * dentro do campo visível.
                     */
                    if(results){


                        const reduceMotion =
                            window.matchMedia(
                                "(prefers-reduced-motion: reduce)"
                            )
                            .matches;


                        results.scrollIntoView(
                            {

                                behavior:
                                    reduceMotion
                                        ? "auto"
                                        : "smooth",

                                block:
                                    "nearest"

                            }
                        );


                    }



                    /*
                     * Atualiza os CTAs da landing
                     * depois que a oferta foi
                     * efetivamente revelada.
                     */
                    updateTriggersIfOfferAlreadyRevealed();


                },
                420
            );


        }



        /* ======================================================
           CLIQUE NOS ENVELOPES
        ====================================================== */


        envelopes.forEach(
            function(
                envelope,
                index
            ){


                envelope.addEventListener(
                    "click",
                    function(){


                        chooseEnvelope(
                            index
                        );


                    }
                );


            }
        );



        /* ======================================================
           ATUALIZAR CTAs APÓS REVELAÇÃO
        ====================================================== */


        function updateTriggersIfOfferAlreadyRevealed(){


            const stored =
                getStoredResult();


            if(!stored){


                return;


            }



            offerTriggers.forEach(
                function(trigger){


                    /*
                     * Se o HTML possuir um span
                     * específico para o texto,
                     * altera somente esse span.
                     *
                     * Isso preserva ícones e
                     * outros elementos do botão.
                     */
                    const textElement =
                        trigger.querySelector(
                            "[data-discount-trigger-text]"
                        );


                    if(textElement){


                        textElement.textContent =
                            "VER MEU DESCONTO";


                    } else {


                        /*
                         * Fallback para CTAs sem
                         * elemento interno específico.
                         */
                        trigger.textContent =
                            "VER MEU DESCONTO";


                    }


                }
            );


        }



        /*
         * Se a pessoa atualizar a página
         * durante a mesma sessão depois de
         * revelar o desconto, o CTA já aparece
         * como "VER MEU DESCONTO".
         */
        updateTriggersIfOfferAlreadyRevealed();



        /* ======================================================
           TECLADO — ESC + TRAVA DE FOCO
        ====================================================== */


        document.addEventListener(
            "keydown",
            function(event){


                /*
                 * Só executa esta lógica quando
                 * o popup da oferta estiver aberto.
                 */
                if(
                    !modal.classList.contains(
                        "active"
                    )
                ){


                    return;


                }



                /* ==============================
                   ESC
                ============================== */


                if(
                    event.key ===
                        "Escape"
                ){


                    closeDiscountModal();


                    return;


                }



                /* ==============================
                   TAB
                ============================== */


                if(
                    event.key !==
                        "Tab"
                ){


                    return;


                }



                /*
                 * Elementos que podem receber
                 * foco dentro do popup.
                 */
                const focusable =
                    Array.from(
                        modal.querySelectorAll(
                            [
                                "button:not([disabled])",
                                "a[href]",
                                "input:not([disabled])",
                                "select:not([disabled])",
                                "textarea:not([disabled])",
                                '[tabindex]:not([tabindex="-1"])'
                            ].join(",")
                        )
                    )
                    .filter(
                        function(element){


                            return (
                                element.offsetParent !==
                                    null
                            );


                        }
                    );



                if(
                    !focusable.length
                ){


                    return;


                }



                const first =
                    focusable[0];


                const last =
                    focusable[
                        focusable.length - 1
                    ];



                /*
                 * SHIFT + TAB no primeiro
                 * elemento volta para o último.
                 */
                if(
                    event.shiftKey &&
                    document.activeElement ===
                        first
                ){


                    event.preventDefault();


                    last.focus();


                    return;


                }



                /*
                 * TAB no último elemento
                 * retorna ao primeiro.
                 */
                if(
                    !event.shiftKey &&
                    document.activeElement ===
                        last
                ){


                    event.preventDefault();


                    first.focus();


                }


            }
        );



        /* ======================================================
           GARANTIA FINAL DO LINK DE CHECKOUT
        ====================================================== */


        /*
         * Executamos novamente no fim da
         * inicialização para garantir que o
         * href esteja correto mesmo se algum
         * outro script tiver alterado o link
         * durante o carregamento.
         */
        updateCheckoutLink();



    }
);


/* ==========================================================
   FIM DO SCRIPT.JS
========================================================== */

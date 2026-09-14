document.addEventListener("DOMContentLoaded", () => {

    const heroLogo = document.getElementById("heroLogo");
    const heroObject = document.getElementById("hero-object");
    const enterButton = document.getElementById("enterPortfolio");
    const heroSubtitle = document.getElementById("heroSubtitle");
    const speechBubble = document.querySelector(".speech-bubble");


    // ============================================
    // REDUCED MOTION
    // ============================================

    if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
        document.body.classList.add("reduce-motion");
    }


    // ============================================
    // NAV LOGO -> SHOW HERO SPEECH BUBBLE
    // ============================================

    if (heroLogo && speechBubble) {

        speechBubble.classList.add("show-hello");
        heroLogo.classList.add("show-hello");

        setTimeout(() => {
            speechBubble.classList.remove("show-hello");
        }, 9000);

        setTimeout(() => {
            heroLogo.classList.remove("show-hello");
        }, 9000);

        heroLogo.addEventListener("mouseenter", () => {

            speechBubble.classList.add("show-hello");
            speechBubble.classList.add("wave");

        });

        heroLogo.addEventListener("mouseleave", () => {

            speechBubble.classList.remove("wave");
            speechBubble.classList.remove("show-hello");

        });

        heroLogo.addEventListener("click", () => {

            heroLogo.classList.toggle("show-hello");

        });

    }


    // ============================================
    // GLOBAL PAGE TRANSITIONS
    // ============================================

    const pageLinks = document.querySelectorAll(
        'a[href]:not([target="_blank"]):not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"])'
    );

    pageLinks.forEach(link => {

        link.addEventListener("click", function(event) {

            // Don't interfere with modifier-key clicks
            if (
                event.ctrlKey ||
                event.shiftKey ||
                event.metaKey ||
                event.altKey
            ) {
                return;
            }


            // ========================================
            // PORTFOLIO PROJECT CARDS
            //
            // Let these links use normal browser
            // navigation. This prevents the global
            // page transition from interfering with
            // project-page navigation.
            // ========================================

            if (link.hasAttribute("data-project")) {
                return;
            }


            // INDEX ENTER PORTFOLIO HAS ITS OWN TRANSITION
            if (link.id === "enterPortfolio") {
                return;
            }


            const destination = link.href;


            // Don't animate current page
            if (destination === window.location.href) {
                return;
            }


            // Respect reduced motion
            if (
                window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches
            ) {
                return;
            }


            event.preventDefault();

            document.body.classList.add("page-leaving");

            setTimeout(() => {
                window.location.href = destination;
            }, 500);

        });

    });


    // ============================================
    // CONTACT DATE
    // ============================================

    const date = document.getElementById("contactDate");

    if (date) {

        date.textContent = new Date()
            .toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
            });

    }


    // ============================================
    // FOOTER
    // ============================================

    const footer = document.getElementById("footerCopyright");

    if (footer) {

        footer.innerHTML =
            `© ${new Date().getFullYear()} Doe Designs · Portfolio website designed & developed from concept to code by Jen Doehne`;

    }


    // ============================================
    // PROJECT SCROLL NAV
    // ============================================

    const projectPage =
        document.querySelector(".project-page");

    const navbar =
        document.querySelector(".navbar");

    const projectTitleNav =
        document.querySelector(".project-title-nav");

    if (
        projectPage &&
        navbar &&
        projectTitleNav
    ) {

        window.addEventListener("scroll", () => {

            if
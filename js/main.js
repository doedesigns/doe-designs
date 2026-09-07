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

        // Show once when page loads
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

            if (window.scrollY > 80) {

                navbar.classList.add("project-scrolled");

            } else {

                navbar.classList.remove("project-scrolled");

            }

        });

    }


    // ============================================
    // RETURN TO TOP WHEN PROJECT TITLE IS CLICKED
    // ============================================

    if (projectTitleNav) {

        projectTitleNav.addEventListener("click", () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }


    // ============================================
    // GENERIC PROJECT CARD INFORMATION
    //
    // Works for:
    // Branding
    // Design
    // Motion
    //
    // Each portfolio card only needs:
    //
    // data-project="path/to/project.html"
    //
    // The project page remains the source of truth
    // for the project title and software.
    // ============================================

    const projectInfoCache = new Map();


    function createSoftwareOverlay(card) {

        let overlay =
            card.querySelector(".software-overlay");

        // Branding cards already have an overlay.
        // Design and Motion cards will get one automatically.
        if (overlay) {
            return overlay;
        }

        overlay = document.createElement("div");

        overlay.className = "software-overlay";

        overlay.innerHTML = `
            <div class="software-overlay-content">

                <h2 class="project-name">Loading...</h2>

                <h3>SOFTWARE</h3>

                <p class="software-list loading">
                    Loading...
                </p>

            </div>
        `;

        card.appendChild(overlay);

        return overlay;

    }


    function getProjectTitle(projectDocument) {

        const title =
            projectDocument.querySelector(".project-title h1");

        if (!title) {
            return "PROJECT";
        }

        // Clone the title so we can remove the
        // "Branding Project", "Website Design Project",
        // "Motion Graphic Project", etc. span.
        const titleClone = title.cloneNode(true);

        const titleBreak =
            titleClone.querySelector(".title-break");

        if (titleBreak) {
            titleBreak.remove();
        }

        const projectName =
            titleClone.textContent
                .replace(/\s+/g, " ")
                .trim();

        return projectName || "PROJECT";

    }


    function getSoftwareList(projectDocument) {

        const detailBoxes =
            projectDocument.querySelectorAll(
                ".project-details .detail-box"
            );

        let softwareBox = null;

        detailBoxes.forEach(box => {

            const heading =
                box.querySelector("h3");

            if (
                heading &&
                heading.textContent
                    .trim()
                    .toUpperCase() === "SOFTWARE"
            ) {

                softwareBox = box;

            }

        });

        if (!softwareBox) {
            return null;
        }

        const softwareParagraphs =
            softwareBox.querySelectorAll("p");

        if (!softwareParagraphs.length) {
            return null;
        }

        /*
         * Some project pages use one <p> with <br>
         * separators. Others use multiple <p> elements.
         *
         * Combining the paragraphs here allows both
         * structures to work.
         */

        const softwareHTML =
            Array.from(softwareParagraphs)
                .map(p => p.innerHTML.trim())
                .filter(Boolean)
                .join("<br>");

        return softwareHTML || null;

    }


    async function loadProjectInfo(projectPage) {

        // Reuse information if another card has
        // already requested the same project.
        if (projectInfoCache.has(projectPage)) {
            return projectInfoCache.get(projectPage);
        }

        const controller =
            new AbortController();

        const timeout =
            setTimeout(() => {
                controller.abort();
            }, 7000);


        try {

            const response =
                await fetch(
                    projectPage,
                    {
                        signal: controller.signal,
                        cache: "no-cache"
                    }
                );

            clearTimeout(timeout);

            if (!response.ok) {
                throw new Error(
                    `Project page returned ${response.status}`
                );
            }

            const html =
                await response.text();

            const parser =
                new DOMParser();

            const projectDocument =
                parser.parseFromString(
                    html,
                    "text/html"
                );

            const projectName =
                getProjectTitle(projectDocument);

            const software =
                getSoftwareList(projectDocument);

            const projectInfo = {
                title: projectName,
                software: software
            };

            projectInfoCache.set(
                projectPage,
                projectInfo
            );

            return projectInfo;

        } catch (error) {

            clearTimeout(timeout);

            console.error(
                "Unable to load project information:",
                projectPage,
                error
            );

            throw error;

        }

    }


    function showProjectInfo(card, projectInfo) {

        const overlay =
            createSoftwareOverlay(card);

        const projectName =
            overlay.querySelector(".project-name");

        const softwareList =
            overlay.querySelector(".software-list");

        if (projectName) {

            projectName.textContent =
                projectInfo.title;

        }

        if (softwareList) {

            if (projectInfo.software) {

                softwareList.innerHTML =
                    projectInfo.software;

                softwareList.classList.remove(
                    "loading",
                    "error"
                );

            } else {

                softwareList.textContent =
                    "Software information unavailable.";

                softwareList.classList.remove(
                    "loading"
                );

                softwareList.classList.add(
                    "error"
                );

            }

        }

    }


    function showProjectInfoError(card) {

        const overlay =
            createSoftwareOverlay(card);

        const projectName =
            overlay.querySelector(".project-name");

        const softwareList =
            overlay.querySelector(".software-list");

        if (projectName) {

            // Use the card's image alt text as a
            // fallback title if the project page
            // cannot be loaded.
            const image =
                card.querySelector("img");

            projectName.textContent =
                image && image.alt
                    ? image.alt
                    : "PROJECT";

        }

        if (softwareList) {

            softwareList.textContent =
                "Software information unavailable.";

            softwareList.classList.remove(
                "loading"
            );

            softwareList.classList.add(
                "error"
            );

        }

    }


    /*
     * Find every portfolio card with a
     * data-project attribute.
     *
     * This intentionally does NOT care whether
     * the card is Branding, Design, or Motion.
     */

    const projectCards =
        document.querySelectorAll(
            "[data-project]"
        );


    projectCards.forEach(card => {

        const projectPage =
            card.dataset.project;

        if (!projectPage) {
            return;
        }

        /*
         * Create the overlay immediately.
         * This means Design and Motion don't need
         * their own overlay HTML.
         */

        createSoftwareOverlay(card);


        /*
         * Load the project information immediately
         * rather than waiting for hover.
         *
         * This means the information is ready when
         * the visitor moves onto the card.
         */

        loadProjectInfo(projectPage)
            .then(projectInfo => {

                showProjectInfo(
                    card,
                    projectInfo
                );

            })
            .catch(() => {

                showProjectInfoError(card);

            });

    });


    // ============================================
    // MOTION CARD HOVER VIDEO PREVIEWS
    // ============================================

    if (
        document.body.classList.contains("motion-page")
    ) {

        document
            .querySelectorAll(".motion-card")
            .forEach(card => {

                const video =
                    card.querySelector(".motion-video");

                if (!video) {
                    return;
                }

                card.addEventListener(
                    "mouseenter",
                    () => {

                        video.currentTime =
                            Number(
                                video.dataset.start || 0
                            );

                        video.play();

                    }
                );

                card.addEventListener(
                    "mouseleave",
                    () => {

                        video.pause();

                        video.currentTime =
                            Number(
                                video.dataset.start || 0
                            );

                    }
                );

            });

    }


    // ============================================
    // YOUTUBE MOTION CARD PREVIEW
    // ============================================

    if (
        document.body.classList.contains("motion-page")
    ) {

        const youtubePreview =
            document.querySelector(
                ".youtube-motion-preview"
            );

        if (youtubePreview) {

            let youtubePlayer = null;
            let youtubeReady = false;

            const videoId =
                youtubePreview.dataset.videoId;

            const startTime =
                Number(
                    youtubePreview.dataset.start || 0
                );


            // Load YouTube IFrame API
            const youtubeScript =
                document.createElement("script");

            youtubeScript.src =
                "https://www.youtube.com/iframe_api";

            document.head.appendChild(
                youtubeScript
            );


            // YouTube calls this automatically
            // when the API is ready
            window.onYouTubeIframeAPIReady =
                function () {

                    youtubePlayer =
                        new YT.Player(
                            youtubePreview,
                            {
                                videoId: videoId,

                                playerVars: {
                                    autoplay: 0,
                                    controls: 0,
                                    playsinline: 1,
                                    rel: 0,
                                    origin:
                                        window.location.origin
                                },

                                events: {

                                    onReady:
                                        function (event) {

                                            youtubeReady =
                                                true;

                                            event.target.mute();

                                            event.target.seekTo(
                                                startTime,
                                                true
                                            );

                                        }

                                }

                            }
                        );

                };


            const youtubeCard =
                youtubePreview.closest(
                    ".youtube-motion-card"
                );


            if (youtubeCard) {

                youtubeCard.addEventListener(
                    "mouseenter",
                    () => {

                        if (
                            !youtubeReady ||
                            !youtubePlayer
                        ) {
                            return;
                        }

                        youtubePlayer.seekTo(
                            startTime,
                            true
                        );

                        youtubePlayer.mute();

                        youtubePlayer.playVideo();

                    }
                );


                youtubeCard.addEventListener(
                    "mouseleave",
                    () => {

                        if (
                            !youtubeReady ||
                            !youtubePlayer
                        ) {
                            return;
                        }

                        youtubePlayer.pauseVideo();

                        youtubePlayer.seekTo(
                            startTime,
                            true
                        );

                    }
                );

            }

        }

    }


    // ============================================
    // MOBILE NAVIGATION
    // ============================================

    const menuToggle =
        document.querySelector(".menu-toggle");

    const navLinks =
        document.querySelector(".nav-links");


    if (menuToggle && navLinks) {

        menuToggle.addEventListener(
            "click",
            () => {

                const isOpen =
                    menuToggle.classList.toggle(
                        "active"
                    );

                navLinks.classList.toggle(
                    "mobile-open"
                );

                menuToggle.setAttribute(
                    "aria-expanded",
                    isOpen
                );

            }
        );

    }


    // ============================================
    // INDEX → PORTFOLIO TRANSITION
    // ============================================

    const enterPortfolio =
        document.getElementById(
            "enterPortfolio"
        );


    if (enterPortfolio) {

        enterPortfolio.addEventListener(
            "click",
            function(event) {

                if (
                    window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches
                ) {
                    return;
                }

                event.preventDefault();

                // Prevent the browser from restoring
                // the transition state when using Back
                document.body.classList.add(
                    "entering-portfolio"
                );

                setTimeout(() => {

                    window.location.href =
                        enterPortfolio.href;

                }, 700);

            }
        );

    }


    // ============================================
    // RESTORE HOME PAGE AFTER BROWSER BACK
    // ============================================

    window.addEventListener(
        "pageshow",
        function () {

            document.body.classList.remove(
                "entering-portfolio"
            );

            document.body.classList.remove(
                "page-leaving"
            );

        }
    );

});
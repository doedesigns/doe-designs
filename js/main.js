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
// HOME PAGE HELLO SPEECH BUBBLE
//
// Bubble appears when hovering:
// - CONTACT ME
// - the cartoon MP4
//
// It does NOT appear automatically.
// ============================================

    if (speechBubble) {

        const contactArea =
            document.querySelector(".page-contact-link");

        const homeVideo =
            document.querySelector(".home-video");


        const showHello = () => {

            if (
                window.matchMedia(
                    "(max-width: 768px)"
                ).matches
            ) {
                return;
            }

            speechBubble.classList.add("show-hello");
            speechBubble.classList.add("wave");

        };


        const hideHello = () => {

            speechBubble.classList.remove("wave");
            speechBubble.classList.remove("show-hello");

        };


        if (contactArea) {

            contactArea.addEventListener(
                "mouseenter",
                showHello
            );

            contactArea.addEventListener(
                "mouseleave",
                hideHello
            );

        }

        if (homeVideo) {

            homeVideo.addEventListener(
                "mouseenter",
                showHello
            );

            homeVideo.addEventListener(
                "mouseleave",
                hideHello
            );

        }
    }

// ============================================
// GLOBAL PAGE TRANSITIONS
// ============================================

    const pageLinks = document.querySelectorAll(
        'a[href]:not([target="_blank"]):not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"])'
    );


    pageLinks.forEach(link => {

        link.addEventListener("click", function(event) {

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
// ========================================

            if (link.hasAttribute("data-project")) {
                return;
            }


// INDEX ENTER PORTFOLIO
            if (link.id === "enterPortfolio") {
                return;
            }


            const destination = link.href;


            if (destination === window.location.href) {
                return;
            }


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

    const date =
        document.getElementById("contactDate");


    if (date) {

        date.textContent =
            new Date().toLocaleDateString(
                "en-US",
                {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }
            );
    }

// ============================================
// FOOTER
// ============================================

    const footer =
        document.getElementById("footerCopyright");


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

                navbar.classList.add(
                    "project-scrolled"
                );

            } else {

                navbar.classList.remove(
                    "project-scrolled"
                );
            }
        });
    }

// ============================================
// RETURN TO TOP
// ============================================

    if (projectTitleNav) {

        projectTitleNav.addEventListener(
            "click",
            () => {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        );
    }

// ============================================
// GENERIC PROJECT CARD INFORMATION
// ============================================

    const projectInfoCache =
        new Map();

// ============================================
// CREATE / PREPARE PROJECT OVERLAY
// ============================================

    function createSoftwareOverlay(card) {

        let overlay =
            card.querySelector(
                ".software-overlay"
            );


        if (overlay) {

            let content =
                overlay.querySelector(
                    ".software-overlay-content"
                );


            if (!content) {

                content =
                    document.createElement("div");

                content.className =
                    "software-overlay-content";

                overlay.appendChild(content);

            }


            let projectName =
                content.querySelector(
                    ".project-name"
                );


            if (!projectName) {

                projectName =
                    document.createElement("h2");

                projectName.className =
                    "project-name";

                projectName.textContent =
                    "Loading...";


                const heading =
                    content.querySelector("h3");


                if (heading) {

                    content.insertBefore(
                        projectName,
                        heading
                    );

                } else {

                    content.appendChild(
                        projectName
                    );

                }

            }

            let deliverablesList =
                content.querySelector(
                    ".software-list"
                );


            if (!deliverablesList) {

                deliverablesList =
                    document.createElement("p");

                deliverablesList.className =
                    "software-list loading";

                deliverablesList.textContent =
                    "Loading...";

                content.appendChild(
                    deliverablesList
                );

            }

            return overlay;

        }

        overlay =
            document.createElement("div");

        overlay.className =
            "software-overlay";


        overlay.innerHTML = `
            <div class="software-overlay-content">

                <h2 class="project-name">
                    Loading...
                </h2>

                <h3>
                    DELIVERABLES
                </h3>

                <p class="software-list loading">
                    Loading...
                </p>

            </div>
        `;

        card.appendChild(overlay);

        return overlay;

    }

// ============================================
// GET PROJECT TITLE
// ============================================

    function getProjectTitle(projectDocument) {

        const title =
            projectDocument.querySelector(
                ".project-title h1"
            );


        if (!title) {
            return "PROJECT";
        }


        const titleClone =
            title.cloneNode(true);


        const titleBreak =
            titleClone.querySelector(
                ".title-break"
            );


        if (titleBreak) {
            titleBreak.remove();
        }

        const projectName =
            titleClone.textContent
                .replace(/\s+/g, " ")
                .trim();


        return projectName || "PROJECT";

    }

// ============================================
// GET DELIVERABLES LIST
// ============================================

    function getDeliverablesList(projectDocument) {

        const detailBoxes =
            projectDocument.querySelectorAll(
                ".project-details .detail-box"
            );

        let deliverablesBox = null;

        detailBoxes.forEach(box => {

            const heading =
                box.querySelector("h3");

            if (
                heading &&
                heading.textContent
                    .trim()
                    .toUpperCase() === "DELIVERABLES"
            ) {
                deliverablesBox = box;
            }

        });

        if (!deliverablesBox) {
            return null;
        }

        const deliverablesParagraphs =
            deliverablesBox.querySelectorAll("p");

        if (!deliverablesParagraphs.length) {
            return null;
        }

        const deliverablesHTML =
            Array.from(deliverablesParagraphs)
                .map(p => p.innerHTML.trim())
                .filter(Boolean)
                .join("<br>");

        return deliverablesHTML || null;
    }

// ============================================
// LOAD PROJECT INFORMATION
// ============================================

    async function loadProjectInfo(projectURL) {

        if (projectInfoCache.has(projectURL)) {
            return projectInfoCache.get(projectURL);
        }

        const controller =
            new AbortController();

        const timeout =
            setTimeout(() => {
                controller.abort();
            }, 7000);

        try {

            const resolvedURL =
                new URL(
                    projectURL,
                    document.baseURI
                ).href;

            const response =
                await fetch(
                    resolvedURL,
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
                getProjectTitle(
                    projectDocument
                );

            const deliverables =
                getDeliverablesList(
                    projectDocument
                );

            const projectInfo = {
                title: projectName,
                deliverables: deliverables
            };

            projectInfoCache.set(
                projectURL,
                projectInfo
            );

            return projectInfo;

        } catch (error) {

            clearTimeout(timeout);

            console.error(
                "Unable to load project information:",
                projectURL,
                error
            );

            throw error;
        }
    }

// ============================================
// SHOW PROJECT INFORMATION
// ============================================

    function showProjectInfo(
        card,
        projectInfo
    ) {

        const overlay =
            createSoftwareOverlay(card);


        const projectName =
            overlay.querySelector(
                ".project-name"
            );


        const deliverablesList =
            overlay.querySelector(
                ".software-list"
            );


        if (projectName) {

            projectName.textContent =
                projectInfo.title;

        }

        if (deliverablesList) {

            if (projectInfo.deliverables) {

                deliverablesList.innerHTML =
                    projectInfo.deliverables;

                deliverablesList.classList.remove(
                    "loading",
                    "error"
                );

            } else {

                deliverablesList.textContent =
                    "Deliverables information unavailable.";

                deliverablesList.classList.remove(
                    "loading"
                );

                deliverablesList.classList.add(
                    "error"
                );

            }
        }
    }

// ============================================
// PROJECT INFORMATION ERROR
// ============================================

    function showProjectInfoError(card) {

        const overlay =
            createSoftwareOverlay(card);


        const projectName =
            overlay.querySelector(
                ".project-name"
            );

        const deliverablesList =
            overlay.querySelector(
                ".software-list"
            );


        if (projectName) {

            const image =
                card.querySelector("img");

            projectName.textContent =
                image && image.alt
                    ? image.alt
                    : "PROJECT";

        }

        if (deliverablesList) {

            deliverablesList.textContent =
                "Deliverables information unavailable.";

            deliverablesList.classList.remove(
                "loading"
            );

            deliverablesList.classList.add(
                "error"
            );

        }
    }

// ============================================
// FIND PROJECT CARDS
// ============================================

    const projectCards =
        document.querySelectorAll(
            "[data-project]"
        );


    projectCards.forEach(card => {

        const projectURL =
            card.dataset.project;


        if (!projectURL) {
            return;
        }

        createSoftwareOverlay(card);


        loadProjectInfo(projectURL)
            .then(
                projectInfo => {

                    showProjectInfo(
                        card,
                        projectInfo
                    );

                }
            )
            .catch(
                () => {

                    showProjectInfoError(
                        card
                    );

                }
            );
    });

// ============================================
// MOTION CARD HOVER VIDEO PREVIEWS
// ============================================

    const motionCards =
        document.querySelectorAll(
            ".motion-card, .motion-home-card"
        );


    motionCards.forEach(card => {

        const video =
            card.querySelector(
                ".motion-video, .home-motion-video"
            );


        const fallback =
            card.querySelector(
                ".motion-still, .home-motion-fallback"
            );


        if (!video) {
            return;
        }

        card.addEventListener(
            "mouseenter",
            () => {

                if (
                    fallback
                ) {

                    fallback.style.opacity =
                        "0";
                }

                video.style.opacity =
                    "1";

                const startTime =
                    Number(
                        video.dataset.start || 0
                    );

                try {

                    video.currentTime =
                        startTime;

                } catch (error) {
                }

                const playPromise =
                    video.play();


                if (
                    playPromise &&
                    typeof playPromise.catch ===
                        "function"
                ) {

                    playPromise.catch(
                        error => {

                            console.warn(
                                "Motion preview could not play:",
                                error
                            );

                        }
                    );

                }

            }
        );

        card.addEventListener(
            "mouseleave",
            () => {

                video.pause();

                const startTime =
                    Number(
                        video.dataset.start || 0
                    );


                try {

                    video.currentTime =
                        startTime;

                } catch (error) {
                }

                video.style.opacity =
                    "0";

                if (
                    fallback
                ) {

                    fallback.style.opacity =
                        "1";

                }
            }
        );

    });

// ============================================
// YOUTUBE MOTION PREVIEWS
//
// Works on the Motion page and homepage.
// ============================================

    const youtubeCards =
        document.querySelectorAll(
            ".youtube-motion-card, .motion-home-card[data-video-id]"
        );


    if (youtubeCards.length) {

        const youtubeScript =
            document.createElement("script");


        youtubeScript.src =
            "https://www.youtube.com/iframe_api";


        document.head.appendChild(
            youtubeScript
        );


        const youtubePlayers =
            new Map();


        let youtubeAPIReady =
            false;


        window.onYouTubeIframeAPIReady =
            function () {

                youtubeAPIReady =
                    true;


                youtubeCards.forEach(
                    card => {

                        let preview =
                            card.querySelector(
                                ".youtube-motion-preview"
                            );

                        if (!preview) {

                            const previewImage =
                                card.querySelector(
                                    ".home-motion-fallback"
                                );


                            if (!previewImage) {
                                return;
                            }


                            preview =
                                document.createElement(
                                    "div"
                                );


                            preview.className =
                                "youtube-motion-preview";


                            preview.dataset.videoId =
                                card.dataset.videoId;


                            preview.dataset.start =
                                card.dataset.start || 0;


                            const parent =
                                previewImage.parentElement;


                            parent.appendChild(
                                preview
                            );

                        }

                        const videoId =
                            preview.dataset.videoId ||
                            card.dataset.videoId;


                        const startTime =
                            Number(
                                preview.dataset.start ||
                                card.dataset.start ||
                                0
                            );


                        if (!videoId) {
                            return;
                        }


                        const player =
                            new YT.Player(
                                preview,
                                {
                                    videoId:
                                        videoId,

                                    playerVars: {
                                        autoplay: 0,
                                        controls: 0,
                                        playsinline: 1,
                                        rel: 0,
                                        modestbranding: 1,
                                        origin:
                                            window.location.origin
                                    },

                                    events: {

                                        onReady:
                                            function(event) {

                                                event.target.mute();

                                                event.target.seekTo(
                                                    startTime,
                                                    true
                                                );

                                            }
                                    }

                                }
                            );

                        youtubePlayers.set(
                            card,
                            {
                                player:
                                    player,
                                start:
                                    startTime
                            }
                        );

                        card.addEventListener(
                            "mouseenter",
                            () => {

                                const playerData =
                                    youtubePlayers.get(
                                        card
                                    );


                                if (
                                    !playerData
                                ) {
                                    return;
                                }


                                playerData.player.mute();


                                playerData.player.seekTo(
                                    playerData.start,
                                    true
                                );


                                playerData.player.playVideo();

                            }
                        );


                        card.addEventListener(
                            "mouseleave",
                            () => {

                                const playerData =
                                    youtubePlayers.get(
                                        card
                                    );


                                if (
                                    !playerData
                                ) {
                                    return;
                                }

                                playerData.player.pauseVideo();


                                playerData.player.seekTo(
                                    playerData.start,
                                    true
                                );

                            }
                        );

                    }
                );

            };

        if (
            window.YT &&
            window.YT.Player
        ) {

            window.onYouTubeIframeAPIReady();

        }
    }

// ============================================
// MOBILE NAVIGATION
// ============================================

    const menuToggle =
        document.querySelector(
            ".menu-toggle"
        );

    const navLinks =
        document.querySelector(
            ".nav-links"
        );

    if (
        menuToggle &&
        navLinks
    ) {

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

    const portfolioButton =
        document.getElementById(
            "enterPortfolio"
        );


    if (portfolioButton) {

        portfolioButton.addEventListener(
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

                document.body.classList.add(
                    "entering-portfolio"
                );

                setTimeout(() => {

                    window.location.href =
                        portfolioButton.href;

                }, 700);
            }
        );
    }

// ============================================
// RESTORE HOME PAGE AFTER BROWSER BACK
// ============================================

    window.addEventListener(
        "pageshow",
        function() {

            document.body.classList.remove(
                "entering-portfolio"
            );

            document.body.classList.remove(
                "page-leaving"
            );

        }
    );

});
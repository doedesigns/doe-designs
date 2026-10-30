document.addEventListener("DOMContentLoaded", () => {
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const enterButton = document.getElementById("enterPortfolio");

// ============================================
// REDUCED MOTION
// ============================================

    if (prefersReducedMotion) {
        document.body.classList.add("reduce-motion");
    }

// ============================================
// HOME PAGE SPEECH BUBBLE
// ============================================

    const speechBubble = document.querySelector(".speech-bubble");

    if (speechBubble) {
        const contactArea = document.querySelector(".page-contact-link");
        const homeVideo = document.querySelector(".home-video");

        function showHello() {
            if (window.matchMedia("(max-width: 768px)").matches) return;

            speechBubble.classList.add("show-hello", "wave");
        }

        function hideHello() {
            speechBubble.classList.remove("show-hello", "wave");
        }

        [contactArea, homeVideo].forEach(element => {
            if (!element) return;

            element.addEventListener("mouseenter", showHello);
            element.addEventListener("mouseleave", hideHello);
        });
    }

// ============================================
// GLOBAL PAGE TRANSITIONS
// ============================================

    const pageLinks = document.querySelectorAll(
        'a[href]:not([target="_blank"]):not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"])'
    );

    pageLinks.forEach(link => {
        link.addEventListener("click", event => {
            if (
                event.ctrlKey ||
                event.shiftKey ||
                event.metaKey ||
                event.altKey
            ) {
                return;
            }

            if (
                link.hasAttribute("data-project") ||
                link.id === "enterPortfolio"
            ) {
                return;
            }

            const destination = link.href;

            if (
                destination === window.location.href ||
                prefersReducedMotion
            ) {
                return;
            }

            event.preventDefault();
            document.body.classList.add("page-leaving");

            window.setTimeout(() => {
                window.location.href = destination;
            }, 500);
        });
    });

// ============================================
// CONTACT DATE
// ============================================

    const contactDate = document.getElementById("contactDate");

    if (contactDate) {
        contactDate.textContent = new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    }

// ============================================
// FOOTER COPYRIGHT
// ============================================

    const footer = document.getElementById("footerCopyright");

    if (footer) {
        footer.textContent =
            `© ${new Date().getFullYear()} Doe Designs · Portfolio website designed & developed from concept to code by Jen Doehne`;
    }

// ============================================
// PROJECT CARD INFORMATION
// ============================================

    const projectInfoCache = new Map();

// Category cards show project titles outside their overlays.
// Their overlays are reserved for deliverables information.

    function isCategoryCardWithoutOverlayTitle(card) {
        return (
            card.classList.contains("design-card") ||
            card.classList.contains("branding-card") ||
            card.classList.contains("motion-card") ||
            card.classList.contains("motion-home-card")
        );
    }

// ============================================
// MOTION PROJECT TITLES
// Place titles beneath the image, not in the overlay.
// ============================================

    function updateMotionCardTitle(card, titleText) {
        const isMotionCard =
            card.classList.contains("motion-card") ||
            card.classList.contains("motion-home-card");

        if (!isMotionCard) return;

        let title = card.querySelector(".portfolio-card-title");

        if (!title) {
            title = document.createElement("h2");
            title.className = "portfolio-card-title";

            const preview = card.querySelector(
                ".motion-preview, .home-motion-fallback, .home-motion-preview"
            );

            if (preview) {
                preview.insertAdjacentElement("afterend", title);
            } else {
                card.appendChild(title);
            }
        }

        title.textContent = titleText;
    }

// ============================================
// CREATE / PREPARE PROJECT OVERLAY
// ============================================
 
	function createSoftwareOverlay(card) {
		const isMotionCard =
			card.classList.contains("motion-card") ||
			card.classList.contains("motion-home-card");

		const preview = isMotionCard
			? card.querySelector(".motion-preview, .home-motion-preview")
			: null;

		const overlayParent = preview || card;

		let overlay = card.querySelector(".software-overlay");

		if (!overlay) {
			overlay = document.createElement("div");
			overlay.className = "software-overlay";
			overlayParent.appendChild(overlay);
		} else if (isMotionCard && preview && !preview.contains(overlay)) {
			preview.appendChild(overlay);
		}

		let content = overlay.querySelector(".software-overlay-content");

		if (!content) {
			content = document.createElement("div");
			content.className = "software-overlay-content";
			overlay.appendChild(content);
		}

		let projectName = content.querySelector(".project-name");

		if (isCategoryCardWithoutOverlayTitle(card)) {
			projectName?.remove();
		} else if (!projectName) {
			projectName = document.createElement("h2");
			projectName.className = "project-name";
			projectName.textContent = "Loading...";

			const heading = content.querySelector("h3");

			if (heading) {
				content.insertBefore(projectName, heading);
			} else {
				content.appendChild(projectName);
			}
		}

		let heading = content.querySelector("h3");

		if (!heading) {
			heading = document.createElement("h3");
			heading.textContent = "DELIVERABLES";
			content.appendChild(heading);
		}

		let deliverablesList = content.querySelector(".software-list");

		if (!deliverablesList) {
			deliverablesList = document.createElement("p");
			deliverablesList.className = "software-list loading";
			deliverablesList.textContent = "Loading...";
			content.appendChild(deliverablesList);
		}

		return overlay;
	}

// ============================================
// GET PROJECT TITLE
// ============================================

    function getProjectTitle(projectDocument) {
        const title = projectDocument.querySelector(".project-title h1");

        if (!title) return "PROJECT";

        const titleClone = title.cloneNode(true);
        titleClone.querySelector(".title-break")?.remove();

        return (
            titleClone.textContent.replace(/\s+/g, " ").trim() ||
            "PROJECT"
        );
    }

// ============================================
// GET DELIVERABLES LIST
// ============================================

    function getDeliverablesList(projectDocument) {
        const detailBoxes = projectDocument.querySelectorAll(
            ".project-details .detail-box"
        );

        const deliverablesBox = Array.from(detailBoxes).find(box => {
            const heading = box.querySelector("h3");

            return (
                heading &&
                heading.textContent.trim().toUpperCase() === "DELIVERABLES"
            );
        });

        if (!deliverablesBox) return null;

        const paragraphs = Array.from(
            deliverablesBox.querySelectorAll("p")
        );

        const deliverablesHTML = paragraphs
            .map(paragraph => paragraph.innerHTML.trim())
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

        const controller = new AbortController();
        const timeout = window.setTimeout(
            () => controller.abort(),
            7000
        );

        try {
            const resolvedURL = new URL(
                projectURL,
                document.baseURI
            ).href;

            const response = await fetch(resolvedURL, {
                signal: controller.signal,
                cache: "no-cache"
            });

            if (!response.ok) {
                throw new Error(
                    `Project page returned ${response.status}`
                );
            }

            const html = await response.text();

            const projectDocument = new DOMParser().parseFromString(
                html,
                "text/html"
            );

            const projectInfo = {
                title: getProjectTitle(projectDocument),
                deliverables: getDeliverablesList(projectDocument)
            };

            projectInfoCache.set(projectURL, projectInfo);

            return projectInfo;
        } catch (error) {
            console.error(
                "Unable to load project information:",
                projectURL,
                error
            );

            throw error;
        } finally {
            window.clearTimeout(timeout);
        }
    }

// ============================================
// UPDATE PROJECT OVERLAY AND CARD TITLE
// ============================================

    function updateProjectOverlay(card, projectInfo) {
        const overlay = createSoftwareOverlay(card);
		updateMotionCardTitle(card, projectInfo.title);
        const projectName = overlay.querySelector(".project-name");
        const deliverablesList = overlay.querySelector(".software-list");

        // Keep the title in the overlay only on cards that need it.
        if (projectName) {
            projectName.textContent = projectInfo.title;
        }

        // Motion titles appear underneath their images.
        updateMotionCardTitle(card, projectInfo.title);

        // Keep deliverables inside the existing overlay.
        if (!deliverablesList) return;

        if (projectInfo.deliverables) {
            deliverablesList.innerHTML = projectInfo.deliverables;
            deliverablesList.classList.remove("loading", "error");
        } else {
            deliverablesList.textContent =
                "Deliverables information unavailable.";

            deliverablesList.classList.remove("loading");
            deliverablesList.classList.add("error");
        }
    }

// ============================================
// PROJECT INFORMATION ERROR
// ============================================

    function showProjectInfoError(card) {
        const overlay = createSoftwareOverlay(card);
        const projectName = overlay.querySelector(".project-name");
        const deliverablesList = overlay.querySelector(".software-list");

        const image = card.querySelector("img");
        const fallbackTitle =
            image?.alt?.trim() || "PROJECT";

        if (projectName) {
            projectName.textContent = fallbackTitle;
        }

        // Still show a title beneath a Motion card if loading fails.
        updateMotionCardTitle(card, fallbackTitle);

        if (deliverablesList) {
            deliverablesList.textContent =
                "Deliverables information unavailable.";

            deliverablesList.classList.remove("loading");
            deliverablesList.classList.add("error");
        }
    }

// ============================================
// FIND PROJECT CARDS
// ============================================

    document.querySelectorAll("[data-project]").forEach(card => {
        const projectURL = card.dataset.project;

        if (!projectURL) return;

        createSoftwareOverlay(card);

        loadProjectInfo(projectURL)
            .then(projectInfo => updateProjectOverlay(card, projectInfo))
            .catch(() => showProjectInfoError(card));
    });

// ============================================
// MOTION CARD HOVER VIDEO PREVIEWS
// Preserved
// ============================================

    document.querySelectorAll(
        ".motion-card, .motion-home-card"
    ).forEach(card => {
        const video = card.querySelector(
            ".motion-video, .home-motion-video"
        );

        const fallback = card.querySelector(
            ".motion-still, .home-motion-fallback"
        );

        if (!video) return;

        card.addEventListener("mouseenter", () => {
            if (fallback) fallback.style.opacity = "0";

            video.style.opacity = "1";

            try {
                video.currentTime = Number(video.dataset.start || 0);
            } catch (error) {
                // Keep the preview working if seeking is unavailable.
            }

            const playPromise = video.play();

            if (playPromise?.catch) {
                playPromise.catch(error => {
                    console.warn(
                        "Motion preview could not play:",
                        error
                    );
                });
            }
        });

        card.addEventListener("mouseleave", () => {
            video.pause();

            try {
                video.currentTime = Number(video.dataset.start || 0);
            } catch (error) {
                // Keep the preview working if seeking is unavailable.
            }

            video.style.opacity = "0";

            if (fallback) fallback.style.opacity = "1";
        });
    });

// ============================================
// YOUTUBE MOTION PREVIEWS
// Preserved
// ============================================

    const youtubeCards = document.querySelectorAll(
        ".youtube-motion-card, .motion-home-card[data-video-id]"
    );

    if (youtubeCards.length) {
        const youtubePlayers = new Map();
        const youtubeScript = document.createElement("script");

        youtubeScript.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(youtubeScript);

        window.onYouTubeIframeAPIReady = function() {
            youtubeCards.forEach(card => {
                let preview = card.querySelector(
                    ".youtube-motion-preview"
                );

                if (!preview) {
                    const fallback = card.querySelector(
                        ".home-motion-fallback"
                    );

                    if (!fallback) return;

                    preview = document.createElement("div");
                    preview.className = "youtube-motion-preview";
                    preview.dataset.videoId = card.dataset.videoId;
                    preview.dataset.start = card.dataset.start || 0;

                    fallback.parentElement.appendChild(preview);
                }

                const videoId =
                    preview.dataset.videoId || card.dataset.videoId;

                const startTime = Number(
                    preview.dataset.start || card.dataset.start || 0
                );

                if (!videoId) return;

                const player = new YT.Player(preview, {
                    videoId,
                    playerVars: {
                        autoplay: 0,
                        controls: 0,
                        playsinline: 1,
                        rel: 0,
                        modestbranding: 1,
                        origin: window.location.origin
                    },
                    events: {
                        onReady(event) {
                            event.target.mute();
                            event.target.seekTo(startTime, true);
                        }
                    }
                });

                youtubePlayers.set(card, {
                    player,
                    start: startTime
                });

                card.addEventListener("mouseenter", () => {
                    const playerData = youtubePlayers.get(card);

                    if (!playerData) return;

                    playerData.player.mute();
                    playerData.player.seekTo(playerData.start, true);
                    playerData.player.playVideo();
                });

                card.addEventListener("mouseleave", () => {
                    const playerData = youtubePlayers.get(card);

                    if (!playerData) return;

                    playerData.player.pauseVideo();
                    playerData.player.seekTo(playerData.start, true);
                });
            });
        };

        if (window.YT?.Player) {
            window.onYouTubeIframeAPIReady();
        }
    }

// ============================================
// MOBILE NAVIGATION
// ============================================

    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            const isOpen = menuToggle.classList.toggle("active");

            navLinks.classList.toggle("mobile-open", isOpen);
            menuToggle.setAttribute("aria-expanded", String(isOpen));
        });
    }

// ============================================
// HOME PAGE → PORTFOLIO TRANSITION
// ============================================

    if (enterButton) {
        enterButton.addEventListener("click", event => {
            if (prefersReducedMotion) return;

            event.preventDefault();
            document.body.classList.add("entering-portfolio");

            window.setTimeout(() => {
                window.location.href = enterButton.href;
            }, 700);
        });
    }

// ============================================
// CHRONO — UX APPROACH ANIMATION
// ============================================

    const uxSection = document.querySelector("body.chrono-page .ux-section");
    const uxTrigger = uxSection?.querySelector(".ux-list .ux-item:nth-child(5)");

    if (
        uxSection &&
        uxTrigger &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
        const uxObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    uxSection.classList.toggle("ux-visible", entry.isIntersecting);
                });
            },
            {
                threshold: 0,
                rootMargin: "0px 0px -5% 0px"
            }
        );

        uxObserver.observe(uxTrigger);
    }


// ============================================
// RESTORE PAGE AFTER BROWSER BACK
// ============================================

    window.addEventListener("pageshow", () => {
        document.body.classList.remove(
            "entering-portfolio",
            "page-leaving"
        );
    });

});
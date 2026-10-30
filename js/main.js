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
    const uxTrigger = uxSection?.querySelector(".ux-animation-trigger");

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
                rootMargin: "0px 0px -8% 0px"
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

// ============================================
// MY DEETS — CATEGORY CARD STACK ANIMATION
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    const grid = document.querySelector(
        "body.deets-page #deets-categories .deets-category-grid"
    );

    if (!grid) return;

    const cards = Array.from(
        grid.querySelectorAll(".deets-category-item")
    );

    if (cards.length !== 6) return;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    if (reducedMotion.matches) return;

    let settleTimer = null;
    let isDealt = false;

    // Calculate the starting position for each card.
    function positionStack() {

        const wasReady = grid.classList.contains("is-ready");

        // Temporarily show the original grid positions
        // so measurements are accurate.
        if (wasReady && !isDealt) {
            grid.classList.remove("is-ready");
        }

        const gridRect = grid.getBoundingClientRect();

        const gridCenterX = gridRect.left + gridRect.width / 2;
        const gridCenterY = gridRect.top + gridRect.height / 2;

        cards.forEach((card, index) => {

            const cardRect = card.getBoundingClientRect();

            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;

            const moveX = gridCenterX - cardCenterX;
            const moveY = gridCenterY - cardCenterY;

            card.style.setProperty("--stack-x", `${moveX}px`);
            card.style.setProperty("--stack-y", `${moveY}px`);
            card.style.setProperty("--deal-index", index);

            card.style.zIndex = index + 1;

        });

        if (wasReady && !isDealt) {
            grid.classList.add("is-ready");
        }
    }

    // Establish the initial stack.
    positionStack();
    grid.classList.add("is-ready");

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {

            const observer = new IntersectionObserver(
                (entries) => {

                    entries.forEach((entry) => {

                        // Play the animation when the section enters view.
                        if (entry.isIntersecting && !isDealt) {

                            isDealt = true;

                            grid.classList.add("is-dealt");

                            clearTimeout(settleTimer);

                            // Start the synchronized settling motion
                            // after all six cards have landed.
                            settleTimer = setTimeout(() => {
                                grid.classList.add("is-settled");
                            }, 2900);

                        }

                        // Reset when the section leaves view.
                        else if (!entry.isIntersecting && isDealt) {

                            isDealt = false;

                            clearTimeout(settleTimer);

                            grid.classList.remove(
                                "is-settled",
                                "is-dealt"
                            );

                        }

                    });
                },
                {
                    threshold: 0.25
                }
            );

            observer.observe(grid);

        });
    });

    // Recalculate card positions if the window changes size.
    window.addEventListener("resize", () => {

        if (!isDealt) {
            positionStack();
        }

    });
});

/* ============================================
   MY DEETS — FULL-WIDTH GROWTH ARROWS
============================================ */

document.addEventListener("DOMContentLoaded", () => {

    const tracks = document.querySelectorAll(
        "body.deets-page [data-deets-growth-track]"
    );

    if (!tracks.length) return;

    const ARROW_SPEED = 220; // Pixels per second
    const OFFSCREEN = 80;
    const TRACK_Y = 56;

    const originalPoints = [
        [8, 56],
        [52, 20],
        [91, 48],
        [137, 12],
        [176, 44],
        [225, 8],
        [265, 34],
        [310, 6]
    ];

    tracks.forEach(track => {

        const svgs = Array.from(
            track.querySelectorAll(".deets-growth-svg")
        );

        if (svgs.length < 2) return;

        let visible = false;
        let running = false;
        let animationFrame = null;
        let generation = 0;

        function getDimensions() {

            const width = document.documentElement.clientWidth;

            let zigStart;
            let endX;

            if (track.dataset.anchor === "image") {

                const image = track.closest(".deets-life-section")
                    ?.querySelector(".deets-life-illustration img");

                if (image) {

                    const rect = image.getBoundingClientRect();

                    // Preserve the original 310px zigzag.
                    // Start it well before the image.
                    zigStart = rect.left - 350;

                    // Finish underneath the image, with the
                    // arrowhead still visible in the viewport.
                    endX = Math.min(rect.right, width - 24);

                } else {

                    zigStart = width * 0.35;
                    endX = width - 24;
                }

            } else {

                // Keep the introductory zigzag centered.
                zigStart = (width - 310) / 2;
                endX = width + OFFSCREEN;
            }

            const points = originalPoints.map(([x, y]) => [
                zigStart + x,
                y
            ]);

            return {
                width,
                points,
                zigStart,
                endX
            };
        }

        function buildPath(dimensions) {

            let d = `M ${-OFFSCREEN} ${TRACK_Y}`;
            d += ` L ${dimensions.zigStart} ${TRACK_Y}`;

            dimensions.points.forEach(([x, y]) => {
                d += ` L ${x} ${y}`;
            });

            d += ` L ${dimensions.endX} ${TRACK_Y}`;

            return d;
        }

        function positionHead(head, path, distance) {

            const point = path.getPointAtLength(distance);

            const previous = path.getPointAtLength(
                Math.max(0, distance - 12)
            );

            const angle = Math.atan2(
                point.y - previous.y,
                point.x - previous.x
            );

            const size = 15;
            const spread = 0.55;

            const leftX = point.x - size * Math.cos(angle - spread);
            const leftY = point.y - size * Math.sin(angle - spread);

            const rightX = point.x - size * Math.cos(angle + spread);
            const rightY = point.y - size * Math.sin(angle + spread);

            // Draw two separate angled strokes meeting at the tip.
            head.setAttribute(
                "d",
                `M ${leftX} ${leftY} L ${point.x} ${point.y} M ${rightX} ${rightY} L ${point.x} ${point.y}`
            );

            head.style.opacity = "1";
        }

        function prepareArrow(svg, dimensions) {

            const path = svg.querySelector(".deets-growth-path");
            const head = svg.querySelector(".deets-growth-head");

            if (!path || !head) return null;

            svg.setAttribute(
                "viewBox",
                `0 0 ${dimensions.width} 70`
            );

            svg.setAttribute("preserveAspectRatio", "none");

            path.setAttribute("d", buildPath(dimensions));

            const length = path.getTotalLength();

            path.style.strokeDasharray = `${length} ${length}`;
            path.style.strokeDashoffset = length;

            head.style.strokeDasharray = "none";
            head.style.strokeDashoffset = "0";
            head.style.fill = "none";
            head.style.opacity = "0";

            return {
                path,
                head,
                length
            };
        }

        function resetArrow(svg, dimensions) {

            const arrow = prepareArrow(svg, dimensions);

            if (!arrow) return;

            arrow.path.style.strokeDashoffset = arrow.length;
            arrow.head.style.opacity = "0";
        }

        function animateArrow(svg, dimensions, token) {

            return new Promise(resolve => {

                const arrow = prepareArrow(svg, dimensions);

                if (!arrow) {
                    resolve(false);
                    return;
                }

                const duration =
                    (arrow.length / ARROW_SPEED) * 1000;

                const startTime = performance.now();

                function drawFrame(now) {

                    if (!visible || token !== generation) {
                        resolve(false);
                        return;
                    }

                    const progress = Math.min(
                        (now - startTime) / duration,
                        1
                    );

                    const distance = arrow.length * progress;

                    arrow.path.style.strokeDashoffset =
                        arrow.length - distance;

                    if (progress > 0) {
                        positionHead(
                            arrow.head,
                            arrow.path,
                            distance
                        );
                    }

                    if (progress < 1) {

                        animationFrame =
                            requestAnimationFrame(drawFrame);

                    } else {

                        arrow.path.style.strokeDashoffset = "0";

                        positionHead(
                            arrow.head,
                            arrow.path,
                            arrow.length
                        );

                        resolve(true);
                    }
                }

                animationFrame =
                    requestAnimationFrame(drawFrame);
            });
        }

        async function runArrows() {

            if (running || !visible) return;

            running = true;

            const token = ++generation;

            const dimensions = getDimensions();

            svgs.forEach(svg => {
                resetArrow(svg, dimensions);
            });

            // Run each arrow to completion before starting the next.
            // This keeps them from overlapping.
            while (visible && token === generation) {

                for (const svg of svgs) {

                    if (!visible || token !== generation) break;

                    const currentDimensions = getDimensions();

                    const completed = await animateArrow(
                        svg,
                        currentDimensions,
                        token
                    );

                    if (!completed) break;
                }
            }

            running = false;
        }

        function stopArrows() {

            visible = false;
            generation++;

            if (animationFrame !== null) {
                cancelAnimationFrame(animationFrame);
                animationFrame = null;
            }

            const dimensions = getDimensions();

            svgs.forEach(svg => {
                resetArrow(svg, dimensions);
            });

            running = false;
        }

        const observer = new IntersectionObserver(entries => {

            visible = entries[0].isIntersecting;

            if (visible) {
                runArrows();
            } else {
                stopArrows();
            }

        }, {
            threshold: 0.05
        });

        const initialDimensions = getDimensions();

        svgs.forEach(svg => {
            resetArrow(svg, initialDimensions);
        });

        observer.observe(track);

        window.addEventListener("resize", () => {

            if (!running) {

                const dimensions = getDimensions();

                svgs.forEach(svg => {
                    resetArrow(svg, dimensions);
                });

                if (visible) {
                    runArrows();
                }
            }
        });

    });

});

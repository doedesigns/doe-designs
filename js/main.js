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

// ============================================
// MY DEETS — FULL-WIDTH GROWTH ARROW
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    const tracks = document.querySelectorAll(
        "body.deets-page [data-deets-growth-track]"
    );

    if (!tracks.length) return;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    const SPEED = 500;       // Straight-line speed in pixels/second
    const ZIGZAG_TIME = 2.2; // Time to trace the original zigzag
    const PAUSE_TIME = 1.5;  // Pause at the end

    const OFFSCREEN = 100;

    // Original My Deets zigzag coordinates.
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

    function makeGeometry(track) {

        const width = window.innerWidth;

        let anchorLeft;
        let anchorWidth;

        if (track.dataset.anchor === "image") {

            const image = track.closest(".deets-life-section")
                ?.querySelector(".deets-life-illustration img");

            if (!image) return null;

            const rect = image.getBoundingClientRect();

            anchorLeft = rect.left;
            anchorWidth = rect.width;

        } else {

            anchorWidth = Math.min(320, width);
            anchorLeft = (width - anchorWidth) / 2;

        }

        const zigWidth = Math.min(320, anchorWidth);
        const scale = zigWidth / 320;

        // Center the original zigzag beneath its anchor.
        const zigLeft =
            anchorLeft + (anchorWidth - zigWidth) / 2;

        const points = originalPoints.map(([x, y]) => [
            zigLeft + x * scale,
            y
        ]);

        const firstPoint = points[0];
        const lastPoint = points[points.length - 1];

        // Calculate the length of the original zigzag.
        let zigLength = 0;

        for (let i = 1; i < points.length; i++) {

            const dx = points[i][0] - points[i - 1][0];
            const dy = points[i][1] - points[i - 1][1];

            zigLength += Math.hypot(dx, dy);
        }

        const entryLength = firstPoint[0] + OFFSCREEN;

        const exitLength =
            width + OFFSCREEN - lastPoint[0];

        const pathData = [
            `M ${-OFFSCREEN} 56`,
            `L ${firstPoint[0]} ${firstPoint[1]}`,

            ...points.slice(1).map(point =>
                `L ${point[0]} ${point[1]}`
            ),

            `L ${width + OFFSCREEN} ${lastPoint[1]}`
        ].join(" ");

        return {
            width,
            pathData,
            entryLength,
            zigLength,
            exitLength
        };
    }

    function prepareArrow(svg, geometry) {

        const path = svg.querySelector(".deets-growth-path");
        const head = svg.querySelector(".deets-growth-head");

        svg.setAttribute(
            "viewBox",
            `0 0 ${geometry.width} 70`
        );

        path.setAttribute("d", geometry.pathData);

        const totalLength = path.getTotalLength();

        path.style.strokeDasharray =
            `${totalLength} ${totalLength}`;

        path.style.strokeDashoffset = totalLength;

        head.style.opacity = "0";

        return {
            svg,
            path,
            head,
            totalLength,
            geometry
        };
    }

    function drawArrow(arrow, phase, timing) {

        const {
            svg,
            path,
            head,
            totalLength,
            geometry
        } = arrow;

        svg.style.opacity = "0";

        if (phase < 0 || phase >= timing.activeTime) {
            return;
        }

        svg.style.opacity = "1";

        const {
            entryLength,
            zigLength,
            exitLength
        } = geometry;

        let drawnLength = 0;

        // STAGE 1: Travel straight in from the left.
        if (phase < timing.entryTime) {

            drawnLength =
                entryLength * (phase / timing.entryTime);

        }

        // STAGE 2: Trace the original zigzag.
        else if (
            phase < timing.entryTime + ZIGZAG_TIME
        ) {

            const progress =
                (phase - timing.entryTime) / ZIGZAG_TIME;

            drawnLength =
                entryLength + zigLength * progress;

        }

        // STAGE 3: Pause at the end of the zigzag.
        else if (
            phase <
            timing.entryTime + ZIGZAG_TIME + PAUSE_TIME
        ) {

            drawnLength = entryLength + zigLength;

        }

        // STAGE 4: Continue straight off the right side.
        else {

            const exitProgress =
                (phase -
                    timing.entryTime -
                    ZIGZAG_TIME -
                    PAUSE_TIME) / timing.exitTime;

            drawnLength =
                entryLength +
                zigLength +
                exitLength * exitProgress;

        }

        drawnLength = Math.min(
            totalLength,
            Math.max(0, drawnLength)
        );

        path.style.strokeDashoffset =
            totalLength - drawnLength;

        // Move the arrowhead to the current drawing tip.
        const point = path.getPointAtLength(drawnLength);

        const before = path.getPointAtLength(
            Math.max(0, drawnLength - 2)
        );

        const after = path.getPointAtLength(
            Math.min(totalLength, drawnLength + 2)
        );

        const angle =
            Math.atan2(
                after.y - before.y,
                after.x - before.x
            ) * 180 / Math.PI;

        head.setAttribute(
            "transform",
            `translate(${point.x} ${point.y}) rotate(${angle})`
        );

        head.style.opacity = drawnLength > 0 ? "1" : "0";
    }

    tracks.forEach(track => {

        const svgs = Array.from(
            track.querySelectorAll(".deets-growth-svg")
        );

        if (svgs.length !== 2) return;

        let arrows = [];
        let timing = null;

        let animationFrame = null;
        let startTime = null;

        function configure() {

            const geometry = makeGeometry(track);

            if (!geometry) return false;

            const entryTime =
                geometry.entryLength / SPEED;

            const exitTime =
                geometry.exitLength / SPEED;

            const activeTime =
                entryTime +
                ZIGZAG_TIME +
                PAUSE_TIME +
                exitTime;

            // Start the next arrow early enough to enter
            // from the left as the previous one exits right.
            const spawnInterval =
                entryTime +
                ZIGZAG_TIME +
                PAUSE_TIME -
                OFFSCREEN / SPEED;

            const slotPeriod = spawnInterval * 2;

            timing = {
                entryTime,
                exitTime,
                activeTime,
                spawnInterval,
                slotPeriod
            };

            arrows = svgs.map(svg =>
                prepareArrow(svg, geometry)
            );

            return true;
        }

        function getPhase(elapsed, slot) {

            const offset =
                slot * timing.spawnInterval;

            if (elapsed < offset) return -1;

            const sinceStart = elapsed - offset;

            const cycleNumber =
                Math.floor(sinceStart / timing.slotPeriod);

            return sinceStart -
                cycleNumber * timing.slotPeriod;
        }

        function animate(timestamp) {

            if (startTime === null) {
                startTime = timestamp;
            }

            const elapsed =
                (timestamp - startTime) / 1000;

            drawArrow(
                arrows[0],
                getPhase(elapsed, 0),
                timing
            );

            drawArrow(
                arrows[1],
                getPhase(elapsed, 1),
                timing
            );

            animationFrame =
                requestAnimationFrame(animate);
        }

        if (!configure()) return;

   if (reducedMotion.matches) {

    const arrow = arrows[0];

    arrow.path.style.strokeDasharray = "none";
    arrow.path.style.strokeDashoffset = "0";

    // Put the arrowhead at the end of the zigzag.
    const endPoint = arrow.path.getPointAtLength(
        arrow.totalLength - arrow.geometry.exitLength
    );

    arrow.head.setAttribute(
        "transform",
        `translate(${endPoint.x} ${endPoint.y})`
    );

    arrow.head.style.opacity = "1";
    arrow.svg.style.opacity = "1";

    // Only show one static arrow.
    svgs[1].style.display = "none";

    return;
}
        function reset() {

            if (animationFrame !== null) {
                cancelAnimationFrame(animationFrame);
            }

            animationFrame = null;
            startTime = null;

            svgs.forEach(svg => {
                svg.style.opacity = "0";
            });
        }

        const observer = new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        if (animationFrame === null) {

                            if (!configure()) return;

                            startTime = null;

                            animationFrame =
                                requestAnimationFrame(animate);
                        }

                    } else {

                        reset();

                    }

                });

            },
            {
                threshold: 0.05
            }
        );

        observer.observe(track);

        // Recalculate the arrow's position and travel distance
        // whenever the browser is resized.
        window.addEventListener("resize", () => {

            reset();

            if (!configure()) return;

            const rect = track.getBoundingClientRect();

            if (
                rect.bottom > 0 &&
                rect.top < window.innerHeight
            ) {
                animationFrame =
                    requestAnimationFrame(animate);
            }

        });

    });

});
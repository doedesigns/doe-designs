/* =========================================================
   CLEAN FUTURE NETWORK
   Horizontal scrolling, scaling, navigation and bootprints
   ========================================================= */

(() => {
    "use strict";

    const body = document.body;
    const track = document.getElementById("cleanTrack");

    if (!track || !body.classList.contains("clean-horizontal-page")) {
        return;
    }

    const stops = Array.from(track.querySelectorAll(".clean-stop"));
    const previous = document.querySelector(".clean-prev");
    const next = document.querySelector(".clean-next");
    const footprints = Array.from(document.querySelectorAll(".clean-footprint"));
    const walkway = document.querySelector(".clean-walkway");
    const projectHeading = document.querySelector(".clean-project-heading");
    const openingTitle = document.querySelector(".clean-opening-copy h2");

    const mobileQuery = window.matchMedia("(max-width: 760px)");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let activeIndex = 0;
    let animationFrame = 0;
    let lastFootprintStep = -1;
    let lastFootprintWidth = -1;

    const isMobile = () => mobileQuery.matches;

    function getActiveIndex() {
        const center = track.scrollLeft + track.clientWidth / 2;
        let closestIndex = 0;
        let closestDistance = Infinity;

        stops.forEach((stop, index) => {
            const stopCenter = stop.offsetLeft + stop.offsetWidth / 2;
            const distance = Math.abs(center - stopCenter);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });

        return closestIndex;
    }

    /* =====================================================
       BOOTPRINT TRAIL
       ===================================================== */

function updateFootprints() {
    if (footprints.length < 2 || isMobile()) return;

    const maxScroll = Math.max(1, track.scrollWidth - track.clientWidth);
    const ratio = Math.max(0, Math.min(1, track.scrollLeft / maxScroll));

    const totalSteps = 17;
    const step = Math.min(totalSteps, Math.floor(ratio * totalSteps));

    if (step === lastFootprintStep) return;
    lastFootprintStep = step;

    const first = footprints[0];
    const second = footprints[1];

    const progress = step / totalSteps;
    const position = 3 + progress * 82;

    first.style.left = `${position}%`;
    second.style.left = `${Math.min(91, position + 9)}%`;

    first.style.top = "0px";
    second.style.top = "24px";

    first.style.transform = "none";
    second.style.transform = "none";

    first.style.opacity = "0.82";
    second.style.opacity = "0.82";
}

    /* =====================================================
       SCENE POSITION AND ACTIVE STOP
       ===================================================== */

    function updateScene() {
        if (isMobile()) {
            return;
        }

        const center = track.scrollLeft + track.clientWidth / 2;
        const travelDistance = track.clientWidth * 1.05;

        stops.forEach(stop => {
            const stopCenter = stop.offsetLeft + stop.offsetWidth / 2;
            const distance = Math.abs(center - stopCenter);
            const proximity = Math.min(1, distance / travelDistance);
            const scale = 1 - (proximity * 0.88);

            stop.style.setProperty(
                "--clean-scale",
                scale.toFixed(3)
            );

            stop.classList.toggle(
                "is-centered",
                proximity < 0.2
            );
        });

        activeIndex = getActiveIndex();

        /*
           Reveal the fixed heading only after the large opening
           title has moved completely off the left side.
        */
        if (projectHeading && openingTitle) {
            const openingTitleRight = openingTitle.getBoundingClientRect().right;
            const openingTitleHasLeft = openingTitleRight <= 0;

            projectHeading.classList.toggle(
                "clean-heading-visible",
                openingTitleHasLeft
            );
        }

        if (previous) {
            previous.disabled = activeIndex === 0;
        }

        if (next) {
            next.disabled = activeIndex === stops.length - 1;
        }

        updateFootprints();
    }

    function requestSceneUpdate() {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }

        animationFrame = requestAnimationFrame(() => {
            updateScene();
            animationFrame = 0;
        });
    }

    /* =====================================================
       NAVIGATION
       ===================================================== */

    function goTo(index) {
        if (!stops.length) {
            return;
        }

        const target = Math.max(
            0,
            Math.min(stops.length - 1, index)
        );

        if (isMobile()) {
            stops[target].scrollIntoView({
                behavior: reduceMotion.matches ? "auto" : "smooth",
                block: "start"
            });

            return;
        }

        const stop = stops[target];

        const desiredLeft =
            stop.offsetLeft +
            (stop.offsetWidth / 2) -
            (track.clientWidth / 2);

        const maxScroll = Math.max(
            0,
            track.scrollWidth - track.clientWidth
        );

        const left = Math.max(
            0,
            Math.min(maxScroll, desiredLeft)
        );

        track.scrollTo({
            left,
            behavior: reduceMotion.matches ? "auto" : "smooth"
        });
    }

    if (previous) {
        previous.addEventListener("click", () => {
            goTo(getActiveIndex() - 1);
        });
    }

    if (next) {
        next.addEventListener("click", () => {
            goTo(getActiveIndex() + 1);
        });
    }

    track.addEventListener(
        "scroll",
        requestSceneUpdate,
        { passive: true }
    );

    /* =====================================================
       VERTICAL WHEEL TO HORIZONTAL SCROLL
       ===================================================== */

    track.addEventListener("wheel", event => {
        if (isMobile()) {
            return;
        }

        if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
            return;
        }

        const atStart = track.scrollLeft <= 0;

        const atEnd =
            track.scrollLeft + track.clientWidth >=
            track.scrollWidth - 2;

        if (
            (event.deltaY < 0 && atStart) ||
            (event.deltaY > 0 && atEnd)
        ) {
            return;
        }

        event.preventDefault();

        track.scrollBy({
            left: event.deltaY,
            behavior: "auto"
        });
    }, { passive: false });

    /* =====================================================
       KEYBOARD NAVIGATION
       ===================================================== */

    document.addEventListener("keydown", event => {
        if (
            isMobile() ||
            event.altKey ||
            event.ctrlKey ||
            event.metaKey
        ) {
            return;
        }

        const tag = event.target && event.target.tagName;

        if (
            tag === "INPUT" ||
            tag === "TEXTAREA" ||
            tag === "SELECT" ||
            tag === "BUTTON" ||
            tag === "A"
        ) {
            return;
        }

        if (event.key === "ArrowRight") {
            event.preventDefault();
            goTo(getActiveIndex() + 1);
        }

        if (event.key === "ArrowLeft") {
            event.preventDefault();
            goTo(getActiveIndex() - 1);
        }
    });

    /* =====================================================
       VIDEO PLAYBACK
       ===================================================== */

    const videoCard = document.querySelector(".clean-video-card");

    if (videoCard) {
        const playButton = videoCard.querySelector(".clean-play");

        if (playButton) {
            playButton.addEventListener("click", () => {
                const videoId = videoCard.dataset.videoId;

                if (!videoId) {
                    return;
                }

                const iframe = document.createElement("iframe");

                iframe.src =
                    `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;

                iframe.title =
                    "Clean Future Network website design presentation";

                iframe.allow =
                    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

                iframe.allowFullscreen = true;

                videoCard.replaceChildren(iframe);
            });
        }
    }

    /* =====================================================
       RESPONSIVE LAYOUT
       ===================================================== */

    function handleLayoutChange() {
        body.classList.toggle(
            "clean-mobile-layout",
            isMobile()
        );

        document.documentElement.classList.toggle(
            "clean-horizontal-active",
            !isMobile()
        );

        if (isMobile()) {
            if (projectHeading) {
                projectHeading.classList.remove("clean-heading-visible");
            }

            stops.forEach(stop => {
                stop.style.removeProperty("--clean-scale");
            });

            footprints.forEach(print => {
                print.style.opacity = "0";
            });

            if (previous) {
                previous.disabled = true;
            }

            if (next) {
                next.disabled = false;
            }
        } else {
            lastFootprintStep = -1;
            lastFootprintWidth = -1;
            requestSceneUpdate();
        }
    }

    if (typeof mobileQuery.addEventListener === "function") {
        mobileQuery.addEventListener("change", handleLayoutChange);
    } else if (typeof mobileQuery.addListener === "function") {
        mobileQuery.addListener(handleLayoutChange);
    }

    handleLayoutChange();

    window.addEventListener("resize", requestSceneUpdate);

    requestSceneUpdate();
})();
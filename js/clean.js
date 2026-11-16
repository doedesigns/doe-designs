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
    const progress = document.querySelector(".clean-progress");
    const footprints = Array.from(document.querySelectorAll(".clean-footprint"));
    const header = document.querySelector(".clean-header");

    const mobileQuery = window.matchMedia("(max-width: 760px)");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let activeIndex = 0;
    let animationFrame = 0;

    const isMobile = () => mobileQuery.matches;


    /* FIND THE STOP CLOSEST TO THE VIEWPORT CENTER */

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


    /* UPDATE SCALE, HEADER, BUTTONS, PROGRESS AND FOOTPRINTS */

    function updateScene() {

        if (isMobile()) {
            return;
        }

        const center = track.scrollLeft + track.clientWidth / 2;

        /*
           Stops reach full size at the viewport center.
           They shrink to approximately 22% as they move
           farther away from the center.
        */

        const travelDistance = track.clientWidth * 1.05;

        stops.forEach(stop => {

            const stopCenter = stop.offsetLeft + stop.offsetWidth / 2;
            const distance = Math.abs(center - stopCenter);
            const proximity = Math.min(1, distance / travelDistance);

            const scale = 1 - (proximity * .78);

            stop.style.setProperty("--clean-scale", scale.toFixed(3));

            stop.classList.toggle("is-centered", proximity < .2);

        });

        activeIndex = getActiveIndex();

        /* REVEAL PROJECT TITLE AFTER MOVING PAST OPENING */

        const opening = stops[0];

        if (header && opening) {

            const openingEnd = opening.offsetLeft + opening.offsetWidth;
            const revealPoint = opening.offsetLeft + opening.offsetWidth * .55;

            header.classList.toggle(
                "clean-title-visible",
                track.scrollLeft > revealPoint
            );

            /*
               Keep the title visible once the visitor has
               moved beyond the opening scene.
            */

            if (track.scrollLeft >= openingEnd) {
                header.classList.add("clean-title-visible");
            }

        }

        /* UPDATE SECTION COUNTER */

        if (progress) {
            progress.textContent =
                `${String(activeIndex + 1).padStart(2, "0")} / ${String(stops.length).padStart(2, "0")}`;
        }

        /* UPDATE SECTION BUTTONS */

        if (previous) {
            previous.disabled = activeIndex === 0;
        }

        if (next) {
            next.disabled = activeIndex === stops.length - 1;
        }

        /* MOVE THE BOOTPRINT TRAIL WITH SCROLL PROGRESS */

        const maxScroll = Math.max(1, track.scrollWidth - track.clientWidth);
        const ratio = track.scrollLeft / maxScroll;

        footprints.forEach((print, index) => {

            const offset = index * 2.2;
            const position = Math.min(96, Math.max(2, ratio * 92 + offset));

            print.style.left = `${position}%`;

        });

    }


    /* SCHEDULE ONE VISUAL UPDATE PER FRAME */

    function requestSceneUpdate() {

        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }

        animationFrame = requestAnimationFrame(() => {
            updateScene();
            animationFrame = 0;
        });

    }


    /* MOVE TO A PARTICULAR STOP */

    function goTo(index) {

        const target = Math.max(0, Math.min(stops.length - 1, index));

        if (isMobile()) {

            stops[target].scrollIntoView({
                behavior: reduceMotion.matches ? "auto" : "smooth",
                block: "start"
            });

            return;
        }

        const stop = stops[target];

        const left = stop.offsetLeft -
            (track.clientWidth / 2) +
            (stop.offsetWidth / 2);

        track.scrollTo({
            left: left,
            behavior: reduceMotion.matches ? "auto" : "smooth"
        });

    }


    /* PREVIOUS AND NEXT BUTTONS */

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


    /* TRACK SCROLLING */

    track.addEventListener("scroll", requestSceneUpdate, {
        passive: true
    });


    /* CONVERT VERTICAL WHEEL MOVEMENT TO HORIZONTAL MOVEMENT */

    track.addEventListener("wheel", event => {

        if (isMobile()) {
            return;
        }

        if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
            return;
        }

        const atStart = track.scrollLeft <= 0;

        const atEnd =
            track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;

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


    /* KEYBOARD NAVIGATION */

    document.addEventListener("keydown", event => {

        if (isMobile() || event.altKey || event.ctrlKey || event.metaKey) {
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


    /* LOAD YOUTUBE ONLY AFTER THE VISITOR CLICKS PLAY */

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


    /* MOBILE / DESKTOP LAYOUT */

    function handleLayoutChange() {

        body.classList.toggle("clean-mobile-layout", isMobile());

        document.documentElement.classList.toggle(
            "clean-horizontal-active",
            !isMobile()
        );

        if (isMobile()) {

            if (header) {
                header.classList.remove("clean-title-visible");
            }

            stops.forEach(stop => {
                stop.style.removeProperty("--clean-scale");
            });

            if (progress) {
                progress.textContent =
                    `01 / ${String(stops.length).padStart(2, "0")}`;
            }

            if (previous) {
                previous.disabled = true;
            }

            if (next) {
                next.disabled = false;
            }

        } else {

            requestSceneUpdate();

        }

    }


    /* SUPPORT OLDER BROWSER VERSIONS */

    if (typeof mobileQuery.addEventListener === "function") {

        mobileQuery.addEventListener("change", handleLayoutChange);

    } else if (typeof mobileQuery.addListener === "function") {

        mobileQuery.addListener(handleLayoutChange);

    }


    /* INITIALIZE */

    handleLayoutChange();

    window.addEventListener("resize", requestSceneUpdate);

    requestSceneUpdate();

})();
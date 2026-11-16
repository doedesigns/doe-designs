/* Clean Future Network — horizontal case-study interactions */

(() => {
    "use strict";

    const body = document.body;
    const track = document.getElementById("cleanTrack");

    if (!track || !body.classList.contains("clean-horizontal-page")) return;

    const panels = Array.from(track.querySelectorAll(".clean-panel"));
    const previous = document.querySelector(".clean-prev");
    const next = document.querySelector(".clean-next");
    const progress = document.querySelector(".clean-progress");
    const footprints = Array.from(document.querySelectorAll(".clean-footprint"));

    const mobileQuery = window.matchMedia("(max-width: 760px)");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let activeIndex = 0;
    let scrollFrame = 0;

    const isMobile = () => mobileQuery.matches;


    /* UPDATE THE ACTIVE PANEL, PROGRESS, AND FOOTPRINTS */

    function setActive(index) {

        activeIndex = Math.max(0, Math.min(panels.length - 1, index));

        panels.forEach((panel, i) => {
            panel.classList.toggle("is-active", i === activeIndex);
        });

        if (progress) {
            progress.textContent =
                `${String(activeIndex + 1).padStart(2, "0")} / ${String(panels.length).padStart(2, "0")}`;
        }

        if (previous) {
            previous.disabled = activeIndex === 0;
        }

        if (next) {
            next.disabled = activeIndex === panels.length - 1;
        }

        const maxScroll = Math.max(1, track.scrollWidth - track.clientWidth);

        const ratio = isMobile()
            ? activeIndex / Math.max(1, panels.length - 1)
            : track.scrollLeft / maxScroll;

        footprints.forEach((print, i) => {

            const offset = i * 2.2;

            print.style.left =
                `calc(${Math.min(96, Math.max(2, ratio * 92 + offset))}% )`;

        });

    }


    /* MOVE TO THE PREVIOUS OR NEXT PANEL */

    function goTo(index) {

        const target = Math.max(0, Math.min(panels.length - 1, index));

        if (isMobile()) {

            panels[target].scrollIntoView({
                behavior: reduceMotion.matches ? "auto" : "smooth",
                block: "start"
            });

            setActive(target);

        } else {

            panels[target].scrollIntoView({
                behavior: reduceMotion.matches ? "auto" : "smooth",
                block: "nearest",
                inline: "center"
            });

        }

    }


    /* LEFT AND RIGHT BUTTONS */

    if (previous) {
        previous.addEventListener("click", () => {
            goTo(activeIndex - 1);
        });
    }

    if (next) {
        next.addEventListener("click", () => {
            goTo(activeIndex + 1);
        });
    }


    /* TRACK SCROLLING */

    track.addEventListener("scroll", () => {

        if (scrollFrame) {
            cancelAnimationFrame(scrollFrame);
        }

        scrollFrame = requestAnimationFrame(() => {

            if (!isMobile()) {

                const center = track.scrollLeft + track.clientWidth / 2;

                let nearest = 0;
                let distance = Infinity;

                panels.forEach((panel, i) => {

                    const panelCenter =
                        panel.offsetLeft + panel.offsetWidth / 2;

                    const d = Math.abs(center - panelCenter);

                    if (d < distance) {
                        distance = d;
                        nearest = i;
                    }

                });

                setActive(nearest);

            }

        });

    }, { passive: true });


    /* CONVERT VERTICAL MOUSE WHEEL MOVEMENT TO HORIZONTAL SCROLLING */

    track.addEventListener("wheel", event => {

        if (isMobile() || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
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


    /* KEYBOARD LEFT AND RIGHT ARROWS */

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
            goTo(activeIndex + 1);
        }

        if (event.key === "ArrowLeft") {
            event.preventDefault();
            goTo(activeIndex - 1);
        }

    });


    /* LOAD THE YOUTUBE VIDEO ONLY WHEN THE VISITOR CLICKS PLAY */

    const videoCard = document.querySelector(".clean-video-card");

    if (videoCard) {

        const playButton = videoCard.querySelector(".clean-play");

        if (playButton) {

            playButton.addEventListener("click", () => {

                const videoId = videoCard.dataset.videoId;

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


    /* MOBILE AND DESKTOP LAYOUT CHANGES */

    function handleLayoutChange() {

        body.classList.toggle("clean-mobile-layout", isMobile());

        document.documentElement.classList.toggle(
            "clean-horizontal-active",
            !isMobile()
        );

        if (isMobile()) {

            setActive(0);

        } else {

            const center = track.scrollLeft + track.clientWidth / 2;

            let nearest = 0;
            let distance = Infinity;

            panels.forEach((panel, i) => {

                const d = Math.abs(
                    center - (panel.offsetLeft + panel.offsetWidth / 2)
                );

                if (d < distance) {
                    distance = d;
                    nearest = i;
                }

            });

            setActive(nearest);

        }

    }


    /* SUPPORT DIFFERENT BROWSER VERSIONS */

    if (typeof mobileQuery.addEventListener === "function") {

        mobileQuery.addEventListener("change", handleLayoutChange);

    } else if (typeof mobileQuery.addListener === "function") {

        mobileQuery.addListener(handleLayoutChange);

    }


    /* INITIALIZE */

    if (!isMobile()) {
        document.documentElement.classList.add("clean-horizontal-active");
    }

    setActive(0);

    handleLayoutChange();

})();
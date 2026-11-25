
document.addEventListener("DOMContentLoaded", () => {

    const section = document.querySelector(".secret-facts");
    if (!section) return;

    const stage = section.querySelector(".photo-constellation");
    const photos = Array.from(stage.querySelectorAll(".fact-photo"));

    if (!stage || !photos.length) return;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    /* =========================================
       FACTS — ORIGINAL WORDING
       ========================================= */

    const facts = {
        2: "I have two rescue dogs named Cap’t Bexley and Judge Harley.\nThey like treats and hiking.\nSquirrels not so much.",

        3: "I started playing video games after working for MTV before law school.\n(Check me out in the credits for RockBand 2 and 3!)\nI’ve never looked back,\n...which is a detriment in some rpg games.",

        4: "I play classical guitar but not very well.",

        5: "I can sing at least one song from every animated Disney movie.\nMost of the time it’s recognizable.",

        7: "Instead of law school, I almost went for a Ph.D. in Egyptology.\nJoke’s on me, though—graphic design is where it’s at!\n...Only took me a couple decades to figure it out.",

        8: "I marked my territory in all 50 states before I turned 30.",

        10: "I taught myself to tile, designed the patterns, and installed it all myself throughout my house—including a master bath that I MAY have gotten a little carried away with.\nBut I give myself a 5 star review.",

        11: "I played varsity softball and basketball in college, but now my body is vehemently against three-a-day practices.",

        14: "My favorite movies are Kill Bill 1 & 2.",

        15: "My favorite graphic design experience is TeamLab Borderless in Tokyo.",

        16: "I have visited 23 countries.\nHopefully, none of them remember my escapades too well.",

        19: "When I have free weekends, I love taking the dogs hiking.\nUnless it’s raining, then we cuddle in a grumpy puppy puddle to guard the house from cute bunnies and dastardly squirrels.",

        21: "I love being on or in the water.\nSo does my aptly named dog, Cap’t Bexley.",

        22: "My happy place is on a volleyball court.\nAnywhere, anytime.",

        29: "My (still functional!) microwave was bought at Target in 2006 for around $20."
    };


    /* =========================================
       PHOTO SELECTION AND FACT REVEAL
       ========================================= */

    let selectedPhoto = null;

    function closeFact() {
        if (!selectedPhoto) return;

        selectedPhoto.classList.remove("is-selected");

        const overlay = selectedPhoto.querySelector(".fact-photo-overlay");
        if (overlay) overlay.remove();

        selectedPhoto = null;
    }

    function showFact(photo) {
        if (selectedPhoto === photo) {
            closeFact();
            return;
        }

        closeFact();

        const factNumber = photo.dataset.fact;
        const factText = facts[factNumber];

        if (!factText) return;

        selectedPhoto = photo;
        photo.classList.add("is-selected");

        const overlay = document.createElement("div");
        overlay.className = "fact-photo-overlay";

        const text = document.createElement("p");
        text.className = "fact-photo-text";
        text.textContent = factText;

        overlay.appendChild(text);
        photo.appendChild(overlay);

        resetIdleTimer();
    }

    photos.forEach(photo => {
        photo.addEventListener("click", event => {
            if (photo.dataset.wasDragged === "true") {
                photo.dataset.wasDragged = "false";
                event.preventDefault();
                return;
            }

            showFact(photo);
        });

        photo.addEventListener("dragstart", event => {
            event.preventDefault();
        });
    });


    /* =========================================
       CLOSE THE FACT
       ========================================= */

    const closeButton = section.querySelector(".fact-close");

    if (closeButton) {
        closeButton.addEventListener("click", closeFact);
    }

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeFact();
        }
    });

    section.addEventListener("click", event => {
        if (
            selectedPhoto &&
            !event.target.closest(".fact-photo") &&
            !event.target.closest(".fact-reveal")
        ) {
            closeFact();
        }
    });


    /* =========================================
       DRAG AND TOSS
       ========================================= */

    let activeDrag = null;
    let suppressClick = false;

    photos.forEach(photo => {

        photo.addEventListener("pointerdown", event => {

            if (event.button !== 0) return;

            closeFact();

            const stageRect = stage.getBoundingClientRect();
            const photoRect = photo.getBoundingClientRect();

            activeDrag = {
                photo,
                pointerId: event.pointerId,
                startX: event.clientX,
                startY: event.clientY,
                originalX: photoRect.left + photoRect.width / 2,
                originalY: photoRect.top + photoRect.height / 2,
                lastX: event.clientX,
                lastY: event.clientY,
                lastTime: performance.now(),
                velocityX: 0,
                velocityY: 0,
                moved: false,
                stageRect
            };

            photo.setPointerCapture(event.pointerId);
            photo.classList.add("is-dragging");
            stage.classList.add("is-interacting");

            resetIdleTimer();

        });

        photo.addEventListener("pointermove", event => {

            if (!activeDrag || activeDrag.photo !== photo) return;

            const drag = activeDrag;

            const dx = event.clientX - drag.startX;
            const dy = event.clientY - drag.startY;

            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
                drag.moved = true;
            }

            if (!drag.moved) return;

            const stageRect = stage.getBoundingClientRect();

            const photoRect = photo.getBoundingClientRect();

            let x = event.clientX - stageRect.left;
            let y = event.clientY - stageRect.top;

            const halfWidth = photoRect.width / 2;
            const halfHeight = photoRect.height / 2;

            x = Math.max(
                halfWidth,
                Math.min(stageRect.width - halfWidth, x)
            );

            y = Math.max(
                halfHeight,
                Math.min(stageRect.height - halfHeight, y)
            );

            const now = performance.now();
            const elapsed = Math.max(1, now - drag.lastTime);

            drag.velocityX =
                (event.clientX - drag.lastX) / elapsed;

            drag.velocityY =
                (event.clientY - drag.lastY) / elapsed;

            drag.lastX = event.clientX;
            drag.lastY = event.clientY;
            drag.lastTime = now;

            const percentX = (x / stageRect.width) * 100;
            const percentY = (y / stageRect.height) * 100;

            photo.style.setProperty("--photo-x", percentX + "%");
            photo.style.setProperty("--photo-y", percentY + "%");

            photo.style.zIndex = 40;

        });

        function finishDrag(event) {

            if (!activeDrag || activeDrag.photo !== photo) return;

            const drag = activeDrag;

            activeDrag = null;

            photo.classList.remove("is-dragging");
            stage.classList.remove("is-interacting");

            if (drag.moved) {

                photo.dataset.wasDragged = "true";
                suppressClick = true;

                setTimeout(() => {
                    suppressClick = false;
                    photo.dataset.wasDragged = "false";
                }, 300);

                if (!reducedMotion) {
                    tossPhoto(photo, drag.velocityX, drag.velocityY);
                }

            } else {
                photo.style.zIndex = "";
            }

            resetIdleTimer();
        }

        photo.addEventListener("pointerup", finishDrag);
        photo.addEventListener("pointercancel", finishDrag);

    });


    /* =========================================
       TOSS MOMENTUM
       ========================================= */

    function tossPhoto(photo, velocityX, velocityY) {

        const stageRect = stage.getBoundingClientRect();

        let x = parseFloat(
            photo.style.getPropertyValue("--photo-x")
        );

        let y = parseFloat(
            photo.style.getPropertyValue("--photo-y")
        );

        if (Number.isNaN(x) || Number.isNaN(y)) return;

        let vx = velocityX * 0.45;
        let vy = velocityY * 0.45;

        let previousTime = performance.now();

        function animate(time) {

            const elapsed = Math.min(32, time - previousTime);
            previousTime = time;

            x += (vx * elapsed / stageRect.width) * 100;
            y += (vy * elapsed / stageRect.height) * 100;

            const photoRect = photo.getBoundingClientRect();

            const halfWidth =
                (photoRect.width / stageRect.width) * 50;

            const halfHeight =
                (photoRect.height / stageRect.height) * 50;

            if (x < halfWidth || x > 100 - halfWidth) {
                vx *= -0.45;
                x = Math.max(halfWidth, Math.min(100 - halfWidth, x));
            }

            if (y < halfHeight || y > 100 - halfHeight) {
                vy *= -0.45;
                y = Math.max(halfHeight, Math.min(100 - halfHeight, y));
            }

            photo.style.setProperty("--photo-x", x + "%");
            photo.style.setProperty("--photo-y", y + "%");

            vx *= 0.94;
            vy *= 0.94;

            if (Math.abs(vx) + Math.abs(vy) > 0.015) {
                requestAnimationFrame(animate);
            } else {
                photo.style.zIndex = "";
            }
        }

        requestAnimationFrame(animate);
    }


    /* =========================================
       GENTLE FLOATING
       ========================================= */

    if (!reducedMotion) {
        photos.forEach((photo, index) => {
            photo.style.setProperty(
                "--float-delay",
                (index * -0.8) + "s"
            );

            photo.classList.add("is-floating");
        });
    }


    /* =========================================
       IDLE REARRANGEMENT
       ========================================= */

    const layouts = [

        /* Loose circular arrangement */
        [
            [50, 8, -5], [70, 12, 7], [85, 30, -8],
            [88, 53, 6], [77, 77, -5], [58, 88, 8],
            [36, 88, -7], [16, 76, 5], [9, 52, -8],
            [17, 29, 7], [35, 18, -5], [51, 31, 8],
            [67, 49, -6], [48, 65, 5], [29, 54, -7]
        ],

        /* Loose diamond arrangement */
        [
            [50, 8, 6], [65, 18, -7], [80, 30, 5],
            [91, 48, -6], [78, 66, 8], [65, 80, -5],
            [50, 91, 7], [34, 80, -8], [19, 67, 5],
            [8, 49, -7], [21, 30, 6], [36, 18, -5],
            [50, 43, 8], [66, 56, -6], [35, 59, 7]
        ],

        /* Loose scattered cluster */
        [
            [20, 18, -8], [43, 12, 6], [70, 17, -5],
            [85, 37, 8], [72, 53, -7], [87, 75, 5],
            [58, 83, -6], [35, 77, 7], [12, 70, -5],
            [10, 43, 8], [32, 35, -7], [52, 48, 6],
            [67, 33, -8], [43, 60, 5], [24, 55, -6]
        ]

    ];

    let layoutIndex = 0;
    let idleTimer = null;

    function rearrangePhotos() {

        if (reducedMotion || activeDrag || selectedPhoto) return;

        const layout = layouts[layoutIndex];

        photos.forEach((photo, index) => {

            const position = layout[index];

            photo.style.setProperty(
                "--photo-x",
                position[0] + "%"
            );

            photo.style.setProperty(
                "--photo-y",
                position[1] + "%"
            );

            photo.style.setProperty(
                "--photo-rotation",
                position[2] + "deg"
            );

            photo.style.zIndex = "";
        });

        layoutIndex = (layoutIndex + 1) % layouts.length;
    }

    function resetIdleTimer() {

        clearTimeout(idleTimer);

        if (reducedMotion) return;

        idleTimer = setTimeout(() => {
            rearrangePhotos();
        }, 18000);
    }

    resetIdleTimer();

});

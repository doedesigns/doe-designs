document.addEventListener("DOMContentLoaded", () => {
    const section = document.querySelector(".secret-facts");
    if (!section) return;

    const stage = section.querySelector(".photo-constellation");
    if (!stage) return;

    const photos = Array.from(stage.querySelectorAll(".fact-photo"));
    if (!photos.length) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* =========================================
       PHOTO STORIES
       ========================================= */
    const facts = {
        2: "I have two rescue dogs named Cap’t Bexley and Judge Harley.\nThey like treats and hiking.\nSquirrels not so much.",
        3: "I started playing video games after working for MTV before law school.\n(Check me out in the credits for RockBand 2 and 3!)\nI’ve never looked back,\n...which is a detriment in some rpg games.",
        4: "I play classical guitar but not very well.",
        5: "I can sing at least one song from every animated Disney movie.\nMost of the time it’s recognizable.",
        6: "My favorite book series is The Shadowhunter Chronicles by Cassandra Clare. I’m also a fan of V. E. Schwab. And I still want a coat like Kell’s.",
        7: "Instead of law school, I almost went for a Ph.D. in Egyptology.\nJoke’s on me, though—graphic design is where it’s at!\n...Only took me a couple decades to figure it out.",
        8: "I marked my territory in all 50 states before I turned 30.",
        9: "I typically read 3–5 books a week. Audiobooks count.\nConvince me otherwise.",
        10: "I taught myself to tile, designed the patterns, and installed it all myself throughout my house—including a master bath that I MAY have gotten a little carried away with.\nBut I give myself a 5 star review.",
        11: "I played varsity softball and basketball in college, but now my body is vehemently against three-a-day practices.",
        14: "My favorite movies are Kill Bill 1 & 2.",
        15: "My favorite graphic design experience is TeamLab Borderless in Tokyo.",
        16: "I have visited 23 countries.\nHopefully, none of them remember my escapades too well.",
        19: "When I have free weekends, I love taking the dogs hiking.\nUnless it’s raining, then we cuddle in a grumpy puppy puddle to guard the house from cute bunnies and dastardly squirrels.",
        20: "My dad and I make cigar box guitars. Actual guitars, made from actual cigar boxes.",
        21: "I love being on or in the water.\nSo does my aptly named dog, Cap’t Bexley.",
        22: "My happy place is on a volleyball court.\nAnywhere, anytime.",
        24: "Sushi is my favorite food. Hold the cream cheese, please.",
        27: "I taught Judge Harley to judge. I can send you adorable pictures of her being judgmental.",
        28: "My mom is a fabulous quilter. I have more than 20 of her quilts, so I basically live in a blanket house.",
        29: "My (still functional!) microwave was bought at Target in 2006 for around $20.",
        32: "Pizza is my go-to broke person, can’t cook, don’t wanna-food.",
    };

    /* =========================================
       ARRANGEMENT SETUP
       ========================================= */
    const photoState = new Map();
    let selectedPhoto = null;
    let activeDrag = null;
    let idleTimer = null;
    let layoutIndex = 0;
    let overlayTimer = null;

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    // Three loose, organic arrangements. Photos are distributed around an
    // imperfect ring, with a few tucked into the middle of the constellation.
    function makeLayout(variant) {
        const count = photos.length;
        const positions = [];
        const ringCount = Math.ceil(count * 0.73);
        const rotation = variant * 0.31;

        for (let i = 0; i < ringCount; i++) {
            const angle = (Math.PI * 2 * i / ringCount) - Math.PI / 2 + rotation;
            let radiusX = variant === 1 ? 34 : 37;
            let radiusY = variant === 2 ? 34 : 38;
            if (variant === 1) {
                const diamondFactor = Math.max(Math.abs(Math.cos(angle)), Math.abs(Math.sin(angle)));
                radiusX *= 0.82 + diamondFactor * 0.18;
                radiusY *= 0.82 + diamondFactor * 0.18;
            }
            const irregularity = Math.sin(i * 2.17 + variant) * 4;
            positions.push({
                x: clamp(50 + Math.cos(angle) * radiusX + irregularity, 9, 91),
                y: clamp(50 + Math.sin(angle) * radiusY + Math.cos(i * 1.61) * 4, 10, 90),
                rotation: Math.sin(i * 1.73 + variant * 2) * 10
            });
        }

        const innerPositions = [
            [39, 35], [61, 36], [39, 65], [62, 64], [50, 24], [51, 76]
        ];
        for (let i = ringCount; i < count; i++) {
            const point = innerPositions[(i - ringCount + variant * 2) % innerPositions.length];
            positions.push({
                x: clamp(point[0] + Math.sin(i * 2.3 + variant) * 4, 12, 88),
                y: clamp(point[1] + Math.cos(i * 1.9 + variant) * 4, 12, 88),
                rotation: Math.sin(i * 1.37 + variant) * 11
            });
        }
        return positions;
    }

    function setPosition(photo, state, animate = true) {
        if (!animate) photo.style.transition = "none";
        photo.style.setProperty("--photo-x", state.x + "%");
        photo.style.setProperty("--photo-y", state.y + "%");
        photo.style.setProperty("--photo-rotation", state.rotation + "deg");
        if (!animate) {
            requestAnimationFrame(() => { photo.style.transition = ""; });
        }
    }

    const initialLayout = makeLayout(0);
    photos.forEach((photo, index) => {
        const initial = initialLayout[index];
        const width = 88 + ((index * 17) % 43);
        const height = Math.round(width * (0.72 + ((index * 7) % 5) * 0.055));
        const state = {
            x: initial.x,
            y: initial.y,
            rotation: initial.rotation,
            phase: index * 1.71,
            speed: 0.00038 + (index % 5) * 0.000055,
            amplitudeX: 2.2 + (index % 4) * 0.45,
            amplitudeY: 2.8 + (index % 3) * 0.55,
            returning: false,
            returnTimer: null,
            returnEndTimer: null
        };
        photoState.set(photo, state);
        photo.style.setProperty("--photo-width", width + "px");
        photo.style.setProperty("--photo-height", height + "px");
        photo.style.setProperty("--photo-x", state.x + "%");
        photo.style.setProperty("--photo-y", state.y + "%");
        photo.style.setProperty("--photo-rotation", state.rotation + "deg");
        photo.style.zIndex = String(2 + ((index * 7) % 15));
        photo.dataset.wasDragged = "false";
    });

    /* =========================================
       FLOATING — EACH PHOTO HAS ITS OWN RHYTHM
       ========================================= */
    function floatPhotos(time) {
        if (!reducedMotion) {
            photos.forEach(photo => {
                const state = photoState.get(photo);
                if (photo === selectedPhoto || photo.classList.contains("is-dragging") || state.returning) {
                    photo.style.setProperty("--drift-x", "0px");
                    photo.style.setProperty("--drift-y", "0px");
                    return;
                }
                const t = time * state.speed + state.phase;
                const dx = Math.sin(t) * state.amplitudeX + Math.sin(t * 0.47) * 1.1;
                const dy = Math.cos(t * 0.83) * state.amplitudeY + Math.sin(t * 0.39) * 1.2;
                photo.style.setProperty("--drift-x", dx.toFixed(2) + "px");
                photo.style.setProperty("--drift-y", dy.toFixed(2) + "px");
            });
        }
        requestAnimationFrame(floatPhotos);
    }
    requestAnimationFrame(floatPhotos);

    /* =========================================
       FACT SELECTION
       ========================================= */
    function clearOverlayTimer() {
        clearTimeout(overlayTimer);
        overlayTimer = null;
    }

    function resetOverlayFade() {
        if (!selectedPhoto) return;
        clearOverlayTimer();
        const overlay = selectedPhoto.querySelector(".fact-photo-overlay");
        if (!overlay) return;
        overlay.classList.remove("is-faded");
        overlayTimer = setTimeout(() => {
            if (selectedPhoto) {
                const currentOverlay = selectedPhoto.querySelector(".fact-photo-overlay");
                if (currentOverlay) currentOverlay.classList.add("is-faded");
            }
        }, 15000);
    }

    function closeFact() {
        if (!selectedPhoto) return;
        const photo = selectedPhoto;
        photo.classList.remove("is-selected");
        const overlay = photo.querySelector(".fact-photo-overlay");
        if (overlay) overlay.remove();
        photo.style.setProperty("--drift-x", "0px");
        photo.style.setProperty("--drift-y", "0px");
        selectedPhoto = null;
        clearOverlayTimer();
        resetIdleTimer();
    }

    function showFact(photo) {
        if (selectedPhoto === photo) {
            closeFact();
            return;
        }
        closeFact();
        const fact = facts[photo.dataset.fact];
        if (!fact) return;

        selectedPhoto = photo;
        photo.classList.add("is-selected");
        const overlay = document.createElement("div");
        overlay.className = "fact-photo-overlay";
        const text = document.createElement("p");
        text.className = "fact-photo-text";
        text.textContent = fact;
        overlay.appendChild(text);
        photo.appendChild(overlay);
        resetOverlayFade();
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
        photo.addEventListener("dragstart", event => event.preventDefault());
        photo.addEventListener("pointermove", () => {
            if (selectedPhoto === photo) resetOverlayFade();
        });
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeFact();
    });

    section.addEventListener("click", event => {
        if (selectedPhoto && !event.target.closest(".fact-photo")) closeFact();
    });

    /* =========================================
       DRAG, TOSS, AND GENTLE RETURN
       ========================================= */
    function clearReturnTimers(state) {
        clearTimeout(state.returnTimer);
        clearTimeout(state.returnEndTimer);
        state.returnTimer = null;
        state.returnEndTimer = null;
        state.returning = false;
    }

    function returnPhotoToConstellation(photo) {
        const state = photoState.get(photo);
        if (!state || reducedMotion || photo === selectedPhoto) return;
        state.returning = true;
        photo.style.transition = "left 5.5s cubic-bezier(0.2, 0.72, 0.2, 1), top 5.5s cubic-bezier(0.2, 0.72, 0.2, 1), box-shadow 0.35s ease, border-color 0.35s ease";
        setPosition(photo, state, true);
        state.returnEndTimer = setTimeout(() => {
            state.returning = false;
            photo.style.transition = "";
        }, 5700);
    }

    function tossPhoto(photo, vx, vy) {
        if (reducedMotion) return;
        const state = photoState.get(photo);
        const rect = stage.getBoundingClientRect();
        let x = parseFloat(photo.style.getPropertyValue("--photo-x"));
        let y = parseFloat(photo.style.getPropertyValue("--photo-y"));
        let velocityX = vx * 0.34;
        let velocityY = vy * 0.34;
        let previous = performance.now();

        function move(time) {
            const elapsed = Math.min(32, time - previous);
            previous = time;
            x += velocityX * elapsed / rect.width * 100;
            y += velocityY * elapsed / rect.height * 100;
            const photoRect = photo.getBoundingClientRect();
            const halfW = photoRect.width / rect.width * 50;
            const halfH = photoRect.height / rect.height * 50;
            if (x < halfW || x > 100 - halfW) {
                velocityX *= -0.42;
                x = clamp(x, halfW, 100 - halfW);
            }
            if (y < halfH || y > 100 - halfH) {
                velocityY *= -0.42;
                y = clamp(y, halfH, 100 - halfH);
            }
            photo.style.setProperty("--photo-x", x + "%");
            photo.style.setProperty("--photo-y", y + "%");
            velocityX *= 0.94;
            velocityY *= 0.94;
            if (Math.abs(velocityX) + Math.abs(velocityY) > 0.018) {
                requestAnimationFrame(move);
            } else {
                photo.style.zIndex = "";
                state.returnTimer = setTimeout(() => returnPhotoToConstellation(photo), 8000);
            }
        }
        requestAnimationFrame(move);
    }

    photos.forEach(photo => {
        photo.addEventListener("pointerdown", event => {
            if (event.button !== 0 || photo === selectedPhoto) return;
            closeFact();
            const state = photoState.get(photo);
            clearReturnTimers(state);
            const rect = stage.getBoundingClientRect();
            const currentX = parseFloat(photo.style.getPropertyValue("--photo-x"));
            const currentY = parseFloat(photo.style.getPropertyValue("--photo-y"));
            activeDrag = {
                photo,
                pointerId: event.pointerId,
                startX: event.clientX,
                startY: event.clientY,
                originX: Number.isNaN(currentX) ? 50 : currentX,
                originY: Number.isNaN(currentY) ? 50 : currentY,
                lastX: event.clientX,
                lastY: event.clientY,
                lastTime: performance.now(),
                velocityX: 0,
                velocityY: 0,
                moved: false,
                rect
            };
            photo.setPointerCapture(event.pointerId);
            photo.classList.add("is-dragging");
            photo.style.setProperty("--drift-x", "0px");
            photo.style.setProperty("--drift-y", "0px");
            resetIdleTimer();
        });

        photo.addEventListener("pointermove", event => {
            if (!activeDrag || activeDrag.photo !== photo) return;
            const drag = activeDrag;
            const dx = event.clientX - drag.startX;
            const dy = event.clientY - drag.startY;
            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) drag.moved = true;
            if (!drag.moved) return;

            const rect = stage.getBoundingClientRect();
            const photoRect = photo.getBoundingClientRect();
            const halfW = photoRect.width / rect.width * 50;
            const halfH = photoRect.height / rect.height * 50;
            const x = clamp((event.clientX - rect.left) / rect.width * 100, halfW, 100 - halfW);
            const y = clamp((event.clientY - rect.top) / rect.height * 100, halfH, 100 - halfH);
            const now = performance.now();
            const elapsed = Math.max(1, now - drag.lastTime);
            drag.velocityX = (event.clientX - drag.lastX) / elapsed;
            drag.velocityY = (event.clientY - drag.lastY) / elapsed;
            drag.lastX = event.clientX;
            drag.lastY = event.clientY;
            drag.lastTime = now;
            photo.style.transition = "none";
            photo.style.setProperty("--photo-x", x + "%");
            photo.style.setProperty("--photo-y", y + "%");
            photo.style.zIndex = "60";
        });

        function finishDrag(event) {
            if (!activeDrag || activeDrag.photo !== photo) return;
            const drag = activeDrag;
            activeDrag = null;
            photo.classList.remove("is-dragging");
            photo.style.transition = "";
            if (drag.moved) {
                photo.dataset.wasDragged = "true";
                setTimeout(() => { photo.dataset.wasDragged = "false"; }, 350);
                tossPhoto(photo, drag.velocityX, drag.velocityY);
            } else {
                photo.style.zIndex = "";
            }
            resetIdleTimer();
        }
        photo.addEventListener("pointerup", finishDrag);
        photo.addEventListener("pointercancel", finishDrag);
    });

    /* =========================================
       IDLE SHAPE CHANGE
       ========================================= */
    function rearrangePhotos() {
        if (reducedMotion || activeDrag || selectedPhoto) return;
        layoutIndex = (layoutIndex + 1) % 3;
        const layout = makeLayout(layoutIndex);
        photos.forEach((photo, index) => {
            const state = photoState.get(photo);
            clearReturnTimers(state);
            state.x = layout[index].x;
            state.y = layout[index].y;
            state.rotation = layout[index].rotation;
            photo.style.zIndex = String(2 + ((index * 7 + layoutIndex * 3) % 15));
            setPosition(photo, state, true);
        });
        resetIdleTimer();
    }

    function resetIdleTimer() {
        clearTimeout(idleTimer);
        if (reducedMotion) return;
        idleTimer = setTimeout(rearrangePhotos, 20000);
    }

    resetIdleTimer();
});

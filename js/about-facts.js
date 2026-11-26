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
        5: "I can sing at least one song from every animated Disney movie.\nMost of the time it’s recognizable. (DisneySea, Tokyo)",
        6: "My favorite book series is The Shadowhunter Chronicles by Cassandra Clare. I’m also a fan of V. E. Schwab. And I still want a coat like Kell’s.",
        7: "Instead of law school, I almost went for a Ph.D. in Egyptology.\nJoke’s on me, though—graphic design is where it’s at!\n...Only took me a couple decades to figure it out. (Giza, Egypt)",
        8: "I marked my territory in all 50 states before I turned 30. (Fenway, Boston)",
        9: "I typically read 3–5 books a week. Audiobooks count.\nConvince me otherwise.",
        10: "I taught myself to lay tile, designed the patterns, and installed it all myself throughout my house—including a master bath that I MAY have gotten a little carried away with.\nBut I give myself a 5 star review.",
        11: "I played varsity softball and basketball in college, but now my body is vehemently against three-a-day practices. (Averett University, Virginia)",
        14: "My favorite movies are Kill Bill 1 & 2.",
        15: "My favorite graphic design experience is teamLab Borderless in Tokyo.",
        16: "I have visited 23 countries.\nHopefully, none of them remember my escapades too well. (Napolean's Army Soldier, Bratislava, Slovakia)",
        19: "When I have free weekends, I love taking the dogs hiking.\nUnless it’s raining, then we cuddle in a grumpy puppy puddle to guard the house from cute bunnies and dastardly squirrels. (Ravensdale, Washington)",
        20: "My dad and I make cigar box guitars. Actual guitars, made from actual cigar boxes.",
        21: "I love being on or in the water.\nSo does my aptly named dog, Cap’t Bexley.",
        22: "My happy place is on a volleyball court.\nAnywhere, anytime. (Seaside, Oregon)",
        24: "Sushi is my favorite food. Hold the cream cheese, please. (Fujisawa, Japan)",
        27: "I taught Judge Harley to judge. I can send you adorable pictures of her being judgmental.",
        28: "My mom is a fabulous quilter. I have more than 20 of her quilts, so I basically live in a blanket house.",
        29: "My (still functional!) microwave was bought at Target in 2006 for around $20. Old Smokey.",
        32: "Pizza is my go-to- broke person, can’t cook, don’t wanna-food.",
        33: "I donated my hair to Wigs4Kids. This was my first donation! (Lansing, Michigan)",
        34: "I am cold ALL the time. This photo happens to be from a backpacking trip...in the summer.",
        36: "I became a certified scuba diver in my 20s. Who doesn’t like a good dive? (Grand Cayman Island)",
        37: "Sushi is my favorite!\nBut hold the cream cheese, you monster!",
        38: "I’ve climbed the Space Needle stairs three times. #tired",
        39: "I make awesome helpful/useless (depending on who you ask) projects. Yes, that is a Nicolas Cage spinpaint masterpiece, a Leonardo Bop-it turkey trophy, and Minion trophies."
    };

     const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const stateByPhoto = new Map();
    let selectedPhoto = null;
    let activeDrag = null;
    let overlayTimer = null;
    let shrinkTimer = null;
    let idleTimer = null;
    let lastFrame = 0;

    /* =========================================
       CIRCULAR ORBIT
       Each photo follows its own point around one loose ring.
       The central heading sits above the photos, so they can pass
       visually underneath it.
       ========================================= */
    const count = photos.length;
    const stageRect = () => stage.getBoundingClientRect();

    photos.forEach((photo, index) => {
        // Golden-angle spacing avoids evenly spaced pairs while keeping a loose ring.
        const angle = (index * 2.399963229728653) - Math.PI / 2 + Math.sin(index * 4.17) * 0.19;
        // Set the frame to the image's natural proportions so portrait and
        // landscape photos both display completely instead of being squeezed.
        const img = photo.querySelector("img");
        const naturalWidth = img && img.naturalWidth ? img.naturalWidth : 4;
        const naturalHeight = img && img.naturalHeight ? img.naturalHeight : 3;
        const ratio = naturalWidth / naturalHeight;
        let width = Math.min(126, 98 * ratio);
        let height = width / ratio;
        if (height > 98) {
            height = 98;
            width = height * ratio;
        }
        const state = {
            angle,
            // Slightly different speeds and radii keep photos from travelling in pairs.
            orbitSpeed: 0.000024 + ((index * 37) % 13) * 0.00000135,
            radiusX: 34 + ((index * 17) % 11) * 0.82,
            radiusY: 35 + ((index * 23) % 10) * 0.78,
            rotation: Math.sin(index * 2.1) * 9,
            phase: index * 1.37,
            free: false,
            returning: false,
            returnTimer: null,
            returnEndTimer: null,
            x: 50,
            y: 50,
            vx: 0,
            vy: 0
        };
        stateByPhoto.set(photo, state);
        photo.style.setProperty("--photo-width", width + "px");
        photo.style.setProperty("--photo-height", height + "px");
        if (img && !img.complete) {
            img.addEventListener("load", () => {
                const imageRatio = img.naturalWidth / img.naturalHeight;
                let imageWidth = Math.min(126, 98 * imageRatio);
                let imageHeight = imageWidth / imageRatio;
                if (imageHeight > 98) {
                    imageHeight = 98;
                    imageWidth = imageHeight * imageRatio;
                }
                photo.style.setProperty("--photo-width", imageWidth + "px");
                photo.style.setProperty("--photo-height", imageHeight + "px");
            }, { once: true });
        }
        photo.style.setProperty("--photo-rotation", state.rotation + "deg");
        photo.style.setProperty("--photo-x", "50%");
        photo.style.setProperty("--photo-y", "50%");
        photo.dataset.wasDragged = "false";
        photo.style.zIndex = String(2 + ((index * 7) % 16));
    });

    function orbitPoint(state, time) {
        const angle = state.angle + time * state.orbitSpeed;
        const wobble = Math.sin(time * 0.00045 + state.phase) * 1.5;
        return {
            x: 50 + Math.cos(angle) * (state.radiusX + wobble),
            y: 50 + Math.sin(angle) * (state.radiusY + wobble * 0.7)
        };
    }
	
/* =========================================
COLLISION-AWARE ORBIT POSITIONS
Choose an open landing point so returning
photos do not converge into stacks.
========================================= */

    const returnReservations = [];

    function releaseReservation(state) {
        if (!state.returnReservation) return;

        const index = returnReservations.indexOf(state.returnReservation);
        if (index !== -1) returnReservations.splice(index, 1);

        state.returnReservation = null;
    }

    function chooseReturnPoint(photo, duration) {
        const state = stateByPhoto.get(photo);
        const rect = stageRect();
        const arrivalTime = performance.now() + duration;

        const photoRect = photo.getBoundingClientRect();
        const photoWidth = photoRect.width;
        const photoHeight = photoRect.height;

        let bestPoint = null;
        let bestAngle = state.angle;
        let bestScore = -Infinity;

        // Test many possible positions around the orbit.
        for (let i = 0; i < 120; i++) {
            const candidateAngle = (i / 120) * Math.PI * 2;

            const testState = {
                ...state,
                angle: candidateAngle - arrivalTime * state.orbitSpeed
            };

            const point = orbitPoint(testState, arrivalTime);

            let nearestScore = Infinity;

            // Compare against every other photo's current position.
            photos.forEach(other => {
                if (other === photo) return;

                const otherState = stateByPhoto.get(other);
                const otherRect = other.getBoundingClientRect();

                const dx = (point.x - otherState.x) / 100 * rect.width;
                const dy = (point.y - otherState.y) / 100 * rect.height;
                const distance = Math.sqrt(dx * dx + dy * dy);

                const requiredDistance =
                    (Math.max(photoWidth, photoHeight) +
                     Math.max(otherRect.width, otherRect.height)) / 2 + 24;

                nearestScore = Math.min(
                    nearestScore,
                    distance / requiredDistance
                );
            });

            returnReservations.forEach(reservation => {
                if (reservation.photo === photo) return;

                const dx = (point.x - reservation.x) / 100 * rect.width;
                const dy = (point.y - reservation.y) / 100 * rect.height;
                const distance = Math.sqrt(dx * dx + dy * dy);

                const requiredDistance =
                    (Math.max(photoWidth, photoHeight) +
                     reservation.size) / 2 + 24;

                nearestScore = Math.min(
                    nearestScore,
                    distance / requiredDistance
                );
            });

            if (nearestScore > bestScore) {
                bestScore = nearestScore;
                bestPoint = point;
                bestAngle = testState.angle;
            }
        }

        // Keep the orbit synchronized with the chosen arrival position.
        state.angle = bestAngle;

        const reservation = {
            photo,
            x: bestPoint.x,
            y: bestPoint.y,
            size: Math.max(photoWidth, photoHeight)
        };

        returnReservations.push(reservation);
        state.returnReservation = reservation;

        return bestPoint;
    }

    function applyPosition(photo, x, y) {
        const rect = stageRect();
        const photoRect = photo.getBoundingClientRect();
        const halfW = photoRect.width / Math.max(1, rect.width) * 50;
        const halfH = photoRect.height / Math.max(1, rect.height) * 50;
        const safeX = clamp(x, halfW, 100 - halfW);
        const safeY = clamp(y, halfH, 100 - halfH);
        photo.style.setProperty("--photo-x", safeX + "%");
        photo.style.setProperty("--photo-y", safeY + "%");
        const state = stateByPhoto.get(photo);
        state.x = safeX;
        state.y = safeY;
    }

    function animate(time) {
        if (!reducedMotion) {
            photos.forEach(photo => {
                const state = stateByPhoto.get(photo);
                if (photo === selectedPhoto || state.free || state.returning || (activeDrag && activeDrag.photo === photo)) return;

                const point = orbitPoint(state, time);
                const bob = Math.sin(time * 0.0012 + state.phase) * 0.65;
                applyPosition(photo, point.x, point.y + bob);
            });
        }
        lastFrame = time;
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    /* =========================================
       SELECTION, FACT FADE, AND DELAYED SHRINK
       ========================================= */
    function clearOverlayTimers() {
        clearTimeout(overlayTimer);
        clearTimeout(shrinkTimer);
        overlayTimer = null;
        shrinkTimer = null;
    }

    function resetFactTimers() {
        if (!selectedPhoto) return;

        clearOverlayTimers();

        const overlay = selectedPhoto.querySelector(".fact-photo-overlay");
        if (!overlay) return;

        overlay.classList.remove("is-faded");
        selectedPhoto.classList.remove("is-shrinking");

        // Show the story for 15 seconds.
        overlayTimer = setTimeout(() => {
            if (!selectedPhoto) return;

            const current = selectedPhoto;
            const currentOverlay = current.querySelector(".fact-photo-overlay");

            // Fade the story.
            if (currentOverlay) {
                currentOverlay.classList.add("is-faded");
            }

            // Leave the enlarged photo visible for another 4 seconds
            // after the story has disappeared.
            shrinkTimer = setTimeout(() => {
                if (selectedPhoto !== current) return;

                const state = stateByPhoto.get(current);
                const shrinkDuration = 4500;

                clearReturnTimers(state);
                releaseReservation(state);

                // Select an unoccupied destination for the shrinking photo.
                const point = chooseReturnPoint(current, shrinkDuration);

                state.returning = true;
                state.free = false;

                // Begin the gradual shrink and movement together.
                current.classList.remove("is-selected");
                current.classList.add("is-shrinking");

                current.style.transition =
                    "left 4.5s cubic-bezier(.2,.72,.2,1), " +
                    "top 4.5s cubic-bezier(.2,.72,.2,1)";

                applyPosition(current, point.x, point.y);

                selectedPhoto = null;

                if (currentOverlay) currentOverlay.remove();

                // Resume the normal orbit after the transition completes.
                setTimeout(() => {
                    current.classList.remove("is-shrinking");
                    current.style.transition = "";

                    state.returning = false;
                    state.free = false;

                    releaseReservation(state);
                    current.style.zIndex = "";
                }, 4600);

                resetIdleTimer();

            }, 5700);

        }, 15000);
    }

    function closeFact() {
        if (!selectedPhoto) return;
        const photo = selectedPhoto;
        clearOverlayTimers();
        const overlay = photo.querySelector(".fact-photo-overlay");
        if (overlay) overlay.remove();
        photo.classList.remove("is-selected", "is-shrinking");
        selectedPhoto = null;
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
        photo.classList.remove("is-shrinking");
        photo.classList.add("is-selected");

        const overlay = document.createElement("div");
        overlay.className = "fact-photo-overlay";
        const text = document.createElement("p");
        text.className = "fact-photo-text";
        text.textContent = fact;
        overlay.appendChild(text);
        photo.appendChild(overlay);
        resetFactTimers();
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
            if (selectedPhoto === photo) resetFactTimers();
        });
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeFact();
    });

    section.addEventListener("click", event => {
        if (selectedPhoto && !event.target.closest(".fact-photo")) closeFact();
    });

    /* =========================================
       DRAG, TOSS, AND RETURN TO ORBIT
       ========================================= */
    function clearReturnTimers(state) {
        clearTimeout(state.returnTimer);
        clearTimeout(state.returnEndTimer);
        state.returnTimer = null;
        state.returnEndTimer = null;
        state.returning = false;
    }

    function returnPhoto(photo) {
        const state = stateByPhoto.get(photo);
        if (!state || reducedMotion || photo === selectedPhoto) return;

        clearReturnTimers(state);
        releaseReservation(state);

        const returnDuration = 5200;

        const point = chooseReturnPoint(photo, returnDuration);

        state.returning = true;

        photo.style.transition =
            "left 5.2s cubic-bezier(.2,.72,.2,1), " +
            "top 5.2s cubic-bezier(.2,.72,.2,1)";

        applyPosition(photo, point.x, point.y);

        state.returnEndTimer = setTimeout(() => {
            state.returning = false;
            state.free = false;

            photo.style.transition = "";
            photo.style.zIndex = "";

            releaseReservation(state);
        }, 5350);
    }

    function tossPhoto(photo, velocityX, velocityY) {
        if (reducedMotion) {
            stateByPhoto.get(photo).free = false;
            return;
        }
        const state = stateByPhoto.get(photo);
        const rect = stageRect();
        let x = state.x;
        let y = state.y;
        let vx = velocityX * 0.42;
        let vy = velocityY * 0.42;
        let previous = performance.now();

        state.free = true;
        function move(time) {
            const elapsed = Math.min(32, time - previous);
            previous = time;
            x += vx * elapsed / rect.width * 100;
            y += vy * elapsed / rect.height * 100;

            const currentRect = photo.getBoundingClientRect();
            const halfW = currentRect.width / rect.width * 50;
            const halfH = currentRect.height / rect.height * 50;

            if (x < halfW || x > 100 - halfW) {
                vx *= -0.38;
                x = clamp(x, halfW, 100 - halfW);
            }
            if (y < halfH || y > 100 - halfH) {
                vy *= -0.38;
                y = clamp(y, halfH, 100 - halfH);
            }

            applyPosition(photo, x, y);
            vx *= 0.94;
            vy *= 0.94;

            if (Math.abs(vx) + Math.abs(vy) > 0.016) {
                requestAnimationFrame(move);
            } else {
                photo.style.zIndex = "";
                state.returnTimer = setTimeout(() => returnPhoto(photo), 9000);
            }
        }
        requestAnimationFrame(move);
    }

    photos.forEach(photo => {
        photo.addEventListener("pointerdown", event => {
            if (event.button !== 0 || photo === selectedPhoto) return;
            closeFact();

            const state = stateByPhoto.get(photo);
            clearReturnTimers(state);
            state.free = true;

            activeDrag = {
                photo,
                pointerId: event.pointerId,
                startX: event.clientX,
                startY: event.clientY,
                lastX: event.clientX,
                lastY: event.clientY,
                lastTime: performance.now(),
                velocityX: 0,
                velocityY: 0,
                moved: false
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
            if (Math.abs(dx) > 4 || Math.abs(dy) > 4) drag.moved = true;
            if (!drag.moved) return;

            const rect = stageRect();
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
            applyPosition(photo, x, y);
            photo.style.zIndex = "60";
        });

        function finishDrag() {
            if (!activeDrag || activeDrag.photo !== photo) return;
            const drag = activeDrag;
            activeDrag = null;
            photo.classList.remove("is-dragging");
            photo.style.transition = "";

            if (drag.moved) {
                photo.dataset.wasDragged = "true";
                setTimeout(() => { photo.dataset.wasDragged = "false"; }, 400);
                tossPhoto(photo, drag.velocityX, drag.velocityY);
            } else {
                stateByPhoto.get(photo).free = false;
                photo.style.zIndex = "";
            }
            resetIdleTimer();
        }

        photo.addEventListener("pointerup", finishDrag);
        photo.addEventListener("pointercancel", finishDrag);
    });

    /* =========================================
       QUIET, CONSISTENT ORBIT
       Keep the circle as the recognizable composition. Individual photo
       speeds and gentle wobble provide movement without periodically
       reshaping the entire constellation.
       ========================================= */
    function resetIdleTimer() {
        clearTimeout(idleTimer);
        // The orbit no longer changes shape on a timer; it remains consistent.
    }

    resetIdleTimer();
});
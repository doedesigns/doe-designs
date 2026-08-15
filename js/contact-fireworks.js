document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // ELEMENTS
    // ==========================================

    const canvas = document.getElementById("fireworks");
    const button = document.getElementById("submitButton");

    if (!canvas || !button) return;

    const ctx = canvas.getContext("2d");

    // ==========================================
    // ARRAYS
    // ==========================================

    const fireworks = [];
    const dust = [];

    // ==========================================
    // COLORS
    // ==========================================

    const fireworkColors = [

        "#00E5FF",   // cyan
        "#2455C3",   // blue
        "#7A2FA8",   // purple
        "#168A5A"    // green

    ];
	
	const dustColors = [

        "rgba(255,255,255,.20)",
        "rgba(0,229,255,.16)",
        "rgba(36,85,195,.14)"

    ];

    // ==========================================
    // RESIZE
    // ==========================================

    function resizeCanvas() {

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

    }

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    // ==========================================
    // DUST PARTICLES
    // ==========================================

    class Dust {

        constructor() {

            this.reset(true);

        }

        reset(randomY = false) {

            this.x = Math.random() * canvas.width;

            this.y = randomY
                ? Math.random() * canvas.height
			: canvas.height + 20;

            this.size = 1 + Math.random() * 2.5;

            this.speed = 0.12 + Math.random() * 0.30;

            this.drift = (Math.random() - .5) * .25;

            this.opacity = .08 + Math.random() * .18;

            this.color = dustColors[
                Math.floor(Math.random() * dustColors.length)
            ];

        }

        update() {

            this.y -= this.speed;
            this.x += this.drift;

            if (this.y < -20) {

                this.reset(false);

            }

            if (this.x < -10) this.x = canvas.width + 10;
            if (this.x > canvas.width + 10) this.x = -10;

        }

        draw() {

            ctx.save();

            ctx.globalAlpha = this.opacity;

            ctx.fillStyle = this.color;

            ctx.beginPath();
			
			ctx.arc(
                this.x,
                this.y,
                this.size,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.restore();

        }

    }

    // ==========================================
    // CREATE DUST
    // ==========================================

    const dustAmount =
        window.innerWidth < 700 ? 40 : 90;

    for (let i = 0; i < dustAmount; i++) {

        dust.push(new Dust());

    }

    // ==========================================
    // FIREWORK PARTICLE
    // ==========================================

    class FireworkParticle {

        constructor(x, y, color) {

            const angle = Math.random() * Math.PI * 2;

            const speed = 3 + Math.random() * 6;
			
			this.x = x;
            this.y = y;

            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;

            this.life = 70 + Math.random() * 25;
            this.maxLife = this.life;

            this.size = 2 + Math.random() * 3;

            this.color =
                Math.random() < .30
                    ? "#FFFFFF"
                    : color;

        }

        update() {

            this.x += this.vx;
            this.y += this.vy;

            this.vx *= .96;
            this.vy *= .96;

            this.vy += .035;

            this.life--;

        }

        draw() {

            ctx.save();

            ctx.globalAlpha =
                this.life / this.maxLife;

            ctx.shadowBlur = 18;
            ctx.shadowColor = this.color;
			
			ctx.fillStyle = this.color;

            ctx.beginPath();

            ctx.arc(
                this.x,
                this.y,
                this.size,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.restore();

        }

    }

    // ==========================================
    // FIREWORK BURST
    // ==========================================

    function burst(x, y) {

        const color =
            fireworkColors[
                Math.floor(
                    Math.random() *
                    fireworkColors.length
                )
            ];

        for (let i = 0; i < 70; i++) {

            fireworks.push(

                new FireworkParticle(
                    x,
                    y,
					
			color
                )

            );

        }

    }
	
	// ==========================================
    // ANIMATION LOOP
    // ==========================================

    function animate() {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        // ----------------------
        // Dust
        // ----------------------

        dust.forEach(d => {

            d.update();
            d.draw();

        });

        // ----------------------
        // Fireworks
        // ----------------------

        for (let i = fireworks.length - 1; i >= 0; i--) {

            const particle = fireworks[i];

            particle.update();
            particle.draw();

            if (particle.life <= 0) {

                fireworks.splice(i, 1);

            }
			
			}

        requestAnimationFrame(animate);

    }

    animate();


    // ==========================================
    // SUBMIT BUTTON
    // ==========================================

    button.addEventListener("click", (e) => {

        e.preventDefault();

        const rect = button.getBoundingClientRect();

        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        // Multiple bursts

        for (let i = 0; i < 6; i++) {

            setTimeout(() => {

                burst(x, y);

            }, i * 120);

        }

        // Wait for celebration

        setTimeout(() => {

            const form =
                document.getElementById("contactForm");
			
			const thankYou =
                document.getElementById("thankYou");

            const paper =
                document.querySelector(".contact-paper");

            // --------------------------
            // Hide form
            // --------------------------

            if (form) {

                form.style.display = "none";

            }

            // --------------------------
            // Show thank you
            // --------------------------

            if (thankYou) {

                thankYou.style.display = "block";

            }

            // --------------------------
            // Paper shake
            // --------------------------

            if (paper) {

                paper.classList.add("paper-shake");

                setTimeout(() => {

                    paper.classList.remove("paper-shake");

                }, 500);

            }

			// --------------------------
            // Continue fireworks
            // --------------------------

            let celebration = 0;

            const celebrationInterval = setInterval(() => {

                const margin = 150;

                const side = Math.floor(Math.random() * 4);

                let fx;
                let fy;

                switch (side) {

                    case 0: // top

                        fx = Math.random() * canvas.width;
                        fy = margin;

                        break;

                    case 1: // right

                        fx = canvas.width - margin;
                        fy = Math.random() * canvas.height;

                        break;

                    case 2: // bottom

                        fx = Math.random() * canvas.width;
                        fy = canvas.height - margin;

                        break;

                    default: // left

                        fx = margin;
						
						fy = Math.random() * canvas.height;

                }

                burst(fx, fy);

                celebration++;

                if (celebration > 12) {

                    clearInterval(
                        celebrationInterval
                    );

                }

            }, 500);

        }, 1200);

    });

});
			
document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("fireworks");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let particles = [];

    let fireworkTimer = null;

    // =====================================
    // Canvas
    // =====================================

    function resizeCanvas() {

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

    }

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    // =====================================
    // Colors
    // =====================================

    const colors = [

        "#00E5FF",
        "#2455C3",
        "#7A2FA8",
        "#168A5A"

    ];

    // =====================================
    // Particle
    // =====================================

    class Particle {

        constructor(x, y, color) {

            const angle = Math.random() * Math.PI * 2;

            const speed = 2 + Math.random() * 4;

            this.x = x;
            this.y = y;

            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;

            this.life = 90 + Math.random() * 35;
            this.maxLife = this.life;

            this.size = 2 + Math.random() * 3;

            this.color = Math.random() < .30
                ? "#FFFFFF"
                : color;

        }

        update() {

            this.x += this.vx;
            this.y += this.vy;

            this.vx *= .985;
            this.vy *= .985;

            this.vy += .03;

            this.life--;

        }

        draw() {

            ctx.save();

            ctx.globalAlpha =
                this.life / this.maxLife;

            ctx.fillStyle = this.color;

            ctx.shadowBlur = 22;
            ctx.shadowColor = this.color;

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

    // =====================================
    // Explosion
    // =====================================

    function explode(x, y) {

        const color =
            colors[
                Math.floor(
                    Math.random() * colors.length
                )
            ];

        const amount =
            window.innerWidth < 700 ? 35 : 60;

        for (let i = 0; i < amount; i++) {

            particles.push(

                new Particle(
                    x,
                    y,
                    color
                )

            );

        }

    }

    // =====================================
    // Random Burst
    // =====================================

    function randomBurst() {

        const margin = 120;

        const x =
            margin +
            Math.random() *
            (canvas.width - margin * 2);

        const y =
            margin +
            Math.random() *
            (canvas.height - margin * 2);

        explode(x, y);

    }

    // =====================================
    // Hover Start
    // =====================================

    function startCelebration() {

        if (fireworkTimer) return;

        randomBurst();

        fireworkTimer = setInterval(() => {

            randomBurst();

        }, 550);

    }

    // =====================================
    // Hover End
    // =====================================

    function stopCelebration() {

        clearInterval(fireworkTimer);

        fireworkTimer = null;

    }

    // =====================================
    // Listen
    // =====================================

    document.addEventListener("launchFirework", () => {

        startCelebration();

    });

    document.addEventListener("stopFirework", () => {

        stopCelebration();

    });

    // =====================================
    // Animate
    // =====================================

    function animate() {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        particles = particles.filter(p => {

            p.update();
            p.draw();

            return p.life > 0;

        });

        requestAnimationFrame(animate);

    }

    animate();

});
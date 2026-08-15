document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("effects");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");


    function resize(){

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

    }

    resize();

    window.addEventListener("resize", resize);


    const colors = [
        "rgba(0,229,255,.45)",
        "rgba(255,255,255,.25)"
    ];


    let hoverArea = null;


    class Drop {

        constructor(){

            this.reset();

        }


        reset(){

            if(hoverArea){

                this.x =
                    hoverArea.left +
                    Math.random() *
                    (hoverArea.right - hoverArea.left);

            } else {

                this.x = -100;

            }


            this.y =
                -Math.random() * canvas.height;


            this.length =
                20 + Math.random()*50;


            this.speed =
                4 + Math.random()*5;


            this.alpha =
                .2 + Math.random()*.4;


            this.color =
                colors[
                    Math.floor(
                        Math.random()*colors.length
                    )
                ];

        }


        update(){

            if(!hoverArea) return;


            this.y += this.speed;


            if(this.y > canvas.height){

                this.reset();

            }

        }


        draw(){

            if(!hoverArea) return;


            ctx.save();

            ctx.globalAlpha = this.alpha;

            ctx.strokeStyle = this.color;

            ctx.lineWidth = 1;

            ctx.shadowBlur = 8;

            ctx.shadowColor="#00E5FF";


            ctx.beginPath();

            ctx.moveTo(
                this.x,
                this.y
            );

            ctx.lineTo(
                this.x,
                this.y + this.length
            );

            ctx.stroke();

            ctx.restore();

        }

    }



    const drops = [];

    const amount =
        window.innerWidth < 700 ? 35 : 80;


    for(let i=0;i<amount;i++){

        drops.push(
            new Drop()
        );

    }



    document.querySelectorAll(".design-card")
    .forEach(card=>{


        card.addEventListener("mouseenter",()=>{


            const rect =
                card.getBoundingClientRect();


            hoverArea={

                left:rect.left - 40,

                right:rect.right + 40

            };


            drops.forEach(drop=>{

                drop.reset();

            });


        });



        card.addEventListener("mouseleave",()=>{

            hoverArea=null;

        });


    });



    function animate(){

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        drops.forEach(drop=>{

            drop.update();

            drop.draw();

        });


        requestAnimationFrame(animate);

    }


    animate();


});
document.addEventListener("DOMContentLoaded",()=>{


/* ===================================
GLOBAL PAGE DUST
(KEEPING EXISTING WEBSITE EFFECT)
=================================== */

const globalCanvas =
document.getElementById("dust");

const colors=[
"rgba(0,229,255,.65)",
"rgba(255,255,255,.55)"
];

class GlobalDust{

constructor(canvas){
this.canvas=canvas;
this.ctx=canvas.getContext("2d");

this.x=Math.random()*canvas.width;
this.y=Math.random()*canvas.height;

this.size=
1+Math.random()*2;

this.speed=
.15+Math.random()*.45;

this.drift=
(Math.random()-.5)*.3;

this.opacity=
.25+Math.random()*.45;
this.color=
colors[
Math.floor(Math.random()*colors.length)
];
}

update(){

/* upward movement */

this.y-=this.speed;
this.x+=this.drift;

if(this.y<-10){
this.y=this.canvas.height+10;
}

if(this.x<0){
this.x=this.canvas.width;
}

if(this.x>this.canvas.width){
this.x=0;
}
}

draw(){
this.ctx.save();
this.ctx.globalAlpha=this.opacity;
this.ctx.fillStyle=this.color;
this.ctx.beginPath();
this.ctx.arc(
this.x,
this.y,
this.size,
0,
Math.PI*2
);

this.ctx.fill();
this.ctx.restore();
}
}

function createGlobalDust(canvas){
function resize(){
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
}

resize();

window.addEventListener(
"resize",
resize
);

let particles=[];
const amount=
window.innerWidth<700
?45
:100;

for(let i=0;i<amount;i++){
particles.push(
new GlobalDust(canvas)
);
}

function animate(){
const ctx=
canvas.getContext("2d");
ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);

particles.forEach(p=>{
p.update();
p.draw();
});

requestAnimationFrame(animate);
}

animate();
}

if(globalCanvas){
createGlobalDust(globalCanvas);
}

/* ===================================
ABOUT / RESUME PAPER DUST
WRAPPED FLOW EFFECT
=================================== */

const sectionCanvases=[
    document.getElementById("aboutDust"),
    document.getElementById("resumeDust")
];


class SectionDust{

    constructor(canvas){

        this.canvas=canvas;
        this.ctx=canvas.getContext("2d");

        this.reset();

    }


    reset(){

        this.x=Math.random()*this.canvas.width;
        this.y=Math.random()*this.canvas.height;

        this.size=.8+Math.random()*1.8;

        this.speed=.15+Math.random()*.35;

        this.wave=Math.random()*Math.PI*2;

        this.waveSpeed=.01+Math.random()*.02;

        this.opacity=.2+Math.random()*.4;

        this.color=
        colors[
            Math.floor(Math.random()*colors.length)
        ];

    }


    update(){

        /*
        Upward movement stays,
        but dust wraps horizontally
        instead of collecting.
        */

        this.y-=this.speed;


        this.wave+=this.waveSpeed;

        this.x+=Math.sin(this.wave)*.45;


		if(this.y < -10){

			this.y=Math.random()*this.canvas.height;

			this.x=Math.random()*this.canvas.width;

		}


        if(this.x < -10){

            this.x=this.canvas.width+10;

        }


        if(this.x > this.canvas.width+10){

            this.x=-10;

        }

    }


    draw(){

        this.ctx.save();

        this.ctx.globalAlpha=this.opacity;

        this.ctx.fillStyle=this.color;

        this.ctx.beginPath();

        this.ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI*2
        );

        this.ctx.fill();

        this.ctx.restore();

    }

}



function createSectionDust(canvas){

    function resize(){

        canvas.width=canvas.offsetWidth;

        canvas.height=canvas.offsetHeight;

    }


    resize();


    window.addEventListener(
        "resize",
        resize
    );


    let particles=[];


    const amount=
    window.innerWidth<700
    ?30
    :70;



    for(let i=0;i<amount;i++){

        particles.push(
            new SectionDust(canvas)
        );

    }



    function animate(){

        const ctx=
        canvas.getContext("2d");


        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        particles.forEach(p=>{

            p.update();

            p.draw();

        });


        requestAnimationFrame(animate);

    }


    animate();

}



sectionCanvases.forEach(canvas=>{

    if(canvas){

        createSectionDust(canvas);

    }

});
});
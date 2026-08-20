document.addEventListener("DOMContentLoaded",()=>{


const canvases=[
document.getElementById("aboutDust"),
document.getElementById("resumeDust")
];

const colors=[
"rgba(0,229,255,.65)",
"rgba(255,255,255,.45)"
];

class PaperDust{

constructor(canvas){

this.canvas=canvas;

this.ctx=canvas.getContext("2d");

this.reset(true);

}

reset(initial=false){


this.x=Math.random()*this.canvas.width;
this.y=Math.random()*this.canvas.height;

this.size=.8+Math.random()*1.5;

this.speed=.05+Math.random()*.15;

this.angle=Math.random()*Math.PI*2;

this.opacity=.15+Math.random()*.35;

this.color=
colors[
Math.floor(Math.random()*colors.length)
];


if(initial){

this.y=Math.random()*this.canvas.height;

}

}

update(){

this.angle += .01;


/* gentle horizontal drift */
this.x += Math.cos(this.angle) * .35;


/* very slight vertical movement */
this.y += Math.sin(this.angle) * .08;


if(this.x > this.canvas.width + 10){
    this.x = -10;
}

if(this.x < -10){
    this.x = this.canvas.width + 10;
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


function createPaperDust(canvas){

function resize(){

canvas.width=canvas.offsetWidth;

canvas.height=canvas.offsetHeight;

}

resize();

window.addEventListener(
"resize",
resize
);


const particles=[];

const amount=
window.innerWidth < 700
?25
:60;


for(let i=0;i<amount;i++){

particles.push(
new PaperDust(canvas)
);

}

function animate(){

const ctx=canvas.getContext("2d");

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

canvases.forEach(canvas=>{

if(canvas){

createPaperDust(canvas);

}
});
});
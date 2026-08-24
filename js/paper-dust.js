/* ===================================
   PAPER DUST
   DOE DESIGNS
   Personal Pages
=================================== */

document.addEventListener("DOMContentLoaded",()=>{

/* ===================================
   CANVAS TARGETS
=================================== */

const canvases=[
document.getElementById("aboutDust"),
document.getElementById("resumeDust")
];

/* ===================================
   COLORS
=================================== */

const colors=[
"rgba(0,229,255,.85)",
"rgba(255,255,255,.60)"
];

/* ===================================
   MOUSE POSITION
=================================== */

const mouse={
x:null,
y:null
};

window.addEventListener("mousemove",(event)=>{
mouse.x=event.clientX;
mouse.y=event.clientY;
});

/* ===================================
   PAPER DUST PARTICLE
=================================== */

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
this.angle=Math.random()*Math.PI*2;
this.opacity=.15+Math.random()*.40;
this.color=
colors[
Math.floor(Math.random()*colors.length)
];

/* cursor influence strength */

this.mousePull=.0025;
if(initial){
this.y=Math.random()*this.canvas.height;

}
}

/* ===================================
   MOVEMENT
=================================== */

update(){
/* natural floating movement */

this.angle += .01;
this.x += Math.cos(this.angle)*.35;
this.y += Math.sin(this.angle)*.08;

/* subtle cursor influence */


if(mouse.x !== null){


const rect =
this.canvas.getBoundingClientRect();
const cursorX =
mouse.x - rect.left;
const cursorY =
mouse.y - rect.top;
const dx =
this.x - cursorX;
const dy =
this.y - cursorY;
const distance =
Math.sqrt(dx*dx + dy*dy);

/* only affect nearby particles */

if(distance < 180){

const force =
(180 - distance) / 180 * .015;

this.x += dx * force;
this.y += dy * force;
}
}

if(this.x > this.canvas.width+10){

this.x=-10;

}


if(this.x < -10){

this.x=this.canvas.width+10;
}

if(this.y > this.canvas.height+10){
this.y=-10;
}

if(this.y < -10){
this.y=this.canvas.height+10;

}
}

/* ===================================
   DRAW
=================================== */

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

/* ===================================
   CREATE DUST SYSTEM
=================================== */

function createPaperDust(canvas){

function resize(){

canvas.width=
canvas.offsetWidth;
canvas.height=
canvas.offsetHeight;

}

resize();

window.addEventListener(
"resize",
resize
);

const particles=[];

/* ===================================
   DUST COUNT
=================================== */

const amount=
window.innerWidth < 700
?40
:100;

for(let i=0;i<amount;i++){


particles.push(
new PaperDust(canvas)
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

particles.forEach(particle=>{
particle.update();
particle.draw();
});

requestAnimationFrame(animate);
}

animate();
}
	
/* ===================================
   START CANVAS
=================================== */

canvases.forEach(canvas=>{
if(canvas){
createPaperDust(canvas);
}
});
});
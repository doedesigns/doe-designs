document.addEventListener("DOMContentLoaded",()=>{

const canvas=document.getElementById("dust");

if(!canvas) return;

const colors=[
"rgba(0,229,255,.65)",
"rgba(255,255,255,.55)"
];


class DustParticle{
constructor(canvas){

this.canvas=canvas;
this.ctx=canvas.getContext("2d");
this.reset();
}

reset(){
this.x=Math.random()*this.canvas.width;
this.y=Math.random()*this.canvas.height;
this.size=1+Math.random()*2;
this.speed=.15+Math.random()*.45;
this.drift=(Math.random()-.5)*.3;
this.opacity=.25+Math.random()*.45;
this.color=
colors[
Math.floor(Math.random()*colors.length)
];
}

update(){
this.y-=this.speed;
this.x+=this.drift;
if(this.y < -10){
this.y=this.canvas.height+10;
this.x=Math.random()*this.canvas.width;
}

if(this.x < 0){
this.x=this.canvas.width;
}

if(this.x > this.canvas.width){
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

function createDust(){
function resize(){
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
}

resize();
window.addEventListener(
"resize",
resize
);

const particles=[];

const amount=
window.innerWidth < 700
?45
:100;

for(let i=0;i<amount;i++){

particles.push(
new DustParticle(canvas)
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

createDust();
});
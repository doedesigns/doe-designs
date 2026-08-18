document.addEventListener("DOMContentLoaded",()=>{

const canvases=[
document.getElementById("dust"),
document.getElementById("aboutDust"),
document.getElementById("resumeDust")
];

const colors=[
"rgba(0,229,255,.65)",
"rgba(255,255,255,.55)"
];


class Dust{

constructor(canvas){

this.canvas=canvas;
this.ctx=canvas.getContext("2d");

this.x=Math.random()*canvas.width;
this.y=Math.random()*canvas.height;

this.size=1+Math.random()*2;

this.speed=.15+Math.random()*.45;

this.drift=(Math.random()-.5)*.3;

this.opacity=.25+Math.random()*.45;

this.color=colors[
Math.floor(Math.random()*colors.length)
];

}


update(){

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



function createDust(canvas){

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
?45
:100;



for(let i=0;i<amount;i++){

particles.push(
new Dust(canvas)
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

createDust(canvas);

}

});


});
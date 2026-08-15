document.addEventListener("DOMContentLoaded",()=>{


const canvas=document.getElementById("dust");

if(!canvas){
    return;
}


const ctx=canvas.getContext("2d");


let particles=[];



/* ===================================
   Canvas Setup
=================================== */


function resize(){

    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;

}


resize();


window.addEventListener(
"resize",
resize
);



/* ===================================
   Colors
=================================== */


const colors=[

"rgba(0,229,255,.65)",

"rgba(255,255,255,.55)"

];



/* ===================================
   Dust Particle
=================================== */


class Dust{


constructor(){


this.x =
Math.random()*canvas.width;


this.y =
Math.random()*canvas.height;



this.size =
1+Math.random()*2;



this.speed =
.15+Math.random()*.45;



this.drift =
(Math.random()-.5)*.3;



this.opacity =
.25+Math.random()*.45;



this.color =
colors[
Math.floor(
Math.random()*colors.length
)
];


}



update(){


this.y -= this.speed;


this.x += this.drift;



if(this.y < -10){

    this.y = canvas.height+10;

}


if(this.x < 0){

    this.x = canvas.width;

}


if(this.x > canvas.width){

    this.x = 0;

}



}



draw(){


ctx.save();


ctx.globalAlpha =
this.opacity;


ctx.fillStyle =
this.color;



ctx.beginPath();


ctx.arc(

this.x,

this.y,

this.size,

0,

Math.PI*2

);


ctx.fill();



ctx.restore();


}



}



/* ===================================
   Create Dust
=================================== */


const amount =
window.innerWidth < 700
? 45
: 100;



for(let i=0;i<amount;i++){


particles.push(
new Dust()
);


}



/* ===================================
   Animation
=================================== */


function animate(){


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



requestAnimationFrame(
animate
);


}



animate();



});
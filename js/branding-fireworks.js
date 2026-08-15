document.addEventListener("DOMContentLoaded",()=>{


const canvas=document.getElementById("fireworks");

if(!canvas){
    return;
}

const ctx=canvas.getContext("2d");

let particles=[];


function resize(){

    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;

}

resize();

window.addEventListener("resize",resize);



const colors=[

"#00E5FF",

];
	
	class Particle{


constructor(x,y,color){

const angle=Math.random()*Math.PI*2;
const speed=4+Math.random()*10;


this.x=x;
this.y=y;

this.vx=Math.cos(angle)*speed;
this.vy=Math.sin(angle)*speed;


this.life=70+Math.random()*40;
this.maxLife=this.life;


this.size=2+Math.random()*4;


this.color =
Math.random()<.40
?"#FFFFFF"
:color;


}



update(){

this.x+=this.vx;
this.y+=this.vy;
	
	this.vx*=.96;
this.vy*=.96;

this.vy+=.03;

this.life--;

}



draw(){

ctx.save();

ctx.globalAlpha=this.life/this.maxLife;

ctx.shadowBlur=18;

ctx.shadowColor=this.color;

ctx.fillStyle=this.color;


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
function explode(x,y){


const color =
colors[
Math.floor(Math.random()*colors.length)
];

	const amount =
window.innerWidth < 700 ? 40 : 90;

for(let i=0;i<90;i++){

particles.push(
new Particle(
x,
y,
color
)
);

}
}
document.querySelectorAll(".branding-card")
.forEach(card=>{
	card.addEventListener("mouseenter",()=>{


const rect=card.getBoundingClientRect();


explode(
rect.left + rect.width*0.30 + window.scrollX,
rect.top + rect.height*0.35 + window.scrollY
);
        setTimeout(()=>{

 explode(
rect.left + rect.width*0.30 + window.scrollX,
rect.top + rect.height*0.35 + window.scrollY
);

        },120);

        setTimeout(()=>{

explode(
rect.left + rect.width*0.30 + window.scrollX,
rect.top + rect.height*0.35 + window.scrollY
);

        },250);

    });

});

function animate(){


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
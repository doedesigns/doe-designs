document.addEventListener("DOMContentLoaded", () => {


/* ===================================
   RIPPLE CANVAS
=================================== */

/*
const canvas = document.getElementById("effects");

if (!canvas) return;


const ctx = canvas.getContext("2d");


function resizeCanvas(){

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}


resizeCanvas();


window.addEventListener(
"resize",
resizeCanvas
);



const ripples = [];



 function createRipple(x,y){


    ripples.push({

        x:x,

        y:y,

        radius:10,

        opacity:.35,

        speed:.6,

        maxRadius:
        160 + Math.random()*120

    });


} */

/* ===================================
   BACKGROUND RIPPLES
=================================== */

/*
function createBackgroundRipple(){


    createRipple(

        Math.random()*canvas.width,

        Math.random()*canvas.height

    );


}



setInterval(()=>{


    createBackgroundRipple();


},2500); */


/* ===================================
   MOTION PAGE VIDEO PREVIEWS
=================================== */


if(
document.body.classList.contains(
"motion-page"
)
){



document
.querySelectorAll(".motion-card")
.forEach(card=>{


const video =
card.querySelector(".motion-video");


if(!video) return;



const startTime =
Number(video.dataset.start)||0;



video.muted=true;

video.playsInline=true;



card.addEventListener(
"mouseenter",
()=>{


    video.play()
    .catch(()=>{});



    const rect =
    card.getBoundingClientRect();



    createRipple(

        rect.left + rect.width/2,

        rect.top + rect.height/2

    );


});





card.addEventListener(
"mouseleave",
()=>{


    video.pause();


    video.currentTime =
    startTime;



});



});



}







/* ===================================
   DRAW RIPPLE ANIMATION
=================================== */

/*
function animate(){



ctx.clearRect(

0,

0,

canvas.width,

canvas.height

);





for(
let i=ripples.length-1;
i>=0;
i--
){



const ripple =
ripples[i];



ripple.radius +=
ripple.speed;



ripple.opacity -=
.0018;




for(
let ring=0;
ring<3;
ring++
){


ctx.beginPath();



ctx.arc(

ripple.x,

ripple.y,

ripple.radius - (ring*22),

0,

Math.PI*2

);



ctx.strokeStyle =
`rgba(0,229,255,${
ripple.opacity*(1-ring*.25)
})`;



ctx.lineWidth=1.5;



ctx.stroke();



}




if(
ripple.opacity<=0 ||
ripple.radius>ripple.maxRadius
){


ripples.splice(
i,
1
);


}



}



requestAnimationFrame(
animate
);



}


animate();


*/
});
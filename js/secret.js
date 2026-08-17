/* ===================================
   SECRET STASH
   DOE DESIGNS
=================================== */


document.addEventListener("DOMContentLoaded", () => {


/* ===================================
   TITLE SPARKLES
=================================== */


const title = document.querySelector(".stash-title");


if(title){

    setInterval(()=>{


        const sparkle=document.createElement("span");

        sparkle.className="stash-sparkle";

        sparkle.innerHTML="✦";


        const rect=title.getBoundingClientRect();


        sparkle.style.left =
            Math.random()*rect.width + "px";

        sparkle.style.top =
            Math.random()*rect.height + "px";


        title.appendChild(sparkle);


        setTimeout(()=>{

            sparkle.remove();

        },1500);


    },450);

}




/* ===================================
   IMAGE REVEAL
=================================== */


const cards=document.querySelectorAll(".secret-card");


cards.forEach((card,index)=>{


    card.style.opacity="0";

    card.style.transform="translateY(30px)";


    setTimeout(()=>{

        card.style.transition=
        "opacity .8s ease, transform .8s ease";


        card.style.opacity="1";

        card.style.transform="translateY(0)";


    },200 + index*120);



});



/* ===================================
   VIDEO HOVER PLAY
=================================== */


const videos=document.querySelectorAll(".motion-video");


videos.forEach(video=>{


    video.addEventListener("mouseenter",()=>{

        video.play();

    });


    video.addEventListener("mouseleave",()=>{

        video.pause();

        video.currentTime=0;

    });


});


});
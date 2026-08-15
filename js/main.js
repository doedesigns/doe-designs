document.addEventListener("DOMContentLoaded", () => {

    const heroLogo = document.getElementById("heroLogo");
    const heroObject = document.getElementById("hero-object");
    const enterButton = document.getElementById("enterPortfolio");
    const heroSubtitle = document.getElementById("heroSubtitle");

    const speechBubble = document.querySelector(".speech-bubble");
    const navLogo = document.querySelector(".logo");

	if(
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
){

    document.body.classList.add("reduce-motion");

}

// ============================================
// NAV LOGO -> SHOW HERO SPEECH BUBBLE
// ============================================

if (heroLogo && speechBubble) {

    // Show once when page loads
    speechBubble.classList.add("show-hello");
    heroLogo.classList.add("show-hello");

    setTimeout(() => {
        speechBubble.classList.remove("show-hello");
    }, 6000);

    setTimeout(() => {
        heroLogo.classList.remove("show-hello");
    }, 6000);

    heroLogo.addEventListener("mouseenter", () => {

        speechBubble.classList.add("show-hello");
        speechBubble.classList.add("wave");

document.dispatchEvent(
    new CustomEvent("launchFirework")
);

    });

    heroLogo.addEventListener("mouseleave", () => {

        speechBubble.classList.remove("wave");
        speechBubble.classList.remove("show-hello");

document.dispatchEvent(
    new CustomEvent("stopFirework")
);

    });

    heroLogo.addEventListener("click", () => {

        heroLogo.classList.toggle("show-hello");

    });

}
    // ============================================
    // FIREWORKS
    // ============================================

    const fireworksIntervals = new Map();

	function triggerFireworks(element){

    document.dispatchEvent(
        new CustomEvent("launchFirework",{
            detail:{ element }
        })
    );

}
    function startFireworks(element){

    if(fireworksIntervals.has(element)){
        return;
    }

    triggerFireworks(element);

    const interval=setInterval(()=>{

        triggerFireworks(element);

    },4200);

    fireworksIntervals.set(element, interval);

}
function stopFireworks(element){

    if(fireworksIntervals.has(element)){

        clearInterval(
            fireworksIntervals.get(element)
        );
        fireworksIntervals.delete(element);
    }
}

    // ============================================
    // HERO OBJECT
    // ============================================

    if (heroObject) {

        heroObject.addEventListener("mouseenter", () => {

            heroObject.classList.add("hover");
            startFireworks(heroObject);

        });

        heroObject.addEventListener("mouseleave", () => {

            heroObject.classList.remove("hover");
            stopFireworks(heroObject);

        });

    }
	
    // ============================================
    // ENTER BUTTON
    // ============================================

    if (enterButton) {

        enterButton.addEventListener("mouseenter", () => {

            startFireworks(enterButton);

        });

        enterButton.addEventListener("mouseleave", () => {

            stopFireworks(enterButton);

        });

    }

    // ============================================
    // CONTACT DATE
    // ============================================
	
	const date=document.getElementById("contactDate");

if(date){

date.textContent= new Date()
    .toLocaleDateString("en-US",{
        year:"numeric",
        month:"long",
        day:"numeric"
    });

}
	// ============================================
    // FOOTER
    // ============================================
	const footer = document.getElementById("footerCopyright");

if (footer) {
    footer.innerHTML =
        `Copyright © ${new Date().getFullYear()} Doe Designs`;
}

    // ============================================
    // SUBTITLE
    // ============================================

    if (heroSubtitle) {

        heroSubtitle.addEventListener("mouseenter", () => {

            startFireworks(heroSubtitle);

        });

        heroSubtitle.addEventListener("mouseleave", () => {

            stopFireworks(heroSubtitle);

        });

    }
// ============================================
// PROJECT SCROLL NAV
// ============================================

const projectPage =
document.querySelector(".project-page");

const navbar =
document.querySelector(".navbar");

const projectTitleNav =
document.querySelector(".project-title-nav");


if(projectPage && navbar && projectTitleNav){

window.addEventListener("scroll",()=>{

if(window.scrollY > 80){

navbar.classList.add("project-scrolled");

}
else{

navbar.classList.remove("project-scrolled");

}

});

}

// ============================================
// RETURN TO TOP WHEN PROJECT TITLE CLICKED
// ============================================

if(projectTitleNav){

projectTitleNav.addEventListener("click",()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

});

} 
	// ============================================
// MOTION CARD HOVER VIDEO PREVIEWS
// ============================================

if (document.body.classList.contains("motion-page")) {

    document.querySelectorAll(".motion-card").forEach(card => {

        const video = card.querySelector(".motion-video");

        if (!video) return;


        card.addEventListener("mouseenter", () => {

            video.currentTime = Number(video.dataset.start || 0);

            video.play();

        });


        card.addEventListener("mouseleave", () => {

            video.pause();

            video.currentTime = Number(video.dataset.start || 0);

        });

    });

}
	// ============================================
// YOUTUBE MOTION CARD PREVIEW
// ============================================

if (document.body.classList.contains("motion-page")) {

    const youtubePreview = document.querySelector(".youtube-motion-preview");

    if (youtubePreview) {

        let youtubePlayer = null;
        let youtubeReady = false;

        const videoId = youtubePreview.dataset.videoId;
        const startTime = Number(youtubePreview.dataset.start || 0);


        // Load YouTube IFrame API
        const youtubeScript = document.createElement("script");

        youtubeScript.src = "https://www.youtube.com/iframe_api";

        document.head.appendChild(youtubeScript);


        // YouTube calls this automatically when the API is ready
        window.onYouTubeIframeAPIReady = function () {

            youtubePlayer = new YT.Player(youtubePreview, {

                videoId: videoId,

                playerVars: {
                    autoplay: 0,
                    controls: 0,
                    playsinline: 1,
                    rel: 0,
                    origin: window.location.origin
                },

                events: {

                    onReady: function (event) {

                        youtubeReady = true;

                        event.target.mute();

                        event.target.seekTo(startTime, true);

                    }

                }

            });

        };


        const youtubeCard =
            youtubePreview.closest(".youtube-motion-card");


        if (youtubeCard) {

            youtubeCard.addEventListener("mouseenter", () => {

                if (!youtubeReady || !youtubePlayer) return;

                youtubePlayer.seekTo(startTime, true);

                youtubePlayer.mute();

                youtubePlayer.playVideo();

            });


            youtubeCard.addEventListener("mouseleave", () => {

                if (!youtubeReady || !youtubePlayer) return;

                youtubePlayer.pauseVideo();

                youtubePlayer.seekTo(startTime, true);

            });

        }

    }

}
});
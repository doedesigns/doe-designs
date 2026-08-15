document.addEventListener("DOMContentLoaded", () => {

    const images = document.querySelectorAll(".lightbox-image img");

    if(!images.length) return;

    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";

    lightbox.innerHTML = `
        <div class="lightbox-box">
            <button class="lightbox-close" aria-label="Close image">
                <span></span>
            </button>
            <img class="lightbox-image-large" src="" alt="">
            <p class="lightbox-description"></p>
        </div>
    `;

    document.body.appendChild(lightbox);

    const lightboxImage =
        lightbox.querySelector(".lightbox-image-large");

    const lightboxDescription =
        lightbox.querySelector(".lightbox-description");
	const closeButton =
        lightbox.querySelector(".lightbox-close");

    images.forEach(img => {
        img.addEventListener("click", () => {
            const parent =
            img.closest(".lightbox-image");
            const description =
            parent.querySelector("p");
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            lightboxDescription.textContent =
            description ? description.textContent.trim() : "";
            lightbox.classList.add("active");
            document.body.style.overflow="hidden";
        });
    });
	
	closeButton.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click",(event)=>{
        if(event.target === lightbox){
            closeLightbox();
        }
    });

    document.addEventListener("keydown",(event)=>{
        if(event.key==="Escape"){
            closeLightbox();
        }
    });

    function closeLightbox(){
        lightbox.classList.remove("active");
        document.body.style.overflow="";
        lightboxImage.src="";
		lightboxDescription.textContent="";
    }
});
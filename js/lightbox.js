document.addEventListener("DOMContentLoaded", () => {

    const images = document.querySelectorAll(".lightbox-image");

    if (!images.length) return;


    // CREATE LIGHTBOX

    const lightbox = document.createElement("div");

    lightbox.className = "lightbox";


    lightbox.innerHTML = `

        <div class="lightbox-box">

            <button class="lightbox-close" aria-label="Close image">
                <span></span>
            </button>

            <img class="lightbox-image-large" src="" alt="">

        </div>

    `;


    document.body.appendChild(lightbox);


    const lightboxImage =
        lightbox.querySelector(".lightbox-image-large");

    const closeButton =
		     lightbox.querySelector(".lightbox-close");



    // OPEN IMAGE

    images.forEach(image => {

        image.addEventListener("click", () => {

            lightboxImage.src = image.src;
            lightboxImage.alt = image.alt;

            lightbox.classList.add("active");

            document.body.style.overflow = "hidden";

        });

    });



    // CLOSE BUTTON

    closeButton.addEventListener("click", () => {

        closeLightbox();

    });



    // CLICK OUTSIDE IMAGE CLOSES
	 lightbox.addEventListener("click", (event) => {

        if(event.target === lightbox){

            closeLightbox();

        }

    });



    // ESC KEY CLOSE

    document.addEventListener("keydown", (event) => {

        if(event.key === "Escape"){

            closeLightbox();

        }

    });



    function closeLightbox(){

        lightbox.classList.remove("active");

        document.body.style.overflow = "";

        lightboxImage.src = "";

    }
});
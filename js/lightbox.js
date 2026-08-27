document.addEventListener("DOMContentLoaded", () => {

    const images = document.querySelectorAll(".lightbox-image img");

    if (!images.length) return;


    /* ===================================
       CREATE LIGHTBOX
    =================================== */

    const lightbox = document.createElement("div");

    lightbox.className = "lightbox";

    lightbox.innerHTML = `
        <div class="lightbox-box">

            <button class="lightbox-close" aria-label="Close image">
                <span></span>
            </button>

            <img
                class="lightbox-image-large"
                src=""
                alt="">

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


    /* ===================================
       OPEN LIGHTBOX
    =================================== */

    images.forEach(img => {

        img.addEventListener("click", () => {

            let description = "";


            /* ===================================
               MOTION PROJECTS
               FIND FIGCAPTION
            =================================== */

            const figure = img.closest("figure");

            if (figure) {

                const caption =
                    figure.querySelector("figcaption");

                if (caption) {

                    description =
                        caption.textContent.trim();

                }

            }


            /* ===================================
               BRANDING / DESIGN PROJECTS
               FIND DESCRIPTION PARAGRAPH
            =================================== */

            if (!description) {

                const projectBlock =
                    img.closest(".project-image-block");

                if (projectBlock) {

                    const paragraph =
                        projectBlock.querySelector("p");

                    if (paragraph) {

                        description =
                            paragraph.textContent.trim();

                    }

                }

            }


            /* ===================================
               LOAD IMAGE + DESCRIPTION
            =================================== */

            lightboxImage.src = img.src;

            lightboxImage.alt = img.alt;

            lightboxDescription.textContent =
                description;


            /* ===================================
               OPEN LIGHTBOX
            =================================== */

            lightbox.classList.add("active");

            document.body.style.overflow = "hidden";

        });

    });


    /* ===================================
       CLOSE BUTTON
    =================================== */

    closeButton.addEventListener(
        "click",
        closeLightbox
    );


    /* ===================================
       CLICK OUTSIDE LIGHTBOX
    =================================== */

    lightbox.addEventListener(
        "click",
        (event) => {

            if (event.target === lightbox) {

                closeLightbox();

            }

        }
    );


    /* ===================================
       ESCAPE KEY
    =================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {

                closeLightbox();

            }

        }
    );


    /* ===================================
       CLOSE FUNCTION
    =================================== */

    function closeLightbox() {

        lightbox.classList.remove("active");

        document.body.style.overflow = "";

        lightboxImage.src = "";

        lightboxDescription.textContent = "";

    }

});
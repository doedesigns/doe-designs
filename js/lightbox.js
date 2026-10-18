/* =========================================
   SHARED PORTFOLIO LIGHTBOX
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const lightboxTriggers = document.querySelectorAll(
        ".lightbox-image img"
    );

    if (!lightboxTriggers.length) return;

    /* CREATE THE LIGHTBOX */

    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Project image details");

    lightbox.innerHTML = `
        <div class="lightbox-box">

            <button
                class="lightbox-close"
                type="button"
                aria-label="Close image">
                <span></span>
            </button>

            <div class="lightbox-main">

                <div class="lightbox-image-panel">
                    <img
                        class="lightbox-image-large"
                        src=""
                        alt="">
                </div>

                <div class="lightbox-content">

                    <div class="lightbox-text-content">
                        <h2 class="lightbox-title"></h2>
                        <div class="lightbox-description"></div>
                    </div>

                    <div
                        class="lightbox-supporting-images"
                        hidden>
                    </div>

                </div>

            </div>
        </div>
    `;

    document.body.appendChild(lightbox);

    const lightboxBox = lightbox.querySelector(".lightbox-box");
    const closeButton = lightbox.querySelector(".lightbox-close");
    const largeImage = lightbox.querySelector(".lightbox-image-large");
    const titleElement = lightbox.querySelector(".lightbox-title");
    const descriptionElement = lightbox.querySelector(
        ".lightbox-description"
    );
    const supportingImages = lightbox.querySelector(
        ".lightbox-supporting-images"
    );

    let previouslyFocusedElement = null;

    /* FIND THE EXISTING IMAGE CAPTION */

    function getCaptionElement(img) {
        const parent = img.closest("figure");

        if (parent) {
            const figcaption = parent.querySelector("figcaption");
            if (figcaption) return figcaption;
        }

        const container = img.closest(".project-image-block");

        if (container) {
            return container.querySelector("p");
        }

        return null;
    }

    /* GET THE LIGHTBOX TITLE */

    function getImageTitle(img, caption) {
        const customTitle = img.getAttribute("data-lightbox-title");

        if (customTitle) return customTitle;

        if (caption) {
            const strong = caption.querySelector("strong");

            if (strong && strong.textContent.trim()) {
                return strong.textContent.trim();
            }
        }

        return img.alt || "Project image";
    }

    /* GET THE LIGHTBOX DESCRIPTION */

    function getImageDescription(img, caption) {
        const customDescription = img.getAttribute(
            "data-lightbox-text"
        );

        if (customDescription) return customDescription;

        if (caption) {
            const captionClone = caption.cloneNode(true);
            const strong = captionClone.querySelector("strong");

            if (strong) strong.remove();

            return captionClone.textContent.trim();
        }

        return "";
    }

    /* ADD OPTIONAL SUPPORTING IMAGES */

    function addSupportingImage(img, number) {
        const source = img.getAttribute(
            `data-lightbox-support-${number}`
        );

        if (!source) return;

        const alt = img.getAttribute(
            `data-lightbox-support-${number}-alt`
        ) || "Supporting design image";

        const caption = img.getAttribute(
            `data-lightbox-support-${number}-caption`
        ) || "";

        const figure = document.createElement("figure");
        figure.className = "lightbox-support-item";

        const supportImage = document.createElement("img");
        supportImage.src = source;
        supportImage.alt = alt;
        supportImage.loading = "lazy";

        figure.appendChild(supportImage);

        if (caption) {
            const figcaption = document.createElement("figcaption");
            figcaption.textContent = caption;
            figure.appendChild(figcaption);
        }

        supportingImages.appendChild(figure);
    }

    /* OPEN THE LIGHTBOX */

    function openLightbox(img) {
        previouslyFocusedElement = document.activeElement;

        const caption = getCaptionElement(img);

        largeImage.src = img.currentSrc || img.src;
        largeImage.alt = img.alt || "";

        titleElement.textContent = getImageTitle(img, caption);

        descriptionElement.textContent = getImageDescription(
            img,
            caption
        );

        supportingImages.replaceChildren();

        addSupportingImage(img, 1);
        addSupportingImage(img, 2);

        const hasSupportingImages = supportingImages.children.length > 0;

        supportingImages.hidden = !hasSupportingImages;

        lightbox.classList.add("active");
        document.body.classList.add("lightbox-open");
        document.body.style.overflow = "hidden";

        closeButton.focus();
    }

    /* CLOSE THE LIGHTBOX */

    function closeLightbox() {
        lightbox.classList.remove("active");
        document.body.classList.remove("lightbox-open");
        document.body.style.overflow = "";

        largeImage.src = "";
        largeImage.alt = "";
        titleElement.textContent = "";
        descriptionElement.textContent = "";
        supportingImages.replaceChildren();
        supportingImages.hidden = true;

        if (
            previouslyFocusedElement &&
            typeof previouslyFocusedElement.focus === "function"
        ) {
            previouslyFocusedElement.focus();
        }
    }

    /* CONNECT ALL PORTFOLIO IMAGES */

    lightboxTriggers.forEach((img) => {
        img.addEventListener("click", () => {
            openLightbox(img);
        });

        img.setAttribute("tabindex", "0");
        img.setAttribute("role", "button");

        if (!img.hasAttribute("aria-label")) {
            img.setAttribute(
                "aria-label",
                `Enlarge image: ${img.alt || "Project image"}`
            );
        }

        img.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openLightbox(img);
            }
        });
    });

    /* CLOSE BUTTON */

    closeButton.addEventListener("click", closeLightbox);

    /* CLICK OUTSIDE THE PANEL */

    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    /* ESCAPE KEY */

    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            lightbox.classList.contains("active")
        ) {
            closeLightbox();
        }
    });

    /* PREVENT CLICKS INSIDE THE PANEL FROM CLOSING IT */

    lightboxBox.addEventListener("click", (event) => {
        event.stopPropagation();
    });
});

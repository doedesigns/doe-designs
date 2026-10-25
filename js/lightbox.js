/* =========================================
   SHARED PORTFOLIO LIGHTBOX
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const lightboxTriggers = Array.from(
        document.querySelectorAll(".lightbox-image img")
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

				<div
					class="lightbox-proposal-navigation"
					hidden>

					<button
						class="project-arrow prev lightbox-proposal-prev"
						type="button"
						aria-label="Previous proposal page">
						<span class="arrow-circle">
							<span class="arrow-triangle"></span>
						</span>
					</button>

					<span class="lightbox-proposal-counter"
						aria-live="polite"></span>

					<button
						class="project-arrow next lightbox-proposal-next"
						type="button"
						aria-label="Next proposal page">
						<span class="arrow-circle">
							<span class="arrow-triangle"></span>
						</span>
					</button>

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
    const proposalNavigation = lightbox.querySelector(
        ".lightbox-proposal-navigation"
    );
    const proposalPrevious = lightbox.querySelector(
        ".lightbox-proposal-prev"
    );
    const proposalNext = lightbox.querySelector(
        ".lightbox-proposal-next"
    );
    const proposalCounter = lightbox.querySelector(
        ".lightbox-proposal-counter"
    );

    let previouslyFocusedElement = null;
    let previousBodyOverflow = "";
    let activeImage = null;
    let activeProposalImages = [];
    let activeProposalIndex = -1;

    /* FIND THE EXISTING IMAGE CAPTION OR DESCRIPTION */

    function getCaptionElement(img) {
        const figure = img.closest("figure");

        if (figure) {
            const figcaption = figure.querySelector("figcaption");

            if (figcaption) return figcaption;
        }

        const imageSection = img.closest(".lightbox-image");

        if (imageSection) {
            const description = imageSection.querySelector(
                ".lightbox-description"
            );

            if (description) return description;
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

        if (customDescription !== null) return customDescription;

        if (caption) {
            const captionClone = caption.cloneNode(true);
            const strong = captionClone.querySelector("strong");

            if (strong) strong.remove();

            return captionClone.innerHTML.trim();
        }

        return "";
    }

    /* RENDER DESCRIPTION HTML SAFELY
       Allows normal text and common formatting/list tags.
       Unsupported elements are reduced to their text content.
    */

    function renderDescription(content) {
        descriptionElement.replaceChildren();

        if (!content) return;

        const template = document.createElement("template");
        template.innerHTML = content;

        const allowedTags = new Set([
            "UL", "OL", "LI", "P", "STRONG",
            "EM", "B", "I", "BR"
        ]);

        function cleanNode(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                return document.createTextNode(node.textContent);
            }

            if (node.nodeType !== Node.ELEMENT_NODE) {
                return document.createDocumentFragment();
            }

            if (!allowedTags.has(node.tagName)) {
                const fragment = document.createDocumentFragment();

                Array.from(node.childNodes).forEach((child) => {
                    fragment.appendChild(cleanNode(child));
                });

                return fragment;
            }

            const cleanElement = document.createElement(
                node.tagName.toLowerCase()
            );

            Array.from(node.childNodes).forEach((child) => {
                cleanElement.appendChild(cleanNode(child));
            });

            return cleanElement;
        }

        Array.from(template.content.childNodes).forEach((node) => {
            descriptionElement.appendChild(cleanNode(node));
        });
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

    /* IDENTIFY THE PROPOSAL CAROUSEL
       Navigation is enabled only for images inside the
       Old Dog Cafe proposal carousel.
    */

    function getProposalImages(img) {
        const proposalCarousel = img.closest(
            "#odc-proposal-carousel"
        );

        if (!proposalCarousel) return [];

        return Array.from(
            proposalCarousel.querySelectorAll(".lightbox-image img")
        );
    }

    /* UPDATE THE CURRENT LIGHTBOX IMAGE */

    function displayImage(img) {
        activeImage = img;

        const caption = getCaptionElement(img);

        largeImage.src = img.currentSrc || img.src;
        largeImage.alt = img.alt || "";

        titleElement.textContent = getImageTitle(img, caption);

        renderDescription(
            getImageDescription(img, caption)
        );

        supportingImages.replaceChildren();

        addSupportingImage(img, 1);
        addSupportingImage(img, 2);

        supportingImages.hidden =
            supportingImages.children.length === 0;

        if (activeProposalImages.length > 1) {
            proposalNavigation.hidden = false;

            proposalCounter.textContent =
                `${activeProposalIndex + 1} of ${activeProposalImages.length}`;

            proposalPrevious.disabled = false;
            proposalNext.disabled = false;
        } else {
            proposalNavigation.hidden = true;
            proposalCounter.textContent = "";
        }
    }

    /* OPEN THE LIGHTBOX */

    function openLightbox(img) {
        previouslyFocusedElement = document.activeElement;
        previousBodyOverflow = document.body.style.overflow;

        activeProposalImages = getProposalImages(img);
        activeProposalIndex = activeProposalImages.indexOf(img);

        if (activeProposalIndex < 0) {
            activeProposalImages = [];
            activeProposalIndex = -1;
        }

        displayImage(img);

        lightbox.classList.add("active");
        document.body.classList.add("lightbox-open");
        document.body.style.overflow = "hidden";

        closeButton.focus();
    }

    /* MOVE THROUGH PROPOSAL PAGES */

    function moveProposal(direction) {
        if (activeProposalImages.length < 2) return;

        activeProposalIndex =
            (activeProposalIndex + direction + activeProposalImages.length) %
            activeProposalImages.length;

        displayImage(activeProposalImages[activeProposalIndex]);
    }

    proposalPrevious.addEventListener("click", () => {
        moveProposal(-1);
    });

    proposalNext.addEventListener("click", () => {
        moveProposal(1);
    });

    /* CLOSE THE LIGHTBOX */

    function closeLightbox() {
        lightbox.classList.remove("active");
        document.body.classList.remove("lightbox-open");
        document.body.style.overflow = previousBodyOverflow;

        largeImage.src = "";
        largeImage.alt = "";
        titleElement.textContent = "";
        descriptionElement.replaceChildren();
        supportingImages.replaceChildren();
        supportingImages.hidden = true;
        proposalNavigation.hidden = true;
        proposalCounter.textContent = "";

        activeImage = null;
        activeProposalImages = [];
        activeProposalIndex = -1;

        if (
            previouslyFocusedElement &&
            typeof previouslyFocusedElement.focus === "function"
        ) {
            previouslyFocusedElement.focus();
        }
    }

    /* CONNECT ALL PORTFOLIO IMAGES */

    lightboxTriggers.forEach((img) => {
        img.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

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
                event.stopPropagation();

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

    /* KEYBOARD SUPPORT */

    document.addEventListener("keydown", (event) => {
        if (!lightbox.classList.contains("active")) return;

        if (event.key === "Escape") {
            closeLightbox();
            return;
        }

        if (event.key === "ArrowLeft") {
            moveProposal(-1);
        }

        if (event.key === "ArrowRight") {
            moveProposal(1);
        }
    });

    /* PREVENT CLICKS INSIDE THE PANEL FROM CLOSING IT */

    lightboxBox.addEventListener("click", (event) => {
        event.stopPropagation();
    });
});
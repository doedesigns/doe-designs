
/* =========================================================
   DOE DESIGNS — SHARED PROJECT NAVIGATION
========================================================= */

(() => {
    function initializeProjectNavigation() {
        const body = document.body;

        if (!body || !body.classList.contains("project-page")) {
            return;
        }

        const navbar = document.querySelector("header .navbar");
        const projectTitleNav = document.querySelector(
            "header .navbar > .project-title-nav"
        );

        if (!navbar || !projectTitleNav) {
            console.warn("Project navigation elements were not found.");
            return;
        }

        // Avoid attaching duplicate scroll listeners.
        if (navbar.dataset.projectNavInitialized === "true") {
            return;
        }

        navbar.dataset.projectNavInitialized = "true";

        // Show the compact navigation after scrolling.
        function updateProjectNavState() {
            navbar.classList.toggle("project-scrolled", window.scrollY > 80);
        }

        updateProjectNavState();

        window.addEventListener("scroll", updateProjectNavState, {
            passive: true
        });

        window.addEventListener("pageshow", updateProjectNavState);

        // Find the active category from the main navigation.
        let activeCategoryLink = document.querySelector(
            ".nav-links a.active, .nav-links a[aria-current='page']"
        );

        // Infer the category from the page's body classes if needed.
        if (!activeCategoryLink) {
            const classes = body.className.toLowerCase();
            let categoryName = "";

            if (/death-page|fox-page|tip-page|design-page|design-project/.test(classes)) {
                categoryName = "Design";
            } else if (/phasepoint-page|deets-page|lotus-organic|clean-future|uiux-page|ui-ux-page/.test(classes)) {
                categoryName = "UI/UX";
            } else if (/motion-page|bang-bang|bangbang|cali-dreamin|unconventional/.test(classes)) {
                categoryName = "Motion";
            } else if (/branding-page|lotus-brand|old-dog|barking-dog|driftwood|montrapac|horsehair/.test(classes)) {
                categoryName = "Branding";
            }

            if (categoryName) {
                const normalized = categoryName.toLowerCase().replace(/\s+/g, "");

                activeCategoryLink = Array.from(
                    document.querySelectorAll(".nav-links a")
                ).find(link =>
                    link.textContent.trim().toLowerCase().replace(/\s+/g, "") === normalized
                );
            }
        }

        // Create or update the category label.
        if (activeCategoryLink) {
            let categoryLink = projectTitleNav.querySelector(
                ".project-category-link"
            );

            if (!categoryLink) {
                categoryLink = document.createElement("a");
                categoryLink.className = "project-category-link";
                projectTitleNav.appendChild(categoryLink);
            }

            categoryLink.href = activeCategoryLink.href;
            categoryLink.textContent = activeCategoryLink.textContent.trim();
            categoryLink.setAttribute(
                "aria-label",
                "View " + activeCategoryLink.textContent.trim() + " projects"
            );
        }

        // Clicking the compact project title returns to the top.
        const projectTitle = projectTitleNav.querySelector("h1");

        if (projectTitle && !projectTitle.dataset.scrollTopHandler) {
            projectTitle.dataset.scrollTopHandler = "true";
            projectTitle.style.cursor = "pointer";
            projectTitle.setAttribute("role", "button");
            projectTitle.setAttribute("tabindex", "0");
            projectTitle.setAttribute("aria-label", "Return to top of project");

            function returnToTop() {
                window.scrollTo({
                    top: 0,
                    behavior: window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches ? "auto" : "smooth"
                });
            }

            projectTitle.addEventListener("click", returnToTop);

            projectTitle.addEventListener("keydown", event => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    returnToTop();
                }
            });
        }
    }

    // Works whether this file loads before or after DOMContentLoaded.
    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeProjectNavigation,
            { once: true }
        );
    } else {
        initializeProjectNavigation();
    }
})();

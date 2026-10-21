// JavaScript Document
/* ============================================
   DOE DESIGNS — SHARED PROJECT NAVIGATION
   Handles desktop scroll state and category link.
   Mobile menu behavior remains in main.js.
============================================ */

document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.querySelector("header .navbar");
    const projectTitleNav = document.querySelector(
        "header .navbar .project-title-nav"
    );
    const projectPage = document.body.classList.contains("project-page");

    // Do not run project navigation on the homepage or general pages.
    if (!projectPage || !navbar || !projectTitleNav) {
        return;
    }

    /* ----------------------------------------
       SCROLL STATE
    ---------------------------------------- */

    const updateProjectNavState = () => {
        navbar.classList.toggle("project-scrolled", window.scrollY > 80);
    };

    updateProjectNavState();

    window.addEventListener("scroll", updateProjectNavState, {
        passive: true
    });

    window.addEventListener("pageshow", updateProjectNavState);

    /* ----------------------------------------
       DETERMINE THE CURRENT PROJECT CATEGORY
    ---------------------------------------- */

    const navLinks = Array.from(
        document.querySelectorAll(".nav-links a")
    );

    let activeCategoryLink = document.querySelector(
        ".nav-links a.active, .nav-links a[aria-current='page']"
    );

    const normalize = value =>
        value.toLowerCase().replace(/[^a-z0-9]/g, "");

    // If the HTML does not identify the active category,
    // infer it from the project's body classes.
    if (!activeCategoryLink) {
        const classes = document.body.className.toLowerCase();
        let categoryName = "";

        if (
            /\b(death-page|fox-page|tip-page|design-page|design-project)\b/.test(classes)
        ) {
            categoryName = "Design";
        } else if (
            /\b(phasepoint-page|deets-page|lotus-organic|clean-future|uiux-page|ui-ux-page)\b/.test(classes)
        ) {
            categoryName = "UI/UX";
        } else if (
            /\b(motion-page|bang-bang|bangbang|cali-dreamin|unconventional)\b/.test(classes)
        ) {
            categoryName = "Motion";
        } else if (
            /\b(branding-page|lotus-brand|old-dog|barking-dog|driftwood|montrapac|horsehair)\b/.test(classes)
        ) {
            categoryName = "Branding";
        }

        if (categoryName) {
            activeCategoryLink = navLinks.find(link =>
                normalize(link.textContent.trim()) === normalize(categoryName)
            );
        }
    }

    if (!activeCategoryLink) {
        console.warn(
            "Project navigation: Could not identify the current project category."
        );
        return;
    }

    /* ----------------------------------------
       CREATE OR UPDATE THE CATEGORY LINK
    ---------------------------------------- */

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
    categoryLink.classList.add("active");

    categoryLink.setAttribute(
        "aria-label",
        "View " + activeCategoryLink.textContent.trim() + " projects"
    );

    categoryLink.setAttribute("aria-current", "page");

    /* ----------------------------------------
       CLICKING THE COMPACT TITLE RETURNS TO TOP
    ---------------------------------------- */

    const compactTitle = projectTitleNav.querySelector("h1");

    if (compactTitle) {
        compactTitle.setAttribute("role", "button");
        compactTitle.setAttribute("tabindex", "0");
        compactTitle.setAttribute("aria-label", "Return to top of project");

        const returnToTop = () => {
            window.scrollTo({
                top: 0,
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth"
            });
        };

        compactTitle.addEventListener("click", returnToTop);

        compactTitle.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                returnToTop();
            }
        });
    }
});
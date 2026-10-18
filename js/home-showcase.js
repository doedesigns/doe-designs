/*=========================================================
    HOMEPAGE PROJECT CATEGORY SWITCHER
    File: js/home-showcase.js
=========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    const showcase = document.getElementById("homeProjectShowcase");

    if (!showcase) return;

    const tabs = Array.from(
        showcase.querySelectorAll(".home-category-tab")
    );

    const panels = Array.from(
        showcase.querySelectorAll(".home-project-panel")
    );

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    let switching = false;
    let switchTimer;

    function setSelectedTab(category) {

        tabs.forEach((tab) => {

            const selected = tab.dataset.category === category;

            tab.classList.toggle("is-active", selected);

            tab.setAttribute(
                "aria-selected",
                selected ? "true" : "false"
            );

            tab.tabIndex = selected ? 0 : -1;

        });
    }

    function showCategory(category) {

        if (switching) return;

        const nextPanel = panels.find(
            (panel) => panel.dataset.category === category
        );

        const currentPanel = panels.find(
            (panel) => panel.classList.contains("is-active")
        );

        if (!nextPanel || nextPanel === currentPanel) return;

        window.clearTimeout(switchTimer);

        setSelectedTab(category);

        switching = true;

        /* If the visitor prefers reduced motion,
           change categories without sliding animations. */

        if (reduceMotion) {

            panels.forEach((panel) => {

                const active = panel === nextPanel;

                panel.classList.remove(
                    "is-transitioning-in",
                    "is-transitioning-out",
                    "initial-entry"
                );

                panel.classList.toggle("is-active", active);

                panel.setAttribute(
                    "aria-hidden",
                    active ? "false" : "true"
                );

            });

            switching = false;

            return;
        }

        /* Current category exits to the left. */

        if (currentPanel) {

            currentPanel.classList.remove(
                "is-active",
                "initial-entry"
            );

            currentPanel.classList.add(
                "is-transitioning-out"
            );

            currentPanel.setAttribute("aria-hidden", "true");

        }

        /* New category enters from the left.
           Its See More link enters from the right. */

        nextPanel.classList.remove(
            "initial-entry",
            "is-transitioning-out"
        );

        nextPanel.classList.add(
            "is-active",
            "is-transitioning-in"
        );

        nextPanel.setAttribute("aria-hidden", "false");

        /* Keep all cards in the document so the existing
           deliverables dropdown and motion previews can
           continue working. */

        switchTimer = window.setTimeout(() => {

            if (currentPanel) {
                currentPanel.classList.remove(
                    "is-transitioning-out"
                );
            }

            nextPanel.classList.remove(
                "is-transitioning-in"
            );

            switching = false;

        }, 760);

    }

    /* Mouse, touch, and keyboard support. */

    tabs.forEach((tab, index) => {

        tab.addEventListener("click", () => {
            showCategory(tab.dataset.category);
        });

        tab.addEventListener("keydown", (event) => {

            let nextIndex = index;

            if (event.key === "ArrowRight") {
                nextIndex = (index + 1) % tabs.length;
            } else if (event.key === "ArrowLeft") {
                nextIndex = (index - 1 + tabs.length) % tabs.length;
            } else if (event.key === "Home") {
                nextIndex = 0;
            } else if (event.key === "End") {
                nextIndex = tabs.length - 1;
            } else {
                return;
            }

            event.preventDefault();

            tabs[nextIndex].focus();

            showCategory(tabs[nextIndex].dataset.category);
        });
    });

    /* Establish the initial UI/UX state. */

    const initialPanel = panels.find(
        (panel) => panel.classList.contains("is-active")
    );

    panels.forEach((panel) => {

        const active = panel === initialPanel;

        panel.setAttribute(
            "aria-hidden",
            active ? "false" : "true"
        );
    });

    if (initialPanel) {
        setSelectedTab(initialPanel.dataset.category);
    }
});
document.addEventListener("DOMContentLoaded", function () {

    const body = document.body;

    const branding = document.querySelector(".branding-hover");
    const design = document.querySelector(".design-hover");
    const motion = document.querySelector(".motion-hover");

    function activate(name) {

        body.classList.remove(
            "branding-active",
            "design-active",
            "motion-active"
        );

        if (name) {
            body.classList.add(name);
        }
    }

    if (branding) {

        branding.addEventListener("mouseenter", function () {
            activate("branding-active");
        });

        branding.addEventListener("mouseleave", function () {
            activate("");
        });

    }


    if (design) {

        design.addEventListener("mouseenter", function () {
            activate("design-active");
        });

        design.addEventListener("mouseleave", function () {
            activate("");
        });

    }


    if (motion) {

        motion.addEventListener("mouseenter", function () {
            activate("motion-active");
        });

        motion.addEventListener("mouseleave", function () {
            activate("");
        });

    }

});
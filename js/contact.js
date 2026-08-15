/* ===================================
DOE DESIGNS
Contact Form - EmailJS
=================================== */

console.log("CONTACT JS LOADED");

const form = document.getElementById("contactForm");
const submitButton = document.getElementById("submitButton");

console.log("FORM FOUND:", form);

if (form) {

    // Initialize EmailJS
    emailjs.init({
        publicKey: "crLSeBGIkXJYwhW07"
    });

    form.addEventListener("submit", function(event) {

        event.preventDefault();

        console.log("SUBMIT CLICKED");

        // Prevent multiple submissions
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "SENDING...";
        }

        emailjs.sendForm(
            "service_iyguihc",
            "template_8kqvdif",
            form
        )
        .then(function(response) {

            console.log(
                "EMAIL SENT SUCCESSFULLY:",
                response.status,
                response.text
            );

            // Only go to the thank-you page after EmailJS succeeds
            window.location.href = "thankyou.html";

        })
        .catch(function(error) {

            console.error("EMAILJS ERROR:", error);

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "SEND MESSAGE";
            }

            alert(
                "Sorry, your message could not be sent. Please try again."
            );

        });

    });

}
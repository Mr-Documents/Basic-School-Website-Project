// Contact form submission via EmailJS: notifies the school, then auto-replies to the sender.
(function () {
    const EMAILJS_PUBLIC_KEY = 'b2fe5DOrJZSFLP0a5';
    const EMAILJS_SERVICE_ID = 'service_q0i2y8g';
    const EMAILJS_TEMPLATE_NOTIFY = 'template_c4hs2ar';
    const EMAILJS_TEMPLATE_AUTOREPLY = 'template_m0mitx4';

    document.addEventListener('DOMContentLoaded', function () {
        const form = document.getElementById('contact-form');
        const messageBox = document.getElementById('form-message');
        if (!form || !messageBox) return;

        if (typeof emailjs === 'undefined') {
            console.error('EmailJS SDK failed to load; contact form cannot send messages.');
            return;
        }

        emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

        const submitBtn = form.querySelector('button[type="submit"]');
        const submitBtnDefaultText = submitBtn.textContent;

        function showMessage(text, type) {
            messageBox.textContent = text;
            messageBox.className = type;
            messageBox.style.display = 'block';
        }

        function setSending(isSending) {
            submitBtn.disabled = isSending;
            submitBtn.textContent = isSending ? 'Sending...' : submitBtnDefaultText;
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            setSending(true);
            messageBox.style.display = 'none';

            emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_NOTIFY, form)
                .then(function () {
                    return emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_AUTOREPLY, form)
                        .catch(function (err) {
                            // The school already has the message; a failed auto-reply shouldn't block that success.
                            console.error('Auto-reply failed to send:', err);
                        });
                })
                .then(function () {
                    showMessage("Thank you! Your message has been sent. We've received it and will get back to you soon.", 'success');
                    form.reset();
                })
                .catch(function (err) {
                    console.error('Message failed to send:', err);
                    showMessage('Sorry, something went wrong and your message could not be sent. Please try again or email us directly.', 'error');
                })
                .finally(function () {
                    setSending(false);
                });
        });
    });
})();

// Contact form submission via Web3Forms.
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        const form = document.getElementById('contact-form');
        const messageBox = document.getElementById('form-message');
        if (!form || !messageBox) return;

        const submitBtn = form.querySelector('button[type="submit"]');
        const submitBtnDefaultText = submitBtn.textContent;
        let isSubmitting = false;

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

            if (isSubmitting) return;

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            isSubmitting = true;
            setSending(true);
            messageBox.style.display = 'none';

            fetch(form.action, {
                method: 'POST',
                headers: { Accept: 'application/json' },
                body: new FormData(form)
            })
                .then(function (res) { return res.json(); })
                .then(function (data) {
                    if (data.success) {
                        showMessage("Thank you! Your message has been sent. We've received it and will get back to you soon.", 'success');
                        form.reset();
                    } else {
                        console.error('Web3Forms submission failed:', data);
                        showMessage('Sorry, something went wrong and your message could not be sent. Please try again or email us directly.', 'error');
                    }
                })
                .catch(function (err) {
                    console.error('Message failed to send:', err);
                    showMessage('Sorry, something went wrong and your message could not be sent. Please try again or email us directly.', 'error');
                })
                .finally(function () {
                    isSubmitting = false;
                    setSending(false);
                });
        });
    });
})();

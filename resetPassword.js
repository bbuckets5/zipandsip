document.addEventListener('DOMContentLoaded', () => {
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmNewPasswordInput = document.getElementById('confirmNewPassword');
    const messageContainer = document.createElement('div'); // For messages to the user
    messageContainer.style.marginTop = '15px';
    messageContainer.style.padding = '10px';
    messageContainer.style.borderRadius = '5px';
    messageContainer.style.textAlign = 'center';
    // Ensure this message container is added to the DOM where appropriate in reset-password.html
    // For simplicity, let's assume it will be appended near the form.
    // A more robust solution might be to have a designated div in the HTML for messages.
    if (resetPasswordForm) { // Only append if form exists
        resetPasswordForm.parentNode.insertBefore(messageContainer, resetPasswordForm.nextSibling);
    }


    // Function to display messages (you can re-use your showToast function if it's globally available,
    // but for now, let's keep it simple and local to this page)
    const showMessage = (msg, type) => {
        messageContainer.textContent = msg;
        if (type === 'success') {
            messageContainer.style.backgroundColor = '#d4edda';
            messageContainer.style.color = '#155724';
        } else if (type === 'error') {
            messageContainer.style.backgroundColor = '#f8d7da';
            messageContainer.style.color = '#721c24';
        }
        // You might want to remove previous classes if type changes
        messageContainer.classList.remove('success', 'error');
        if (type === 'success') messageContainer.classList.add('success');
        if (type === 'error') messageContainer.classList.add('error');

         // Add a small animation/fade-in if you have CSS for it
         messageContainer.style.opacity = '0';
         setTimeout(() => { messageContainer.style.opacity = '1'; }, 10); // Small delay for transition
    };

    // 1. Get the token from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        showMessage('Password reset link is missing or invalid.', 'error');
        // Disable the form if no token is found
        if (resetPasswordForm) resetPasswordForm.style.display = 'none';
        return; // Stop execution
    }

    // 2. Handle form submission
    if (resetPasswordForm) { // Only add listener if form exists
        resetPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Stop the form from reloading the page

            const newPassword = newPasswordInput.value;
            const confirmNewPassword = confirmNewPasswordInput.value;

            if (newPassword !== confirmNewPassword) {
                showMessage('Passwords do not match.', 'error');
                return;
            }

            if (newPassword.length < 6) {
                showMessage('Password must be at least 6 characters long.', 'error');
                return;
            }

            try {
                // Use your main backend URL constant from script.js if available globally,
                // otherwise, hardcode or define it here
                const BACKEND_URL = 'http://localhost:3000'; // Make sure this matches your backend server URL

                const response = await fetch(`${BACKEND_URL}/api/auth/reset-password`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token, newPassword }),
                });

                const data = await response.json();

                if (response.ok) { // Check if the response status is 2xx
                    showMessage(data.message || 'Password reset successfully!', 'success');
                    // Optional: Redirect to login page after a delay
                    setTimeout(() => {
                         window.location.href = 'login.html'; // Or your main login page
                    }, 3000);
                } else {
                    showMessage(data.message || 'Error resetting password. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showMessage('Network error. Could not reset password.', 'error');
            }
        });
    }
});
/**
 * VERTIKAL Zapier Forms Handler
 * Shared helper for all form submissions across Pages
 */

const ZAPIER_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/25853501/uw57cnq/";

/**
 * Submit form data to Zapier webhook
 * @param {Object} data - Form data object
 * @param {string} data.type - Form type (apply, waitlist, contact, invest, demo, series)
 * @param {string} data.sourcePage - Source page URL
 * @param {string} data.role - User role (creator, investor, network, viewer)
 * @param {string} data.name - User name
 * @param {string} data.email - User email (required)
 * @param {string} data.message - Optional message
 * @param {Object} data.extra - Additional fields
 * @returns {Promise<Object>} Response object with success/error
 */
async function submitToZapier({ type, sourcePage, role, name, email, message, extra = {} }) {
    // Client-side validation
    if (!email || !email.includes('@')) {
        return { success: false, error: 'Valid email is required' };
    }

    if (!ZAPIER_WEBHOOK_URL || ZAPIER_WEBHOOK_URL === "PASTE_HERE") {
        console.warn('Zapier webhook URL not configured');
        return { success: false, error: 'Form submission not configured. Please contact support.' };
    }

    const payload = {
        type: type || 'contact',
        sourcePage: sourcePage || window.location.href,
        role: role || 'viewer',
        name: name || '',
        email: email,
        message: message || '',
        timestamp: new Date().toISOString(),
        ...extra
    };

    try {
        const response = await fetch(ZAPIER_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return { success: true, data: await response.json() };
    } catch (error) {
        console.error('Zapier submission error:', error);
        return { success: false, error: error.message || 'Failed to submit form' };
    }
}

/**
 * Show success message
 * @param {HTMLElement} formElement - Form element to show success on
 */
function showSuccess(formElement) {
    const successMsg = document.createElement('div');
    successMsg.className = 'form-success';
    successMsg.style.cssText = 'background: #00C853; color: #fff; padding: 1rem; margin-top: 1rem; border-radius: 4px; text-align: center;';
    successMsg.textContent = 'Thank you! We\'ll be in touch soon.';
    
    formElement.appendChild(successMsg);
    formElement.querySelector('button[type="submit"]').disabled = true;
    
    // Scroll to success message
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Show error message
 * @param {HTMLElement} formElement - Form element to show error on
 * @param {string} message - Error message
 */
function showError(formElement, message) {
    const errorMsg = document.createElement('div');
    errorMsg.className = 'form-error';
    errorMsg.style.cssText = 'background: #f44336; color: #fff; padding: 1rem; margin-top: 1rem; border-radius: 4px; text-align: center;';
    errorMsg.textContent = message || 'Something went wrong. Please try again.';
    
    formElement.appendChild(errorMsg);
    
    // Remove error after 5 seconds
    setTimeout(() => errorMsg.remove(), 5000);
}

/**
 * Initialize form handler
 * @param {HTMLFormElement} form - Form element
 * @param {Object} options - Form options
 */
function initForm(form, options = {}) {
    if (!form) return;

    const submitButton = form.querySelector('button[type="submit"]');
    if (!submitButton) return;

    let isSubmitting = false;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (isSubmitting) return;
        isSubmitting = true;

        // Remove previous messages
        const prevSuccess = form.querySelector('.form-success');
        const prevError = form.querySelector('.form-error');
        if (prevSuccess) prevSuccess.remove();
        if (prevError) prevError.remove();

        // Disable submit button
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        // Get form data
        const formData = new FormData(form);
        const email = formData.get('email') || form.querySelector('input[type="email"]')?.value;
        const name = formData.get('name') || form.querySelector('input[name="name"]')?.value;
        const message = formData.get('message') || form.querySelector('textarea')?.value;

        // Submit to Zapier
        const result = await submitToZapier({
            type: options.type || 'contact',
            sourcePage: window.location.href,
            role: options.role || 'viewer',
            name: name || '',
            email: email,
            message: message || '',
            extra: options.extra || {}
        });

        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.textContent = submitButton.dataset.originalText || 'Submit';
        isSubmitting = false;

        if (result.success) {
            showSuccess(form);
            form.reset();
        } else {
            showError(form, result.error);
        }
    });

    // Store original button text
    submitButton.dataset.originalText = submitButton.textContent;
}

// Auto-initialize forms with data-zapier-form attribute
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-zapier-form]').forEach(form => {
        const type = form.dataset.zapierForm;
        const role = form.dataset.role || 'viewer';
        initForm(form, { type, role });
    });
});


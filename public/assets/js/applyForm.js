document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('applyForm');
  const submitBtn = form?.querySelector('button[type="submit"]');
  const errorDiv = document.querySelector('.error-message');
  const successDiv = document.querySelector('.success-message');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const roleSelect = document.getElementById('role');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Hide previous messages
    if (errorDiv) {
      errorDiv.style.display = 'none';
      errorDiv.textContent = '';
    }
    if (successDiv) {
      successDiv.style.display = 'none';
      successDiv.innerHTML = '';
    }
    
    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const role = formData.get('role') || 'creator';
    const portfolio = formData.get('portfolio') || '';
    const whyVertikal = formData.get('why') || formData.get('message') || '';
    
    // Format data for Zapier webhook
    const zapierData = {
      full_name: name,
      email: email,
      applying_as: role,
      portfolio_url: portfolio || null,
      why_vertikal: whyVertikal,
      submitted_at: new Date().toISOString(),
      source: 'vertikalapp.com/apply'
    };
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    
    try {
      // Submit to Zapier webhook (zapierForms.js must be loaded first)
      if (typeof window.submitToZapier === 'function') {
        await window.submitToZapier(zapierData);
      } else {
        throw new Error('Zapier webhook function not loaded. Make sure zapierForms.js is loaded before applyForm.js');
      }
      
      // SUCCESS: Show confirmation message
      if (successDiv) {
        successDiv.innerHTML = `
          <div style="background: #00C853; color: #fff; padding: 24px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #00FF94;">
            <h3 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 900; color: #fff;">✓ APPLICATION RECEIVED!</h3>
            <p style="margin: 0 0 16px 0; color: #fff; font-size: 16px;">We've sent a confirmation to your email.</p>
            <div style="background: rgba(0,0,0,0.2); padding: 16px; border-radius: 6px; margin-top: 12px;">
              <p style="margin: 4px 0; color: #fff; font-size: 14px;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 4px 0; color: #fff; font-size: 14px;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 4px 0; color: #fff; font-size: 14px;"><strong>Role:</strong> ${role}</p>
            </div>
          </div>
        `;
        successDiv.style.display = 'block';
        
        // Scroll to success message
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      // Keep name/email visible (DO NOT reset form immediately)
      // Disable submit button for 2 seconds
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Application';
      }, 2000);
      
      // Optionally redirect after 5 seconds (give user time to see confirmation)
      setTimeout(() => {
        window.location.href = '/';
      }, 5000);
      
    } catch (error) {
      console.error('Submit error:', error);
      
      // Show error message
      if (errorDiv) {
        errorDiv.innerHTML = `
          <div style="background: #ff3333; color: #fff; padding: 16px; border-radius: 8px;">
            <strong>Error:</strong> ${error.message || 'Failed to submit application. Please try again.'}
          </div>
        `;
        errorDiv.style.display = 'block';
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      // Re-enable submit button on error
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Application';
    }
  });
});


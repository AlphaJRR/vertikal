import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  'https://vuwawtzhhcarckybdgbd.supabase.co',
  'sb_publishable_r52TGUTyJr0uU9dPFi6V8g_va7Iab3Y'
);

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('applyForm');
  const submitBtn = form?.querySelector('button[type="submit"]');
  const errorDiv = document.querySelector('.error-message');
  const successDiv = document.querySelector('.success-message');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (errorDiv) errorDiv.style.display = 'none';
    if (successDiv) successDiv.style.display = 'none';
    
    const formData = new FormData(form);
    const data = {
      full_name: formData.get('name'),
      email: formData.get('email'),
      applying_as: formData.get('role') || 'creator',
      portfolio_url: formData.get('portfolio') || null,
      why_vertikal: formData.get('why') || formData.get('message') || ''
    };
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    
    try {
      const { error } = await supabase
        .from('applications')
        .insert([data]);
      
      if (error) throw error;
      
      if (successDiv) {
        successDiv.textContent = '✓ Application submitted! We\'ll be in touch soon.';
        successDiv.style.display = 'block';
      }
      form.reset();
      
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
      
    } catch (error) {
      console.error('Submit error:', error);
      if (errorDiv) {
        errorDiv.textContent = 'Error: ' + error.message;
        errorDiv.style.display = 'block';
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Application';
    }
  });
});


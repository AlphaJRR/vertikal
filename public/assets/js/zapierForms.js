/**
 * Zapier Webhook Integration
 * Handles form submissions to Zapier webhooks
 * 
 * ⚠️ REPLACE THE URL BELOW WITH YOUR ACTUAL ZAPIER WEBHOOK URL FROM STEP 1
 * Format: https://hooks.zapier.com/hooks/catch/XXXXX/YYYYY/
 */

(function() {
  'use strict';
  
  // ⚠️ REPLACE THIS WITH YOUR ACTUAL ZAPIER WEBHOOK URL FROM STEP 1
  // Look in Zapier Step 1: "Catch Raw Hook" for the webhook URL
  const ZAPIER_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID_HERE/";

  /**
   * Submit form data to Zapier webhook
   * @param {Object} data - Form data to submit
   * @returns {Promise} - Fetch promise
   */
  window.submitToZapier = async function(data) {
    if (!ZAPIER_WEBHOOK_URL || ZAPIER_WEBHOOK_URL.includes('YOUR_WEBHOOK_ID_HERE')) {
      throw new Error('Zapier webhook URL not configured. Please update zapierForms.js line 12 with your webhook URL from Zapier Step 1.');
    }

    const response = await fetch(ZAPIER_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Zapier webhook error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  };
})();


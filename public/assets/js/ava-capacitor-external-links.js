/**
 * Alpha Visual Artists – open external links in Safari when running inside the iOS app (Capacitor).
 * Prevents Calendly, Shopify, Stripe, etc. from opening in the in-app WebView (App Store compliance).
 * Include this script on https://alphavisualartists.com when the site is loaded in the app.
 */
(function() {
  if (typeof window.Capacitor === 'undefined' || !window.Capacitor.Plugins || !window.Capacitor.Plugins.Browser) return;

  var externalHosts = [
    'calendly.com',
    'stripe.com',
    'checkout.stripe.com',
    'pay.stripe.com',
    'shopify.com',
    '*.myshopify.com'
  ];

  function isExternal(url) {
    try {
      var host = new URL(url, location.origin).hostname.toLowerCase();
      return externalHosts.some(function(h) {
        var pattern = h.replace(/\./g, '\\.').replace(/\*/g, '.*');
        return new RegExp('^' + pattern + '$').test(host);
      });
    } catch (e) {
      return false;
    }
  }

  document.addEventListener('click', function(e) {
    var a = e.target && e.target.closest && e.target.closest('a');
    if (!a || !a.href) return;
    if (!isExternal(a.href)) return;
    e.preventDefault();
    window.Capacitor.Plugins.Browser.open({ url: a.href });
  }, true);
})();

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            <p>
              VERTIKAL Media Company LLC collects information that you provide directly to us, including 
              your name, email address, profile information, and content you create or share on the platform.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to provide, maintain, and improve our services, 
              process transactions, send you communications, and personalize your experience.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Information Sharing</h2>
            <p>
              We do not sell your personal information. We may share your information with service providers 
              who assist us in operating our platform, conducting our business, or serving our users, 
              as long as those parties agree to keep this information confidential.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal information at any time 
              through your account settings or by contacting us directly.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our platform and 
              hold certain information to improve your experience.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us through the 
              official channels provided on the VERTIKAL platform.
            </p>
          </section>
          <p className="text-sm text-gray-500 mt-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
      <footer style={{padding: '40px', background: '#000', borderTop: '1px solid #333', color: '#fff', fontFamily: 'sans-serif', textAlign: 'center', marginTop: '60px'}}>
        <div style={{maxWidth: '1200px', margin: 'auto'}}>
            <h3 style={{letterSpacing: '2px', marginBottom: '15px'}}>VERTIKAL MEDIA COMPANY</h3>
            <p style={{fontSize: '14px', color: '#888', marginBottom: '20px'}}>
                © 2026 Vertikal Media Company LLC. All Rights Reserved.
            </p>
            <div style={{fontSize: '12px', color: '#555', lineHeight: '1.6'}}>
                <strong>Official Registered Agent Address:</strong><br/>
                On file.
            </div>
        </div>
      </footer>
    </div>
  );
}

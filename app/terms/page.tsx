export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-8">Terms of Service</h1>
        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using VERTIKAL Media Company LLC ("VERTIKAL", "we", "us", or "our"), 
              you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Use License</h2>
            <p>
              Permission is granted to temporarily access the materials on VERTIKAL's website for personal, 
              non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. User Content</h2>
            <p>
              You retain ownership of any content you submit, post, or display on or through VERTIKAL. 
              By submitting content, you grant VERTIKAL a worldwide, non-exclusive, royalty-free license to use, 
              reproduce, and distribute your content.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Prohibited Uses</h2>
            <p>
              You may not use VERTIKAL in any way that violates any applicable laws or regulations, 
              infringes on the rights of others, or interferes with the operation of the platform.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Limitation of Liability</h2>
            <p>
              VERTIKAL shall not be liable for any indirect, incidental, special, consequential, or punitive 
              damages resulting from your use of or inability to use the platform.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Contact Information</h2>
            <p>
              For questions about these Terms of Service, please contact us through the official channels 
              provided on the VERTIKAL platform.
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

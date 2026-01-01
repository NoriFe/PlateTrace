import React from 'react';

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-bg text-gray-200 px-4 py-12">
      <div className="max-w-4xl mx-auto bg-gray-900 border-2 border-accent/40 rounded-lg shadow-lg shadow-accent/10 p-8 space-y-6">
        <header className="space-y-3">
          <p className="text-accent font-dmsans text-sm font-bold uppercase tracking-wide">Legal</p>
          <h1 className="text-4xl font-bold text-white font-dmsans">Privacy Policy</h1>
          <p className="text-gray-400 font-dmsans text-sm">Last updated: January 2026</p>
        </header>

        <section className="space-y-2">
          <h2 className="text-2xl font-bold text-white font-dmsans">Who we are</h2>
          <p className="text-gray-300 font-dmsans">
            PlateTrace is provided as a demonstration of vehicle plate recognition for educational and small-business use. For any privacy questions, contact <span className="text-accent">privacy@platetrace.local</span>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white font-dmsans">Data we collect</h2>
          <ul className="list-disc list-inside text-gray-300 font-dmsans space-y-1">
            <li>Account data: email, username, first and last name.</li>
            <li>Authentication data: hashed passwords (never stored in plain text).</li>
            <li>Usage data: uploaded images, extracted plate numbers, timestamps, and basic app activity.</li>
            <li>Technical data: IP address and browser details for security and debugging.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white font-dmsans">How we use your data</h2>
          <ul className="list-disc list-inside text-gray-300 font-dmsans space-y-1">
            <li>To provide and secure login and account access.</li>
            <li>To process uploads, run OCR on plates, and store results.</li>
            <li>To maintain logs for troubleshooting, abuse prevention, and service integrity.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white font-dmsans">Legal basis (UK GDPR)</h2>
          <ul className="list-disc list-inside text-gray-300 font-dmsans space-y-1">
            <li>Performance of a contract: delivering the PlateTrace service you request.</li>
            <li>Legitimate interests: securing the platform and preventing misuse.</li>
            <li>Consent: where required for optional features (e.g., analytics or cookies).</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white font-dmsans">Sharing and storage</h2>
          <ul className="list-disc list-inside text-gray-300 font-dmsans space-y-1">
            <li>Data is stored in Supabase (PostgreSQL) in the EU region.</li>
            <li>We do not sell personal data. Sharing is limited to service providers supporting hosting, storage, security, and logging.</li>
            <li>Data is retained only as long as needed for the stated purposes or to meet legal requirements.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white font-dmsans">Your rights</h2>
          <p className="text-gray-300 font-dmsans">
            Under UK GDPR you can request access, correction, deletion, restriction, and data portability. You may also object to processing or withdraw consent where applicable. To exercise your rights, email <span className="text-accent">privacy@platetrace.local</span>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white font-dmsans">Cookies and tracking</h2>
          <p className="text-gray-300 font-dmsans">
            This demo primarily uses essential cookies/local storage for authentication. If analytics or additional cookies are added later, we will request consent where required.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white font-dmsans">Security</h2>
          <p className="text-gray-300 font-dmsans">
            We use industry-standard measures such as HTTPS, hashed passwords, and access controls. No system is perfectly secure; please use strong, unique passwords and contact us if you suspect an issue.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white font-dmsans">Contact</h2>
          <p className="text-gray-300 font-dmsans">
            Questions or requests: <span className="text-accent">privacy@platetrace.local</span>.
          </p>
        </section>
      </div>
    </div>
  );
}

export default PrivacyPolicy;

import React from "react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-black text-gray-300">
      <div className="max-w-4xl mx-auto py-16 px-6">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-white">Privacy Policy</h1>
          <p className="mt-2 text-sm text-gray-400">
            Effective date: January 7, 2026 — Last updated: January 7, 2026
          </p>
        </header>

        <section className="bg-gray-900 shadow rounded-lg p-6 mb-6 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-3 text-white">1. Information We Collect</h2>
          <p className="text-gray-300 mb-3">
            We collect information you provide directly (name, email, messages) and usage data
            (pages visited, device info). We also use cookies and similar technologies to improve
            your experience.
          </p>

          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li><strong className="text-white">Personal Data:</strong> Name, email, message content when you contact us.</li>
            <li><strong className="text-white">Usage Data:</strong> Pages visited, timestamps, IP address (anonymized).</li>
          </ul>
        </section>

        <section className="bg-gray-900 shadow rounded-lg p-6 mb-6 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-3 text-white">2. How We Use Information</h2>
          <p className="text-gray-300 mb-3">
            We use data to provide and maintain our services, communicate with you, personalize
            content, and improve product stability and features.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-700 rounded bg-gray-800">
              <h3 className="font-medium text-white">Service Delivery</h3>
              <p className="text-sm text-gray-400">Account management and feature functionality.</p>
            </div>
            <div className="p-4 border border-gray-700 rounded bg-gray-800">
              <h3 className="font-medium text-white">Communication</h3>
              <p className="text-sm text-gray-400">Support replies, product updates, and notifications.</p>
            </div>
          </div>
        </section>

        <section className="bg-gray-900 shadow rounded-lg p-6 mb-6 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-3 text-white">3. Sharing & Disclosure</h2>
          <p className="text-gray-300 mb-3">
            We do not sell personal data. We may share information with service providers who help
            operate the site (hosting, analytics) under strict contracts and security controls.
          </p>
        </section>

        <section className="bg-gray-900 shadow rounded-lg p-6 mb-6 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-3 text-white">4. Cookies & Tracking</h2>
          <p className="text-gray-300">
            Cookies help store session info and preferences. You can control cookies via your
            browser settings; disabling some cookies may affect features.
          </p>
        </section>

        <section className="bg-gray-900 shadow rounded-lg p-6 mb-6 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-3 text-white">5. Security & Retention</h2>
          <p className="text-gray-300 mb-2">
            We maintain administrative, technical, and physical safeguards to protect data.
          </p>
          <p className="text-gray-300">
            We retain personal data only as long as necessary to provide services and comply with
            legal obligations.
          </p>
        </section>

        <section className="bg-gray-900 shadow rounded-lg p-6 mb-6 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-3 text-white">6. Your Rights</h2>
          <p className="text-gray-300 mb-3">
            Depending on your jurisdiction, you may access, correct, or request deletion of your
            personal data. To exercise rights, contact us at <a className="text-red-400 hover:text-red-300" href="mailto:privacy@project-vip.example">privacy@project-vip.example</a>.
          </p>
        </section>

        <footer className="text-sm text-gray-500 mt-6">
          <p>
            This privacy policy is a sample placeholder. Replace it with your legally reviewed
            policy before publishing.
          </p>
        </footer>
      </div>
    </div>
  );
}

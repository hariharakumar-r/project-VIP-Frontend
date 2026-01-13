import React from "react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-4xl mx-auto py-16 px-6">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900">Privacy Policy</h1>
          <p className="mt-2 text-sm text-gray-600">
            Effective date: January 7, 2026 — Last updated: January 7, 2026
          </p>
        </header>

        <section className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
          <p className="text-gray-700 mb-3">
            We collect information you provide directly (name, email, messages) and usage data
            (pages visited, device info). We also use cookies and similar technologies to improve
            your experience.
          </p>

          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li><strong>Personal Data:</strong> Name, email, message content when you contact us.</li>
            <li><strong>Usage Data:</strong> Pages visited, timestamps, IP address (anonymized).</li>
          </ul>
        </section>

        <section className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-3">2. How We Use Information</h2>
          <p className="text-gray-700 mb-3">
            We use data to provide and maintain our services, communicate with you, personalize
            content, and improve product stability and features.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 border rounded">
              <h3 className="font-medium">Service Delivery</h3>
              <p className="text-sm text-gray-600">Account management and feature functionality.</p>
            </div>
            <div className="p-4 border rounded">
              <h3 className="font-medium">Communication</h3>
              <p className="text-sm text-gray-600">Support replies, product updates, and notifications.</p>
            </div>
          </div>
        </section>

        <section className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-3">3. Sharing & Disclosure</h2>
          <p className="text-gray-700 mb-3">
            We do not sell personal data. We may share information with service providers who help
            operate the site (hosting, analytics) under strict contracts and security controls.
          </p>
        </section>

        <section className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-3">4. Cookies & Tracking</h2>
          <p className="text-gray-700">
            Cookies help store session info and preferences. You can control cookies via your
            browser settings; disabling some cookies may affect features.
          </p>
        </section>

        <section className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-3">5. Security & Retention</h2>
          <p className="text-gray-700 mb-2">
            We maintain administrative, technical, and physical safeguards to protect data.
          </p>
          <p className="text-gray-700">
            We retain personal data only as long as necessary to provide services and comply with
            legal obligations.
          </p>
        </section>

        <section className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-3">6. Your Rights</h2>
          <p className="text-gray-700 mb-3">
            Depending on your jurisdiction, you may access, correct, or request deletion of your
            personal data. To exercise rights, contact us at <a className="text-indigo-600" href="mailto:privacy@project-vip.example">privacy@project-vip.example</a>.
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

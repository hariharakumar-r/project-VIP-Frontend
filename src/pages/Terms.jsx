import React from "react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50 text-gray-900">
      <div className="max-w-4xl mx-auto py-16 px-6">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold">Terms of Service</h1>
          <p className="mt-2 text-sm text-gray-600">
            Last updated: January 7, 2026 — Please read these terms carefully.
          </p>
        </header>

        <article className="space-y-6">
          <section className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold mb-2">1. Acceptance of Terms</h2>
            <p className="text-gray-700">
              By accessing or using our services, you agree to these Terms. If you do not agree,
              do not use the services.
            </p>
          </section>

          <section className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold mb-2">2. Use of Service</h2>
            <p className="text-gray-700 mb-2">
              You may use the service for lawful purposes only. You must not misuse the service or
              attempt to gain unauthorized access to systems.
            </p>
            <ul className="list-disc list-inside text-gray-700">
              <li>No abusive or illegal activity.</li>
              <li>Respect intellectual property and other users' rights.</li>
            </ul>
          </section>

          <section className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold mb-2">3. Accounts</h2>
            <p className="text-gray-700">
              If you create an account, keep account credentials secure. You are responsible for
              all activity under your account.
            </p>
          </section>

          <section className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold mb-2">4. Payments & Refunds</h2>
            <p className="text-gray-700">
              Paid features (if any) are governed by the payment terms presented at purchase.
              Refunds are handled on a case-by-case basis.
            </p>
          </section>

          <section className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold mb-2">5. Limitation of Liability</h2>
            <p className="text-gray-700">
              To the maximum extent permitted by law, we are not liable for indirect or incidental
              damages arising from your use of the service.
            </p>
          </section>

          <section className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold mb-2">6. Governing Law & Changes</h2>
            <p className="text-gray-700 mb-2">
              These Terms are governed by the laws of the applicable jurisdiction. We may modify
              the Terms; we will notify users of material changes.
            </p>
          </section>

          <section className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold mb-2">Contact</h2>
            <p className="text-gray-700">
              Questions about these Terms? Contact{" "}
              <a
                className="text-indigo-600"
                href="mailto:legal@project-vip.example"
              >
                legal@project-vip.example
              </a>
              .
            </p>
          </section>
        </article>

        <p className="mt-8 text-sm text-gray-500">
          These terms are illustrative sample copy. Have a lawyer review any legal text before
          publishing.
        </p>
      </div>
    </div>
  );
}

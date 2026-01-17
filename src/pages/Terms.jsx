import React from "react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-black text-gray-300">
      <div className="max-w-4xl mx-auto py-16 px-6">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-white">Terms of Service</h1>
          <p className="mt-2 text-sm text-gray-400">
            Last updated: January 7, 2026 — Please read these terms carefully.
          </p>
        </header>

        <article className="space-y-6">
          <section className="bg-gray-900 p-6 rounded shadow border border-gray-700">
            <h2 className="text-2xl font-semibold mb-2 text-white">1. Acceptance of Terms</h2>
            <p className="text-gray-300">
              By accessing or using our services, you agree to these Terms. If you do not agree,
              do not use the services.
            </p>
          </section>

          <section className="bg-gray-900 p-6 rounded shadow border border-gray-700">
            <h2 className="text-2xl font-semibold mb-2 text-white">2. Use of Service</h2>
            <p className="text-gray-300 mb-2">
              You may use the service for lawful purposes only. You must not misuse the service or
              attempt to gain unauthorized access to systems.
            </p>
            <ul className="list-disc list-inside text-gray-300">
              <li>No abusive or illegal activity.</li>
              <li>Respect intellectual property and other users' rights.</li>
            </ul>
          </section>

          <section className="bg-gray-900 p-6 rounded shadow border border-gray-700">
            <h2 className="text-2xl font-semibold mb-2 text-white">3. Accounts</h2>
            <p className="text-gray-300">
              If you create an account, keep account credentials secure. You are responsible for
              all activity under your account.
            </p>
          </section>

          <section className="bg-gray-900 p-6 rounded shadow border border-gray-700">
            <h2 className="text-2xl font-semibold mb-2 text-white">4. Payments & Refunds</h2>
            <p className="text-gray-300">
              Paid features (if any) are governed by the payment terms presented at purchase.
              Refunds are handled on a case-by-case basis.
            </p>
          </section>

          <section className="bg-gray-900 p-6 rounded shadow border border-gray-700">
            <h2 className="text-2xl font-semibold mb-2 text-white">5. Limitation of Liability</h2>
            <p className="text-gray-300">
              To the maximum extent permitted by law, we are not liable for indirect or incidental
              damages arising from your use of the service.
            </p>
          </section>

          <section className="bg-gray-900 p-6 rounded shadow border border-gray-700">
            <h2 className="text-2xl font-semibold mb-2 text-white">6. Governing Law & Changes</h2>
            <p className="text-gray-300 mb-2">
              These Terms are governed by the laws of the applicable jurisdiction. We may modify
              the Terms; we will notify users of material changes.
            </p>
          </section>

          <section className="bg-gray-900 p-6 rounded shadow border border-gray-700">
            <h2 className="text-2xl font-semibold mb-2 text-white">Contact</h2>
            <p className="text-gray-300">
              Questions about these Terms? Contact{" "}
              <a
                className="text-red-400 hover:text-red-300"
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

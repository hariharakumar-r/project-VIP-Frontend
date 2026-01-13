import React, { useState } from "react";
import { Menu, X, ArrowRight, CheckCircle } from "lucide-react";

export default function CTAPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation */}
        {/* CTA Section */}
      <section className="min-h-screen flex items-center justify-center py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-black mb-8 text-black">
            Ready to Transform Your Career?
          </h2>

          <p className="text-xl text-gray-700 mb-8">
            Thousands of freshers have already taken the leap. The question
            isn't "Can I do this?"—it's "When will I start?"
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="px-10 py-5 bg-black text-white rounded-lg font-bold text-lg hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2 mx-auto sm:mx-0">
              Start Free Today
              <ArrowRight size={20} />
            </button>
            <button className="px-10 py-5 border-2 border-black text-black rounded-lg font-bold hover:bg-gray-100 transition-all duration-300 text-lg mx-auto sm:mx-0">
              Talk to Us First
            </button>
          </div>

          <p className="text-gray-600 mb-8">
            ✓ Free forever tier available | ✓ No credit card required | ✓ Cancel
            anytime
          </p>
        </div>
      </section>
    </div>
  );
}

import { ArrowRight } from "lucide-react";

export default function CTAPage() {
  return (
    <div className="min-h-screen text-white">
      {/* CTA Section */}
      <section className="min-h-screen flex items-center justify-center py-12 md:py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl lg:text-6xl font-black mb-6 md:mb-8 text-white drop-shadow-lg">
            Ready to Transform Your Career?
          </h2>

          <p className="text-lg md:text-xl text-gray-200 mb-6 md:mb-8">
            Thousands of freshers have already taken the leap. The question
            isn't "Can I do this?"—it's "When will I start?"
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-8 md:mb-10">
            <button className="px-6 md:px-10 py-3 md:py-5 bg-red-700 text-white rounded-lg font-bold text-base md:text-lg hover:bg-red-800 transition-all duration-300 flex items-center justify-center gap-2 mx-auto sm:mx-0 shadow-lg">
              Start Free Today
              <ArrowRight size={20} />
            </button>
            <button className="px-6 md:px-10 py-3 md:py-5 border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:text-red-700 transition-all duration-300 text-base md:text-lg mx-auto sm:mx-0 shadow-lg">
              Talk to Us First
            </button>
          </div>

          <p className="text-gray-300 text-sm md:text-base">
            ✓ Free forever tier available | ✓ No credit card required | ✓ Cancel
            anytime
          </p>
        </div>
      </section>
    </div>
  );
}

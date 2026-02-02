import { ArrowRight, CheckCircle, Star, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTAPage() {
  return (
    <div className="min-h-screen text-white">
      {/* CTA Section */}
      <section className="min-h-screen flex items-center justify-center py-12 md:py-20 px-4 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-red-900/30 via-black to-black"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="mb-6 md:mb-8 inline-block">
            <div className="border border-yellow-400/30 rounded-full px-6 py-2 bg-yellow-400/10 backdrop-blur-sm">
              <span className="text-sm font-bold text-yellow-300 flex items-center gap-2">
                <Star size={16} className="text-yellow-400" />
                Limited Time Offer
              </span>
            </div>
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-6xl font-black mb-6 md:mb-8 text-white drop-shadow-lg">
            Ready to Transform Your{" "}
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Career?
            </span>
          </h2>

          <p className="text-lg md:text-xl text-gray-200 mb-6 md:mb-8 max-w-2xl mx-auto">
            Thousands of freshers have already taken the leap. The question
            isn't "Can I do this?"—it's{" "}
            <span className="font-bold text-white">"When will I start?"</span>
          </p>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 md:mb-10">
            <div className="flex items-center justify-center gap-2 text-green-300">
              <CheckCircle size={20} />
              <span className="text-sm md:text-base">Free forever tier available</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-blue-300">
              <Zap size={20} />
              <span className="text-sm md:text-base">No credit card required</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-purple-300">
              <CheckCircle size={20} />
              <span className="text-sm md:text-base">Cancel anytime</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-8 md:mb-10">
            <Link 
              to="/register"
              className="px-6 md:px-10 py-3 md:py-5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-bold text-base md:text-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 flex items-center justify-center gap-2 mx-auto sm:mx-0 shadow-lg transform hover:scale-105 hover:shadow-xl"
            >
              Start Free Today
              <ArrowRight size={20} />
            </Link>
            <Link 
              to="/info/about"
              className="px-6 md:px-10 py-3 md:py-5 border-2 border-white/30 text-white rounded-lg font-bold hover:bg-white/10 hover:border-white/50 transition-all duration-300 text-base md:text-lg mx-auto sm:mx-0 shadow-lg backdrop-blur-sm transform hover:scale-105"
            >
              Talk to Us First
            </Link>
          </div>

          {/* Social Proof */}
          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className="text-yellow-400 fill-current" />
              ))}
              <span className="ml-2 text-white font-semibold">4.9/5</span>
            </div>
            <p className="text-gray-300 text-sm md:text-base italic">
              "Project VIP helped me land my dream job in just 3 months. The AI resume builder and mock interviews were game-changers!"
            </p>
            <p className="text-gray-400 text-sm mt-2">- Sarah K., Software Engineer at Google</p>
          </div>
        </div>
      </section>
    </div>
  );
}

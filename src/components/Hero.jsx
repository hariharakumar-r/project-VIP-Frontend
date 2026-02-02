import { ArrowRight, Sparkles, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroPage() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-12 md:py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-blue-900/20"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-red-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Badge */}
        <div className="mb-6 md:mb-8 inline-block animate-fade-in">
          <div className="border-2 border-white/20 rounded-full px-6 py-3 bg-black/40 backdrop-blur-sm">
            <span className="text-xs md:text-sm font-bold text-white flex items-center gap-2">
              <Sparkles size={16} className="text-yellow-400" />
              Welcome to Your Future
            </span>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 md:mb-6 leading-tight text-white drop-shadow-lg animate-slide-up">
          You're Not Alone in This{" "}
          <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
            Fight
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl lg:text-2xl text-gray-100 mb-6 md:mb-8 leading-relaxed max-w-3xl mx-auto drop-shadow animate-slide-up delay-200">
          We understand the sleepless nights, the rejection emails, the skill
          gaps that keep you awake.{" "}
          <span className="font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Project VIP exists because we've been there too.
          </span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-10 md:mb-12 animate-slide-up delay-300">
          <Link 
            to="/register"
            className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-bold hover:from-red-700 hover:to-red-800 transition-all duration-300 flex items-center justify-center gap-2 mx-auto sm:mx-0 shadow-lg text-sm md:text-base transform hover:scale-105 hover:shadow-xl"
          >
            Start Your Journey
            <ArrowRight size={20} />
          </Link>
          <Link 
            to="/info/about"
            className="px-6 md:px-8 py-3 md:py-4 border-2 border-white/30 text-white rounded-lg font-bold hover:bg-white/10 hover:border-white/50 transition-all duration-300 mx-auto sm:mx-0 shadow-lg text-sm md:text-base backdrop-blur-sm transform hover:scale-105"
          >
            Learn More
          </Link>
        </div>

        {/* Enhanced Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 animate-slide-up delay-500">
          <StatCard 
            number="500+" 
            label="Freshers Helped" 
            icon={<Users size={24} />}
            color="from-blue-500 to-blue-600"
          />
          <StatCard 
            number="85%" 
            label="Job Success Rate" 
            icon={<TrendingUp size={24} />}
            color="from-green-500 to-green-600"
          />
          <StatCard 
            number="10+" 
            label="Features Built" 
            icon={<Sparkles size={24} />}
            color="from-purple-500 to-purple-600"
          />
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-gray-300 text-sm animate-slide-up delay-700">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Free Forever Tier</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>No Credit Card Required</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span>Cancel Anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ number, label, icon, color }) {
  return (
    <div className="group">
      <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:border-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <p className="text-2xl md:text-3xl font-black text-white mb-2">{number}</p>
        <p className="text-sm md:text-base text-gray-300 font-medium">{label}</p>
      </div>
    </div>
  );
}

import { ArrowRight } from "lucide-react";

export default function HeroPage() {

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-12 md:py-20">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-6 md:mb-8 inline-block">
          <div className="border-2 border-white rounded-full px-6 py-3 bg-black bg-opacity-40">
            <span className="text-xs md:text-sm font-bold text-white">
              Welcome to Your Future
            </span>
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 md:mb-6 leading-tight text-white drop-shadow-lg">
          You're Not Alone in This Fight
        </h1>

        <p className="text-lg md:text-xl lg:text-2xl text-gray-100 mb-6 md:mb-8 leading-relaxed max-w-2xl mx-auto drop-shadow">
          We understand the sleepless nights, the rejection emails, the skill
          gaps that keep you awake.{" "}
          <span className="font-bold text-white">
            Project VIP exists because we've been there too.
          </span>
        </p>

        {/* <p className="text-base md:text-lg text-gray-200 mb-8 md:mb-10 max-w-xl mx-auto drop-shadow">
          From your first resume to your dream job interview, we're here to
          bridge every gap and unlock your true potential.
        </p> */}

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-10 md:mb-12">
          <button className="px-6 md:px-8 py-3 md:py-4 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 transition-all duration-300 flex items-center justify-center gap-2 mx-auto sm:mx-0 shadow-lg text-sm md:text-base">
            Start Your Journey
            <ArrowRight size={20} />
          </button>
          <button className="px-6 md:px-8 py-3 md:py-4 border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:text-red-700 transition-all duration-300 mx-auto sm:mx-0 shadow-lg text-sm md:text-base">
            Learn More
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <StatCard number="500+" label="Freshers Helped" />
          <StatCard number="85%" label="Job Success Rate" />
          <StatCard number="10+" label="Features Built" />
        </div>
      </div>
    </section>
  );
}

function StatCard({ number, label }) {
  return (
    <div className="p-4 md:p-6 bg-black bg-opacity-60 border-2 border-white rounded-lg hover:bg-opacity-80 transition-all duration-300 shadow-lg">
      <div className="text-2xl md:text-3xl font-black text-white mb-1 md:mb-2">{number}</div>
      <div className="text-gray-200 text-xs md:text-sm font-semibold">{label}</div>
    </div>
  );
}

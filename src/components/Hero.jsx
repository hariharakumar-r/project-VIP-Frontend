import { ArrowRight } from "lucide-react";

export default function HeroPage() {

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8 inline-block">
          <div className="border-2 border-black rounded-full px-6 py-3">
            <span className="text-sm font-bold text-black">
              Welcome to Your Future
            </span>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight text-black">
          You're Not Alone in This Fight
        </h1>

        <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed max-w-2xl mx-auto">
          We understand the sleepless nights, the rejection emails, the skill
          gaps that keep you awake.{" "}
          <span className="font-bold text-black">
            Project VIP exists because we've been there too.
          </span>
        </p>

        <p className="text-lg text-gray-600 mb-12 max-w-xl mx-auto">
          From your first resume to your dream job interview, we're here to
          bridge every gap and unlock your true potential.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button className="px-8 py-4 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2 mx-auto sm:mx-0">
            Start Your Journey
            <ArrowRight size={20} />
          </button>
          <button className="px-8 py-4 border-2 border-black text-black rounded-lg font-bold hover:bg-gray-100 transition-all duration-300 mx-auto sm:mx-0">
            Learn More
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
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
    <div className="p-6 bg-gray-100 border-2 border-black rounded-lg">
      <div className="text-3xl font-black text-black mb-2">{number}</div>
      <div className="text-gray-700 text-sm font-semibold">{label}</div>
    </div>
  );
}

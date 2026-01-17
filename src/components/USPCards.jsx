import { FileText, Video, Brain } from "lucide-react";

export default function WhyChooseUsPage() {
  return (
    <div className="min-h-screen text-white">
      {/* Why Choose Us Section */}
      <section className="min-h-screen py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-4 md:mb-6 text-white drop-shadow-lg">
              Why Choose Project VIP?
            </h2>
            <p className="text-lg md:text-xl text-gray-300">What Sets Us Apart</p>
          </div>

          {/* Four Main Features - Square Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <FeatureCard
              icon={<FileText size={40} />}
              title="AI Resume Builder"
              description="Our intelligent system analyzes job descriptions and crafts ATS-optimized resumes that highlight your strengths exactly how recruiters want to see them."
              highlights={[
                "ATS-Optimized",
                "Auto-Tailoring",
                "Format Excellence",
              ]}
            />

            <FeatureCard
              icon={<Video size={40} />}
              title="Expert Zoom Scheduling"
              description="Connect with industry professionals for mock interviews and mentoring sessions. Real feedback from real experts who've walked the path you're on."
              highlights={[
                "Flexible Timing",
                "Industry Experts",
                "Recorded Sessions",
              ]}
            />

            <FeatureCard
              icon={<Brain size={40} />}
              title="AI Career Assistant"
              description="Your personal career coach available 24/7. Get instant feedback on cover letters, interview prep, skill recommendations, and personalized job matches."
              highlights={[
                "24/7 Available",
                "Personalized Paths",
                "Real-time Feedback",
              ]}
            />
            <FeatureCard
              icon={<Brain size={40} />}
              title="Career Roadmap"
              description="Get a personalized career roadmap based on your skills, interests, and goals. We'll help you navigate the job market with confidence."
              highlights={[
                "Personalized Plans",
                "Goal Setting",
                "Progress Tracking",
              ]}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, highlights }) {
  return (
    <div className="bg-black border border-gray-700 rounded-lg p-6 md:p-8 hover:border-red-700 transition-all duration-300 shadow-lg flex flex-col h-full min-h-[500px] md:min-h-[550px]">
      <div className="text-red-600 mb-4 flex-shrink-0">{icon}</div>
      <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 line-clamp-2">{title}</h3>
      <p className="text-gray-300 leading-relaxed mb-4 md:mb-6 flex-grow text-sm md:text-base">{description}</p>
      <div className="flex flex-wrap gap-2 mt-auto">
        {highlights.map((highlight, idx) => (
          <span
            key={idx}
            className="px-2 md:px-3 py-1 bg-red-900 border border-red-700 text-red-300 rounded text-xs md:text-sm font-semibold hover:bg-red-800 transition-colors whitespace-nowrap"
          >
            {highlight}
          </span>
        ))}
      </div>
    </div>
  );
}
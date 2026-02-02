import { FileText, Video, Brain, Map, Sparkles, CheckCircle, ArrowRight } from "lucide-react";

export default function WhyChooseUsPage() {
  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/50 to-black"></div>
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
      
      {/* Why Choose Us Section */}
      <section className="min-h-screen py-12 md:py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <div className="mb-4 inline-block">
              <div className="border border-purple-400/30 rounded-full px-6 py-2 bg-purple-400/10 backdrop-blur-sm">
                <span className="text-sm font-bold text-purple-300 flex items-center gap-2">
                  <Sparkles size={16} className="text-purple-400" />
                  Our Unique Features
                </span>
              </div>
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-4 md:mb-6 text-white drop-shadow-lg">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
                Project VIP?
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Cutting-edge tools and personalized support to accelerate your career journey
            </p>
          </div>

          {/* Four Main Features - Enhanced Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <FeatureCard
              icon={<FileText size={40} />}
              title="AI Resume Builder"
              description="Our intelligent system analyzes job descriptions and crafts ATS-optimized resumes that highlight your strengths exactly how recruiters want to see them."
              highlights={[
                "ATS-Optimized",
                "Auto-Tailoring",
                "Format Excellence",
              ]}
              color="from-blue-500 to-blue-600"
              delay="0"
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
              color="from-green-500 to-green-600"
              delay="100"
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
              color="from-purple-500 to-purple-600"
              delay="200"
            />
            
            <FeatureCard
              icon={<Map size={40} />}
              title="Career Roadmap"
              description="Get a personalized career roadmap based on your skills, interests, and goals. We'll help you navigate the job market with confidence."
              highlights={[
                "Personalized Plans",
                "Goal Setting",
                "Progress Tracking",
              ]}
              color="from-orange-500 to-orange-600"
              delay="300"
            />
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12 md:mt-16">
            <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to Experience the Difference?
              </h3>
              <p className="text-gray-300 mb-6">
                Join thousands of successful job seekers who transformed their careers with Project VIP
              </p>
              <button className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-bold hover:from-red-700 hover:to-red-800 transition-all duration-300 flex items-center justify-center gap-2 mx-auto shadow-lg transform hover:scale-105">
                Get Started Now
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, highlights, color, delay }) {
  return (
    <div 
      className="group bg-black/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 hover:border-white/20 transition-all duration-500 shadow-lg flex flex-col h-full min-h-[500px] md:min-h-[550px] transform hover:scale-105 hover:shadow-2xl"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Icon */}
      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r ${color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
        <div className="text-white">
          {icon}
        </div>
      </div>
      
      {/* Title */}
      <h3 className="text-xl md:text-2xl font-bold text-white mb-4 group-hover:text-gray-100 transition-colors">
        {title}
      </h3>
      
      {/* Description */}
      <p className="text-gray-300 leading-relaxed mb-6 flex-grow text-sm md:text-base group-hover:text-gray-200 transition-colors">
        {description}
      </p>
      
      {/* Highlights */}
      <div className="space-y-2 mt-auto">
        {highlights.map((highlight, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm">
            <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
            <span className="text-gray-300 group-hover:text-white transition-colors">
              {highlight}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
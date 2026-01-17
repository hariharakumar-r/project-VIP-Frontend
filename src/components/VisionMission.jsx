import {
  Target,
  Zap,
  Brain,
  FileText,
  Video,
  Users,
} from "lucide-react";

export default function VisionMissionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#1F1C18] to-[#8E0E00] text-white">
      {/* Vision & Mission Section */}
      <section className="min-h-screen py-12 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-4 md:mb-6 text-white">
              Vision & Mission
            </h2>
            <p className="text-lg md:text-xl text-gray-300">Why We Exist</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-12 mb-10 md:mb-16">
            <div className="bg-black border border-gray-700 rounded-2xl p-8 md:p-12">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <Target size={32} className="text-red-600" />
                <h3 className="text-2xl md:text-3xl font-bold text-white">Vision</h3>
              </div>
              <p className="text-gray-300 leading-relaxed text-sm md:text-lg">
                A world where no talented fresher is left behind due to lack of
                guidance, poor presentation, or missing skills. Where every
                college graduate walks into their dream job interview with
                confidence, clarity, and the right tools in hand.
              </p>
            </div>

            <div className="bg-black border border-gray-700 rounded-2xl p-8 md:p-12">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <Zap size={32} className="text-red-600" />
                <h3 className="text-2xl md:text-3xl font-bold text-white">Mission</h3>
              </div>
              <p className="text-gray-300 leading-relaxed text-sm md:text-lg">
                To empower freshers by bridging the skill gap through
                intelligent tools, personalized guidance, and real mentorship.
                We're not just a platform—we're your career companion from day
                one.
              </p>
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8">Our Promise</h3>

            <PromiseCard
              title="Bridge the Skill Gap"
              description="Identify what you lack, master what you need. Our AI career assistant learns your weaknesses and builds a personalized learning path."
              icon={<Brain size={28} className="text-red-600" />}
            />

            <PromiseCard
              title="Transform Your Resume"
              description="From lifeless bullet points to a compelling story that makes recruiters stop scrolling. Our AI resume builder crafts resumes that actually get noticed."
              icon={<FileText size={28} className="text-red-600" />}
            />

            <PromiseCard
              title="Master Every Interview"
              description="Practice with real industry experts via scheduled zoom calls. Get feedback that actually helps. Refine until you're unstoppable."
              icon={<Video size={28} className="text-red-600" />}
            />

            <PromiseCard
              title="Genuine Mentorship"
              description="Not just algorithms—real people who've succeeded in landing jobs share their stories, strategies, and secrets with you."
              icon={<Users size={28} className="text-red-600" />}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function PromiseCard({ title, description, icon }) {
  return (
    <div className="bg-black border border-gray-700 rounded-xl p-4 md:p-8 flex gap-4 md:gap-6">
      <div className="p-2 md:p-3 bg-gray-900 border border-gray-700 rounded-lg h-fit flex-shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">{title}</h4>
        <p className="text-gray-300 leading-relaxed text-sm md:text-base">{description}</p>
      </div>
    </div>
  );
}

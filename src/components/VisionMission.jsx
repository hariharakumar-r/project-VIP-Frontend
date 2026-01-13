import React, { useState } from "react";
import {
  Menu,
  X,
  Target,
  Zap,
  Brain,
  FileText,
  Video,
  Users,
  Shield,
} from "lucide-react";

export default function VisionMissionPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Vision & Mission Section */}
      <section className="min-h-screen py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-black">
              Vision & Mission
            </h2>
            <p className="text-xl text-gray-600">Why We Exist</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="bg-gray-100 border-2 border-black rounded-2xl p-12">
              <div className="flex items-center gap-3 mb-6">
                <Target size={32} className="text-black" />
                <h3 className="text-3xl font-bold text-black">Vision</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                A world where no talented fresher is left behind due to lack of
                guidance, poor presentation, or missing skills. Where every
                college graduate walks into their dream job interview with
                confidence, clarity, and the right tools in hand.
              </p>
            </div>

            <div className="bg-gray-100 border-2 border-black rounded-2xl p-12">
              <div className="flex items-center gap-3 mb-6">
                <Zap size={32} className="text-black" />
                <h3 className="text-3xl font-bold text-black">Mission</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                To empower freshers by bridging the skill gap through
                intelligent tools, personalized guidance, and real mentorship.
                We're not just a platform—we're your career companion from day
                one.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-black mb-8">Our Promise</h3>

            <PromiseCard
              title="Bridge the Skill Gap"
              description="Identify what you lack, master what you need. Our AI career assistant learns your weaknesses and builds a personalized learning path."
              icon={<Brain size={28} className="text-black" />}
            />

            <PromiseCard
              title="Transform Your Resume"
              description="From lifeless bullet points to a compelling story that makes recruiters stop scrolling. Our AI resume builder crafts resumes that actually get noticed."
              icon={<FileText size={28} className="text-black" />}
            />

            <PromiseCard
              title="Master Every Interview"
              description="Practice with real industry experts via scheduled zoom calls. Get feedback that actually helps. Refine until you're unstoppable."
              icon={<Video size={28} className="text-black" />}
            />

            <PromiseCard
              title="Genuine Mentorship"
              description="Not just algorithms—real people who've succeeded in landing jobs share their stories, strategies, and secrets with you."
              icon={<Users size={28} className="text-black" />}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function PromiseCard({ title, description, icon }) {
  return (
    <div className="bg-gray-100 border-2 border-black rounded-xl p-6 md:p-8 flex gap-6">
      <div className="p-3 bg-white border border-black rounded-lg h-fit">
        {icon}
      </div>
      <div>
        <h4 className="text-xl font-bold text-black mb-2">{title}</h4>
        <p className="text-gray-700 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

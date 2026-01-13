import React, { useState } from "react";
import { Menu, X, FileText, Video, Brain, Shield } from "lucide-react";

export default function WhyChooseUsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Why Choose Us Section */}
      <section className="min-h-screen py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-black">
              Why Choose Project VIP?
            </h2>
            <p className="text-xl text-gray-600">What Sets Us Apart</p>
          </div>

          {/* Four Main Features */}
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            <FeatureCard
              icon={<FileText size={40} />}
              title="AI Resume Builder"
              description="Our intelligent system analyzes job descriptions and crafts ATS-optimized resumes that highlight your strengths exactly how recruiters want to see them. Watch your callback rate skyrocket."
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
    <div className="bg-gray-100 border-2 border-black rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
      <div className="text-black mb-4">{icon}</div>
      <h3 className="text-2xl font-bold text-black mb-4">{title}</h3>
      <p className="text-gray-700 leading-relaxed mb-6">{description}</p>
      <div className="flex flex-wrap gap-2">
        {highlights.map((highlight, idx) => (
          <span
            key={idx}
            className="px-3 py-1 bg-white border border-black text-black rounded-full text-xs font-semibold"
          >
            {highlight}
          </span>
        ))}
      </div>
    </div>
  );
}
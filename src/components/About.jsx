import React, { useState } from "react";
import { Menu, X, Heart, Lightbulb, Users } from "lucide-react";

export default function AboutPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-black">
      <section className="min-h-screen py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-black">
              About Project VIP
            </h2>
            <p className="text-xl text-gray-600">
              The Story Behind the Solution
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-black">
                How It All Started
              </h3>
              <p className="text-gray-700 leading-relaxed">
                The creator of Project VIP walked the path you're walking now.
                Dozens of applications sent. Countless interviews attended. The
                gut-wrenching wait for responses. The sting of rejection. The
                persistent self-doubt.
              </p>
              <p className="text-gray-700 leading-relaxed">
                But something became crystal clear:{" "}
                <span className="font-bold text-black">
                  the problem wasn't ability—it was guidance, support, and the
                  right tools.
                </span>{" "}
                Too many talented freshers were losing out because they didn't
                know how to showcase themselves properly. Their resumes weren't
                polished. Their interview skills weren't honed. They lacked
                mentorship.
              </p>
              <p className="text-gray-700 leading-relaxed">
                That's when Project VIP was born—not from theory, but from real
                pain, real struggle, and a burning desire to ensure no fresher
                has to feel that despair alone.
              </p>
            </div>

            <div className="bg-gray-100 border-2 border-black rounded-2xl p-8">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <Heart className="text-black flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h4 className="font-bold text-black mb-2">
                      Built with Empathy
                    </h4>
                    <p className="text-gray-700 text-sm">
                      Every feature designed by someone who understands your
                      struggle
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Lightbulb
                    className="text-black flex-shrink-0 mt-1"
                    size={24}
                  />
                  <div>
                    <h4 className="font-bold text-black mb-2">
                      Innovation at Core
                    </h4>
                    <p className="text-gray-700 text-sm">
                      AI-powered tools that actually understand what employers
                      want
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Users className="text-black flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h4 className="font-bold text-black mb-2">
                      Community Driven
                    </h4>
                    <p className="text-gray-700 text-sm">
                      Learn from peers, share experiences, grow together
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-100 border-2 border-black rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl font-bold text-black mb-6">
              Our Core Belief
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              Every fresher deserves a fair shot at their dream career. With the
              right guidance, honest feedback, and powerful tools, anyone can
              bridge the gap between where they are and where they want to be.
              Project VIP is that bridge—built by someone who's crossed it, for
              everyone coming after.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

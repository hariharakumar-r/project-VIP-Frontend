import { useState, useEffect, useRef } from "react";
import api from "../../services/api";
import { Plus, Trash2, Save, Download, Eye, Edit2 } from "lucide-react";
import html2pdf from "html2pdf.js";

export default function ResumeBuilder() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
  });

  const [resume, setResume] = useState({
    summary: "",
    skills: [],
    experience: [],
    education: [],
  });

  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const resumeRef = useRef();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/applicant/profile");
      setProfile({
        name: res.data.name || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        location: res.data.location || "",
      });
      if (res.data.resume) setResume(res.data.resume);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post("/api/applicant/profile", { resume });
      alert("Resume saved successfully!");
    } catch (err) {
      alert("Failed to save resume");
    } finally {
      setSaving(false);
    }
  };

  const downloadPDF = () => {
    const element = resumeRef.current;
    if (!element) {
      alert("Resume content not found. Please try again.");
      return;
    }

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `${profile.name?.replace(/\s+/g, '_') || "resume"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff"
      },
      jsPDF: { 
        orientation: "portrait", 
        unit: "mm", 
        format: "a4",
        putOnlyUsedFonts: true,
        floatPrecision: 16
      },
    };

    // Show loading state
    const originalText = element.querySelector('h1').textContent;
    element.querySelector('h1').textContent = "Generating PDF...";
    
    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        // Restore original text
        element.querySelector('h1').textContent = originalText;
        alert("PDF downloaded successfully!");
      })
      .catch((error) => {
        console.error("PDF generation failed:", error);
        element.querySelector('h1').textContent = originalText;
        alert("Failed to generate PDF. Please try again.");
      });
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setResume({ ...resume, skills: [...resume.skills, newSkill.trim()] });
      setNewSkill("");
    }
  };

  const removeSkill = (index) => {
    setResume({ ...resume, skills: resume.skills.filter((_, i) => i !== index) });
  };

  const addExperience = () => {
    setResume({
      ...resume,
      experience: [...resume.experience, { title: "", company: "", startDate: "", endDate: "", description: "" }],
    });
  };

  const updateExperience = (index, field, value) => {
    const updated = [...resume.experience];
    updated[index][field] = value;
    setResume({ ...resume, experience: updated });
  };

  const removeExperience = (index) => {
    setResume({ ...resume, experience: resume.experience.filter((_, i) => i !== index) });
  };

  const addEducation = () => {
    setResume({
      ...resume,
      education: [...resume.education, { degree: "", institution: "", field: "", graduationYear: "" }],
    });
  };

  const updateEducation = (index, field, value) => {
    const updated = [...resume.education];
    updated[index][field] = value;
    setResume({ ...resume, education: updated });
  };

  const removeEducation = (index) => {
    setResume({ ...resume, education: resume.education.filter((_, i) => i !== index) });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">Resume Builder</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-2 bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800"
          >
            <Eye size={20} />
            {previewMode ? "Edit" : "Preview"}
          </button>
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800"
          >
            <Download size={20} />
            Download PDF
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 disabled:opacity-50"
          >
            <Save size={20} />
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        {!previewMode && (
          <div className="space-y-6">
            {/* Summary Section */}
            <div className="bg-black p-6 rounded-lg shadow border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                <Edit2 size={20} />
                Professional Summary
              </h3>
              <textarea
                value={resume.summary}
                onChange={(e) => setResume({ ...resume, summary: e.target.value })}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-600 placeholder-gray-500"
                rows={4}
                placeholder="Write a brief professional summary about yourself..."
              />
            </div>

            {/* Skills Section */}
            <div className="bg-black p-6 rounded-lg shadow border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-white">Skills</h3>
              <div className="flex gap-2 mb-4">
                <input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  className="flex-1 p-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-600 placeholder-gray-500"
                  placeholder="Add a skill (e.g., JavaScript, React)..."
                />
                <button
                  onClick={addSkill}
                  className="bg-red-700 text-white px-4 py-3 rounded-lg hover:bg-red-800"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill, i) => (
                  <div
                    key={i}
                    className="bg-red-900 text-red-300 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(i)}
                      className="text-red-400 hover:text-red-200 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Section */}
            <div className="bg-black p-6 rounded-lg shadow border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Work Experience</h3>
                <button
                  onClick={addExperience}
                  className="flex items-center gap-1 bg-red-700 text-white px-3 py-1 rounded-lg hover:bg-red-800"
                >
                  <Plus size={18} />
                  Add
                </button>
              </div>
              <div className="space-y-4">
                {resume.experience.map((exp, i) => (
                  <div key={i} className="border-l-4 border-red-700 p-4 bg-gray-900 rounded border border-gray-700">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <input
                        value={exp.title}
                        onChange={(e) => updateExperience(i, "title", e.target.value)}
                        className="p-2 border border-gray-600 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-600 placeholder-gray-500"
                        placeholder="Job Title"
                      />
                      <input
                        value={exp.company}
                        onChange={(e) => updateExperience(i, "company", e.target.value)}
                        className="p-2 border border-gray-600 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-600 placeholder-gray-500"
                        placeholder="Company"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(i, "startDate", e.target.value)}
                        className="p-2 border border-gray-600 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                        placeholder="Start Date"
                      />
                      <input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(i, "endDate", e.target.value)}
                        className="p-2 border border-gray-600 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                        placeholder="End Date"
                      />
                    </div>
                    <textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(i, "description", e.target.value)}
                      className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-600 placeholder-gray-500"
                      placeholder="Describe your responsibilities and achievements..."
                      rows={3}
                    />
                    <button
                      onClick={() => removeExperience(i)}
                      className="text-red-400 mt-2 flex items-center gap-1 hover:text-red-300"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Section */}
            <div className="bg-black p-6 rounded-lg shadow border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Education</h3>
                <button
                  onClick={addEducation}
                  className="flex items-center gap-1 bg-red-700 text-white px-3 py-1 rounded-lg hover:bg-red-800"
                >
                  <Plus size={18} />
                  Add
                </button>
              </div>
              <div className="space-y-4">
                {resume.education.map((edu, i) => (
                  <div key={i} className="border-l-4 border-green-700 p-4 bg-gray-900 rounded border border-gray-700">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <input
                        value={edu.degree}
                        onChange={(e) => updateEducation(i, "degree", e.target.value)}
                        className="p-2 border border-gray-600 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-600 placeholder-gray-500"
                        placeholder="Degree (e.g., Bachelor's)"
                      />
                      <input
                        value={edu.field}
                        onChange={(e) => updateEducation(i, "field", e.target.value)}
                        className="p-2 border border-gray-600 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-600 placeholder-gray-500"
                        placeholder="Field of Study"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <input
                        value={edu.institution}
                        onChange={(e) => updateEducation(i, "institution", e.target.value)}
                        className="p-2 border border-gray-600 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-600 placeholder-gray-500"
                        placeholder="Institution/University"
                      />
                      <input
                        type="number"
                        value={edu.graduationYear}
                        onChange={(e) => updateEducation(i, "graduationYear", e.target.value)}
                        className="p-2 border border-gray-600 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-600 placeholder-gray-500"
                        placeholder="Graduation Year"
                      />
                    </div>
                    <button
                      onClick={() => removeEducation(i)}
                      className="text-red-400 mt-2 flex items-center gap-1 hover:text-red-300"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Preview Panel */}
        <div className={previewMode ? "col-span-1 lg:col-span-2" : ""}>
          <div
            ref={resumeRef}
            className="bg-white p-12 rounded-lg shadow"
            style={{ minHeight: "1000px", fontFamily: "Arial, sans-serif" }}
          >
            {/* Header */}
            <div className="border-b-2 border-gray-800 pb-6 mb-6">
              <h1 className="text-4xl font-bold text-gray-900">{profile.name || "Your Name"}</h1>
              <div className="flex gap-4 text-sm text-gray-600 mt-2">
                {profile.email && <span>{profile.email}</span>}
                {profile.phone && <span>•</span>}
                {profile.phone && <span>{profile.phone}</span>}
                {profile.location && <span>•</span>}
                {profile.location && <span>{profile.location}</span>}
              </div>
            </div>

            {/* Summary */}
            {resume.summary && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2 border-b-2 border-gray-300 pb-1">
                  PROFESSIONAL SUMMARY
                </h2>
                <p className="text-gray-700 text-sm leading-relaxed">{resume.summary}</p>
              </div>
            )}

            {/* Skills */}
            {resume.skills.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2 border-b-2 border-gray-300 pb-1">
                  SKILLS
                </h2>
                <div className="flex flex-wrap gap-2">
                  {resume.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {resume.experience.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-gray-300 pb-1">
                  WORK EXPERIENCE
                </h2>
                <div className="space-y-4">
                  {resume.experience.map((exp, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{exp.title}</h3>
                          <p className="text-gray-700 font-semibold">{exp.company}</p>
                        </div>
                        <span className="text-sm text-gray-600">
                          {exp.startDate && exp.endDate
                            ? `${exp.startDate} - ${exp.endDate}`
                            : exp.startDate
                            ? exp.startDate
                            : ""}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="text-gray-700 text-sm mt-2 whitespace-pre-wrap">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {resume.education.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-gray-300 pb-1">
                  EDUCATION
                </h2>
                <div className="space-y-4">
                  {resume.education.map((edu, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {edu.degree}
                            {edu.field && ` in ${edu.field}`}
                          </h3>
                          <p className="text-gray-700 font-semibold">{edu.institution}</p>
                        </div>
                        {edu.graduationYear && (
                          <span className="text-sm text-gray-600">{edu.graduationYear}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

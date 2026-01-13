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
    const opt = {
      margin: 10,
      filename: `${profile.name || "resume"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
    };
    html2pdf().set(opt).from(element).save();
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
        <h2 className="text-3xl font-bold">Resume Builder</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            <Eye size={20} />
            {previewMode ? "Edit" : "Preview"}
          </button>
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            <Download size={20} />
            Download PDF
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
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
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Edit2 size={20} />
                Professional Summary
              </h3>
              <textarea
                value={resume.summary}
                onChange={(e) => setResume({ ...resume, summary: e.target.value })}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Write a brief professional summary about yourself..."
              />
            </div>

            {/* Skills Section */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Skills</h3>
              <div className="flex gap-2 mb-4">
                <input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a skill (e.g., JavaScript, React)..."
                />
                <button
                  onClick={addSkill}
                  className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill, i) => (
                  <div
                    key={i}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(i)}
                      className="text-blue-600 hover:text-blue-800 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Section */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Work Experience</h3>
                <button
                  onClick={addExperience}
                  className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                >
                  <Plus size={18} />
                  Add
                </button>
              </div>
              <div className="space-y-4">
                {resume.experience.map((exp, i) => (
                  <div key={i} className="border-l-4 border-blue-500 p-4 bg-gray-50 rounded">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <input
                        value={exp.title}
                        onChange={(e) => updateExperience(i, "title", e.target.value)}
                        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Job Title"
                      />
                      <input
                        value={exp.company}
                        onChange={(e) => updateExperience(i, "company", e.target.value)}
                        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Company"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(i, "startDate", e.target.value)}
                        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Start Date"
                      />
                      <input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(i, "endDate", e.target.value)}
                        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="End Date"
                      />
                    </div>
                    <textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(i, "description", e.target.value)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe your responsibilities and achievements..."
                      rows={3}
                    />
                    <button
                      onClick={() => removeExperience(i)}
                      className="text-red-500 mt-2 flex items-center gap-1 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Section */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Education</h3>
                <button
                  onClick={addEducation}
                  className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                >
                  <Plus size={18} />
                  Add
                </button>
              </div>
              <div className="space-y-4">
                {resume.education.map((edu, i) => (
                  <div key={i} className="border-l-4 border-green-500 p-4 bg-gray-50 rounded">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <input
                        value={edu.degree}
                        onChange={(e) => updateEducation(i, "degree", e.target.value)}
                        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Degree (e.g., Bachelor's)"
                      />
                      <input
                        value={edu.field}
                        onChange={(e) => updateEducation(i, "field", e.target.value)}
                        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Field of Study"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <input
                        value={edu.institution}
                        onChange={(e) => updateEducation(i, "institution", e.target.value)}
                        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Institution/University"
                      />
                      <input
                        type="number"
                        value={edu.graduationYear}
                        onChange={(e) => updateEducation(i, "graduationYear", e.target.value)}
                        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Graduation Year"
                      />
                    </div>
                    <button
                      onClick={() => removeEducation(i)}
                      className="text-red-500 mt-2 flex items-center gap-1 hover:text-red-700"
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

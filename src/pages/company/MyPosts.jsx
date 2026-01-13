import { useState, useEffect } from "react";
import api from "../../services/api";
import { 
  Users, 
  MapPin, 
  DollarSign, 
  Eye, 
  Edit2, 
  Trash2, 
  Plus, 
  X, 
  Save,
  Calendar,
  Briefcase,
  Star
} from "lucide-react";

export default function MyPosts() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const [jobForm, setJobForm] = useState({
    title: "",
    location: "",
    jobType: "",
    skills: [],
    salary: "",
    description: "",
    status: "ACTIVE"
  });

  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/api/company/my-posts");
      setJobs(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch job posts");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setJobForm({
      title: "",
      location: "",
      jobType: "",
      skills: [],
      salary: "",
      description: "",
      status: "ACTIVE"
    });
    setSkillInput("");
    setEditingJob(null);
    setShowJobForm(false);
  };

  const handleCreateJob = () => {
    resetForm();
    setShowJobForm(true);
  };

  const handleEditJob = (job) => {
    setJobForm({
      title: job.title || "",
      location: job.location || "",
      jobType: job.jobType || "",
      skills: job.skills || [],
      salary: job.salary || "",
      description: job.description || "",
      status: job.status || "ACTIVE"
    });
    setEditingJob(job._id);
    setShowJobForm(true);
  };

  const addSkill = () => {
    if (skillInput.trim() && !jobForm.skills.includes(skillInput.trim())) {
      setJobForm({
        ...jobForm,
        skills: [...jobForm.skills, skillInput.trim()]
      });
      setSkillInput("");
    }
  };

  const removeSkill = (index) => {
    setJobForm({
      ...jobForm,
      skills: jobForm.skills.filter((_, i) => i !== index)
    });
  };

  const handleSubmitJob = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingJob) {
        await api.put(`/api/company/job/${editingJob}`, jobForm);
        alert("Job post updated successfully!");
      } else {
        await api.post("/api/company/job", jobForm);
        alert("Job post created successfully!");
      }
      
      resetForm();
      fetchJobs();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save job post");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job post? This action cannot be undone.")) {
      setDeleting(jobId);
      try {
        await api.delete(`/api/company/job/${jobId}`);
        alert("Job post deleted successfully!");
        fetchJobs();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete job post");
      } finally {
        setDeleting(null);
      }
    }
  };

  const viewApplicants = async (jobId) => {
    setSelectedJob(jobId);
    setLoadingApplicants(true);
    try {
      const res = await api.get(`/api/company/applicants/${jobId}`);
      console.log("Applicants data:", res.data);
      setApplicants(res.data || []);
    } catch (err) {
      console.error("Error fetching applicants:", err);
      alert("Failed to fetch applicants: " + (err.response?.data?.message || err.message));
      setApplicants([]);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      await api.patch(`/api/company/application/${applicationId}/status`, { status });
      setApplicants(applicants.map(a => a._id === applicationId ? { ...a, status } : a));
      alert("Application status updated successfully!");
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE": return "bg-green-100 text-green-800";
      case "INACTIVE": return "bg-gray-100 text-gray-800";
      case "CLOSED": return "bg-red-100 text-red-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  if (loading) return <div className="text-center py-8">Loading job posts...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">My Job Posts</h2>
        <button
          onClick={handleCreateJob}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          <Plus size={20} />
          Create Job Post
        </button>
      </div>

      {/* Job Posts Grid */}
      <div className="grid gap-6">
        {jobs.map((job) => (
          <div key={job._id} className="bg-white p-6 rounded-lg shadow-lg border">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold">{job.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                    {job.status}
                  </span>
                  {job.promoted && (
                    <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                      <Star size={12} />
                      Promoted
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                  {job.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={16} />
                      {job.location}
                    </span>
                  )}
                  {job.salary && (
                    <span className="flex items-center gap-1">
                      <DollarSign size={16} />
                      {job.salary}
                    </span>
                  )}
                  {job.jobType && (
                    <span className="flex items-center gap-1">
                      <Briefcase size={16} />
                      {job.jobType}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar size={16} />
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {job.skills && job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-gray-700 line-clamp-2">{job.description}</p>
              </div>

              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => viewApplicants(job._id)}
                  className="flex items-center gap-2 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600"
                >
                  <Users size={18} />
                  Applicants
                </button>
                <button
                  onClick={() => handleEditJob(job)}
                  className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600"
                >
                  <Edit2 size={18} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteJob(job._id)}
                  disabled={deleting === job._id}
                  className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
                >
                  <Trash2 size={18} />
                  {deleting === job._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        ))}

        {jobs.length === 0 && (
          <div className="text-center py-12">
            <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">No job posts yet</p>
            <button
              onClick={handleCreateJob}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Create Your First Job Post
            </button>
          </div>
        )}
      </div>

      {/* Job Form Modal */}
      {showJobForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">
                {editingJob ? "Edit Job Post" : "Create New Job Post"}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-black"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmitJob} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Job Title *</label>
                  <input
                    type="text"
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Senior Software Engineer"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <input
                    type="text"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., New York, NY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Job Type</label>
                  <select
                    value={jobForm.jobType}
                    onChange={(e) => setJobForm({ ...jobForm, jobType: e.target.value })}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select job type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Salary</label>
                  <input
                    type="text"
                    value={jobForm.salary}
                    onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., $80,000 - $120,000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={jobForm.status}
                  onChange={(e) => setJobForm({ ...jobForm, status: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Skills</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                    className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a skill and press Enter"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {jobForm.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="text-blue-600 hover:text-blue-800 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Job Description *</label>
                <textarea
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={6}
                  placeholder="Describe the job responsibilities, requirements, and benefits..."
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  <Save size={20} />
                  {saving ? "Saving..." : editingJob ? "Update Job" : "Create Job"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Applicants Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">Job Applicants</h3>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-gray-500 hover:text-black"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              {loadingApplicants ? (
                <p className="text-center py-8">Loading applicants...</p>
              ) : applicants.length === 0 ? (
                <div className="text-center py-8">
                  <Users size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No applicants yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applicants.map((app) => (
                    <div key={app._id} className="border p-4 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <p className="font-semibold text-lg">{app.applicantId?.name || "Unknown Applicant"}</p>
                          <p className="text-gray-600 text-sm">{app.applicantId?.email}</p>
                          {app.applicantId?.phone && (
                            <p className="text-gray-600 text-sm">{app.applicantId.phone}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            Applied on {new Date(app.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <select
                            value={app.status}
                            onChange={(e) => updateStatus(app._id, e.target.value)}
                            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="APPLIED">Applied</option>
                            <option value="SHORTLISTED">Shortlisted</option>
                            <option value="ACCEPTED">Accepted</option>
                            <option value="REJECTED">Rejected</option>
                          </select>
                        </div>
                      </div>

                      {/* Applicant Profile Details */}
                      {app.applicantProfile && (
                        <div className="bg-gray-50 p-3 rounded mt-3 space-y-2 text-sm">
                          {app.applicantProfile.skills && app.applicantProfile.skills.length > 0 && (
                            <div>
                              <p className="font-medium text-gray-700">Skills:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {app.applicantProfile.skills.map((skill, idx) => (
                                  <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {app.applicantProfile.experience && (
                            <div>
                              <p className="font-medium text-gray-700">Experience:</p>
                              <p className="text-gray-600 line-clamp-2">{app.applicantProfile.experience}</p>
                            </div>
                          )}
                          
                          {app.applicantProfile.education && (
                            <div>
                              <p className="font-medium text-gray-700">Education:</p>
                              <p className="text-gray-600 line-clamp-2">{app.applicantProfile.education}</p>
                            </div>
                          )}

                          {app.applicantProfile.resume && (
                            <div>
                              <p className="font-medium text-gray-700 mb-1">Resume:</p>
                              <a
                                href={app.applicantProfile.resume}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded text-xs hover:bg-red-200 transition-colors"
                              >
                                📄 View Resume (PDF)
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

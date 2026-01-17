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
  Star,
  ZoomIn,
  Download,
  ExternalLink
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
  
  // New states for photo and document viewing
  const [viewingPhoto, setViewingPhoto] = useState(null);
  const [viewingDocument, setViewingDocument] = useState(null);

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
      case "ACTIVE": return "bg-green-900 text-green-300";
      case "INACTIVE": return "bg-gray-800 text-gray-300";
      case "CLOSED": return "bg-red-900 text-red-300";
      default: return "bg-blue-900 text-blue-300";
    }
  };

  if (loading) return <div className="text-center py-8 text-gray-300">Loading job posts...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">My Job Posts</h2>
        <button
          onClick={handleCreateJob}
          className="flex items-center gap-2 bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800"
        >
          <Plus size={20} />
          Create Job Post
        </button>
      </div>

      {/* Job Posts Grid */}
      <div className="grid gap-6">
        {jobs.map((job) => (
          <div key={job._id} className="bg-black p-6 rounded-lg shadow-lg border border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-white">{job.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                    {job.status}
                  </span>
                  {job.promoted && (
                    <span className="flex items-center gap-1 bg-yellow-900 text-yellow-300 px-2 py-1 rounded-full text-xs font-medium">
                      <Star size={12} />
                      Promoted
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-3">
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
                        className="bg-gray-900 text-gray-300 px-2 py-1 rounded text-xs border border-gray-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-gray-300 line-clamp-2">{job.description}</p>
              </div>

              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => viewApplicants(job._id)}
                  className="flex items-center gap-2 bg-green-700 text-white px-3 py-2 rounded-lg hover:bg-green-800"
                >
                  <Users size={18} />
                  Applicants
                </button>
                <button
                  onClick={() => handleEditJob(job)}
                  className="flex items-center gap-2 bg-gray-700 text-white px-3 py-2 rounded-lg hover:bg-gray-600"
                >
                  <Edit2 size={18} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteJob(job._id)}
                  disabled={deleting === job._id}
                  className="flex items-center gap-2 bg-red-700 text-white px-3 py-2 rounded-lg hover:bg-red-800 disabled:opacity-50"
                >
                  <Trash2 size={18} />
                  {deleting === job._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        ))}

        {jobs.length === 0 && (
          <div className="text-center py-12 bg-black rounded-lg border border-gray-700">
            <Briefcase size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 mb-4">No job posts yet</p>
            <button
              onClick={handleCreateJob}
              className="bg-red-700 text-white px-6 py-2 rounded-lg hover:bg-red-800"
            >
              Create Your First Job Post
            </button>
          </div>
        )}
      </div>

      {/* Job Form Modal */}
      {showJobForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-black rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">
                {editingJob ? "Edit Job Post" : "Create New Job Post"}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmitJob} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Job Title *</label>
                  <input
                    type="text"
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    placeholder="e.g., Senior Software Engineer"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                  <input
                    type="text"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    placeholder="e.g., New York, NY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Job Type</label>
                  <select
                    value={jobForm.jobType}
                    onChange={(e) => setJobForm({ ...jobForm, jobType: e.target.value })}
                    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Salary</label>
                  <input
                    type="text"
                    value={jobForm.salary}
                    onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    placeholder="e.g., $80,000 - $120,000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={jobForm.status}
                  onChange={(e) => setJobForm({ ...jobForm, status: e.target.value })}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Skills</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                    className="flex-1 p-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    placeholder="Add a skill and press Enter"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="bg-red-700 text-white px-4 py-3 rounded-lg hover:bg-red-800"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {jobForm.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-gray-900 text-gray-300 px-3 py-1 rounded-full flex items-center gap-2 border border-gray-700"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="text-gray-500 hover:text-gray-300 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Job Description *</label>
                <textarea
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  rows={6}
                  placeholder="Describe the job responsibilities, requirements, and benefits..."
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-red-700 text-white px-6 py-3 rounded-lg hover:bg-red-800 disabled:opacity-50"
                >
                  <Save size={20} />
                  {saving ? "Saving..." : editingJob ? "Update Job" : "Create Job"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
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
          <div className="bg-black rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto border border-gray-700">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Job Applicants</h3>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              {loadingApplicants ? (
                <p className="text-center py-8 text-gray-300">Loading applicants...</p>
              ) : applicants.length === 0 ? (
                <div className="text-center py-8">
                  <Users size={48} className="mx-auto text-gray-600 mb-4" />
                  <p className="text-gray-400">No applicants yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applicants.map((app) => (
                    <div key={app._id} className="border border-gray-700 p-4 rounded-lg hover:shadow-md transition-shadow bg-gray-900">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <p className="font-semibold text-lg text-white">{app.applicantId?.name || "Unknown Applicant"}</p>
                          <p className="text-gray-400 text-sm">{app.applicantId?.email}</p>
                          {app.applicantId?.phone && (
                            <p className="text-gray-400 text-sm">{app.applicantId.phone}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            Applied on {new Date(app.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <select
                            value={app.status}
                            onChange={(e) => updateStatus(app._id, e.target.value)}
                            className="border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 bg-gray-800 text-white"
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
                        <div className="bg-black p-4 rounded mt-3 space-y-3 text-sm border border-gray-700">
                          {/* Photo */}
                          {app.applicantProfile.photo && (
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 bg-gray-700 rounded-full overflow-hidden flex-shrink-0">
                                <img 
                                  src={app.applicantProfile.photo} 
                                  alt="Applicant photo"
                                  className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => setViewingPhoto({
                                    src: app.applicantProfile.photo,
                                    name: app.applicantId?.name || "Applicant"
                                  })}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                                <div className="w-full h-full flex items-center justify-center bg-gray-600 text-gray-400 text-xs">
                                  No Photo
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                                  <ZoomIn size={16} className="text-white" />
                                </div>
                              </div>
                              <div>
                                <p className="font-medium text-gray-300">Profile Photo</p>
                                <p className="text-xs text-gray-500">Click to view full size</p>
                              </div>
                            </div>
                          )}

                          {/* Contact Information */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {app.applicantProfile.phone && (
                              <div>
                                <p className="font-medium text-gray-400">Phone:</p>
                                <p className="text-gray-300">{app.applicantProfile.phone}</p>
                              </div>
                            )}
                            {app.applicantProfile.location && (
                              <div>
                                <p className="font-medium text-gray-400">Location:</p>
                                <p className="text-gray-300">{app.applicantProfile.location}</p>
                              </div>
                            )}
                          </div>

                          {/* Bio */}
                          {app.applicantProfile.bio && (
                            <div>
                              <p className="font-medium text-gray-400">Bio:</p>
                              <p className="text-gray-300 line-clamp-2">{app.applicantProfile.bio}</p>
                            </div>
                          )}

                          {/* Skills */}
                          {app.applicantProfile.skills && app.applicantProfile.skills.length > 0 && (
                            <div>
                              <p className="font-medium text-gray-400 mb-2">Skills:</p>
                              <div className="flex flex-wrap gap-1">
                                {app.applicantProfile.skills.map((skill, idx) => (
                                  <span key={idx} className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs border border-gray-700">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Experience */}
                          {app.applicantProfile.experience && (
                            <div>
                              <p className="font-medium text-gray-400">Experience:</p>
                              <p className="text-gray-300 line-clamp-3">{app.applicantProfile.experience}</p>
                            </div>
                          )}
                          
                          {/* Education */}
                          {app.applicantProfile.education && (
                            <div>
                              <p className="font-medium text-gray-400">Education:</p>
                              <p className="text-gray-300 line-clamp-3">{app.applicantProfile.education}</p>
                            </div>
                          )}

                          {/* Educational Details */}
                          {(app.applicantProfile.tenthPercentage || app.applicantProfile.twelfthPercentage || 
                            app.applicantProfile.cgpa || app.applicantProfile.schoolName || 
                            app.applicantProfile.collegeName || app.applicantProfile.degree) && (
                            <div className="bg-gray-800 p-3 rounded border border-gray-700">
                              <p className="font-medium text-gray-400 mb-2">Educational Details:</p>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                                {app.applicantProfile.tenthPercentage && (
                                  <div>
                                    <span className="text-gray-500">10th:</span>
                                    <span className="ml-1 font-medium text-gray-300">{app.applicantProfile.tenthPercentage}%</span>
                                  </div>
                                )}
                                {app.applicantProfile.twelfthPercentage && (
                                  <div>
                                    <span className="text-gray-500">12th:</span>
                                    <span className="ml-1 font-medium text-gray-300">{app.applicantProfile.twelfthPercentage}%</span>
                                  </div>
                                )}
                                {app.applicantProfile.cgpa && (
                                  <div>
                                    <span className="text-gray-500">CGPA:</span>
                                    <span className="ml-1 font-medium text-gray-300">{app.applicantProfile.cgpa}</span>
                                  </div>
                                )}
                                {app.applicantProfile.schoolName && (
                                  <div className="col-span-2 md:col-span-3">
                                    <span className="text-gray-500">School:</span>
                                    <span className="ml-1 text-gray-300">{app.applicantProfile.schoolName}</span>
                                  </div>
                                )}
                                {app.applicantProfile.collegeName && (
                                  <div className="col-span-2 md:col-span-3">
                                    <span className="text-gray-500">College:</span>
                                    <span className="ml-1 text-gray-300">{app.applicantProfile.collegeName}</span>
                                  </div>
                                )}
                                {app.applicantProfile.degree && (
                                  <div className="col-span-2 md:col-span-3">
                                    <span className="text-gray-500">Degree:</span>
                                    <span className="ml-1 text-gray-300">{app.applicantProfile.degree}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Documents */}
                          <div className="flex flex-wrap gap-2">
                            {app.applicantProfile.resume && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setViewingDocument({
                                    src: app.applicantProfile.resume,
                                    name: `${app.applicantId?.name || "Applicant"} - Resume`,
                                    type: "resume"
                                  })}
                                  className="inline-flex items-center gap-2 bg-red-900 text-red-300 px-3 py-1 rounded text-xs hover:bg-red-800 transition-colors"
                                >
                                  <Eye size={14} />
                                  View Resume
                                </button>
                                <a
                                  href={app.applicantProfile.resume}
                                  download={`${app.applicantId?.name || "applicant"}_resume.pdf`}
                                  className="inline-flex items-center gap-2 bg-red-900 text-red-300 px-3 py-1 rounded text-xs hover:bg-red-800 transition-colors"
                                >
                                  <Download size={14} />
                                  Download
                                </a>
                              </div>
                            )}
                            {app.applicantProfile.documents && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setViewingDocument({
                                    src: app.applicantProfile.documents,
                                    name: `${app.applicantId?.name || "Applicant"} - Certificates`,
                                    type: "certificates"
                                  })}
                                  className="inline-flex items-center gap-2 bg-green-900 text-green-300 px-3 py-1 rounded text-xs hover:bg-green-800 transition-colors"
                                >
                                  <Eye size={14} />
                                  View Certificates
                                </button>
                                <a
                                  href={app.applicantProfile.documents}
                                  download={`${app.applicantId?.name || "applicant"}_certificates.pdf`}
                                  className="inline-flex items-center gap-2 bg-green-900 text-green-300 px-3 py-1 rounded text-xs hover:bg-green-800 transition-colors"
                                >
                                  <Download size={14} />
                                  Download
                                </a>
                              </div>
                            )}
                          </div>
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

      {/* Photo Viewing Modal */}
      {viewingPhoto && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-black rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden border border-gray-700">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">{viewingPhoto.name} - Profile Photo</h3>
              <button
                onClick={() => setViewingPhoto(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-4 flex justify-center">
              <img 
                src={viewingPhoto.src} 
                alt={`${viewingPhoto.name} profile photo`}
                className="max-w-full max-h-[60vh] object-contain rounded-lg"
              />
            </div>
            <div className="p-4 border-t border-gray-700 bg-gray-900 flex justify-center">
              <a
                href={viewingPhoto.src}
                download={`${viewingPhoto.name.replace(/\s+/g, '_')}_photo.jpg`}
                className="flex items-center gap-2 bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800"
              >
                <Download size={16} />
                Download Photo
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewing Modal */}
      {viewingDocument && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-black rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden border border-gray-700">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">{viewingDocument.name}</h3>
              <div className="flex items-center gap-2">
                <a
                  href={viewingDocument.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-blue-700 text-white px-3 py-2 rounded hover:bg-blue-800"
                >
                  <ExternalLink size={16} />
                  Open in New Tab
                </a>
                <a
                  href={viewingDocument.src}
                  download={`${viewingDocument.name.replace(/\s+/g, '_')}.pdf`}
                  className="flex items-center gap-2 bg-green-700 text-white px-3 py-2 rounded hover:bg-green-800"
                >
                  <Download size={16} />
                  Download
                </a>
                <button
                  onClick={() => setViewingDocument(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-4 h-[calc(90vh-120px)]">
              <iframe
                src={`${viewingDocument.src}#toolbar=1&navpanes=1&scrollbar=1`}
                className="w-full h-full border border-gray-700 rounded"
                title={viewingDocument.name}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

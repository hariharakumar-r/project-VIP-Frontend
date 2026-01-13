import { useState, useEffect } from "react";
import api from "../../services/api";
import { 
  Star, 
  Send, 
  User, 
  Phone, 
  Mail, 
  Building2, 
  Edit2, 
  Save, 
  X,
  MapPin,
  DollarSign,
  Calendar,
  Briefcase
} from "lucide-react";

export default function RequestPromotion() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [selectedJobDetails, setSelectedJobDetails] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingJobs, setFetchingJobs] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [loadingUserInfo, setLoadingUserInfo] = useState(true);
  const [editingPhone, setEditingPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [updatingPhone, setUpdatingPhone] = useState(false);

  useEffect(() => {
    fetchJobs();
    fetchUserInfo();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/api/company/my-posts");
      // Filter out already promoted jobs
      const eligibleJobs = res.data.filter(job => !job.promoted && job.status === "ACTIVE");
      setJobs(eligibleJobs);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch job posts");
    } finally {
      setFetchingJobs(false);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const res = await api.get("/api/company/user-info");
      setUserInfo(res.data);
      setPhoneInput(res.data.phone || "");
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUserInfo(false);
    }
  };

  const handleJobSelection = (jobId) => {
    setSelectedJob(jobId);
    const job = jobs.find(j => j._id === jobId);
    setSelectedJobDetails(job);
  };

  const handleUpdatePhone = async () => {
    if (!phoneInput.trim()) {
      alert("Please enter a valid phone number");
      return;
    }

    setUpdatingPhone(true);
    try {
      await api.patch("/api/company/user-phone", { phone: phoneInput });
      setUserInfo({ ...userInfo, phone: phoneInput });
      setEditingPhone(false);
      alert("Phone number updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update phone number");
    } finally {
      setUpdatingPhone(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedJob) {
      alert("Please select a job post");
      return;
    }

    if (!userInfo.phone) {
      alert("Please add your phone number before submitting a promotion request");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/admin/promo-request", { 
        jobId: selectedJob, 
        message,
        contactPhone: userInfo.phone
      });
      alert("Promotion request submitted successfully!");
      setSelectedJob("");
      setSelectedJobDetails(null);
      setMessage("");
      // Refresh jobs to update the list
      fetchJobs();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingJobs || loadingUserInfo) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Request Post Promotion</h2>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Contact Information Panel */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <User size={24} />
            Contact Information
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <User size={20} className="text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{userInfo.name || "Not provided"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail size={20} className="text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{userInfo.email || "Not provided"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Building2 size={20} className="text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Company</p>
                <p className="font-medium">{userInfo.companyName || "Not provided"}</p>
              </div>
            </div>

            {/* Phone Number Section */}
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Phone size={20} className="text-blue-600" />
                  <p className="text-sm text-blue-800 font-medium">Phone Number</p>
                </div>
                {!editingPhone && (
                  <button
                    onClick={() => setEditingPhone(true)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 size={16} />
                  </button>
                )}
              </div>

              {editingPhone ? (
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your phone number"
                  />
                  <button
                    onClick={handleUpdatePhone}
                    disabled={updatingPhone}
                    className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    {updatingPhone ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={16} />}
                  </button>
                  <button
                    onClick={() => {
                      setEditingPhone(false);
                      setPhoneInput(userInfo.phone || "");
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <p className="font-medium text-blue-900">
                  {userInfo.phone || (
                    <span className="text-red-600">Phone number required for promotion requests</span>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Promotion Request Form */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Star className="text-yellow-500" size={24} />
            Promotion Request
          </h3>

          <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>Benefits of promotion:</strong> Featured placement, increased visibility, 
              priority in search results, and highlighted badge on your job post.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Job Post to Promote *
              </label>
              <select 
                value={selectedJob} 
                onChange={(e) => handleJobSelection(e.target.value)} 
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required
              >
                <option value="">Choose a job post...</option>
                {jobs.map((job) => (
                  <option key={job._id} value={job._id}>
                    {job.title} - {job.location || "Remote"}
                  </option>
                ))}
              </select>
              {jobs.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  No eligible job posts found. Only active, non-promoted posts can be promoted.
                </p>
              )}
            </div>

            {selectedJobDetails && (
              <div className="p-4 bg-gray-50 rounded-lg border">
                <h4 className="font-semibold mb-2">Selected Job Details:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Briefcase size={16} className="text-gray-600" />
                    <span>{selectedJobDetails.title}</span>
                  </div>
                  {selectedJobDetails.location && (
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-600" />
                      <span>{selectedJobDetails.location}</span>
                    </div>
                  )}
                  {selectedJobDetails.salary && (
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-gray-600" />
                      <span>{selectedJobDetails.salary}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-600" />
                    <span>Posted {new Date(selectedJobDetails.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">
                Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Why should this post be promoted? Highlight the job's importance, urgency, or special requirements..."
              />
            </div>

            <button 
              type="submit" 
              disabled={loading || !userInfo.phone || jobs.length === 0} 
              className="w-full flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
              {loading ? "Submitting..." : "Submit Promotion Request"}
            </button>

            {!userInfo.phone && (
              <p className="text-sm text-red-600 text-center">
                Please add your phone number above before submitting a request.
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Information Section */}
      <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">How Promotion Works</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h4 className="font-medium mb-2">✨ What you get:</h4>
            <ul className="space-y-1 ml-4">
              <li>• Featured placement at the top of job listings</li>
              <li>• Special "Promoted" badge on your job post</li>
              <li>• Increased visibility to job seekers</li>
              <li>• Priority in search results</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">📋 Requirements:</h4>
            <ul className="space-y-1 ml-4">
              <li>• Job post must be active</li>
              <li>• Contact phone number required</li>
              <li>• Admin approval needed</li>
              <li>• One promotion request per job post</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

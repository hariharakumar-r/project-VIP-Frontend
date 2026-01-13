import { useState, useEffect } from "react";
import api from "../../services/api";
import { Calendar, Send, Video, Clock, User, MapPin, FileText, ChevronDown } from "lucide-react";

export default function ScheduleInterview() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState("");
  const [selectedApplicantDetails, setSelectedApplicantDetails] = useState(null);
  const [interviewData, setInterviewData] = useState({ 
    date: "", 
    time: "", 
    duration: 30,
    title: "",
    description: "",
    notes: "",
    companyEmail: "", // Add company email field
    waitingRoom: true,
    joinBeforeHost: false,
    muteUponEntry: true
  });
  const [loading, setLoading] = useState(false);
  const [fetchingJobs, setFetchingJobs] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/api/company/my-posts");
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingJobs(false);
    }
  };

  const fetchApplicants = async (jobId) => {
    setSelectedJob(jobId);
    setSelectedApplicant("");
    setSelectedApplicantDetails(null);
    if (!jobId) {
      setApplicants([]);
      return;
    }
    try {
      const res = await api.get(`/api/company/applicants/${jobId}`);
      console.log("Applicants fetched:", res.data);
      setApplicants(res.data || []);
      
      // Auto-fill interview title when job is selected
      const selectedJobData = jobs.find(j => j._id === jobId);
      if (selectedJobData) {
        setInterviewData(prev => ({
          ...prev,
          title: `Interview for ${selectedJobData.title}`,
          description: `Technical interview for ${selectedJobData.title} position`
        }));
      }
    } catch (err) {
      console.error("Error fetching applicants:", err);
      alert("Failed to fetch applicants: " + (err.response?.data?.message || err.message));
      setApplicants([]);
    }
  };

  const handleApplicantSelect = (appId) => {
    setSelectedApplicant(appId);
    const applicant = applicants.find(a => a._id === appId);
    setSelectedApplicantDetails(applicant);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApplicant) {
      alert("Please select an applicant");
      return;
    }
    
    if (!interviewData.companyEmail) {
      alert("Please enter your company email");
      return;
    }
    
    setLoading(true);
    try {
      // Properly format the date and time to ISO 8601 format
      const dateStr = interviewData.date; // Format: YYYY-MM-DD
      const timeStr = interviewData.time; // Format: HH:mm
      
      // Combine date and time
      const dateTimeStr = `${dateStr}T${timeStr}:00`; // Format: YYYY-MM-DDTHH:mm:00
      
      // Create a Date object and convert to ISO string
      const dateTime = new Date(dateTimeStr);
      
      // Validate the date
      if (isNaN(dateTime.getTime())) {
        alert("Invalid date or time format");
        setLoading(false);
        return;
      }
      
      // Convert to ISO 8601 format with Z (UTC)
      const isoDateTime = dateTime.toISOString();
      
      // Get selected job and applicant details
      const selectedJobData = jobs.find(j => j._id === selectedJob);
      const selectedApplicantData = applicants.find(a => a._id === selectedApplicant);
      
      // Prepare webhook payload with all necessary data
      const webhookPayload = {
        // Meeting details
        meetingTitle: interviewData.title,
        meetingDescription: interviewData.description,
        scheduledAt: isoDateTime,
        duration: parseInt(interviewData.duration),
        timezone: "Asia/Kolkata",
        notes: interviewData.notes,
        
        // Participants (all 3: admin, company, applicant)
        participants: [
          {
            name: "Admin",
            email: "dummydumdum005@gmail.com",
            role: "admin"
          },
          {
            name: selectedApplicantData?.applicantId?.name || "Company Representative",
            email: interviewData.companyEmail,
            role: "company"
          },
          {
            name: selectedApplicantData?.applicantId?.name || "Applicant",
            email: selectedApplicantData?.applicantId?.email || "",
            role: "applicant"
          }
        ],
        
        // Job details
        job: {
          id: selectedJob,
          title: selectedJobData?.title || "",
          location: selectedJobData?.location || ""
        },
        
        // Company details
        company: {
          email: interviewData.companyEmail
        },
        
        // Applicant details
        applicant: {
          id: selectedApplicant,
          name: selectedApplicantData?.applicantId?.name || "",
          email: selectedApplicantData?.applicantId?.email || "",
          phone: selectedApplicantData?.applicantId?.phone || ""
        },
        
        // Meeting settings
        settings: {
          waitingRoom: interviewData.waitingRoom,
          joinBeforeHost: true, // Allow meeting to start without admin
          muteUponEntry: interviewData.muteUponEntry,
          allowParticipantsToStart: true // Key setting for no admin requirement
        },
        
        // Metadata
        createdAt: new Date().toISOString(),
        source: "job-portal-frontend"
      };

      console.log("Webhook Payload:", JSON.stringify(webhookPayload, null, 2));

      // Send to webhook endpoint
      const response = await api.post(`/api/webhook/schedule-interview`, webhookPayload);
      
      alert("Interview data collected! Webhook will process Zoom meeting creation and send emails to all participants.");
      
      // Reset form
      setInterviewData({ 
        date: "", 
        time: "", 
        duration: 30,
        title: "",
        description: "",
        notes: "",
        companyEmail: "",
        waitingRoom: true,
        joinBeforeHost: false,
        muteUponEntry: true
      });
      setSelectedApplicant("");
      setSelectedApplicantDetails(null);
      
      console.log("Webhook response:", response.data);
    } catch (err) {
      console.error("Webhook error:", err);
      alert(err.response?.data?.message || "Failed to process interview request");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingJobs) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Schedule Zoom Interview</h2>
        <p className="text-gray-600">Create a Zoom meeting and send interview invitation to applicants</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <FileText className="inline w-4 h-4 mr-1" />
                Select Job Post
              </label>
              <select 
                value={selectedJob} 
                onChange={(e) => fetchApplicants(e.target.value)} 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Choose a job post...</option>
                {jobs.map((job) => (
                  <option key={job._id} value={job._id}>
                    {job.title} - {job.location}
                  </option>
                ))}
              </select>
            </div>

            {/* Applicant Selection */}
            {selectedJob && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  <User className="inline w-4 h-4 mr-1" />
                  Select Applicant
                </label>
                <select 
                  value={selectedApplicant} 
                  onChange={(e) => handleApplicantSelect(e.target.value)} 
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  required
                >
                  <option value="">Choose an applicant...</option>
                  {applicants.map((app) => (
                    <option key={app._id} value={app._id}>
                      {app.applicantId?.name || "Unknown"} ({app.applicantId?.email || "No email"})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Interview Details */}
            {selectedApplicant && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Interview Title</label>
                    <input 
                      type="text" 
                      value={interviewData.title} 
                      onChange={(e) => setInterviewData({ ...interviewData, title: e.target.value })} 
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="e.g., Technical Interview for Frontend Developer"
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Company Email</label>
                    <input 
                      type="email" 
                      value={interviewData.companyEmail} 
                      onChange={(e) => setInterviewData({ ...interviewData, companyEmail: e.target.value })} 
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="your-company@example.com"
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Clock className="inline w-4 h-4 mr-1" />
                      Duration (minutes)
                    </label>
                    <select 
                      value={interviewData.duration} 
                      onChange={(e) => setInterviewData({ ...interviewData, duration: e.target.value })} 
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={45}>45 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={90}>1.5 hours</option>
                      <option value={120}>2 hours</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Calendar className="inline w-4 h-4 mr-1" />
                      Date
                    </label>
                    <input 
                      type="date" 
                      value={interviewData.date} 
                      onChange={(e) => setInterviewData({ ...interviewData, date: e.target.value })} 
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      min={new Date().toISOString().split('T')[0]}
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Clock className="inline w-4 h-4 mr-1" />
                      Time
                    </label>
                    <input 
                      type="time" 
                      value={interviewData.time} 
                      onChange={(e) => setInterviewData({ ...interviewData, time: e.target.value })} 
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Interview Description</label>
                  <textarea
                    value={interviewData.description}
                    onChange={(e) => setInterviewData({ ...interviewData, description: e.target.value })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Brief description of the interview process, topics to be covered, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Additional Notes</label>
                  <textarea
                    value={interviewData.notes}
                    onChange={(e) => setInterviewData({ ...interviewData, notes: e.target.value })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Any additional information for the candidate (preparation instructions, documents to bring, etc.)"
                  />
                </div>

                {/* Zoom Meeting Settings */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3 text-blue-900">
                    <Video className="inline w-4 h-4 mr-1" />
                    Zoom Meeting Settings
                  </h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={interviewData.waitingRoom}
                        onChange={(e) => setInterviewData({ ...interviewData, waitingRoom: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm">Enable waiting room (recommended)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={interviewData.joinBeforeHost}
                        onChange={(e) => setInterviewData({ ...interviewData, joinBeforeHost: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm">Allow participants to join before host</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={interviewData.muteUponEntry}
                        onChange={(e) => setInterviewData({ ...interviewData, muteUponEntry: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm">Mute participants upon entry</span>
                    </label>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading || !selectedApplicant} 
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full justify-center"
                >
                  <Video size={20} />
                  {loading ? "Processing Interview Request..." : "Schedule Interview via Webhook"}
                </button>
              </>
            )}
          </form>
        </div>

        {/* Applicant Details Sidebar */}
        {selectedApplicantDetails && (
          <div className="bg-white p-6 rounded-lg shadow h-fit sticky top-6">
            <h3 className="text-lg font-semibold mb-4">Applicant Details</h3>
            
            <div className="space-y-4">
              {/* Basic Info */}
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Name</p>
                <p className="text-lg font-medium">{selectedApplicantDetails.applicantId?.name}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Email</p>
                <p className="text-sm text-blue-600 break-all">{selectedApplicantDetails.applicantId?.email}</p>
              </div>

              {selectedApplicantDetails.applicantId?.phone && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Phone</p>
                  <p className="text-sm">{selectedApplicantDetails.applicantId.phone}</p>
                </div>
              )}

              <hr className="my-4" />

              {/* Skills */}
              {selectedApplicantDetails.applicantProfile?.skills && selectedApplicantDetails.applicantProfile.skills.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedApplicantDetails.applicantProfile.skills.map((skill, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {selectedApplicantDetails.applicantProfile?.experience && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Experience</p>
                  <p className="text-sm text-gray-700 line-clamp-3">{selectedApplicantDetails.applicantProfile.experience}</p>
                </div>
              )}

              {/* Education */}
              {selectedApplicantDetails.applicantProfile?.education && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Education</p>
                  <p className="text-sm text-gray-700 line-clamp-3">{selectedApplicantDetails.applicantProfile.education}</p>
                </div>
              )}

              {/* Resume */}
              {selectedApplicantDetails.applicantProfile?.resume && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Resume</p>
                  <a
                    href={selectedApplicantDetails.applicantProfile.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-2 rounded text-sm hover:bg-red-200 transition-colors"
                  >
                    📄 View Resume
                  </a>
                </div>
              )}

              {/* Application Status */}
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Application Status</p>
                <p className="text-sm font-medium">{selectedApplicantDetails.status}</p>
              </div>

              {/* Applied Date */}
              <div className="text-xs text-gray-500">
                Applied on {new Date(selectedApplicantDetails.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-800 mb-2">What happens when you schedule an interview?</h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• A Zoom meeting will be automatically created</li>
          <li>• The applicant will receive a professional email invitation with meeting details</li>
          <li>• The application status will be updated to "SHORTLISTED"</li>
          <li>• You can manage all interviews from the company dashboard</li>
          <li>• Both you and the applicant can join the meeting directly from the platform</li>
        </ul>
      </div>
    </div>
  );
}
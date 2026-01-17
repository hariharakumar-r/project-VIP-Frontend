import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import ZoomMeeting, { ZoomMeetingFallback } from "../../components/ZoomMeeting";
import { 
  Calendar, 
  Clock, 
  Video, 
  User, 
  Building2, 
  MapPin, 
  ArrowLeft,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

export default function InterviewDetails() {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showZoomSDK, setShowZoomSDK] = useState(false);

  useEffect(() => {
    if (!interviewId) return;
    fetchInterviewDetails();
  }, [interviewId]);

  const fetchInterviewDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/interviews/${interviewId}`);
      setInterview(response.data.interview);
    } catch (err) {
      console.error("Failed to fetch interview details:", err);
      setError(err.response?.data?.message || "Failed to load interview details");
    } finally {
      setLoading(false);
    }
  };

  const handleMeetingStart = async () => {
    // Update interview status to STARTED
    try {
      await api.put(`/api/interviews/${interviewId}`, { status: "STARTED" });
      setInterview(prev => ({ ...prev, status: "STARTED" }));
    } catch (err) {
      console.error("Failed to update interview status:", err);
    }
  };

  const handleMeetingEnd = async () => {
    // Update interview status to COMPLETED
    try {
      await api.put(`/api/interviews/${interviewId}`, { status: "COMPLETED" });
      setInterview(prev => ({ ...prev, status: "COMPLETED" }));
      setShowZoomSDK(false);
    } catch (err) {
      console.error("Failed to update interview status:", err);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "SCHEDULED":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "STARTED":
        return <Video className="w-5 h-5 text-green-500" />;
      case "COMPLETED":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "CANCELLED":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "NO_SHOW":
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-900 text-blue-300";
      case "STARTED":
        return "bg-green-900 text-green-300";
      case "COMPLETED":
        return "bg-green-900 text-green-300";
      case "CANCELLED":
        return "bg-red-900 text-red-300";
      case "NO_SHOW":
        return "bg-orange-900 text-orange-300";
      default:
        return "bg-gray-800 text-gray-300";
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const isUpcoming = (dateString) => {
    return new Date(dateString) > new Date();
  };

  const canJoinMeeting = () => {
    if (!interview || interview.status !== "SCHEDULED") return false;
    
    const now = new Date();
    const interviewTime = new Date(interview.scheduledAt);
    const timeDiff = interviewTime - now;
    
    // Allow joining 15 minutes before the scheduled time
    return timeDiff <= 15 * 60 * 1000 && timeDiff >= -60 * 60 * 1000; // 15 min before to 1 hour after
  };

  if (loading) {
    return <div className="text-center py-8">Loading interview details...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button 
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-800"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!interview) {
    return <div className="text-center py-8">Interview not found</div>;
  }

  const { date, time } = formatDateTime(interview.scheduledAt);
  const upcoming = isUpcoming(interview.scheduledAt);
  const isCompany = user?.role === "COMPANY";

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-300 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {interview.title}
            </h1>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(interview.status)}`}>
                {getStatusIcon(interview.status)}
                {interview.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Interview Details */}
          <div className="bg-black rounded-lg shadow p-6 border border-gray-700">
            <h2 className="text-lg font-semibold mb-4 text-white">Interview Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3">
                {isCompany ? (
                  <>
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-white">{interview.applicantId?.name}</div>
                      <div className="text-sm text-gray-400">{interview.applicantId?.email}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-white">{interview.companyId?.name}</div>
                      <div className="text-sm text-gray-400">Company</div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="font-medium text-white">{interview.jobId?.title}</div>
                  <div className="text-sm text-gray-400">{interview.jobId?.location}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="font-medium text-white">{date}</div>
                  <div className="text-sm text-gray-400">Interview Date</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="font-medium text-white">{time}</div>
                  <div className="text-sm text-gray-400">{interview.duration} minutes</div>
                </div>
              </div>
            </div>

            {interview.description && (
              <div className="mb-4">
                <h3 className="font-medium text-white mb-2">Description</h3>
                <p className="text-gray-300">{interview.description}</p>
              </div>
            )}

            {interview.notes && (
              <div className="bg-yellow-900/20 border border-yellow-700 rounded p-4">
                <h3 className="font-medium text-yellow-300 mb-2">Additional Notes</h3>
                <p className="text-yellow-200">{interview.notes}</p>
              </div>
            )}
          </div>

          {/* Zoom Meeting Section */}
          {interview.status === "SCHEDULED" && upcoming && (
            <div className="bg-black rounded-lg shadow p-6 border border-gray-700">
              <h2 className="text-lg font-semibold mb-4 text-white">Join Meeting</h2>
              
              {showZoomSDK ? (
                <div>
                  <div className="mb-4">
                    <button
                      onClick={() => setShowZoomSDK(false)}
                      className="text-sm text-gray-400 hover:text-gray-300"
                    >
                      ← Switch to external meeting
                    </button>
                  </div>
                  <ZoomMeeting
                    interviewId={interviewId}
                    onMeetingStart={handleMeetingStart}
                    onMeetingEnd={handleMeetingEnd}
                    className="w-full"
                  />
                </div>
              ) : (
                <div>
                  <ZoomMeetingFallback
                    zoomJoinUrl={interview.zoomJoinUrl}
                    meetingId={interview.zoomMeetingId}
                    password={interview.zoomPassword}
                  />
                  
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => setShowZoomSDK(true)}
                      className="text-sm text-red-400 hover:text-red-300"
                      disabled={!canJoinMeeting()}
                    >
                      Or join using embedded meeting
                    </button>
                  </div>
                </div>
              )}
              
              {!canJoinMeeting() && (
                <div className="mt-4 p-3 bg-orange-900/20 border border-orange-700 rounded">
                  <p className="text-sm text-orange-300">
                    Meeting will be available 15 minutes before the scheduled time.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Past Meeting Info */}
          {(interview.status === "COMPLETED" || interview.status === "CANCELLED") && (
            <div className="bg-black rounded-lg shadow p-6 border border-gray-700">
              <h2 className="text-lg font-semibold mb-4 text-white">Meeting Summary</h2>
              <div className="text-gray-300">
                {interview.status === "COMPLETED" && (
                  <p>This interview was completed successfully.</p>
                )}
                {interview.status === "CANCELLED" && (
                  <p>This interview was cancelled.</p>
                )}
              </div>
              
              {interview.feedback && (
                <div className="mt-4 p-4 bg-blue-900/20 border border-blue-700 rounded">
                  <h3 className="font-medium text-blue-300 mb-2">Feedback</h3>
                  <p className="text-blue-200">{interview.feedback}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Meeting Info */}
          <div className="bg-black rounded-lg shadow p-6 border border-gray-700">
            <h3 className="font-semibold mb-4 text-white">Meeting Information</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-400">Meeting ID:</span>
                <div className="font-mono text-gray-300">{interview.zoomMeetingId}</div>
              </div>
              {interview.zoomPassword && (
                <div>
                  <span className="text-gray-400">Password:</span>
                  <div className="font-mono text-gray-300">{interview.zoomPassword}</div>
                </div>
              )}
              <div>
                <span className="text-gray-400">Duration:</span>
                <div className="text-gray-300">{interview.duration} minutes</div>
              </div>
              <div>
                <span className="text-gray-400">Timezone:</span>
                <div className="text-gray-300">{interview.timezone}</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          {interview.status === "SCHEDULED" && upcoming && (
            <div className="bg-black rounded-lg shadow p-6 border border-gray-700">
              <h3 className="font-semibold mb-4 text-white">Quick Actions</h3>
              <div className="space-y-3">
                <a
                  href={interview.zoomJoinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 w-full bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition-colors"
                >
                  <Video className="w-4 h-4" />
                  Join in New Window
                  <ExternalLink className="w-3 h-3" />
                </a>
                
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(interview.zoomJoinUrl);
                    alert("Meeting link copied to clipboard!");
                  }}
                  className="w-full bg-gray-800 text-gray-300 px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                >
                  Copy Meeting Link
                </button>
              </div>
            </div>
          )}

          {/* Preparation Tips for Applicants */}
          {!isCompany && interview.status === "SCHEDULED" && upcoming && (
            <div className="bg-green-900/20 border border-green-700 rounded-lg p-6">
              <h3 className="font-semibold text-green-300 mb-3">Preparation Tips</h3>
              <ul className="text-sm text-green-300 space-y-2">
                <li>• Test your camera and microphone</li>
                <li>• Ensure stable internet connection</li>
                <li>• Find a quiet, well-lit space</li>
                <li>• Have your resume ready</li>
                <li>• Prepare questions about the role</li>
                <li>• Join 2-3 minutes early</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
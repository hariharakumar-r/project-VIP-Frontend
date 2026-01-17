import { useState, useEffect } from "react";
import api from "../../services/api";
import { 
  Calendar, 
  Clock, 
  Video, 
  Building2, 
  MapPin, 
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  User
} from "lucide-react";

export default function MyInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/interviews/applicant");
      setInterviews(res.data.interviews);
    } catch (err) {
      console.error("Failed to fetch interviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "SCHEDULED":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "STARTED":
        return <Video className="w-4 h-4 text-green-500" />;
      case "COMPLETED":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "CANCELLED":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "NO_SHOW":
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
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

  const getTimeUntilInterview = (dateString) => {
    const now = new Date();
    const interviewTime = new Date(dateString);
    const diffMs = interviewTime - now;
    
    if (diffMs <= 0) return null;
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `in ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    } else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `in ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
    }
  };

  const CompanyDisplay = ({ company }) => (
    <div className="flex items-center gap-3 text-gray-300">
      <div className="w-5 h-5 bg-gray-800 rounded flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-600">
        {company?.logo ? (
          <img 
            src={company.logo} 
            alt={`${company.name || company.companyName} logo`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className={`w-full h-full flex items-center justify-center ${company?.logo ? 'hidden' : 'flex'}`}>
          <Building2 className="w-3 h-3 text-gray-500" />
        </div>
      </div>
      <span>{company?.name || company?.companyName}</span>
    </div>
  );

  if (loading) {
    return <div className="text-center py-8">Loading your interviews...</div>;
  }

  const upcomingInterviews = interviews.filter(interview => 
    interview.status === "SCHEDULED" && isUpcoming(interview.scheduledAt)
  );
  
  const pastInterviews = interviews.filter(interview => 
    interview.status !== "SCHEDULED" || !isUpcoming(interview.scheduledAt)
  );

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">My Interviews</h2>
        <p className="text-gray-300">View all your scheduled and completed interviews</p>
      </div>

      {interviews.length === 0 ? (
        <div className="text-center py-12 bg-black rounded-lg shadow border border-gray-700">
          <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No interviews scheduled</h3>
          <p className="text-gray-400">
            When companies schedule interviews with you, they'll appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Upcoming Interviews */}
          {upcomingInterviews.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-green-400">
                📅 Upcoming Interviews ({upcomingInterviews.length})
              </h3>
              <div className="space-y-4">
                {upcomingInterviews.map((interview) => {
                  const { date, time } = formatDateTime(interview.scheduledAt);
                  const timeUntil = getTimeUntilInterview(interview.scheduledAt);
                  
                  return (
                    <div key={interview._id} className="bg-black rounded-lg shadow-md border-l-4 border-green-600 p-6 border border-gray-700">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h4 className="text-lg font-semibold text-white">
                              {interview.title}
                            </h4>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(interview.status)}`}>
                              {getStatusIcon(interview.status)}
                              {interview.status}
                            </span>
                            {timeUntil && (
                              <span className="bg-green-900 text-green-300 px-2 py-1 rounded-full text-xs font-medium">
                                {timeUntil}
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <CompanyDisplay company={interview.companyId} />
                            <div className="flex items-center gap-2 text-gray-300">
                              <MapPin className="w-4 h-4" />
                              <span>{interview.jobId?.title}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                              <Calendar className="w-4 h-4" />
                              <span>{date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                              <Clock className="w-4 h-4" />
                              <span>{time} ({interview.duration} min)</span>
                            </div>
                          </div>

                          {interview.description && (
                            <div className="mb-4">
                              <h5 className="font-medium text-white mb-2">Interview Details:</h5>
                              <p className="text-gray-300 text-sm">{interview.description}</p>
                            </div>
                          )}

                          {interview.notes && (
                            <div className="bg-blue-900 border border-blue-700 rounded p-3 mb-4">
                              <h5 className="font-medium text-blue-300 mb-1">Additional Notes:</h5>
                              <p className="text-sm text-blue-200">{interview.notes}</p>
                            </div>
                          )}

                          {/* Zoom Meeting Info */}
                          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                            <h5 className="font-medium text-white mb-2 flex items-center gap-2">
                              <Video className="w-4 h-4" />
                              Zoom Meeting Details
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300">
                              <div>Meeting ID: {interview.zoomMeetingId}</div>
                              {interview.zoomPassword && (
                                <div>Password: <span className="font-mono bg-gray-800 px-1 rounded text-gray-200">{interview.zoomPassword}</span></div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="ml-4">
                          <a
                            href={interview.zoomJoinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors"
                          >
                            <Video className="w-4 h-4" />
                            Join Meeting
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>

                      {/* Preparation Tips */}
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <details className="group">
                          <summary className="cursor-pointer text-sm font-medium text-gray-300 hover:text-white">
                            📝 Interview Preparation Tips
                          </summary>
                          <div className="mt-2 text-sm text-gray-400 space-y-1">
                            <p>• Test your internet connection and Zoom setup 15 minutes before</p>
                            <p>• Ensure you're in a quiet, well-lit environment</p>
                            <p>• Have your resume and relevant documents ready</p>
                            <p>• Prepare questions about the role and company</p>
                            <p>• Join the meeting 2-3 minutes early</p>
                          </div>
                        </details>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Past Interviews */}
          {pastInterviews.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-300">
                📋 Past Interviews ({pastInterviews.length})
              </h3>
              <div className="space-y-4">
                {pastInterviews.map((interview) => {
                  const { date, time } = formatDateTime(interview.scheduledAt);
                  
                  return (
                    <div key={interview._id} className="bg-black rounded-lg shadow p-6 border border-gray-700">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h4 className="text-lg font-semibold text-white">
                              {interview.title}
                            </h4>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(interview.status)}`}>
                              {getStatusIcon(interview.status)}
                              {interview.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <CompanyDisplay company={interview.companyId} />
                            <div className="flex items-center gap-2 text-gray-300">
                              <MapPin className="w-4 h-4" />
                              <span>{interview.jobId?.title}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                              <Calendar className="w-4 h-4" />
                              <span>{date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                              <Clock className="w-4 h-4" />
                              <span>{time} ({interview.duration} min)</span>
                            </div>
                          </div>

                          {interview.feedback && (
                            <div className="bg-yellow-900 border border-yellow-700 rounded p-3">
                              <h5 className="font-medium text-yellow-300 mb-1">Feedback:</h5>
                              <p className="text-sm text-yellow-200">{interview.feedback}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
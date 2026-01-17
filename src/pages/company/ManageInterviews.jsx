import { useState, useEffect } from "react";
import api from "../../services/api";
import { 
  Calendar, 
  Clock, 
  Video, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit, 
  Trash2, 
  Send,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

export default function ManageInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchInterviews();
  }, [filter, currentPage]);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10
      });
      
      if (filter !== "ALL") {
        params.append("status", filter);
      }

      const res = await api.get(`/api/interviews/company?${params}`);
      setInterviews(res.data.interviews);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error("Failed to fetch interviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const sendReminder = async (interviewId) => {
    try {
      await api.post(`/api/interviews/${interviewId}/reminder`);
      alert("Reminder sent successfully!");
      fetchInterviews(); // Refresh to update reminder status
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send reminder");
    }
  };

  const cancelInterview = async (interviewId) => {
    const reason = prompt("Please provide a reason for cancellation:");
    if (!reason) return;

    try {
      await api.delete(`/api/interviews/${interviewId}`, {
        data: { reason }
      });
      alert("Interview cancelled successfully!");
      fetchInterviews();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel interview");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "SCHEDULED":
        return <Clock className="w-4 h-4 text-blue-400" />;
      case "STARTED":
        return <Video className="w-4 h-4 text-green-400" />;
      case "COMPLETED":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "CANCELLED":
        return <XCircle className="w-4 h-4 text-red-400" />;
      case "NO_SHOW":
        return <AlertCircle className="w-4 h-4 text-orange-400" />;
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
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const isUpcoming = (dateString) => {
    return new Date(dateString) > new Date();
  };

  if (loading) {
    return <div className="text-center py-8">Loading interviews...</div>;
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-white">Manage Interviews</h2>
        <p className="text-gray-400">View and manage all your scheduled interviews</p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-900 p-1 rounded-lg w-fit border border-gray-700">
          {["ALL", "SCHEDULED", "COMPLETED", "CANCELLED"].map((status) => (
            <button
              key={status}
              onClick={() => {
                setFilter(status);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === status
                  ? "bg-red-700 text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              {status === "ALL" ? "All Interviews" : status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Interviews List */}
      {interviews.length === 0 ? (
        <div className="text-center py-12 bg-black rounded-lg shadow border border-gray-700">
          <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">No interviews found</h3>
          <p className="text-gray-500">
            {filter === "ALL" 
              ? "You haven't scheduled any interviews yet." 
              : `No ${filter.toLowerCase()} interviews found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {interviews.map((interview) => {
            const { date, time } = formatDateTime(interview.scheduledAt);
            const upcoming = isUpcoming(interview.scheduledAt);
            
            return (
              <div key={interview._id} className="bg-black rounded-lg shadow p-6 border border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-white">
                        {interview.title}
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(interview.status)}`}>
                        {getStatusIcon(interview.status)}
                        {interview.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <User className="w-4 h-4" />
                        <span>{interview.applicantId?.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Mail className="w-4 h-4" />
                        <span>{interview.applicantId?.email}</span>
                      </div>
                      {interview.applicantId?.phone && (
                        <div className="flex items-center gap-2 text-gray-400">
                          <Phone className="w-4 h-4" />
                          <span>{interview.applicantId.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span>{interview.jobId?.title}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{time} ({interview.duration} min)</span>
                      </div>
                    </div>

                    {interview.description && (
                      <p className="text-gray-400 mb-3">{interview.description}</p>
                    )}

                    {interview.notes && (
                      <div className="bg-yellow-900/20 border border-yellow-700 rounded p-3 mb-3">
                        <p className="text-sm text-yellow-300">
                          <strong>Notes:</strong> {interview.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    {interview.status === "SCHEDULED" && upcoming && (
                      <>
                        <a
                          href={interview.zoomJoinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-blue-700 text-white px-3 py-2 rounded text-sm hover:bg-blue-800 transition-colors"
                        >
                          <Video className="w-4 h-4" />
                          Join Meeting
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        
                        {!interview.reminderSent && (
                          <button
                            onClick={() => sendReminder(interview._id)}
                            className="flex items-center gap-2 bg-green-700 text-white px-3 py-2 rounded text-sm hover:bg-green-800 transition-colors"
                          >
                            <Send className="w-4 h-4" />
                            Send Reminder
                          </button>
                        )}
                        
                        <button
                          onClick={() => cancelInterview(interview._id)}
                          className="flex items-center gap-2 bg-red-700 text-white px-3 py-2 rounded text-sm hover:bg-red-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Cancel
                        </button>
                      </>
                    )}

                    {interview.status === "SCHEDULED" && !upcoming && (
                      <span className="text-sm text-gray-500 px-3 py-2">
                        Interview time has passed
                      </span>
                    )}

                    {interview.status === "COMPLETED" && (
                      <span className="text-sm text-green-400 px-3 py-2">
                        ✓ Completed
                      </span>
                    )}

                    {interview.status === "CANCELLED" && (
                      <span className="text-sm text-red-400 px-3 py-2">
                        ✗ Cancelled
                      </span>
                    )}
                  </div>
                </div>

                {/* Zoom Meeting Info */}
                {interview.zoomJoinUrl && interview.status === "SCHEDULED" && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>Meeting ID: {interview.zoomMeetingId}</span>
                      {interview.zoomPassword && (
                        <span>Password: {interview.zoomPassword}</span>
                      )}
                      <span className={`${interview.invitationSent ? 'text-green-400' : 'text-orange-400'}`}>
                        {interview.invitationSent ? '✓ Invitation sent' : '⚠ Invitation pending'}
                      </span>
                      {interview.reminderSent && (
                        <span className="text-blue-400">✓ Reminder sent</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-700 rounded text-sm text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-900"
            >
              Previous
            </button>
            
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 border rounded text-sm ${
                  currentPage === page 
                    ? 'bg-red-700 text-white border-red-700' 
                    : 'border-gray-700 text-gray-300 hover:bg-gray-900'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.pages))}
              disabled={currentPage === pagination.pages}
              className="px-3 py-2 border border-gray-700 rounded text-sm text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-900"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState, useEffect } from "react";
import api from "../../services/api";
import { Clock, CheckCircle, XCircle, Calendar, Users, Eye, Building2 } from "lucide-react";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/api/applicant/applications");
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "ACCEPTED": return <CheckCircle className="text-green-500" size={20} />;
      case "REJECTED": return <XCircle className="text-red-500" size={20} />;
      case "SHORTLISTED": return <Users className="text-blue-500" size={20} />;
      case "INTERVIEW_SCHEDULED": return <Calendar className="text-purple-500" size={20} />;
      default: return <Clock className="text-yellow-500" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ACCEPTED": return "bg-green-900 text-green-300 border-green-700";
      case "REJECTED": return "bg-red-900 text-red-300 border-red-700";
      case "SHORTLISTED": return "bg-blue-900 text-blue-300 border-blue-700";
      case "INTERVIEW_SCHEDULED": return "bg-purple-900 text-purple-300 border-purple-700";
      default: return "bg-yellow-900 text-yellow-300 border-yellow-700";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "ACCEPTED": return "Accepted";
      case "REJECTED": return "Rejected";
      case "SHORTLISTED": return "Shortlisted";
      case "INTERVIEW_SCHEDULED": return "Interview Scheduled";
      default: return "Applied";
    }
  };

  const getStatusDescription = (status) => {
    switch (status) {
      case "ACCEPTED": return "Congratulations! You've been selected for this position.";
      case "REJECTED": return "Unfortunately, your application was not selected.";
      case "SHORTLISTED": return "Great news! You've been shortlisted for further review.";
      case "INTERVIEW_SCHEDULED": return "An interview has been scheduled for you.";
      default: return "Your application is under review.";
    }
  };

  if (loading) return <div className="text-center py-8">Loading applications...</div>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-white">My Applications</h2>
        <p className="text-gray-400">
          {applications.length} application{applications.length !== 1 ? 's' : ''} submitted
        </p>
      </div>

      <div className="space-y-4">
        {applications.map((app) => (
          <div key={app._id} className="bg-black p-6 rounded-lg shadow border border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{app.job?.title}</h3>
                    <div className="flex items-center gap-3 text-gray-400 mt-1">
                      <div className="w-6 h-6 bg-gray-800 rounded flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-700">
                        {app.job?.companyId?.logo ? (
                          <img 
                            src={app.job.companyId.logo} 
                            alt={`${app.job.companyId.name || app.job.companyId.companyName} logo`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className={`w-full h-full flex items-center justify-center ${app.job?.companyId?.logo ? 'hidden' : 'flex'}`}>
                          <Building2 size={12} className="text-gray-600" />
                        </div>
                      </div>
                      <span className="font-medium">{app.job?.company?.name || app.job?.companyId?.name || app.job?.companyId?.companyName}</span>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 border ${getStatusColor(app.status)}`}>
                    {getStatusIcon(app.status)}
                    {getStatusText(app.status)}
                  </span>
                </div>
                
                <p className="text-gray-300 mt-2">{getStatusDescription(app.status)}</p>
                
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    Applied: {new Date(app.createdAt).toLocaleDateString()}
                  </span>
                  {app.job?.location && (
                    <span className="flex items-center gap-1">
                      <Eye size={14} />
                      {app.job.location}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Interview Information */}
            {app.interview && (
              <div className="mt-4 p-4 bg-purple-900/20 border border-purple-700 rounded-lg">
                <div className="flex items-center gap-2 text-purple-300 font-medium mb-2">
                  <Calendar size={18} />
                  Interview Details
                </div>
                <p className="text-purple-300 text-sm">
                  <strong>Date:</strong> {new Date(app.interview.scheduledAt).toLocaleString()}
                </p>
                {app.interview.zoomLink && (
                  <div className="mt-2">
                    <a
                      href={app.interview.zoomLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 text-sm"
                    >
                      Join Interview
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Job Details */}
            {app.job && (
              <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
                <h4 className="font-medium text-white mb-2">Job Details</h4>
                <p className="text-gray-300 text-sm line-clamp-2">{app.job.description}</p>
                {(app.job.salary || app.job.jobType) && (
                  <div className="flex gap-4 mt-2 text-sm text-gray-400">
                    {app.job.salary && <span>Salary: {app.job.salary}</span>}
                    {app.job.jobType && <span>Type: {app.job.jobType}</span>}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        
        {applications.length === 0 && (
          <div className="text-center py-12 bg-black rounded-lg border border-gray-700">
            <Eye className="mx-auto h-16 w-16 text-gray-600 mb-4" />
            <p className="text-gray-300 text-lg">No applications yet</p>
            <p className="text-gray-500 text-sm mt-2">Start applying to jobs to see your applications here</p>
          </div>
        )}
      </div>
    </div>
  );
}

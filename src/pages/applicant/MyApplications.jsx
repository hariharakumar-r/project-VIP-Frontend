import { useState, useEffect } from "react";
import api from "../../services/api";
import { Clock, CheckCircle, XCircle, Calendar } from "lucide-react";

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
      default: return <Clock className="text-yellow-500" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ACCEPTED": return "bg-green-100 text-green-800";
      case "REJECTED": return "bg-red-100 text-red-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };

  if (loading) return <div className="text-center py-8">Loading applications...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Applications</h2>
      <div className="space-y-4">
        {applications.map((app) => (
          <div key={app._id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{app.job?.title}</h3>
                <p className="text-gray-600">{app.job?.company?.name}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${getStatusColor(app.status)}`}>
                {getStatusIcon(app.status)}
                {app.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500">Applied on: {new Date(app.createdAt).toLocaleDateString()}</p>
            {app.interview && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="flex items-center gap-2 text-blue-800">
                  <Calendar size={18} />
                  Interview scheduled: {new Date(app.interview.date).toLocaleString()}
                </p>
                {app.interview.notes && <p className="text-sm text-blue-600 mt-1">{app.interview.notes}</p>}
              </div>
            )}
          </div>
        ))}
        {applications.length === 0 && <p className="text-gray-500 text-center py-8">No applications yet</p>}
      </div>
    </div>
  );
}

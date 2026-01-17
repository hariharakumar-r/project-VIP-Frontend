import { useState, useEffect } from "react";
import api from "../../services/api";
import { Check, X, Phone, Mail, Building2, Calendar, MapPin, DollarSign } from "lucide-react";

export default function PromoRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/api/admin/promotion-requests");
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to fetch promotion requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (requestId, action) => {
    const confirmMessage = action === "approved" 
      ? "Are you sure you want to approve this promotion request? The job will be featured at the top of listings."
      : "Are you sure you want to reject this promotion request?";
    
    if (!confirm(confirmMessage)) return;

    setProcessing(requestId);
    try {
      await api.patch(`/api/admin/promo-request/${requestId}`, { status: action });
      fetchRequests(); // Refresh the list
      alert(`Promotion request ${action} successfully!`);
    } catch (err) {
      console.error("Failed to process request:", err);
      alert("Failed to process request");
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  const pendingRequests = requests.filter(r => r.status === "pending");
  const processedRequests = requests.filter(r => r.status !== "pending");

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white">Promotion Requests</h2>
        <p className="text-gray-300 mt-2">
          {pendingRequests.length} pending request{pendingRequests.length !== 1 ? 's' : ''} • {processedRequests.length} processed
        </p>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-orange-400">Pending Requests</h3>
          <div className="grid gap-4">
            {pendingRequests.map((req) => (
              <div key={req._id} className="bg-black p-6 rounded-lg shadow-lg border-l-4 border-orange-600">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-white">{req.jobId?.title || "Job Post"}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Building2 size={16} />
                            {req.companyId?.name || req.companyId?.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={16} />
                            {new Date(req.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Job Details */}
                    {req.jobId && (
                      <div className="bg-gray-900 p-4 rounded-lg mb-3 border border-gray-700">
                        <h4 className="font-semibold text-sm text-gray-300 mb-2">Job Details:</h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          {req.jobId.location && (
                            <div className="flex items-center gap-2 text-gray-400">
                              <MapPin size={14} />
                              <span>{req.jobId.location}</span>
                            </div>
                          )}
                          {req.jobId.salary && (
                            <div className="flex items-center gap-2 text-gray-400">
                              <DollarSign size={14} />
                              <span>{req.jobId.salary}</span>
                            </div>
                          )}
                          {req.jobId.jobType && (
                            <div className="text-gray-400">
                              <span className="px-2 py-1 bg-blue-900 text-blue-300 rounded text-xs">
                                {req.jobId.jobType}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Contact Information */}
                    <div className="bg-blue-900 bg-opacity-30 p-4 rounded-lg mb-3 border border-blue-700">
                      <h4 className="font-semibold text-sm text-blue-300 mb-2">Contact Information:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-blue-300">
                          <Mail size={14} />
                          <span>{req.companyId?.email}</span>
                        </div>
                        {req.contactPhone && (
                          <div className="flex items-center gap-2 text-blue-300">
                            <Phone size={14} />
                            <span>{req.contactPhone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Message */}
                    {req.message && (
                      <div className="bg-yellow-900 bg-opacity-30 p-4 rounded-lg border border-yellow-700">
                        <h4 className="font-semibold text-sm text-yellow-300 mb-1">Request Message:</h4>
                        <p className="text-sm text-yellow-200 italic">"{req.message}"</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 ml-6">
                    <button 
                      onClick={() => handleRequest(req._id, "approved")} 
                      disabled={processing === req._id}
                      className="bg-green-700 text-white p-3 rounded-lg hover:bg-green-800 transition disabled:opacity-50 flex items-center gap-2"
                      title="Approve and promote this job"
                    >
                      <Check size={20} />
                      <span className="text-sm font-medium">Approve</span>
                    </button>
                    <button 
                      onClick={() => handleRequest(req._id, "rejected")} 
                      disabled={processing === req._id}
                      className="bg-red-700 text-white p-3 rounded-lg hover:bg-red-800 transition disabled:opacity-50 flex items-center gap-2"
                      title="Reject this promotion request"
                    >
                      <X size={20} />
                      <span className="text-sm font-medium">Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Processed Requests */}
      {processedRequests.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-300">Processed Requests</h3>
          <div className="grid gap-4">
            {processedRequests.map((req) => (
              <div 
                key={req._id} 
                className={`bg-black p-6 rounded-lg shadow-lg border-l-4 ${
                  req.status === "approved" ? "border-green-600" : "border-red-600"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{req.jobId?.title || "Job Post"}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        req.status === "approved" ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"
                      }`}>
                        {req.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">
                      Company: {req.companyId?.name || req.companyId?.email}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Processed: {new Date(req.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {requests.length === 0 && (
        <div className="text-center py-12 bg-black bg-opacity-60 rounded-lg border border-gray-700">
          <p className="text-gray-300 text-lg">No promotion requests</p>
          <p className="text-gray-400 text-sm mt-2">Requests from companies will appear here</p>
        </div>
      )}
    </div>
  );
}

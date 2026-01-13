import { useState, useEffect } from "react";
import api from "../../services/api";
import { Check, X } from "lucide-react";

export default function PromoRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/api/admin/promo-requests");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (requestId, action) => {
    try {
      await api.patch(`/api/admin/promo-request/${requestId}`, { status: action });
      setRequests(requests.map(r => r._id === requestId ? { ...r, status: action } : r));
    } catch (err) {
      alert("Failed to process request");
    }
  };

  if (loading) return <div className="text-center py-8">Loading requests...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Promotion Requests</h2>
      <div className="grid gap-4">
        {requests.map((req) => (
          <div key={req._id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{req.job?.title}</h3>
                <p className="text-sm text-gray-500">Requested by: {req.company?.name}</p>
                {req.message && <p className="mt-2 text-gray-700">{req.message}</p>}
              </div>
              {req.status === "PENDING" ? (
                <div className="flex gap-2">
                  <button onClick={() => handleRequest(req._id, "APPROVED")} className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"><Check size={20} /></button>
                  <button onClick={() => handleRequest(req._id, "REJECTED")} className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"><X size={20} /></button>
                </div>
              ) : (
                <span className={`px-3 py-1 rounded-full text-sm ${req.status === "APPROVED" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {req.status}
                </span>
              )}
            </div>
          </div>
        ))}
        {requests.length === 0 && <p className="text-gray-500 text-center py-8">No promotion requests</p>}
      </div>
    </div>
  );
}

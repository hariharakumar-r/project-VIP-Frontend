import { useState, useEffect } from "react";
import api from "../../services/api";
import { Star, Check } from "lucide-react";

export default function PromotePost() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promoting, setPromoting] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/api/jobs");
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const promoteJob = async (jobId) => {
    setPromoting(jobId);
    try {
      await api.post("/api/admin/promo-job", { jobId });
      setJobs(jobs.map(j => j._id === jobId ? { ...j, isPromoted: true } : j));
      alert("Job promoted successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to promote job");
    } finally {
      setPromoting(null);
    }
  };

  if (loading) return <div className="text-center py-8">Loading jobs...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Promote Posts</h2>
      <div className="grid gap-4">
        {jobs.map((job) => (
          <div key={job._id} className="bg-white p-6 rounded-lg shadow flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{job.title}</h3>
                {job.isPromoted && <Star className="text-yellow-500 fill-yellow-500" size={18} />}
              </div>
              <p className="text-sm text-gray-500">{job.company?.name || "Admin Post"}</p>
            </div>
            {job.isPromoted ? (
              <span className="flex items-center gap-1 text-green-600"><Check size={18} />Promoted</span>
            ) : (
              <button
                onClick={() => promoteJob(job._id)}
                disabled={promoting === job._id}
                className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 disabled:opacity-50"
              >
                <Star size={18} />{promoting === job._id ? "Promoting..." : "Promote"}
              </button>
            )}
          </div>
        ))}
        {jobs.length === 0 && <p className="text-gray-500 text-center py-8">No jobs available</p>}
      </div>
    </div>
  );
}

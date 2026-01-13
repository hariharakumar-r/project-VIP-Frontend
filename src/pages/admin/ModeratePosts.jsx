import { useState, useEffect } from "react";
import api from "../../services/api";
import { Trash2, Eye, EyeOff, MapPin, DollarSign } from "lucide-react";

export default function ModeratePosts() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const deleteJob = async (jobId) => {
    if (!confirm("Are you sure you want to delete this job post?")) return;
    try {
      await api.delete(`/api/admin/jobs/${jobId}`);
      setJobs(jobs.filter(j => j._id !== jobId));
    } catch (err) {
      alert("Failed to delete job");
    }
  };

  const toggleVisibility = async (jobId, isHidden) => {
    try {
      await api.patch(`/api/admin/jobs/${jobId}`, { isHidden: !isHidden });
      setJobs(jobs.map(j => j._id === jobId ? { ...j, isHidden: !isHidden } : j));
    } catch (err) {
      alert("Failed to update job visibility");
    }
  };

  if (loading) return <div className="text-center py-8">Loading posts...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Moderate Posts</h2>
      <div className="grid gap-4">
        {jobs.map((job) => (
          <div key={job._id} className={`bg-white p-6 rounded-lg shadow ${job.isHidden ? "opacity-60" : ""}`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <p className="text-sm text-gray-500">Posted by: {job.company?.name || "Admin"}</p>
                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                  {job.location && <span className="flex items-center gap-1"><MapPin size={16} />{job.location}</span>}
                  {job.salary && <span className="flex items-center gap-1"><DollarSign size={16} />{job.salary}</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleVisibility(job._id, job.isHidden)}
                  className={`p-2 rounded-lg ${job.isHidden ? "bg-green-100 text-green-600 hover:bg-green-200" : "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"}`}
                  title={job.isHidden ? "Show post" : "Hide post"}
                >
                  {job.isHidden ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
                <button
                  onClick={() => deleteJob(job._id)}
                  className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                  title="Delete post"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <p className="mt-4 text-gray-700">{job.description}</p>
            {job.isHidden && <p className="mt-2 text-sm text-yellow-600">This post is hidden from public view</p>}
          </div>
        ))}
        {jobs.length === 0 && <p className="text-gray-500 text-center py-8">No posts to moderate</p>}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import api from "../../services/api";
import { MapPin, DollarSign, Star, Trash2 } from "lucide-react";

export default function AdminPosts() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/api/jobs");
      setJobs(res.data.filter(j => j.isOwner));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (jobId) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    try {
      await api.delete(`/api/jobs/${jobId}`);
      setJobs(jobs.filter(j => j._id !== jobId));
    } catch (err) {
      alert("Failed to delete job");
    }
  };

  if (loading) return <div className="text-center py-8">Loading posts...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Job Posts</h2>
      <div className="grid gap-4">
        {jobs.map((job) => (
          <div key={job._id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">{job.title}</h3>
                  {job.isPromoted && <Star className="text-yellow-500 fill-yellow-500" size={18} />}
                </div>
                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                  {job.location && <span className="flex items-center gap-1"><MapPin size={16} />{job.location}</span>}
                  {job.salary && <span className="flex items-center gap-1"><DollarSign size={16} />{job.salary}</span>}
                </div>
              </div>
              <button onClick={() => deleteJob(job._id)} className="text-red-500 hover:text-red-700">
                <Trash2 size={20} />
              </button>
            </div>
            <p className="mt-4 text-gray-700">{job.description}</p>
          </div>
        ))}
        {jobs.length === 0 && <p className="text-gray-500 text-center py-8">No job posts yet</p>}
      </div>
    </div>
  );
}

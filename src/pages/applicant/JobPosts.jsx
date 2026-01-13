import { useState, useEffect } from "react";
import api from "../../services/api";
import { MapPin, DollarSign, Clock } from "lucide-react";

export default function JobPosts() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);

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

  const handleApply = async (jobId) => {
    setApplying(jobId);
    try {
      await api.post("/api/applicant/apply", { jobId });
      alert("Application submitted successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(null);
    }
  };

  if (loading) return <div className="text-center py-8">Loading jobs...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Available Jobs</h2>
      <div className="grid gap-4">
        {jobs.map((job) => (
          <div key={job._id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <p className="text-gray-600">{job.company?.name}</p>
              </div>
              <button
                onClick={() => handleApply(job._id)}
                disabled={applying === job._id}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
              >
                {applying === job._id ? "Applying..." : "Apply"}
              </button>
            </div>
            <p className="mt-4 text-gray-700">{job.description}</p>
            <div className="mt-4 flex gap-4 text-sm text-gray-500">
              {job.location && <span className="flex items-center gap-1"><MapPin size={16} />{job.location}</span>}
              {job.salary && <span className="flex items-center gap-1"><DollarSign size={16} />{job.salary}</span>}
              {job.type && <span className="flex items-center gap-1"><Clock size={16} />{job.type}</span>}
            </div>
          </div>
        ))}
        {jobs.length === 0 && <p className="text-gray-500 text-center py-8">No jobs available</p>}
      </div>
    </div>
  );
}

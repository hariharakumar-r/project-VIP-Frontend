import { useState } from "react";
import api from "../../services/api";
import { Send } from "lucide-react";

export default function CreateJobPost() {
  const [job, setJob] = useState({ title: "", description: "", location: "", salary: "", type: "FULL_TIME", requirements: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/jobs", job);
      alert("Job posted successfully!");
      setJob({ title: "", description: "", location: "", salary: "", type: "FULL_TIME", requirements: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Create Job Post</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Job Title</label>
          <input value={job.title} onChange={(e) => setJob({ ...job, title: e.target.value })} className="w-full p-3 border rounded-lg" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea value={job.description} onChange={(e) => setJob({ ...job, description: e.target.value })} className="w-full p-3 border rounded-lg" rows={4} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input value={job.location} onChange={(e) => setJob({ ...job, location: e.target.value })} className="w-full p-3 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Salary</label>
            <input value={job.salary} onChange={(e) => setJob({ ...job, salary: e.target.value })} className="w-full p-3 border rounded-lg" placeholder="e.g., $50k-$70k" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Job Type</label>
          <select value={job.type} onChange={(e) => setJob({ ...job, type: e.target.value })} className="w-full p-3 border rounded-lg">
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERNSHIP">Internship</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Requirements</label>
          <textarea value={job.requirements} onChange={(e) => setJob({ ...job, requirements: e.target.value })} className="w-full p-3 border rounded-lg" rows={3} placeholder="List job requirements..." />
        </div>
        <button type="submit" disabled={loading} className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50">
          <Send size={20} />{loading ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
}

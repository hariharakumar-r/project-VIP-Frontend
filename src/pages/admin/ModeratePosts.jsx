import { useState, useEffect } from "react";
import api from "../../services/api";
import { Trash2, Ban, CheckCircle, MapPin, DollarSign, Calendar, Shield } from "lucide-react";

export default function ModeratePosts() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/api/admin/all-posts");
      setJobs(res.data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (jobId) => {
    if (!confirm("Are you sure you want to permanently delete this job post? This action cannot be undone.")) return;
    try {
      await api.delete(`/api/admin/delete-post/${jobId}`);
      setJobs(jobs.filter(j => j._id !== jobId));
    } catch (err) {
      alert("Failed to delete job");
    }
  };

  const toggleBlock = async (jobId, isBlocked) => {
    try {
      if (isBlocked) {
        await api.patch(`/api/admin/unblock-post/${jobId}`);
      } else {
        await api.patch(`/api/admin/block-post/${jobId}`);
      }
      fetchJobs(); // Refresh the list
    } catch (err) {
      alert("Failed to update post status");
    }
  };

  const filteredJobs = filter === "ALL" 
    ? jobs 
    : filter === "BLOCKED" 
    ? jobs.filter(j => j.isBlockedByAdmin) 
    : jobs.filter(j => j.moderationStatus === filter.toLowerCase());

  if (loading) return <div className="text-center py-8 text-gray-300">Loading posts...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Moderate Posts</h2>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)} 
          className="border border-gray-600 rounded-lg px-4 py-2 bg-gray-900 text-white focus:ring-2 focus:ring-red-600"
        >
          <option value="ALL">All Posts</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
          <option value="BLOCKED">Blocked by Admin</option>
        </select>
      </div>
      
      <div className="grid gap-4">
        {filteredJobs.map((job) => (
          <div 
            key={job._id} 
            className={`bg-black p-6 rounded-lg shadow-lg border-l-4 ${
              job.isBlockedByAdmin 
                ? "border-red-600 bg-opacity-80" 
                : job.moderationStatus === "approved" 
                ? "border-green-600" 
                : job.moderationStatus === "pending"
                ? "border-yellow-600"
                : "border-gray-700"
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold text-white">{job.title}</h3>
                  {job.promoted && (
                    <span className="px-2 py-1 bg-yellow-900 text-yellow-300 text-xs rounded-full">
                      Promoted
                    </span>
                  )}
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    job.moderationStatus === "approved" ? "bg-green-900 text-green-300" :
                    job.moderationStatus === "pending" ? "bg-yellow-900 text-yellow-300" :
                    "bg-red-900 text-red-300"
                  }`}>
                    {job.moderationStatus.toUpperCase()}
                  </span>
                </div>
                
                <p className="text-sm text-gray-400 mb-2">
                  Posted by: <span className="font-medium text-gray-300">{job.createdBy?.name || job.createdBy?.email}</span>
                  {job.createdBy?.role && (
                    <span className="ml-2 px-2 py-0.5 bg-blue-900 text-blue-300 text-xs rounded">
                      {job.createdBy.role}
                    </span>
                  )}
                </p>
                
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-400">
                  {job.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={16} />{job.location}
                    </span>
                  )}
                  {job.salary && (
                    <span className="flex items-center gap-1">
                      <DollarSign size={16} />{job.salary}
                    </span>
                  )}
                  {job.jobType && (
                    <span className="px-2 py-0.5 bg-gray-800 rounded text-xs">
                      {job.jobType}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar size={16} />
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                {job.description && (
                  <p className="mt-3 text-gray-300 line-clamp-2">{job.description}</p>
                )}
                
                {job.isBlockedByAdmin && (
                  <div className="mt-3 flex items-center gap-2 text-red-400 font-medium">
                    <Shield size={18} />
                    <span>This post has been blocked by admin and is hidden from users</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => toggleBlock(job._id, job.isBlockedByAdmin)}
                  className={`p-2 rounded-lg transition ${
                    job.isBlockedByAdmin 
                      ? "bg-green-900 text-green-400 hover:bg-green-800" 
                      : "bg-red-900 text-red-400 hover:bg-red-800"
                  }`}
                  title={job.isBlockedByAdmin ? "Unblock post" : "Block post"}
                >
                  {job.isBlockedByAdmin ? <CheckCircle size={20} /> : <Ban size={20} />}
                </button>
                <button
                  onClick={() => deleteJob(job._id)}
                  className="p-2 rounded-lg bg-red-700 text-white hover:bg-red-800 transition"
                  title="Delete post permanently"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredJobs.length === 0 && (
          <p className="text-gray-400 text-center py-8">No posts found</p>
        )}
      </div>
    </div>
  );
}

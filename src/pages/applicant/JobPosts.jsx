import { useState, useEffect } from "react";
import api from "../../services/api";
import { MapPin, DollarSign, Clock, Star, Briefcase, Building2, Search, Filter, X } from "lucide-react";

export default function JobPosts() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchTerm, locationFilter, jobTypeFilter]);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/api/jobs");
      // Jobs are already sorted by promoted status on backend
      setJobs(res.data);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = [...jobs];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyId?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Location filter
    if (locationFilter) {
      filtered = filtered.filter(job => 
        job.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Job type filter
    if (jobTypeFilter) {
      filtered = filtered.filter(job => 
        job.jobType?.toLowerCase() === jobTypeFilter.toLowerCase()
      );
    }

    setFilteredJobs(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setLocationFilter("");
    setJobTypeFilter("");
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  const promotedJobs = filteredJobs.filter(job => job.promoted);
  const regularJobs = filteredJobs.filter(job => !job.promoted);

  // Get unique values for filter options
  const uniqueLocations = [...new Set(jobs.map(job => job.location).filter(Boolean))];
  const uniqueJobTypes = [...new Set(jobs.map(job => job.jobType).filter(Boolean))];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white">Available Jobs</h2>
        <p className="text-gray-300 mt-2">
          {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} available
          {promotedJobs.length > 0 && ` • ${promotedJobs.length} featured`}
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-black p-6 rounded-lg shadow-lg mb-6 border border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search jobs, companies, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-600 placeholder-gray-500"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-gray-800 text-gray-300 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors border border-gray-600"
          >
            <Filter size={20} />
            Filters
            {(locationFilter || jobTypeFilter) && (
              <span className="bg-red-700 text-white text-xs px-2 py-1 rounded-full">
                {[locationFilter, jobTypeFilter].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="">All Locations</option>
                  {uniqueLocations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Job Type</label>
                <select
                  value={jobTypeFilter}
                  onChange={(e) => setJobTypeFilter(e.target.value)}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="">All Types</option>
                  {uniqueJobTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 bg-red-700 text-white px-4 py-3 rounded-lg hover:bg-red-800 transition-colors w-full justify-center"
                >
                  <X size={20} />
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Promoted Jobs Section */}
      {promotedJobs.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Star className="text-yellow-400" size={24} />
            <h3 className="text-xl font-semibold text-white">Featured Jobs</h3>
          </div>
          
          {/* Horizontal scroll container for promoted jobs */}
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max">
              {promotedJobs.map((job) => (
                <div 
                  key={job._id} 
                  className="bg-black bg-opacity-80 p-6 rounded-lg shadow-lg border-2 border-yellow-600 relative overflow-hidden min-w-[400px] max-w-[500px] flex-shrink-0"
                >
                  {/* Promoted Badge */}
                  <div className="absolute top-0 right-0 bg-yellow-600 text-white px-4 py-1 rounded-bl-lg font-semibold text-sm flex items-center gap-1">
                    <Star size={14} fill="white" />
                    PROMOTED
                  </div>

                  <div className="mt-2">
                    <h3 className="text-xl font-bold text-white mb-2">{job.title}</h3>
                    <div className="flex items-center gap-3 text-gray-300 mb-3">
                      <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-600">
                        {job.companyId?.logo ? (
                          <img 
                            src={job.companyId.logo} 
                            alt={`${job.companyId.name || job.companyId.companyName} logo`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className={`w-full h-full flex items-center justify-center ${job.companyId?.logo ? 'hidden' : 'flex'}`}>
                          <Building2 size={16} className="text-gray-500" />
                        </div>
                      </div>
                      <span className="font-medium">{job.companyId?.name || job.companyId?.companyName || "Company"}</span>
                    </div>
                    <p className="text-gray-300 mb-4 line-clamp-3">{job.description}</p>
                    
                    <div className="flex flex-wrap gap-2 text-sm text-gray-400 mb-4">
                      {job.location && (
                        <span className="flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full">
                          <MapPin size={16} />
                          {job.location}
                        </span>
                      )}
                      {job.salary && (
                        <span className="flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full">
                          <DollarSign size={16} />
                          {job.salary}
                        </span>
                      )}
                      {job.jobType && (
                        <span className="flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full">
                          <Briefcase size={16} />
                          {job.jobType}
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleApply(job._id)}
                      disabled={applying === job._id}
                      className="w-full bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 disabled:opacity-50 font-semibold shadow-md transition-all hover:shadow-lg"
                    >
                      {applying === job._id ? "Applying..." : "Apply Now"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Regular Jobs Section */}
      {regularJobs.length > 0 && (
        <div>
          {promotedJobs.length > 0 && (
            <h3 className="text-xl font-semibold text-white mb-4">All Jobs</h3>
          )}
          <div className="grid gap-4">
            {regularJobs.map((job) => (
              <div key={job._id} className="bg-black p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-700">
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <h3 className="text-xl font-semibold text-white mb-2">{job.title}</h3>
                    <div className="flex items-center gap-3 text-gray-400 mb-3">
                      <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-600">
                        {job.companyId?.logo ? (
                          <img 
                            src={job.companyId.logo} 
                            alt={`${job.companyId.name || job.companyId.companyName} logo`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className={`w-full h-full flex items-center justify-center ${job.companyId?.logo ? 'hidden' : 'flex'}`}>
                          <Building2 size={16} className="text-gray-500" />
                        </div>
                      </div>
                      <span>{job.companyId?.name || job.companyId?.companyName || "Company"}</span>
                    </div>
                    <p className="text-gray-300 mb-4">{job.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                      {job.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={16} />
                          {job.location}
                        </span>
                      )}
                      {job.salary && (
                        <span className="flex items-center gap-1">
                          <DollarSign size={16} />
                          {job.salary}
                        </span>
                      )}
                      {job.jobType && (
                        <span className="flex items-center gap-1">
                          <Briefcase size={16} />
                          {job.jobType}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleApply(job._id)}
                    disabled={applying === job._id}
                    className="bg-red-700 text-white px-6 py-3 rounded-lg hover:bg-red-800 disabled:opacity-50 transition-colors flex-shrink-0"
                  >
                    {applying === job._id ? "Applying..." : "Apply"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredJobs.length === 0 && jobs.length > 0 && (
        <div className="text-center py-12 bg-black bg-opacity-60 rounded-lg border border-gray-700">
          <Search className="mx-auto h-16 w-16 text-gray-500 mb-4" />
          <p className="text-gray-300 text-lg">No jobs match your filters</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your search criteria</p>
          <button
            onClick={clearFilters}
            className="mt-4 bg-red-700 text-white px-6 py-2 rounded-lg hover:bg-red-800"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {jobs.length === 0 && (
        <div className="text-center py-12 bg-black bg-opacity-60 rounded-lg border border-gray-700">
          <Briefcase className="mx-auto h-16 w-16 text-gray-500 mb-4" />
          <p className="text-gray-300 text-lg">No jobs available at the moment</p>
          <p className="text-gray-400 text-sm mt-2">Check back later for new opportunities</p>
        </div>
      )}
    </div>
  );
}

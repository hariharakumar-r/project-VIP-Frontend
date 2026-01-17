import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { 
  Users, 
  Building2, 
  FileText, 
  Star, 
  UserCheck, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  Briefcase,
  CheckCircle,
  XCircle,
  Clock,
  Video,
  Award,
  Activity,
  TrendingDown
} from "lucide-react";
import api from "../../services/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("🔄 Fetching dashboard stats...");
      console.log("API URL:", import.meta.env.VITE_API_URL || "http://localhost:3000");
      console.log("Token:", localStorage.getItem("token")?.substring(0, 20) + "...");
      
      const res = await api.get("/api/admin/dashboard-stats");
      console.log("✅ Dashboard stats received:", res.data);
      console.log("Stats keys:", Object.keys(res.data));
      
      setStats(res.data);
      setLoading(false);
    } catch (err) {
      console.error("❌ Failed to fetch dashboard stats:", err);
      console.error("Error details:", {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          headers: err.config?.headers
        }
      });
      
      // Store error details for debugging
      setError({
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data
      });
      
      // Set stats to null to show error message
      setStats(null);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
        <p className="text-xl font-semibold text-red-400 mb-2">Failed to load dashboard statistics</p>
        <p className="text-gray-300 mb-4">Unable to fetch data from the server</p>
        <button 
          onClick={fetchDashboardStats}
          className="px-6 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800"
        >
          Retry
        </button>
      </div>
    );
  }

  // Chart configurations
  const monthlyActivityData = {
    labels: stats.charts.monthlyData.map(item => item.month),
    datasets: [
      {
        label: "New Users",
        data: stats.charts.monthlyData.map(item => item.users),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
      },
      {
        label: "New Jobs",
        data: stats.charts.monthlyData.map(item => item.jobs),
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
      },
      {
        label: "Applications",
        data: stats.charts.monthlyData.map(item => item.applications),
        borderColor: "rgb(245, 158, 11)",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        tension: 0.4,
      },
      {
        label: "Interviews",
        data: stats.charts.monthlyData.map(item => item.interviews),
        borderColor: "rgb(139, 92, 246)",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const userDistributionData = {
    labels: ["Applicants", "Companies", "Admins"],
    datasets: [
      {
        data: [
          stats.charts.userDistribution.applicants,
          stats.charts.userDistribution.companies,
          stats.charts.userDistribution.admins,
        ],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(16, 185, 129)",
          "rgb(245, 158, 11)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const applicationStatusData = {
    labels: ["Applied", "Shortlisted", "Rejected", "Hired"],
    datasets: [
      {
        data: [
          stats.applications.applied,
          stats.applications.shortlisted,
          stats.applications.rejected,
          stats.applications.hired,
        ],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(16, 185, 129, 0.8)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Debug Info - Remove this after fixing */}
      <div className="bg-red-900 border border-red-700 rounded-lg p-4 text-sm text-red-200">
        <h4 className="font-semibold text-red-100">Debug Info:</h4>
        <p>Loading: {loading ? "Yes" : "No"}</p>
        <p>Stats: {stats ? "Loaded" : "Null"}</p>
        <p>API URL: {import.meta.env.VITE_API_URL || "http://localhost:3000"}</p>
        <p>Time: {new Date().toLocaleTimeString()}</p>
        <p>Token: {localStorage.getItem("token") ? "Present" : "Missing"}</p>
        {stats && <p>Total Users: {stats.totals?.users || "N/A"}</p>}
        {error && (
          <div className="mt-2 p-2 bg-red-800 border border-red-600 rounded">
            <p className="font-semibold text-red-100">Error Details:</p>
            <p>Status: {error.status || "N/A"}</p>
            <p>Message: {error.message}</p>
            <p>Response: {JSON.stringify(error.data)}</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Super Admin Dashboard</h1>
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Calendar size={16} />
          <span>{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-black p-6 rounded-lg shadow-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Users</p>
              <p className="text-3xl font-bold text-white">{stats.totals.users}</p>
              <p className="text-sm text-green-400 mt-1">
                +{stats.thisMonth.newUsers} this month
              </p>
            </div>
            <div className="p-3 bg-blue-900 rounded-full">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-black p-6 rounded-lg shadow-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Applications</p>
              <p className="text-3xl font-bold text-white">{stats.totals.applications}</p>
              <p className="text-sm text-blue-400 mt-1">
                +{stats.thisMonth.newApplications} this month
              </p>
            </div>
            <div className="p-3 bg-purple-900 rounded-full">
              <Briefcase className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-black p-6 rounded-lg shadow-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Active Job Posts</p>
              <p className="text-3xl font-bold text-white">{stats.totals.activeJobPosts}</p>
              <p className="text-sm text-gray-500 mt-1">
                {stats.totals.jobPosts} total posts
              </p>
            </div>
            <div className="p-3 bg-green-900 rounded-full">
              <FileText className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-black p-6 rounded-lg shadow-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Interviews</p>
              <p className="text-3xl font-bold text-white">{stats.totals.interviews}</p>
              <p className="text-sm text-orange-400 mt-1">
                {stats.interviews.upcoming} upcoming
              </p>
            </div>
            <div className="p-3 bg-orange-900 rounded-full">
              <Video className="h-6 w-6 text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Today & This Week Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black bg-opacity-60 p-6 rounded-lg border border-blue-700">
          <h3 className="text-sm font-semibold text-blue-300 mb-3 flex items-center gap-2">
            <Activity size={18} />
            Today's Activity
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-blue-300">New Users:</span>
              <span className="font-bold text-blue-100">{stats.today.newUsers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-blue-300">New Applications:</span>
              <span className="font-bold text-blue-100">{stats.today.newApplications}</span>
            </div>
          </div>
        </div>

        <div className="bg-black bg-opacity-60 p-6 rounded-lg border border-green-700">
          <h3 className="text-sm font-semibold text-green-300 mb-3 flex items-center gap-2">
            <TrendingUp size={18} />
            This Week
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-green-300">New Users:</span>
              <span className="font-bold text-green-100">{stats.thisWeek.newUsers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-green-300">New Applications:</span>
              <span className="font-bold text-green-100">{stats.thisWeek.newApplications}</span>
            </div>
          </div>
        </div>

        <div className="bg-black bg-opacity-60 p-6 rounded-lg border border-purple-700">
          <h3 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
            <Calendar size={18} />
            This Month
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-purple-300">New Registrations:</span>
              <span className="font-bold text-purple-100">{stats.thisMonth.newRegistrations}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-purple-300">New Interviews:</span>
              <span className="font-bold text-purple-100">{stats.thisMonth.newInterviews}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Application & Interview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black p-6 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
            <Briefcase className="h-5 w-5" />
            Application Statistics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-900 rounded-lg">
              <p className="text-2xl font-bold text-blue-300">{stats.applications.applied}</p>
              <p className="text-xs text-gray-400 mt-1">Applied</p>
            </div>
            <div className="text-center p-3 bg-yellow-900 rounded-lg">
              <p className="text-2xl font-bold text-yellow-300">{stats.applications.shortlisted}</p>
              <p className="text-xs text-gray-400 mt-1">Shortlisted</p>
            </div>
            <div className="text-center p-3 bg-red-900 rounded-lg">
              <p className="text-2xl font-bold text-red-300">{stats.applications.rejected}</p>
              <p className="text-xs text-gray-400 mt-1">Rejected</p>
            </div>
            <div className="text-center p-3 bg-green-900 rounded-lg">
              <p className="text-2xl font-bold text-green-300">{stats.applications.hired}</p>
              <p className="text-xs text-gray-400 mt-1">Hired</p>
            </div>
          </div>
        </div>

        <div className="bg-black p-6 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
            <Video className="h-5 w-5" />
            Interview Statistics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-900 rounded-lg">
              <p className="text-2xl font-bold text-blue-300">{stats.interviews.scheduled}</p>
              <p className="text-xs text-gray-400 mt-1">Scheduled</p>
            </div>
            <div className="text-center p-3 bg-green-900 rounded-lg">
              <p className="text-2xl font-bold text-green-300">{stats.interviews.completed}</p>
              <p className="text-xs text-gray-400 mt-1">Completed</p>
            </div>
            <div className="text-center p-3 bg-red-900 rounded-lg">
              <p className="text-2xl font-bold text-red-300">{stats.interviews.cancelled}</p>
              <p className="text-xs text-gray-400 mt-1">Cancelled</p>
            </div>
            <div className="text-center p-3 bg-orange-900 rounded-lg">
              <p className="text-2xl font-bold text-orange-300">{stats.interviews.upcoming}</p>
              <p className="text-xs text-gray-400 mt-1">Upcoming</p>
            </div>
          </div>
        </div>
      </div>

      {/* Moderation Stats */}
      <div className="bg-black p-6 rounded-lg shadow-lg border border-gray-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
          <AlertTriangle className="h-5 w-5 text-orange-400" />
          Moderation & Security
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="text-center p-3 bg-red-900 rounded-lg">
            <p className="text-2xl font-bold text-red-300">{stats.moderation.blockedUsers}</p>
            <p className="text-xs text-gray-400 mt-1">Blocked Users</p>
          </div>
          <div className="text-center p-3 bg-red-900 rounded-lg">
            <p className="text-2xl font-bold text-red-300">{stats.moderation.blockedPosts}</p>
            <p className="text-xs text-gray-400 mt-1">Blocked Posts</p>
          </div>
          <div className="text-center p-3 bg-yellow-900 rounded-lg">
            <p className="text-2xl font-bold text-yellow-300">{stats.moderation.pendingPosts}</p>
            <p className="text-xs text-gray-400 mt-1">Pending Posts</p>
          </div>
          <div className="text-center p-3 bg-gray-800 rounded-lg">
            <p className="text-2xl font-bold text-gray-300">{stats.moderation.rejectedPosts}</p>
            <p className="text-xs text-gray-400 mt-1">Rejected Posts</p>
          </div>
          <div className="text-center p-3 bg-orange-900 rounded-lg">
            <p className="text-2xl font-bold text-orange-300">{stats.moderation.pendingPromoRequests}</p>
            <p className="text-xs text-gray-400 mt-1">Pending Promos</p>
          </div>
          <div className="text-center p-3 bg-green-900 rounded-lg">
            <p className="text-2xl font-bold text-green-300">{stats.moderation.approvedPromoRequests}</p>
            <p className="text-xs text-gray-400 mt-1">Approved Promos</p>
          </div>
          <div className="text-center p-3 bg-red-900 rounded-lg">
            <p className="text-2xl font-bold text-red-300">{stats.moderation.rejectedPromoRequests}</p>
            <p className="text-xs text-gray-400 mt-1">Rejected Promos</p>
          </div>
        </div>
      </div>

      {/* Job & User Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black p-6 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
            <FileText className="h-5 w-5" />
            Job Post Breakdown
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-800 rounded">
              <span className="text-sm text-gray-300">Total Posts:</span>
              <span className="font-bold text-white">{stats.jobs.total}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-900 rounded">
              <span className="text-sm text-green-300">Active Posts:</span>
              <span className="font-bold text-green-100">{stats.jobs.active}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-900 rounded">
              <span className="text-sm text-yellow-300">Promoted:</span>
              <span className="font-bold text-yellow-100">{stats.jobs.promoted}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-900 rounded">
              <span className="text-sm text-blue-300">Full-time:</span>
              <span className="font-bold text-blue-100">{stats.jobs.fullTime}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-900 rounded">
              <span className="text-sm text-purple-300">Part-time:</span>
              <span className="font-bold text-purple-100">{stats.jobs.partTime}</span>
            </div>
          </div>
        </div>

        <div className="bg-black p-6 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
            <Users className="h-5 w-5" />
            User Breakdown
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-800 rounded">
              <span className="text-sm text-gray-300">Total Users:</span>
              <span className="font-bold text-white">{stats.totals.users}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-900 rounded">
              <span className="text-sm text-blue-300">Applicants:</span>
              <span className="font-bold text-blue-100">{stats.totals.applicants}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-900 rounded">
              <span className="text-sm text-green-300">Companies:</span>
              <span className="font-bold text-green-100">{stats.totals.companies}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-900 rounded">
              <span className="text-sm text-purple-300">Admins:</span>
              <span className="font-bold text-purple-100">{stats.totals.admins}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-900 rounded">
              <span className="text-sm text-green-300">Verified:</span>
              <span className="font-bold text-green-100">{stats.verification.verified}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-black p-6 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
            <TrendingUp className="h-5 w-5" />
            Activity Trends (Last 6 Months)
          </h3>
          <Line data={monthlyActivityData} options={chartOptions} />
        </div>

        <div className="bg-black p-6 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
            <Users className="h-5 w-5" />
            User Distribution
          </h3>
          <div className="h-64 flex items-center justify-center">
            <Doughnut data={userDistributionData} options={doughnutOptions} />
          </div>
        </div>

        <div className="bg-black p-6 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
            <Briefcase className="h-5 w-5" />
            Application Status Distribution
          </h3>
          <div className="h-64 flex items-center justify-center">
            <Doughnut data={applicationStatusData} options={doughnutOptions} />
          </div>
        </div>

        <div className="bg-black p-6 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
            <Award className="h-5 w-5" />
            Top Companies by Job Posts
          </h3>
          <div className="space-y-3">
            {stats.topStats.topCompanies.length > 0 ? (
              stats.topStats.topCompanies.map((company, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-300">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-white">{company.name}</p>
                      <p className="text-xs text-gray-400">{company.email}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-blue-900 text-blue-300 rounded-full text-sm font-semibold">
                    {company.jobCount} jobs
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">No data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-black p-6 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
            <Users className="h-5 w-5 text-blue-400" />
            Recent Users
          </h3>
          <div className="space-y-3">
            {stats.recentActivity.users.length > 0 ? (
              stats.recentActivity.users.map((user) => (
                <div key={user._id} className="flex items-center justify-between p-2 hover:bg-gray-800 rounded">
                  <div>
                    <p className="font-medium text-sm text-white">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    user.role === "COMPANY" ? "bg-green-900 text-green-300" :
                    user.role === "APPLICANT" ? "bg-blue-900 text-blue-300" :
                    "bg-purple-900 text-purple-300"
                  }`}>
                    {user.role}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4 text-sm">No recent users</p>
            )}
          </div>
        </div>

        <div className="bg-black p-6 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
            <FileText className="h-5 w-5 text-green-400" />
            Recent Job Posts
          </h3>
          <div className="space-y-3">
            {stats.recentActivity.jobs.length > 0 ? (
              stats.recentActivity.jobs.map((job) => (
                <div key={job._id} className="p-2 hover:bg-gray-800 rounded">
                  <p className="font-medium text-sm text-white">{job.title}</p>
                  <p className="text-xs text-gray-400">
                    by {job.createdBy?.name || "Unknown"}
                  </p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs ${
                    job.status === "ACTIVE" ? "bg-green-900 text-green-300" : "bg-gray-800 text-gray-300"
                  }`}>
                    {job.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4 text-sm">No recent jobs</p>
            )}
          </div>
        </div>

        <div className="bg-black p-6 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
            <Briefcase className="h-5 w-5 text-purple-400" />
            Recent Applications
          </h3>
          <div className="space-y-3">
            {stats.recentActivity.applications.length > 0 ? (
              stats.recentActivity.applications.map((app) => (
                <div key={app._id} className="p-2 hover:bg-gray-800 rounded">
                  <p className="font-medium text-sm text-white">{app.jobId?.title || "Job"}</p>
                  <p className="text-xs text-gray-400">
                    by {app.applicantId?.name || "Unknown"}
                  </p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs ${
                    app.status === "APPLIED" ? "bg-blue-900 text-blue-300" :
                    app.status === "SHORTLISTED" ? "bg-yellow-900 text-yellow-300" :
                    app.status === "HIRED" ? "bg-green-900 text-green-300" :
                    "bg-red-900 text-red-300"
                  }`}>
                    {app.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4 text-sm">No recent applications</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-black p-6 rounded-lg shadow-lg border border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-white">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => navigate('/admin/dashboard/moderate-users')}
            className="p-4 text-left border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Users className="h-6 w-6 text-blue-400 mb-2" />
            <p className="font-medium text-white">Manage Users</p>
            <p className="text-sm text-gray-400">View and moderate users</p>
          </button>
          <button 
            onClick={() => navigate('/admin/dashboard/moderate-posts')}
            className="p-4 text-left border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <FileText className="h-6 w-6 text-green-400 mb-2" />
            <p className="font-medium text-white">Moderate Posts</p>
            <p className="text-sm text-gray-400">Review job postings</p>
          </button>
          <button 
            onClick={() => navigate('/admin/dashboard/promo-requests')}
            className="p-4 text-left border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Star className="h-6 w-6 text-yellow-400 mb-2" />
            <p className="font-medium text-white">Promo Requests</p>
            <p className="text-sm text-gray-400">Handle promotions</p>
          </button>
          <button 
            onClick={() => navigate('/admin/dashboard/create-job')}
            className="p-4 text-left border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Building2 className="h-6 w-6 text-purple-400 mb-2" />
            <p className="font-medium text-white">Create Job</p>
            <p className="text-sm text-gray-400">Add new job posting</p>
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import api from "../../services/api";
import { Ban, CheckCircle, User, Trash2, AlertTriangle } from "lucide-react";

export default function ModerateUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleBlock = async (userId, isBlocked) => {
    const action = isBlocked ? "unblock" : "block";
    if (!confirm(`Are you sure you want to ${action} this user? ${!isBlocked ? "They will not be able to post jobs or apply for positions." : ""}`)) return;
    
    try {
      if (isBlocked) {
        await api.patch(`/api/admin/unblock-user/${userId}`);
      } else {
        await api.patch(`/api/admin/block-user/${userId}`);
      }
      fetchUsers(); // Refresh the list
    } catch (err) {
      alert("Failed to update user status");
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm("Are you sure you want to permanently delete this user? This action cannot be undone.")) return;
    try {
      await api.delete(`/api/admin/user/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  const filteredUsers = filter === "ALL" 
    ? users 
    : filter === "BLOCKED"
    ? users.filter(u => u.isBlocked)
    : users.filter(u => u.role === filter);

  if (loading) return <div className="text-center py-8 text-gray-300">Loading users...</div>;

  const blockedCount = users.filter(u => u.isBlocked).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Moderate Users</h2>
          {blockedCount > 0 && (
            <p className="text-sm text-gray-400 mt-1">
              {blockedCount} user{blockedCount !== 1 ? "s" : ""} currently blocked
            </p>
          )}
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border border-gray-600 rounded-lg px-4 py-2 bg-gray-900 text-white focus:ring-2 focus:ring-red-600">
          <option value="ALL">All Users ({users.length})</option>
          <option value="APPLICANT">Applicants ({users.filter(u => u.role === "APPLICANT").length})</option>
          <option value="COMPANY">Companies ({users.filter(u => u.role === "COMPANY").length})</option>
          <option value="SUPER_ADMIN">Admins ({users.filter(u => u.role === "SUPER_ADMIN").length})</option>
          <option value="BLOCKED">Blocked Users ({blockedCount})</option>
        </select>
      </div>

      {blockedCount > 0 && filter === "ALL" && (
        <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="text-yellow-400 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-medium text-yellow-300">Active Restrictions</p>
            <p className="text-sm text-yellow-200 mt-1">
              {blockedCount} user{blockedCount !== 1 ? "s are" : " is"} currently blocked and cannot post jobs or apply for positions.
            </p>
          </div>
        </div>
      )}
      
      <div className="bg-black rounded-lg shadow-lg overflow-hidden border border-gray-700">
        <table className="w-full">
          <thead className="bg-gray-900 border-b border-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">User</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Joined</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredUsers.map((user) => (
              <tr key={user._id} className={user.isBlocked ? "bg-red-900 bg-opacity-20" : "hover:bg-gray-800"}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                      <User size={20} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{user.name}</p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.role === "SUPER_ADMIN" ? "bg-purple-900 text-purple-300" :
                    user.role === "COMPANY" ? "bg-blue-900 text-blue-300" :
                    "bg-green-900 text-green-300"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {user.isBlocked ? (
                    <span className="flex items-center gap-1 text-red-400 font-medium">
                      <Ban size={16} />Blocked
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-green-400">
                      <CheckCircle size={16} />Active
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => toggleBlock(user._id, user.isBlocked)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        user.isBlocked 
                          ? "bg-green-700 text-white hover:bg-green-800" 
                          : "bg-red-700 text-white hover:bg-red-800"
                      }`}
                      disabled={user.role === "SUPER_ADMIN"}
                      title={user.role === "SUPER_ADMIN" ? "Cannot block admin users" : ""}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                    {user.role !== "SUPER_ADMIN" && (
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="p-2 rounded-lg bg-red-900 text-red-400 hover:bg-red-800 transition"
                        title="Delete user permanently"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && <p className="text-gray-400 text-center py-8">No users found</p>}
      </div>
    </div>
  );
}

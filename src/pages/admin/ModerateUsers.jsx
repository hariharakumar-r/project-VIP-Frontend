import { useState, useEffect } from "react";
import api from "../../services/api";
import { Ban, CheckCircle, User } from "lucide-react";

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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleBlock = async (userId, isBlocked) => {
    try {
      await api.patch(`/api/admin/block-user/${userId}`, { blocked: !isBlocked });
      setUsers(users.map(u => u._id === userId ? { ...u, isBlocked: !isBlocked } : u));
    } catch (err) {
      alert("Failed to update user status");
    }
  };

  const filteredUsers = filter === "ALL" ? users : users.filter(u => u.role === filter);

  if (loading) return <div className="text-center py-8">Loading users...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Moderate Users</h2>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border rounded-lg px-4 py-2">
          <option value="ALL">All Users</option>
          <option value="APPLICANT">Applicants</option>
          <option value="COMPANY">Companies</option>
          <option value="SUPER_ADMIN">Admins</option>
        </select>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">User</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-right text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <User size={20} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    user.role === "SUPER_ADMIN" ? "bg-purple-100 text-purple-800" :
                    user.role === "COMPANY" ? "bg-blue-100 text-blue-800" :
                    "bg-green-100 text-green-800"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {user.isBlocked ? (
                    <span className="flex items-center gap-1 text-red-600"><Ban size={16} />Blocked</span>
                  ) : (
                    <span className="flex items-center gap-1 text-green-600"><CheckCircle size={16} />Active</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => toggleBlock(user._id, user.isBlocked)}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      user.isBlocked ? "bg-green-500 text-white hover:bg-green-600" : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && <p className="text-gray-500 text-center py-8">No users found</p>}
      </div>
    </div>
  );
}

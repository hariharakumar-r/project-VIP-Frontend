import { useState, useEffect } from "react";
import api from "../../services/api";
import { Save, Shield } from "lucide-react";

export default function AdminProfile() {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/admin/profile");
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/api/admin/profile", profile);
      alert("Profile updated!");
    } catch (err) {
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-8 text-gray-300">Loading profile...</div>;

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6 text-white">Admin Profile</h2>
      <div className="bg-red-900/20 border border-red-700 p-4 rounded-lg mb-6 flex items-center gap-3">
        <Shield className="text-red-400" size={24} />
        <p className="text-red-300">You have Super Admin privileges</p>
      </div>
      <form onSubmit={handleSave} className="bg-black p-6 rounded-lg shadow space-y-4 border border-gray-700">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Name</label>
          <input value={profile.name || ""} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-600" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
          <input value={profile.email || ""} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-600" type="email" />
        </div>
        <button type="submit" disabled={saving} className="flex items-center gap-2 bg-red-700 text-white px-6 py-3 rounded-lg hover:bg-red-800 disabled:opacity-50">
          <Save size={20} />{saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}

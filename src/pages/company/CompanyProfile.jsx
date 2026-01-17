import { useState, useEffect } from "react";
import api from "../../services/api";
import { Save, Trash2, Upload, Building2, X, Edit2 } from "lucide-react";

export default function CompanyProfile() {
  const [profile, setProfile] = useState({
    name: "",
    description: "",
    industry: "",
    website: "",
    location: "",
    logo: "",
    role: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [logoError, setLogoError] = useState("");
  const [previewLogo, setPreviewLogo] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/company/profile");
      setProfile(res.data || {});
      if (res.data?.logo) {
        setPreviewLogo(res.data.logo);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setLogoError("File size must be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setLogoError("Please upload a valid image file");
      return;
    }

    setLogoError("");

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile({ ...profile, logo: reader.result });
      setPreviewLogo(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteLogo = () => {
    setProfile({ ...profile, logo: "" });
    setPreviewLogo("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/api/company/profile", profile);
      alert("Company profile updated successfully!");
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your company profile? This action cannot be undone.")) {
      setDeleting(true);
      try {
        await api.delete("/api/company/profile");
        alert("Company profile deleted successfully!");
        setProfile({
          name: "",
          description: "",
          industry: "",
          website: "",
          location: "",
          logo: "",
          role: "",
        });
        setPreviewLogo("");
        setIsEditing(false);
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete profile");
      } finally {
        setDeleting(false);
      }
    }
  };

  if (loading) return <div className="text-center py-8 text-gray-300">Loading company profile...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">Company Profile</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800"
          >
            <Edit2 size={20} />
            Edit Profile
          </button>
        )}
      </div>

      {isEditing ? (
        // Edit Form
        <form onSubmit={handleSave} className="bg-black p-8 rounded-lg shadow-lg space-y-6 border border-gray-700">
          {/* Logo Section */}
          <div className="flex flex-col items-center gap-4 pb-6 border-b border-gray-700">
            <div className="w-32 h-32 rounded-lg bg-gray-800 flex items-center justify-center overflow-hidden border-4 border-gray-700">
              {previewLogo ? (
                <img src={previewLogo} alt="Company Logo" className="w-full h-full object-cover" />
              ) : (
                <Building2 size={64} className="text-gray-600" />
              )}
            </div>

            <div className="flex flex-col items-center gap-2">
              <label className="flex items-center gap-2 bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 cursor-pointer">
                <Upload size={20} />
                Upload Logo
                <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
              </label>
              {previewLogo && (
                <button
                  type="button"
                  onClick={handleDeleteLogo}
                  className="text-red-400 hover:text-red-300 flex items-center gap-1"
                >
                  <X size={16} />
                  Remove Logo
                </button>
              )}
              {logoError && <p className="text-red-400 text-sm">{logoError}</p>}
              <p className="text-xs text-gray-400">Max 5MB • JPG, PNG, GIF</p>
            </div>
          </div>

          {/* Company Information */}
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-semibold mb-4 text-white">Company Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Company Name *</label>
                <input
                  value={profile.name || ""}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="Your company name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Your Role</label>
                <input
                  value={profile.role || ""}
                  onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="e.g., HR Manager, Recruiter"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Industry</label>
                <input
                  value={profile.industry || ""}
                  onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="e.g., Technology, Finance"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Location</label>
                <input
                  value={profile.location || ""}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="City, Country"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-gray-300">Website</label>
                <input
                  type="url"
                  value={profile.website || ""}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="https://www.example.com"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-semibold mb-4 text-white">About Company</h3>
            <textarea
              value={profile.description || ""}
              onChange={(e) => setProfile({ ...profile, description: e.target.value })}
              className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              rows={6}
              placeholder="Tell us about your company, its mission, values, and culture..."
            />
          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-700 pt-6 flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-red-700 text-white px-6 py-3 rounded-lg hover:bg-red-800 disabled:opacity-50"
            >
              <Save size={20} />
              {saving ? "Saving..." : "Save Profile"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                fetchProfile();
              }}
              className="flex items-center gap-2 bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 bg-red-900 text-red-400 px-6 py-3 rounded-lg hover:bg-red-800 disabled:opacity-50 ml-auto"
            >
              <Trash2 size={20} />
              {deleting ? "Deleting..." : "Delete Profile"}
            </button>
          </div>
        </form>
      ) : (
        // View Mode
        <div className="bg-black rounded-lg shadow-lg overflow-hidden border border-gray-700">
          {/* Header with Logo */}
          <div className="bg-gradient-to-r from-red-900 to-red-800 p-8">
            <div className="flex items-center gap-6">
              {previewLogo ? (
                <img
                  src={previewLogo}
                  alt="Company Logo"
                  className="w-24 h-24 rounded-lg object-cover bg-gray-800 p-2"
                />
              ) : (
                <div className="w-24 h-24 rounded-lg bg-gray-800 flex items-center justify-center">
                  <Building2 size={48} className="text-gray-600" />
                </div>
              )}
              <div className="text-white">
                <h1 className="text-4xl font-bold">{profile.name || "Company Name"}</h1>
                {profile.role && <p className="text-lg mt-2">{profile.role}</p>}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8 space-y-6">
            {profile.description ? (
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">About</h3>
                <p className="text-gray-300">{profile.description}</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <Building2 size={48} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">Complete your company profile to get started</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 bg-red-700 text-white px-6 py-2 rounded-lg hover:bg-red-800"
                >
                  Add Company Information
                </button>
              </div>
            )}

            {(profile.industry || profile.location) && (
              <div className="grid md:grid-cols-2 gap-6">
                {profile.industry && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-1">Industry</h3>
                    <p className="text-lg text-white">{profile.industry}</p>
                  </div>
                )}
                {profile.location && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-1">Location</h3>
                    <p className="text-lg text-white">{profile.location}</p>
                  </div>
                )}
              </div>
            )}

            {profile.website && (
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-1">Website</h3>
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-400 hover:text-red-300"
                >
                  {profile.website}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

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

  if (loading) return <div className="text-center py-8">Loading company profile...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Company Profile</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            <Edit2 size={20} />
            Edit Profile
          </button>
        )}
      </div>

      {isEditing ? (
        // Edit Form
        <form onSubmit={handleSave} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
          {/* Logo Section */}
          <div className="flex flex-col items-center gap-4 pb-6 border-b">
            <div className="w-32 h-32 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-gray-300">
              {previewLogo ? (
                <img src={previewLogo} alt="Company Logo" className="w-full h-full object-cover" />
              ) : (
                <Building2 size={64} className="text-gray-400" />
              )}
            </div>

            <div className="flex flex-col items-center gap-2">
              <label className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer">
                <Upload size={20} />
                Upload Logo
                <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
              </label>
              {previewLogo && (
                <button
                  type="button"
                  onClick={handleDeleteLogo}
                  className="text-red-500 hover:text-red-700 flex items-center gap-1"
                >
                  <X size={16} />
                  Remove Logo
                </button>
              )}
              {logoError && <p className="text-red-500 text-sm">{logoError}</p>}
              <p className="text-xs text-gray-500">Max 5MB • JPG, PNG, GIF</p>
            </div>
          </div>

          {/* Company Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Company Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Company Name *</label>
                <input
                  value={profile.name || ""}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your company name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Your Role</label>
                <input
                  value={profile.role || ""}
                  onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., HR Manager, Recruiter"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Industry</label>
                <input
                  value={profile.industry || ""}
                  onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Technology, Finance"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  value={profile.location || ""}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="City, Country"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Website</label>
                <input
                  type="url"
                  value={profile.website || ""}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://www.example.com"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">About Company</h3>
            <textarea
              value={profile.description || ""}
              onChange={(e) => setProfile({ ...profile, description: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={6}
              placeholder="Tell us about your company, its mission, values, and culture..."
            />
          </div>

          {/* Action Buttons */}
          <div className="border-t pt-6 flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
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
              className="flex items-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 disabled:opacity-50 ml-auto"
            >
              <Trash2 size={20} />
              {deleting ? "Deleting..." : "Delete Profile"}
            </button>
          </div>
        </form>
      ) : (
        // View Mode
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header with Logo */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8">
            <div className="flex items-center gap-6">
              {previewLogo ? (
                <img
                  src={previewLogo}
                  alt="Company Logo"
                  className="w-24 h-24 rounded-lg object-cover bg-white p-2"
                />
              ) : (
                <div className="w-24 h-24 rounded-lg bg-white flex items-center justify-center">
                  <Building2 size={48} className="text-gray-400" />
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
                <h3 className="text-xl font-semibold mb-2">About</h3>
                <p className="text-gray-700">{profile.description}</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Complete your company profile to get started</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                >
                  Add Company Information
                </button>
              </div>
            )}

            {(profile.industry || profile.location) && (
              <div className="grid md:grid-cols-2 gap-6">
                {profile.industry && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-1">Industry</h3>
                    <p className="text-lg text-gray-900">{profile.industry}</p>
                  </div>
                )}
                {profile.location && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-1">Location</h3>
                    <p className="text-lg text-gray-900">{profile.location}</p>
                  </div>
                )}
              </div>
            )}

            {profile.website && (
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-1">Website</h3>
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
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

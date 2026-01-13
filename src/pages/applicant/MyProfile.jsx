import { useState, useEffect } from "react";
import api from "../../services/api";
import { Save, Trash2, Upload, User as UserIcon, X } from "lucide-react";

export default function MyProfile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    picture: "",
    phone: "",
    location: "",
    bio: "",
    photo: "",
    skills: [],
    experience: "",
    education: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [previewPicture, setPreviewPicture] = useState("");
  const [photoError, setPhotoError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/applicant/profile");
      setProfile(res.data);
      // Use photo from applicant profile, fallback to picture from user
      if (res.data.photo) {
        setPreviewPicture(res.data.photo);
      } else if (res.data.picture) {
        setPreviewPicture(res.data.picture);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("File size must be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setPhotoError("Please upload a valid image file");
      return;
    }

    setPhotoError("");
    setUploadingPhoto(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Photo = reader.result;
        
        // Upload photo to backend
        const res = await api.post("/api/applicant/photo", { photo: base64Photo });
        
        setProfile({ ...profile, photo: base64Photo });
        setPreviewPicture(base64Photo);
        alert("Photo uploaded successfully!");
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setPhotoError(err.response?.data?.message || "Failed to upload photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (window.confirm("Are you sure you want to delete your photo?")) {
      try {
        await api.delete("/api/applicant/photo");
        setProfile({ ...profile, photo: "" });
        setPreviewPicture("");
        alert("Photo deleted successfully!");
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete photo");
      }
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setProfile({
        ...profile,
        skills: [...(profile.skills || []), skillInput.trim()],
      });
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (index) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((_, i) => i !== index),
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/api/applicant/profile", profile);
      alert("Profile updated successfully!");
      fetchProfile();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
      setDeleting(true);
      try {
        await api.delete("/api/applicant/profile");
        alert("Profile deleted successfully!");
        setProfile({
          name: "",
          email: "",
          picture: "",
          phone: "",
          location: "",
          bio: "",
          photo: "",
          skills: [],
          experience: "",
          education: "",
        });
        setPreviewPicture("");
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete profile");
      } finally {
        setDeleting(false);
      }
    }
  };

  if (loading) return <div className="text-center py-8">Loading profile...</div>;

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>

      <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow space-y-6">
        {/* Profile Photo Section */}
        <div className="flex flex-col items-center gap-4 pb-6 border-b">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-gray-300">
              {previewPicture ? (
                <img src={previewPicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={64} className="text-gray-400" />
              )}
            </div>
            {previewPicture && (
              <button
                type="button"
                onClick={handleDeletePhoto}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex flex-col items-center gap-2">
            <label className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer disabled:opacity-50">
              <Upload size={20} />
              {uploadingPhoto ? "Uploading..." : "Upload Photo"}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                disabled={uploadingPhoto}
                className="hidden"
              />
            </label>
            {photoError && <p className="text-red-500 text-sm">{photoError}</p>}
            <p className="text-xs text-gray-500">Max 5MB • JPG, PNG, GIF</p>
          </div>
        </div>

        {/* Basic Information */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                value={profile.name || ""}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                value={profile.email || ""}
                type="email"
                disabled
                className="w-full p-3 border rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                value={profile.phone || ""}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your phone number"
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
          </div>
        </div>

        {/* Bio */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">About You</h3>
          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              value={profile.bio || ""}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>

        {/* Skills */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Skills</h3>
          <div className="flex gap-2 mb-4">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a skill and press Enter"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.skills?.map((skill, index) => (
              <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2">
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(index)}
                  className="text-blue-600 hover:text-blue-800 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Experience & Education */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Experience & Education</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Experience</label>
              <textarea
                value={profile.experience || ""}
                onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Describe your work experience..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Education</label>
              <textarea
                value={profile.education || ""}
                onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Describe your educational background..."
              />
            </div>
          </div>
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
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 disabled:opacity-50"
          >
            <Trash2 size={20} />
            {deleting ? "Deleting..." : "Delete Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}

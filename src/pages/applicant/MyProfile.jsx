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
    // New educational fields
    tenthPercentage: "",
    twelfthPercentage: "",
    collegeName: "",
    schoolName: "",
    cgpa: "",
    degree: "",
    documents: null // For PDF upload
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingDocs, setUploadingDocs] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [previewPicture, setPreviewPicture] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [docsError, setDocsError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/applicant/profile");
      
      setProfile({
        ...res.data,
        // Ensure all fields exist with proper defaults
        tenthPercentage: res.data.tenthPercentage || "",
        twelfthPercentage: res.data.twelfthPercentage || "",
        collegeName: res.data.collegeName || "",
        schoolName: res.data.schoolName || "",
        cgpa: res.data.cgpa || "",
        degree: res.data.degree || "",
        documents: res.data.documents || null
      });
      
      // Set preview picture - prioritize photo over picture
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

  const handleDocumentChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type (only PDF)
    if (file.type !== "application/pdf") {
      setDocsError("Please upload a PDF file only");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setDocsError("File size must be less than 10MB");
      return;
    }

    setDocsError("");
    setUploadingDocs(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Doc = reader.result;
        
        try {
          // Upload document using dedicated route
          const res = await api.post("/api/applicant/documents", { documents: base64Doc });
          
          // Update local state
          setProfile({ ...profile, documents: base64Doc });
          alert("Document uploaded successfully!");
          
          // Refresh profile to get latest data
          fetchProfile();
        } catch (apiErr) {
          console.error("Document upload error:", apiErr);
          setDocsError(apiErr.response?.data?.message || "Failed to save document to server");
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("File processing error:", err);
      setDocsError("Failed to process document file");
    } finally {
      setUploadingDocs(false);
    }
  };

  const handleDeleteDocument = async () => {
    if (window.confirm("Are you sure you want to delete your documents?")) {
      try {
        // Delete document using dedicated route
        await api.delete("/api/applicant/documents");
        
        // Update local state
        setProfile({ ...profile, documents: null });
        alert("Document deleted successfully!");
        
        // Refresh profile to get latest data
        fetchProfile();
      } catch (err) {
        console.error("Document deletion error:", err);
        alert(err.response?.data?.message || "Failed to delete document");
      }
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
      const response = await api.post("/api/applicant/profile", profile);
      alert("Profile updated successfully!");
      fetchProfile();
    } catch (err) {
      console.error("Save error:", err);
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

  if (loading) return <div className="text-center py-8 text-gray-300">Loading profile...</div>;

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-bold mb-6 text-white">My Profile</h2>

      <form onSubmit={handleSave} className="bg-black p-6 rounded-lg shadow space-y-6 border border-gray-700">
        {/* Profile Photo Section */}
        <div className="flex flex-col items-center gap-4 pb-6 border-b border-gray-700">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border-4 border-gray-700">
              {previewPicture ? (
                <img src={previewPicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={64} className="text-gray-600" />
              )}
            </div>
            {previewPicture && (
              <button
                type="button"
                onClick={handleDeletePhoto}
                className="absolute top-0 right-0 bg-red-700 text-white rounded-full p-2 hover:bg-red-800"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex flex-col items-center gap-2">
            <label className="flex items-center gap-2 bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 cursor-pointer disabled:opacity-50">
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
            {photoError && <p className="text-red-400 text-sm">{photoError}</p>}
            <p className="text-xs text-gray-500">Max 5MB • JPG, PNG, GIF</p>
          </div>
        </div>

        {/* Basic Information */}
        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-lg font-semibold mb-4 text-white">Basic Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Name</label>
              <input
                value={profile.name || ""}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
              <input
                value={profile.email || ""}
                type="email"
                disabled
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Phone</label>
              <input
                value={profile.phone || ""}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                placeholder="Your phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Location</label>
              <input
                value={profile.location || ""}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                placeholder="City, Country"
              />
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-lg font-semibold mb-4 text-white">About You</h3>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Bio</label>
            <textarea
              value={profile.bio || ""}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              rows={4}
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>

        {/* Skills */}
        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-lg font-semibold mb-4 text-white">Skills</h3>
          <div className="flex gap-2 mb-4">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
              className="flex-1 p-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              placeholder="Add a skill and press Enter"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="bg-red-700 text-white px-4 py-3 rounded-lg hover:bg-red-800"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.skills?.map((skill, index) => (
              <div key={index} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full flex items-center gap-2 border border-gray-700">
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(index)}
                  className="text-gray-500 hover:text-gray-300 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Experience & Education */}
        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-lg font-semibold mb-4 text-white">Experience & Education</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Experience</label>
              <textarea
                value={profile.experience || ""}
                onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                rows={4}
                placeholder="Describe your work experience..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Education</label>
              <textarea
                value={profile.education || ""}
                onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                rows={4}
                placeholder="Describe your educational background..."
              />
            </div>
          </div>
        </div>

        {/* Detailed Educational Information */}
        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-lg font-semibold mb-4 text-white">Educational Details</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">10th Percentage</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={profile.tenthPercentage || ""}
                onChange={(e) => setProfile({ ...profile, tenthPercentage: e.target.value })}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                placeholder="85.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">12th Percentage</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={profile.twelfthPercentage || ""}
                onChange={(e) => setProfile({ ...profile, twelfthPercentage: e.target.value })}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                placeholder="88.2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">CGPA</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={profile.cgpa || ""}
                onChange={(e) => setProfile({ ...profile, cgpa: e.target.value })}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                placeholder="8.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">School Name</label>
              <input
                value={profile.schoolName || ""}
                onChange={(e) => setProfile({ ...profile, schoolName: e.target.value })}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                placeholder="ABC High School"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">College Name</label>
              <input
                value={profile.collegeName || ""}
                onChange={(e) => setProfile({ ...profile, collegeName: e.target.value })}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                placeholder="XYZ University"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Degree</label>
              <input
                value={profile.degree || ""}
                onChange={(e) => setProfile({ ...profile, degree: e.target.value })}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                placeholder="Bachelor of Technology"
              />
            </div>
          </div>
        </div>

        {/* Documents Upload */}
        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-lg font-semibold mb-4 text-white">Documents</h3>
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400 mb-4">
              Upload a single PDF containing all your certificates (10th, 12th, degree, etc.)
            </p>
            
            {profile.documents ? (
              <div className="flex items-center justify-between p-3 bg-gray-800 border border-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-900 rounded-lg flex items-center justify-center">
                    <span className="text-red-400 font-bold text-xs">PDF</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-white">Documents.pdf</p>
                    <p className="text-xs text-gray-500">Uploaded successfully</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={profile.documents}
                    download="documents.pdf"
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Download
                  </a>
                  <button
                    type="button"
                    onClick={handleDeleteDocument}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <label className="flex items-center gap-2 bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 cursor-pointer disabled:opacity-50">
                  <Upload size={20} />
                  {uploadingDocs ? "Uploading..." : "Upload Documents (PDF)"}
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleDocumentChange}
                    disabled={uploadingDocs}
                    className="hidden"
                  />
                </label>
                {docsError && <p className="text-red-400 text-sm">{docsError}</p>}
                <p className="text-xs text-gray-500">Max 10MB • PDF only</p>
              </div>
            )}
          </div>
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
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 bg-red-900 text-red-300 px-6 py-3 rounded-lg hover:bg-red-800 disabled:opacity-50 border border-red-700"
          >
            <Trash2 size={20} />
            {deleting ? "Deleting..." : "Delete Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}

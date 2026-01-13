import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { Building2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ViewCompanyProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/api/company/view/${userId}`);
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading company profile...</div>;

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Company profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header with Logo */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8">
          <div className="flex items-center gap-6">
            {profile.logo ? (
              <img
                src={profile.logo}
                alt="Company Logo"
                className="w-24 h-24 rounded-lg object-cover bg-white p-2"
              />
            ) : (
              <div className="w-24 h-24 rounded-lg bg-white flex items-center justify-center">
                <Building2 size={48} className="text-gray-400" />
              </div>
            )}
            <div className="text-white">
              <h1 className="text-4xl font-bold">{profile.name}</h1>
              {profile.role && <p className="text-lg mt-2">{profile.role}</p>}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-8 space-y-6">
          {profile.description && (
            <div>
              <h3 className="text-xl font-semibold mb-2">About</h3>
              <p className="text-gray-700">{profile.description}</p>
            </div>
          )}

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

          {profile.createdAt && (
            <div className="text-sm text-gray-500 pt-4 border-t">
              <p>Profile created on {new Date(profile.createdAt).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

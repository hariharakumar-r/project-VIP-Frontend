import { useState, useEffect } from "react";
import api from "../../services/api";
import { Building2, MapPin, Globe, Users, Briefcase } from "lucide-react";

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await api.get("/api/applicant/companies");
      setCompanies(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white">Companies</h2>
        <p className="text-gray-300 mt-2">
          {companies.length} compan{companies.length !== 1 ? 'ies' : 'y'} hiring
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <div key={company._id} className="bg-black p-6 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-700">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-600">
                {company.logo ? (
                  <img 
                    src={company.logo} 
                    alt={`${company.name || company.companyName} logo`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`w-full h-full flex items-center justify-center ${company.logo ? 'hidden' : 'flex'}`}>
                  <Building2 size={32} className="text-gray-500" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold text-white truncate">
                  {company.name || company.companyName || "Company"}
                </h3>
                {company.industry && (
                  <p className="text-gray-400 text-sm mt-1">{company.industry}</p>
                )}
              </div>
            </div>

            {company.description && (
              <p className="text-gray-300 text-sm mb-4 line-clamp-3">{company.description}</p>
            )}

            <div className="space-y-2 text-sm text-gray-400">
              {company.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="flex-shrink-0" />
                  <span className="truncate">{company.location}</span>
                </div>
              )}
              
              {company.website && (
                <div className="flex items-center gap-2">
                  <Globe size={16} className="flex-shrink-0" />
                  <a 
                    href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-red-500 hover:text-red-400 truncate"
                  >
                    {company.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}

              {company.role && (
                <div className="flex items-center gap-2">
                  <Users size={16} className="flex-shrink-0" />
                  <span className="truncate">{company.role}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700">
              <button className="w-full bg-red-700 text-white py-2 px-4 rounded-lg hover:bg-red-800 transition-colors flex items-center justify-center gap-2">
                <Briefcase size={16} />
                View Jobs
              </button>
            </div>
          </div>
        ))}
        
        {companies.length === 0 && (
          <div className="col-span-full text-center py-12 bg-black rounded-lg border border-gray-700">
            <Building2 className="mx-auto h-16 w-16 text-gray-500 mb-4" />
            <p className="text-gray-300 text-lg">No companies found</p>
            <p className="text-gray-400 text-sm mt-2">Companies will appear here when they join the platform</p>
          </div>
        )}
      </div>
    </div>
  );
}

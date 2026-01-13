import { useState, useEffect } from "react";
import api from "../../services/api";
import { Building2, MapPin, Globe } from "lucide-react";

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

  if (loading) return <div className="text-center py-8">Loading companies...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Companies</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {companies.map((company) => (
          <div key={company._id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <Building2 size={32} className="text-gray-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{company.name || company.companyName}</h3>
                <p className="text-gray-600">{company.industry}</p>
              </div>
            </div>
            {company.description && <p className="mt-4 text-gray-700">{company.description}</p>}
            <div className="mt-4 flex gap-4 text-sm text-gray-500">
              {company.location && <span className="flex items-center gap-1"><MapPin size={16} />{company.location}</span>}
              {company.website && <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline"><Globe size={16} />Website</a>}
            </div>
          </div>
        ))}
        {companies.length === 0 && <p className="text-gray-500 text-center py-8 col-span-2">No companies found</p>}
      </div>
    </div>
  );
}

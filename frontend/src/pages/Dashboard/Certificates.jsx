import { useState, useEffect } from 'react';
import { Award, Download, FileText } from 'lucide-react';

const CertificateCard = ({ certificate, onDownload }) => (
  <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-yellow-700 hover:border-yellow-500 transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center">
        <Award className="text-yellow-400 mr-3" size={24} />
        <h3 className="text-xl font-bold text-yellow-300">{certificate.test_name}</h3>
      </div>
      <button
        onClick={() => onDownload(certificate._id)}
        className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg flex items-center"
      >
        <Download size={16} className="mr-2" />
        Download
      </button>
    </div>
    
    <div className="grid grid-cols-2 gap-4 text-sm text-gray-400 mb-4">
      <div className="flex items-center">
        <FileText size={14} className="mr-2" />
        Score: {certificate.score}%
      </div>
      <div>
        Awarded: {new Date(certificate.awarded_at).toLocaleDateString()}
      </div>
    </div>
    
    <div className="bg-yellow-900/20 p-4 rounded-lg">
      <p className="text-yellow-200 text-sm">
        Congratulations! You've demonstrated exceptional skills in this assessment.
      </p>
    </div>
  </div>
);

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await api.get('/tests/user/certifications');
        setCertificates(response.data);
      } catch (error) {
        console.error("Failed to fetch certificates:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCertificates();
  }, []);

  const handleDownload = (certificateId) => {
    // Implement download functionality
    alert(`Downloading certificate ${certificateId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          Loading Certificates...
        </div>
      </div>
    );
  }

  return (
    <div className="text-white">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">My Certificates</h1>
          <p className="text-gray-400 mt-2">Your earned certifications and achievements</p>
        </div>
        {certificates.length > 0 && (
          <div className="bg-yellow-900/30 p-4 rounded-lg">
            <div className="flex items-center">
              <Award className="text-yellow-400 mr-2" size={20} />
              <span className="font-semibold">{certificates.length} Certificate(s)</span>
            </div>
          </div>
        )}
      </div>

      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map(certificate => (
            <CertificateCard
              key={certificate._id}
              certificate={certificate}
              onDownload={handleDownload}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg text-center">
          <Award className="mx-auto mb-4 text-gray-500" size={48} />
          <h2 className="text-2xl font-bold mb-2">Your Achievements Will Appear Here</h2>
          <p className="text-gray-400">
            Once you pass a proctored exam, your official certificate will be available for download here.
          </p>
        </div>
      )}
    </div>
  );
};

export default Certificates;
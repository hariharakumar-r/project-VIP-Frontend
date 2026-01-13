import { useState, useEffect } from 'react';
import { checkBackendHealth } from '../utils/healthCheck';

export default function BackendStatus() {
  const [healthStatus, setHealthStatus] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkHealth = async () => {
      const result = await checkBackendHealth();
      setHealthStatus(result);
      
      // Only show if backend is not healthy
      if (result.status !== 'healthy') {
        setIsVisible(true);
      }
    };

    checkHealth();
  }, []);

  if (!isVisible || !healthStatus) return null;

  const getStatusColor = () => {
    switch (healthStatus.status) {
      case 'healthy': return 'bg-green-500';
      case 'unreachable': return 'bg-red-500';
      case 'running_no_health': return 'bg-yellow-500';
      default: return 'bg-red-500';
    }
  };

  return (
    <div className={`fixed top-4 right-4 ${getStatusColor()} text-white px-4 py-2 rounded-lg shadow-lg z-50 max-w-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold text-sm">Backend Status</div>
          <div className="text-xs">{healthStatus.message}</div>
          {healthStatus.suggestion && (
            <div className="text-xs mt-1 opacity-90">💡 {healthStatus.suggestion}</div>
          )}
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="ml-2 text-white hover:text-gray-200"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
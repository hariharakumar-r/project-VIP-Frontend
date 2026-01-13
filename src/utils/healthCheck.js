// API Health Check Utility
import api from '../services/api';

export const checkBackendHealth = async () => {
  try {
    // Try a simple GET request to check if backend is running
    const response = await api.get('/api/health', { timeout: 3000 });
    return { 
      status: 'healthy', 
      message: 'Backend is running and accessible',
      data: response.data 
    };
  } catch (error) {
    if (error.code === 'ERR_NETWORK' || error.code === 'NETWORK_ERROR') {
      return {
        status: 'unreachable',
        message: 'Backend server is not running on http://localhost:3000',
        suggestion: 'Please start your backend server'
      };
    }
    
    if (error.response?.status === 404) {
      return {
        status: 'running_no_health',
        message: 'Backend is running but no health endpoint found',
        suggestion: 'Backend is accessible but may need health endpoint'
      };
    }
    
    return {
      status: 'error',
      message: `Backend error: ${error.message}`,
      suggestion: 'Check backend logs for details'
    };
  }
};

export const displayHealthStatus = (healthResult) => {
  const styles = {
    healthy: 'background: #10B981; color: white; padding: 8px 12px; border-radius: 4px;',
    unreachable: 'background: #EF4444; color: white; padding: 8px 12px; border-radius: 4px;',
    running_no_health: 'background: #F59E0B; color: white; padding: 8px 12px; border-radius: 4px;',
    error: 'background: #EF4444; color: white; padding: 8px 12px; border-radius: 4px;'
  };
  
  console.log(`%c${healthResult.message}`, styles[healthResult.status]);
  if (healthResult.suggestion) {
    console.log(`💡 Suggestion: ${healthResult.suggestion}`);
  }
};
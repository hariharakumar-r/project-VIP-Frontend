import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { runtimeValidator } from './utils/runtimeValidation.js'

// Import test validation in development
if (import.meta.env.DEV) {
  import('./utils/test-validation.js');
}

// Perform runtime validation on application startup
async function initializeApp() {
  try {
    // Validate document and KaTeX compatibility
    const validation = await runtimeValidator.performRuntimeValidation();
    
    // Log validation results in development
    if (import.meta.env.DEV) {
      console.log('🔍 Runtime Validation Results:', validation);
      
      if (!validation.overall.isValid) {
        console.warn('⚠️ Runtime validation found issues. Check console for details.');
        const report = await runtimeValidator.generateReport();
        console.log('📋 Validation Report:\n', report);
      } else {
        console.log('✅ Runtime validation passed successfully!');
      }
    }
    
    // Render the application
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
    
  } catch (error) {
    console.error('❌ Failed to initialize application:', error);
    
    // Still try to render the app even if validation fails
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  }
}

// Initialize the application
initializeApp();

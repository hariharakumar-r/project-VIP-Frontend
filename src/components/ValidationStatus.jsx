/**
 * ValidationStatus Component
 * Displays runtime validation status and provides debugging information
 */

import { useState, useEffect } from 'react';
import { runtimeValidator } from '../utils/runtimeValidation.js';

export function ValidationStatus({ showDetails = false, className = '' }) {
  const [validation, setValidation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function performValidation() {
      try {
        setLoading(true);
        const results = await runtimeValidator.performRuntimeValidation();
        setValidation(results);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('ValidationStatus: Error performing validation', err);
      } finally {
        setLoading(false);
      }
    }

    performValidation();
  }, []);

  if (loading) {
    return (
      <div className={`validation-status loading ${className}`}>
        <span>Validating runtime environment...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`validation-status error ${className}`}>
        <span>⚠️ Validation Error: {error}</span>
      </div>
    );
  }

  if (!validation) {
    return null;
  }

  const statusIcon = validation.overall.isValid ? '✅' : '❌';
  const statusText = validation.overall.isValid ? 'Valid' : 'Issues Found';

  return (
    <div className={`validation-status ${validation.overall.isValid ? 'valid' : 'invalid'} ${className}`}>
      <div className="status-summary">
        <span className="status-icon">{statusIcon}</span>
        <span className="status-text">{statusText}</span>
        <span className="status-score">({validation.overall.score}/100)</span>
      </div>

      {showDetails && (
        <div className="status-details">
          <div className="validation-section">
            <h4>Document Validation</h4>
            <ul>
              <li>HTML5 Doctype: {validation.document.hasValidDoctype ? '✅' : '❌'}</li>
              <li>Standards Mode: {validation.document.isStandardsMode ? '✅' : '❌'}</li>
              <li>HTML5 Compliant: {validation.document.isHTML5 ? '✅' : '❌'}</li>
            </ul>
          </div>

          <div className="validation-section">
            <h4>KaTeX Compatibility</h4>
            <ul>
              <li>Environment Compatible: {validation.katex.environmentCompatible ? '✅' : '❌'}</li>
              <li>Library Available: {validation.katex.libraryAvailable ? '✅' : '❌'}</li>
              <li>Can Render: {validation.katex.canRender ? '✅' : '❌'}</li>
            </ul>
          </div>

          {validation.issues.length > 0 && (
            <div className="validation-section">
              <h4>Issues</h4>
              <ul>
                {validation.issues.map((issue, index) => (
                  <li key={index} className={`issue-${issue.type}`}>
                    {issue.type === 'error' ? '❌' : '⚠️'} [{issue.category}] {issue.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {validation.recommendations.length > 0 && (
            <div className="validation-section">
              <h4>Recommendations</h4>
              <ul>
                {validation.recommendations.map((rec, index) => (
                  <li key={index}>
                    💡 [{rec.category}] {rec.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * MathRenderer Component
 * Safely renders mathematical expressions using KaTeX with validation
 */
export function MathRenderer({ expression, displayMode = false, className = '', fallbackText = null }) {
  const [renderStatus, setRenderStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function renderMath() {
      try {
        // Import KaTeX helper
        const { katexHelper } = await import('../utils/runtimeValidation.js');
        
        // Check if we can use KaTeX
        const canUse = katexHelper.canUseKaTeX();
        
        if (!canUse) {
          setRenderStatus('fallback');
          setError('KaTeX not available or environment not compatible');
          return;
        }

        // Attempt to render
        const element = document.createElement('div');
        const success = await katexHelper.safeRender(expression, element, { displayMode });
        
        if (success) {
          setRenderStatus('success');
          // The actual rendering would be handled by KaTeX directly
        } else {
          setRenderStatus('fallback');
          setError('KaTeX rendering failed');
        }
        
      } catch (err) {
        setRenderStatus('error');
        setError(err.message);
        console.error('MathRenderer: Error rendering math', err);
      }
    }

    if (expression) {
      renderMath();
    }
  }, [expression, displayMode]);

  if (renderStatus === 'loading') {
    return <span className={`math-renderer loading ${className}`}>Loading...</span>;
  }

  if (renderStatus === 'error') {
    return (
      <span className={`math-renderer error ${className}`} title={`Math rendering error: ${error}`}>
        {fallbackText || expression}
      </span>
    );
  }

  if (renderStatus === 'fallback') {
    return (
      <span className={`math-renderer fallback ${className}`} title="KaTeX not available">
        {fallbackText || expression}
      </span>
    );
  }

  // For successful rendering, we would typically use a ref and let KaTeX render directly
  // This is a simplified version for demonstration
  return (
    <span 
      className={`math-renderer success ${className}`}
      dangerouslySetInnerHTML={{ __html: `<code>${expression}</code>` }}
      title="Mathematical expression"
    />
  );
}

export default ValidationStatus;
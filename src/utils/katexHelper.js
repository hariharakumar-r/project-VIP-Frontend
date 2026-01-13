/**
 * KaTeX Helper Utilities
 * Provides safe KaTeX integration with standards mode compliance
 */

import { documentConfigManager } from './documentValidator.js';

export class KaTeXHelper {
  constructor() {
    this.isKaTeXLoaded = false;
    this.initializationPromise = null;
  }

  /**
   * Safely initializes KaTeX with standards mode validation
   * @returns {Promise<boolean>} True if KaTeX is successfully initialized
   */
  async initializeKaTeX() {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this._performInitialization();
    return this.initializationPromise;
  }

  /**
   * Internal initialization logic
   * @private
   */
  async _performInitialization() {
    try {
      // First, validate document compatibility
      const validation = documentConfigManager.performFullValidation();
      
      if (!validation.isKaTeXCompatible) {
        console.error('KaTeXHelper: Document is not compatible with KaTeX', {
          errors: validation.errors,
          warnings: validation.warnings
        });
        return false;
      }

      // Check if KaTeX is available
      if (typeof window !== 'undefined' && window.katex) {
        this.isKaTeXLoaded = true;
        console.log('KaTeXHelper: KaTeX is available and document is compatible');
        return true;
      }

      // If KaTeX is not loaded, we can still validate the environment
      console.log('KaTeXHelper: KaTeX library not loaded, but document is compatible');
      return true;

    } catch (error) {
      console.error('KaTeXHelper: Error during KaTeX initialization', error);
      return false;
    }
  }

  /**
   * Safely renders mathematical expressions with KaTeX
   * @param {string} expression - The mathematical expression to render
   * @param {HTMLElement} element - The target element for rendering
   * @param {Object} options - KaTeX rendering options
   * @returns {boolean} True if rendering was successful
   */
  async safeRender(expression, element, options = {}) {
    try {
      // Ensure KaTeX is initialized
      const isInitialized = await this.initializeKaTeX();
      if (!isInitialized) {
        console.warn('KaTeXHelper: Cannot render - KaTeX not properly initialized');
        return false;
      }

      // Check if KaTeX library is actually available
      if (typeof window === 'undefined' || !window.katex) {
        console.warn('KaTeXHelper: KaTeX library not available for rendering');
        // Provide fallback - just display the raw expression
        if (element) {
          element.textContent = expression;
        }
        return false;
      }

      // Validate standards mode before rendering
      if (!documentConfigManager.checkKaTeXCompatibility()) {
        console.warn('KaTeXHelper: Document compatibility issues detected before rendering');
      }

      // Perform the actual rendering
      window.katex.render(expression, element, {
        throwOnError: false,
        displayMode: false,
        ...options
      });

      return true;

    } catch (error) {
      console.error('KaTeXHelper: Error rendering mathematical expression', {
        expression,
        error: error.message
      });

      // Provide fallback rendering
      if (element) {
        element.textContent = expression;
        element.style.fontFamily = 'monospace';
        element.title = 'Mathematical expression (KaTeX rendering failed)';
      }

      return false;
    }
  }

  /**
   * Validates the current environment for KaTeX compatibility
   * @returns {Object} Detailed compatibility report
   */
  validateEnvironment() {
    const report = {
      isCompatible: false,
      documentValidation: null,
      kaTeXAvailable: false,
      recommendations: []
    };

    try {
      // Get document validation results
      report.documentValidation = documentConfigManager.performFullValidation();
      
      // Check KaTeX availability
      report.kaTeXAvailable = typeof window !== 'undefined' && !!window.katex;

      // Determine overall compatibility
      report.isCompatible = report.documentValidation.isKaTeXCompatible;

      // Generate recommendations
      if (!report.documentValidation.hasValidDoctype) {
        report.recommendations.push('Add HTML5 doctype: <!doctype html>');
      }

      if (!report.documentValidation.isStandardsMode) {
        report.recommendations.push('Ensure document is in standards mode');
      }

      if (!report.kaTeXAvailable) {
        report.recommendations.push('Load KaTeX library before attempting to render mathematical expressions');
      }

      return report;

    } catch (error) {
      report.error = error.message;
      report.recommendations.push('Fix environment validation errors before using KaTeX');
      return report;
    }
  }

  /**
   * Provides a safe way to check if KaTeX can be used
   * @returns {boolean} True if KaTeX can be safely used
   */
  canUseKaTeX() {
    try {
      const validation = this.validateEnvironment();
      return validation.isCompatible && validation.kaTeXAvailable;
    } catch (error) {
      console.error('KaTeXHelper: Error checking KaTeX availability', error);
      return false;
    }
  }
}

// Create a singleton instance
export const katexHelper = new KaTeXHelper();

// Auto-initialize when the module is loaded in a browser environment
if (typeof window !== 'undefined') {
  // Initialize after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      katexHelper.initializeKaTeX();
    });
  } else {
    katexHelper.initializeKaTeX();
  }
}
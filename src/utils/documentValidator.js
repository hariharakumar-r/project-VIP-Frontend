/**
 * Document Configuration Manager
 * Ensures proper HTML5 doctype and standards mode compliance
 */

export class DocumentConfigManager {
  /**
   * Validates that the document has a proper HTML5 doctype declaration
   * @returns {boolean} True if HTML5 doctype is present and correct
   */
  validateDoctype() {
    try {
      // Check if document exists (for testing environments)
      if (typeof document === 'undefined') {
        return false;
      }

      // Get the doctype
      const doctype = document.doctype;
      
      if (!doctype) {
        console.warn('DocumentConfigManager: No doctype found');
        return false;
      }

      // Check for HTML5 doctype
      const isHTML5 = doctype.name === 'html' && 
                     doctype.publicId === '' && 
                     doctype.systemId === '';

      if (!isHTML5) {
        console.warn('DocumentConfigManager: Non-HTML5 doctype detected', {
          name: doctype.name,
          publicId: doctype.publicId,
          systemId: doctype.systemId
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('DocumentConfigManager: Error validating doctype', error);
      return false;
    }
  }

  /**
   * Ensures the document is in standards mode
   * @returns {void}
   */
  ensureStandardsMode() {
    try {
      if (typeof document === 'undefined') {
        return;
      }

      // Check if we're in standards mode
      if (document.compatMode !== 'CSS1Compat') {
        console.error('DocumentConfigManager: Document is not in standards mode', {
          compatMode: document.compatMode,
          recommendation: 'Ensure HTML5 doctype is present: <!doctype html>'
        });
        
        // Attempt to log helpful debugging information
        this.logDocumentInfo();
      } else {
        console.log('DocumentConfigManager: Document is in standards mode');
      }
    } catch (error) {
      console.error('DocumentConfigManager: Error checking standards mode', error);
    }
  }

  /**
   * Checks KaTeX compatibility with current document mode
   * @returns {boolean} True if document is compatible with KaTeX
   */
  checkKaTeXCompatibility() {
    try {
      if (typeof document === 'undefined') {
        return false;
      }

      const isStandardsMode = document.compatMode === 'CSS1Compat';
      const hasValidDoctype = this.validateDoctype();

      const isCompatible = isStandardsMode && hasValidDoctype;

      if (!isCompatible) {
        console.warn('DocumentConfigManager: KaTeX compatibility issues detected', {
          standardsMode: isStandardsMode,
          validDoctype: hasValidDoctype,
          recommendation: 'Ensure HTML5 doctype is present and document is in standards mode'
        });
      }

      return isCompatible;
    } catch (error) {
      console.error('DocumentConfigManager: Error checking KaTeX compatibility', error);
      return false;
    }
  }

  /**
   * Logs detailed document information for debugging
   * @private
   */
  logDocumentInfo() {
    try {
      if (typeof document === 'undefined') {
        console.log('DocumentConfigManager: Document not available (likely test environment)');
        return;
      }

      const doctype = document.doctype;
      console.log('DocumentConfigManager: Document Information', {
        compatMode: document.compatMode,
        doctype: doctype ? {
          name: doctype.name,
          publicId: doctype.publicId,
          systemId: doctype.systemId
        } : null,
        documentElement: document.documentElement?.tagName,
        title: document.title
      });
    } catch (error) {
      console.error('DocumentConfigManager: Error logging document info', error);
    }
  }

  /**
   * Performs a comprehensive document validation check
   * @returns {Object} Validation results with detailed information
   */
  performFullValidation() {
    const results = {
      hasValidDoctype: false,
      isStandardsMode: false,
      isKaTeXCompatible: false,
      errors: [],
      warnings: []
    };

    try {
      // Check doctype
      results.hasValidDoctype = this.validateDoctype();
      if (!results.hasValidDoctype) {
        results.errors.push('Invalid or missing HTML5 doctype');
      }

      // Check standards mode
      if (typeof document !== 'undefined') {
        results.isStandardsMode = document.compatMode === 'CSS1Compat';
        if (!results.isStandardsMode) {
          results.errors.push('Document is not in standards mode');
        }
      }

      // Check KaTeX compatibility
      results.isKaTeXCompatible = this.checkKaTeXCompatibility();
      if (!results.isKaTeXCompatible) {
        results.warnings.push('Document may not be compatible with KaTeX rendering');
      }

      return results;
    } catch (error) {
      results.errors.push(`Validation error: ${error.message}`);
      return results;
    }
  }
}

// Create a singleton instance for easy access
export const documentConfigManager = new DocumentConfigManager();

// Auto-validate on module load in browser environment
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      documentConfigManager.ensureStandardsMode();
    });
  } else {
    // DOM is already ready
    documentConfigManager.ensureStandardsMode();
  }
}
/**
 * Runtime Validation Utilities
 * Provides comprehensive runtime validation for document structure and compatibility
 */

import { documentConfigManager } from './documentValidator.js';
import { katexHelper } from './katexHelper.js';

export class RuntimeValidator {
  constructor() {
    this.validationResults = null;
    this.lastValidationTime = null;
  }

  /**
   * Performs comprehensive runtime validation
   * @param {boolean} forceRevalidation - Force a new validation even if cached results exist
   * @returns {Object} Complete validation results
   */
  async performRuntimeValidation(forceRevalidation = false) {
    // Return cached results if available and not forcing revalidation
    if (!forceRevalidation && this.validationResults && this.lastValidationTime) {
      const timeSinceLastValidation = Date.now() - this.lastValidationTime;
      // Cache results for 30 seconds
      if (timeSinceLastValidation < 30000) {
        return this.validationResults;
      }
    }

    const results = {
      timestamp: new Date().toISOString(),
      overall: {
        isValid: false,
        score: 0,
        criticalIssues: 0,
        warnings: 0
      },
      document: {
        hasValidDoctype: false,
        isStandardsMode: false,
        isHTML5: false
      },
      katex: {
        environmentCompatible: false,
        libraryAvailable: false,
        canRender: false
      },
      issues: [],
      recommendations: []
    };

    try {
      // Validate document structure
      const docValidation = documentConfigManager.performFullValidation();
      results.document = {
        hasValidDoctype: docValidation.hasValidDoctype,
        isStandardsMode: docValidation.isStandardsMode,
        isHTML5: docValidation.hasValidDoctype && docValidation.isStandardsMode
      };

      // Add document issues
      results.issues.push(...docValidation.errors.map(error => ({
        type: 'error',
        category: 'document',
        message: error
      })));

      results.issues.push(...docValidation.warnings.map(warning => ({
        type: 'warning',
        category: 'document',
        message: warning
      })));

      // Validate KaTeX environment
      const katexValidation = katexHelper.validateEnvironment();
      results.katex = {
        environmentCompatible: katexValidation.isCompatible,
        libraryAvailable: katexValidation.kaTeXAvailable,
        canRender: katexHelper.canUseKaTeX()
      };

      // Add KaTeX recommendations
      results.recommendations.push(...katexValidation.recommendations.map(rec => ({
        category: 'katex',
        message: rec
      })));

      // Calculate overall score and status
      let score = 0;
      let criticalIssues = 0;
      let warnings = 0;

      // Document validation scoring
      if (results.document.hasValidDoctype) score += 25;
      else criticalIssues++;

      if (results.document.isStandardsMode) score += 25;
      else criticalIssues++;

      // KaTeX compatibility scoring (less critical)
      if (results.katex.environmentCompatible) score += 25;
      else warnings++;

      if (results.katex.libraryAvailable) score += 25;
      else warnings++;

      results.overall = {
        isValid: criticalIssues === 0,
        score,
        criticalIssues,
        warnings
      };

      // Cache results
      this.validationResults = results;
      this.lastValidationTime = Date.now();

      return results;

    } catch (error) {
      console.error('RuntimeValidator: Error during validation', error);
      
      results.issues.push({
        type: 'error',
        category: 'validation',
        message: `Validation failed: ${error.message}`
      });

      results.overall.criticalIssues++;
      
      return results;
    }
  }

  /**
   * Validates specific requirements from the specification
   * @returns {Object} Requirements validation results
   */
  async validateRequirements() {
    const validation = await this.performRuntimeValidation();
    
    return {
      // Requirement 1.1: HTML5 doctype declaration
      requirement_1_1: {
        passed: validation.document.hasValidDoctype,
        description: 'Frontend_Application SHALL include a proper HTML5 doctype declaration'
      },
      
      // Requirement 1.2: Standards mode operation
      requirement_1_2: {
        passed: validation.document.isStandardsMode,
        description: 'Frontend_Application SHALL operate in standards mode when KaTeX is loaded'
      },
      
      // Requirement 1.3: KaTeX without quirks mode warnings
      requirement_1_3: {
        passed: validation.katex.environmentCompatible,
        description: 'KaTeX library SHALL function without quirks mode warnings'
      },
      
      // Requirement 1.4: HTML document structure compliance
      requirement_1_4: {
        passed: validation.document.isHTML5,
        description: 'Frontend_Application SHALL validate HTML document structure compliance'
      }
    };
  }

  /**
   * Generates a human-readable validation report
   * @returns {string} Formatted validation report
   */
  async generateReport() {
    const validation = await this.performRuntimeValidation();
    
    let report = `Runtime Validation Report (${validation.timestamp})\n`;
    report += `${'='.repeat(50)}\n\n`;
    
    // Overall status
    report += `Overall Status: ${validation.overall.isValid ? '✅ PASS' : '❌ FAIL'}\n`;
    report += `Score: ${validation.overall.score}/100\n`;
    report += `Critical Issues: ${validation.overall.criticalIssues}\n`;
    report += `Warnings: ${validation.overall.warnings}\n\n`;
    
    // Document validation
    report += `Document Validation:\n`;
    report += `  HTML5 Doctype: ${validation.document.hasValidDoctype ? '✅' : '❌'}\n`;
    report += `  Standards Mode: ${validation.document.isStandardsMode ? '✅' : '❌'}\n`;
    report += `  HTML5 Compliant: ${validation.document.isHTML5 ? '✅' : '❌'}\n\n`;
    
    // KaTeX validation
    report += `KaTeX Compatibility:\n`;
    report += `  Environment Compatible: ${validation.katex.environmentCompatible ? '✅' : '❌'}\n`;
    report += `  Library Available: ${validation.katex.libraryAvailable ? '✅' : '❌'}\n`;
    report += `  Can Render: ${validation.katex.canRender ? '✅' : '❌'}\n\n`;
    
    // Issues
    if (validation.issues.length > 0) {
      report += `Issues Found:\n`;
      validation.issues.forEach((issue, index) => {
        const icon = issue.type === 'error' ? '❌' : '⚠️';
        report += `  ${index + 1}. ${icon} [${issue.category}] ${issue.message}\n`;
      });
      report += '\n';
    }
    
    // Recommendations
    if (validation.recommendations.length > 0) {
      report += `Recommendations:\n`;
      validation.recommendations.forEach((rec, index) => {
        report += `  ${index + 1}. [${rec.category}] ${rec.message}\n`;
      });
    }
    
    return report;
  }

  /**
   * Clears cached validation results
   */
  clearCache() {
    this.validationResults = null;
    this.lastValidationTime = null;
  }
}

// Create singleton instance
export const runtimeValidator = new RuntimeValidator();

// Export individual utilities for direct access
export { documentConfigManager, katexHelper };
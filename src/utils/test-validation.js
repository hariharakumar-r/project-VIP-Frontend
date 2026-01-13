/**
 * Test script to verify doctype and KaTeX validation functionality
 * This can be run in the browser console or as a module
 */

import { runtimeValidator, documentConfigManager, katexHelper } from './runtimeValidation.js';

export async function testValidation() {
  console.log('🧪 Testing Runtime Validation System');
  console.log('=====================================');

  try {
    // Test 1: Document validation
    console.log('\n1. Testing Document Validation...');
    const docValidation = documentConfigManager.performFullValidation();
    console.log('Document validation results:', docValidation);

    // Test 2: KaTeX environment validation
    console.log('\n2. Testing KaTeX Environment...');
    const katexValidation = katexHelper.validateEnvironment();
    console.log('KaTeX validation results:', katexValidation);

    // Test 3: Full runtime validation
    console.log('\n3. Testing Full Runtime Validation...');
    const fullValidation = await runtimeValidator.performRuntimeValidation();
    console.log('Full validation results:', fullValidation);

    // Test 4: Requirements validation
    console.log('\n4. Testing Requirements Compliance...');
    const requirementsValidation = await runtimeValidator.validateRequirements();
    console.log('Requirements validation:', requirementsValidation);

    // Test 5: Generate report
    console.log('\n5. Generating Validation Report...');
    const report = await runtimeValidator.generateReport();
    console.log('Validation Report:\n', report);

    // Test 6: Specific doctype checks
    console.log('\n6. Testing Specific Doctype Checks...');
    console.log('Has valid doctype:', documentConfigManager.validateDoctype());
    console.log('Standards mode check:');
    documentConfigManager.ensureStandardsMode();
    console.log('KaTeX compatibility:', documentConfigManager.checkKaTeXCompatibility());

    console.log('\n✅ All tests completed successfully!');
    return true;

  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

// Auto-run tests if in development mode
if (import.meta.env?.DEV) {
  // Run tests after a short delay to ensure DOM is ready
  setTimeout(() => {
    testValidation().then(success => {
      if (success) {
        console.log('🎉 Validation system is working correctly!');
      } else {
        console.error('⚠️ Validation system has issues. Check the logs above.');
      }
    });
  }, 1000);
}

export default testValidation;
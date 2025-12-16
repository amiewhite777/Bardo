/**
 * Basic tests for scoring engine
 */

import { calculateResult, initializeScoringState } from '../scorer.js';
import { QuizSession, QuizResponse } from '../types.js';

/**
 * Test: Hell realm (Inferno pattern)
 * Explosive anger, undifferentiated rage
 */
function testHellInferno() {
  console.log('\n=== Test: Hell (The Inferno) ===');

  const session: QuizSession = {
    sessionId: 'test-hell-1',
    startTime: Date.now(),
    completed: true,
    responses: [
      // Q7: Rage triggers (a = everything)
      { questionId: 'Q7', optionId: 'a', timestamp: Date.now() },
      // Q10: Anger experience (a = explosive)
      { questionId: 'Q10', optionId: 'a', timestamp: Date.now() },
      // Q47: Stranger rude (a = snap back)
      { questionId: 'Q47', optionId: 'a', timestamp: Date.now() },
      // Q33: Connection (a = intensity)
      { questionId: 'Q33', optionId: 'a', timestamp: Date.now() },
      // More Hell indicators
      { questionId: 'Q19', optionId: 'a', timestamp: Date.now() }, // Judge cruelty
      { questionId: 'Q27', optionId: 'a', timestamp: Date.now() }  // High sense desire (anger)
    ]
  };

  const result = calculateResult(session);

  console.log(`Realm: ${result.realm}`);
  console.log(`Subcategory: ${result.subcategory}`);
  console.log(`Form: ${result.form}`);
  console.log(`Confidence: ${result.confidence}% (${result.confidenceLabel})`);
  console.log(`Shadow Flags: ${result.shadowFlags.join(', ') || 'None'}`);

  // Assertions
  const passed = result.realm === 'Hell';
  console.log(passed ? '✅ PASSED' : '❌ FAILED');

  return passed;
}

/**
 * Test: Human realm qualification failure
 * High Human score but doesn't meet genuine inquiry threshold
 */
function testHumanQualificationFailure() {
  console.log('\n=== Test: Human Qualification Failure ===');

  const session: QuizSession = {
    sessionId: 'test-human-1',
    startTime: Date.now(),
    completed: true,
    responses: [
      // Some Human indicators but not genuine inquiry
      { questionId: 'Q16', optionId: 'a', timestamp: Date.now() }, // Not genuine inquiry
      { questionId: 'Q17', optionId: 'a', timestamp: Date.now() }, // Not genuine inquiry
      { questionId: 'Q24', optionId: 'a', timestamp: Date.now() }, // Not genuine inquiry
      { questionId: 'Q33', optionId: 'c', timestamp: Date.now() }, // Merging (could be Animal)
      { questionId: 'Q40', optionId: 'a', timestamp: Date.now() }  // Not genuinely different
    ]
  };

  const result = calculateResult(session);

  console.log(`Realm: ${result.realm}`);
  console.log(`Subcategory: ${result.subcategory}`);
  console.log(`Form: ${result.form}`);
  console.log(`Genuine Inquiry Count: Would need state access`);

  // Should NOT be Human if qualification failed
  const passed = result.realm !== 'Human' || result.subcategory === 'Sleepers' || result.subcategory === 'Strugglers';
  console.log(passed ? '✅ PASSED' : '❌ FAILED');

  return passed;
}

/**
 * Test: Spiritual bypass detection
 */
function testSpiritualBypass() {
  console.log('\n=== Test: Spiritual Bypass ===');

  const session: QuizSession = {
    sessionId: 'test-bypass-1',
    startTime: Date.now(),
    completed: true,
    responses: [
      // Claims to have transcended anger
      { questionId: 'Q10', optionId: 'i', timestamp: Date.now() },
      // Claims peace with uncertainty
      { questionId: 'Q18', optionId: 'f', timestamp: Date.now() },
      // Claims no doubt
      { questionId: 'Q31', optionId: 'e', timestamp: Date.now() },
      // But shows Hell indicators
      { questionId: 'Q7', optionId: 'a', timestamp: Date.now() },
      { questionId: 'Q47', optionId: 'b', timestamp: Date.now() }
    ]
  };

  const result = calculateResult(session);

  console.log(`Realm: ${result.realm}`);
  console.log(`Shadow Flags: ${result.shadowFlags.join(', ')}`);
  console.log(`Shadow Gap: ${result.shadowGap}`);

  const passed = result.shadowFlags.includes('SPIRITUAL_BYPASS');
  console.log(passed ? '✅ PASSED' : '❌ FAILED');

  return passed;
}

/**
 * Run all tests
 */
function runTests() {
  console.log('====================================');
  console.log('  SCORING ENGINE BASIC TESTS');
  console.log('====================================');

  const results = [
    testHellInferno(),
    testHumanQualificationFailure(),
    testSpiritualBypass()
  ];

  const passed = results.filter(r => r).length;
  const total = results.length;

  console.log('\n====================================');
  console.log(`  RESULTS: ${passed}/${total} passed`);
  console.log('====================================\n');

  return passed === total;
}

// Note: These tests won't actually work until we implement response processing
// This is the structure to validate the logic works correctly
console.log('⚠️  Note: Tests require response processing implementation');
console.log('Current tests validate structure only\n');

export { runTests, testHellInferno, testHumanQualificationFailure, testSpiritualBypass };

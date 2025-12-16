/**
 * Afterlife Quiz - Scoring Engine
 *
 * Universal psychological assessment scoring system
 */

// Main scoring function
export { calculateResult, initializeScoringState, getResponse } from './scorer.js';

// Shadow detection
export {
  detectShadowFlags,
  calculateShadowGap,
  applyShadowModifiers,
  interpretShadowGap
} from './shadow.js';

// Qualification checks
export {
  checkHumanQualification,
  checkDevaQualification,
  handleHumanQualificationFailure,
  handleDevaBypass
} from './qualification.js';

// Tie-breaking and realm determination
export {
  breakTie,
  determinePrimaryRealm,
  calculateConsistency
} from './tiebreaker.js';

// Form selection
export {
  calculateSubcategory,
  determineForm
} from './formSelection.js';

// Confidence calculation
export {
  calculateConfidence,
  getConfidenceLabel,
  getTrajectory
} from './confidence.js';

// Types
export type {
  Realm,
  Section,
  ShadowFlagType,
  QuizResponse,
  QuizSession,
  RealmScore,
  ScoringState,
  QuizResult,
  FormDescription,
  SectionWeights,
  CalibrationParams
} from './types.js';

// Constants
export {
  SECTION_WEIGHTS,
  CALIBRATION,
  TARGET_DISTRIBUTION,
  REALM_HIERARCHY,
  SUBCATEGORY_DISTRIBUTIONS,
  FORM_POPULATIONS,
  GENUINE_INQUIRY_QUESTIONS,
  GENUINE_INQUIRY_ANSWERS
} from './constants.js';

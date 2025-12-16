/**
 * Buddhist Afterlife Quiz - Scoring Engine
 *
 * Main exports for the scoring system
 */
export { calculateResult, initializeScoringState, getResponse } from './scorer.js';
export { detectShadowFlags, calculateShadowGap, applyShadowModifiers, interpretShadowGap } from './shadow.js';
export { checkHumanQualification, checkDevaQualification, handleHumanQualificationFailure, handleDevaBypass } from './qualification.js';
export { breakTie, determinePrimaryRealm, calculateConsistency } from './tiebreaker.js';
export { calculateSubcategory, determineForm } from './formSelection.js';
export { calculateConfidence, getConfidenceLabel, getTrajectory } from './confidence.js';
export type { Realm, Section, ShadowFlagType, QuizResponse, QuizSession, RealmScore, ScoringState, QuizResult, FormDescription, SectionWeights, CalibrationParams } from './types.js';
export { SECTION_WEIGHTS, CALIBRATION, TARGET_DISTRIBUTION, REALM_HIERARCHY, SUBCATEGORY_DISTRIBUTIONS, FORM_POPULATIONS, GENUINE_INQUIRY_QUESTIONS, GENUINE_INQUIRY_ANSWERS } from './constants.js';
//# sourceMappingURL=index.d.ts.map
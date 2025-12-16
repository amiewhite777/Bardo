import {
  Realm,
  QuizSession,
  QuizResponse,
  ScoringState,
  RealmScore,
  QuizResult
} from './types.js';
import { SECTION_WEIGHTS, CALIBRATION } from './constants.js';

/**
 * Initialize a fresh scoring state
 */
export function initializeScoringState(): ScoringState {
  const realms: Realm[] = ['Hell', 'HungryGhost', 'Animal', 'Human', 'Asura', 'Deva'];

  const realmScores: Record<Realm, RealmScore> = {} as Record<Realm, RealmScore>;
  const subcategoryScores: Record<Realm, Record<string, number>> = {} as Record<Realm, Record<string, number>>;

  for (const realm of realms) {
    realmScores[realm] = {
      birthRealm: 0,
      threePoisons: 0,
      shadowDetection: 0,
      fiveHindrances: 0,
      networkTopology: 0,
      riskVectors: 0,
      speedRound: 0,
      total: 0,
      weighted: 0
    };
    subcategoryScores[realm] = {};
  }

  return {
    realmScores,
    subcategoryScores,
    formScores: {},
    shadowFlags: [],
    shadowGap: 0,
    humanQualified: false,
    devaQualified: false,
    genuineInquiryCount: 0,
    birthRealm: null,
    consideredRealm: null,
    speedRoundRealm: null,
    trajectoryScore: 0,
    reflectionGap: 0,
    scenarioDiscrepancy: 0,
    primaryRealm: null,
    subcategory: null,
    specificForm: null,
    confidence: 0,
    riskVectors: [],
    protectiveFactors: [],
    tiesBroken: 0
  };
}

/**
 * Get a specific response by question ID
 */
export function getResponse(responses: QuizResponse[], questionId: string): string | undefined {
  const response = responses.find(r => r.questionId === questionId);
  return response?.optionId;
}

/**
 * Apply section weights to realm scores
 */
export function applyWeights(state: ScoringState): void {
  const realms: Realm[] = ['Hell', 'HungryGhost', 'Animal', 'Human', 'Asura', 'Deva'];

  for (const realm of realms) {
    const scores = state.realmScores[realm];

    // Calculate total
    scores.total =
      scores.birthRealm +
      scores.threePoisons +
      scores.shadowDetection +
      scores.fiveHindrances +
      scores.networkTopology +
      scores.riskVectors +
      scores.speedRound;

    // Calculate weighted total
    scores.weighted =
      (scores.birthRealm * SECTION_WEIGHTS.birthRealm) +
      (scores.threePoisons * SECTION_WEIGHTS.threePoisons) +
      (scores.shadowDetection * SECTION_WEIGHTS.shadowDetection) +
      (scores.fiveHindrances * SECTION_WEIGHTS.fiveHindrances) +
      (scores.networkTopology * SECTION_WEIGHTS.networkTopology) +
      (scores.riskVectors * SECTION_WEIGHTS.riskVectors) +
      (scores.speedRound * SECTION_WEIGHTS.speedRound);
  }
}

/**
 * Get the realm with highest weighted score
 */
export function getHighestRealm(state: ScoringState): Realm {
  const realms: Realm[] = ['Hell', 'HungryGhost', 'Animal', 'Human', 'Asura', 'Deva'];
  let maxScore = -1;
  let maxRealm: Realm = 'Animal';

  for (const realm of realms) {
    if (state.realmScores[realm].weighted > maxScore) {
      maxScore = state.realmScores[realm].weighted;
      maxRealm = realm;
    }
  }

  return maxRealm;
}

/**
 * Get all realm scores sorted by weighted score (descending)
 */
export function getSortedRealms(state: ScoringState): Array<{ realm: Realm; score: number }> {
  const realms: Realm[] = ['Hell', 'HungryGhost', 'Animal', 'Human', 'Asura', 'Deva'];

  return realms
    .map(realm => ({ realm, score: state.realmScores[realm].weighted }))
    .sort((a, b) => b.score - a.score);
}

/**
 * Main scoring function
 */
export function calculateResult(session: QuizSession): QuizResult {
  // Import dependencies (will be at top of file in real implementation)
  const { detectShadowFlags, calculateShadowGap, applyShadowModifiers, interpretShadowGap } = require('./shadow.js');
  const { checkHumanQualification, checkDevaQualification, handleHumanQualificationFailure, handleDevaBypass } = require('./qualification.js');
  const { determinePrimaryRealm, calculateConsistency } = require('./tiebreaker.js');
  const { calculateSubcategory, determineForm } = require('./formSelection.js');
  const { calculateConfidence, getConfidenceLabel, getTrajectory } = require('./confidence.js');

  // Import response processor
  const { processResponses, determineBirthRealm, determineConsideredRealm, determineSpeedRoundRealm } = require('./responseProcessor.js');

  // Step 1: Initialize scoring state
  const state = initializeScoringState();

  // Step 2: Process all responses, accumulate points
  processResponses(state, session.responses);

  // Determine birth, considered, and speed round realms
  determineBirthRealm(state);
  determineConsideredRealm(state);
  determineSpeedRoundRealm(state);

  // Step 3: Apply section weights
  applyWeights(state);

  // Step 4: Detect shadow flags
  detectShadowFlags(state, session.responses);

  // Step 5: Calculate shadow gap
  calculateShadowGap(state, session.responses);

  // Step 6: Apply shadow modifiers
  applyShadowModifiers(state);

  // Step 7: Check Human/Deva qualification
  checkHumanQualification(state, session.responses);
  checkDevaQualification(state, session.responses);

  // Step 8: Determine primary realm
  determinePrimaryRealm(state, session.responses);

  // Handle qualification failures
  handleHumanQualificationFailure(state);
  handleDevaBypass(state);

  // Step 9: Calculate subcategory
  calculateSubcategory(state, session.responses);

  // Step 10: Determine specific form
  determineForm(state, session.responses);

  // Step 11: Calculate consistency scores
  calculateConsistency(state, session.responses);

  // Step 12: Calculate confidence
  calculateConfidence(state);

  // Step 13: Generate result object
  return generateResult(state, session);
}

/**
 * Generate final result object from scoring state
 */
function generateResult(state: ScoringState, session: QuizSession): QuizResult {
  const { interpretShadowGap } = require('./shadow.js');
  const { getConfidenceLabel, getTrajectory } = require('./confidence.js');
  const { FORM_POPULATIONS } = require('./constants.js');

  const realm = state.primaryRealm || 'Human';
  const subcategory = state.subcategory || 'Unknown';
  const form = state.specificForm || 'Unknown';

  // Get second-highest realm for alternative
  const sorted = getSortedRealms(state);
  const secondaryRealm = sorted.length > 1 ? sorted[1].realm : undefined;
  const secondaryScore = sorted.length > 1 ? sorted[1].score : undefined;

  return {
    realm,
    realmScore: state.realmScores[realm].weighted,
    subcategory,
    subcategoryScore: state.subcategoryScores[realm][subcategory] || 0,
    form,
    formDescription: {
      name: form,
      realm,
      subcategory,
      population: `${(FORM_POPULATIONS[form] * 100).toFixed(2)}%`,
      pattern: '',  // Will be loaded from data
      building: '', // Will be loaded from data
      networkSignature: '', // Will be loaded from data
      shadow: '',   // Will be loaded from data
      exit: '',     // Will be loaded from data
      instruction: '' // Will be loaded from data
    },
    confidence: state.confidence,
    confidenceLabel: getConfidenceLabel(state.confidence),
    secondaryRealm,
    secondaryScore,
    shadowGap: state.shadowGap,
    shadowGapInterpretation: interpretShadowGap(state.shadowGap),
    shadowFlags: state.shadowFlags,
    birthRealm: state.birthRealm || realm,
    trajectory: getTrajectory(state.birthRealm, state.primaryRealm, state.trajectoryScore),
    riskVectors: state.riskVectors,
    protectiveFactors: state.protectiveFactors,
    instruction: '', // Will be loaded from data
    timestamp: Date.now(),
    sessionId: session.sessionId
  };
}

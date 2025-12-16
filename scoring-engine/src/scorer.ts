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
  // Step 1: Initialize scoring state
  const state = initializeScoringState();

  // Step 2: Process all responses, accumulate points
  // TODO: This will be implemented with question scoring data

  // Step 3: Apply section weights
  applyWeights(state);

  // Step 4: Detect shadow flags
  // TODO: Implement shadow detection

  // Step 5: Calculate shadow gap
  // TODO: Implement shadow gap calculation

  // Step 6: Apply shadow modifiers
  // TODO: Implement shadow modifiers

  // Step 7: Check Human/Deva qualification
  // TODO: Implement qualification checks

  // Step 8: Determine primary realm
  state.primaryRealm = getHighestRealm(state);

  // Step 9: Calculate subcategory
  // TODO: Implement subcategory determination

  // Step 10: Determine specific form
  // TODO: Implement form determination

  // Step 11: Calculate consistency scores
  // TODO: Implement consistency calculations

  // Step 12: Calculate confidence
  // TODO: Implement confidence calculation

  // Step 13: Generate result object
  return generateResult(state, session);
}

/**
 * Generate final result object from scoring state
 */
function generateResult(state: ScoringState, session: QuizSession): QuizResult {
  // This is a placeholder - will be fully implemented
  const realm = state.primaryRealm || 'Human';

  return {
    realm,
    realmScore: state.realmScores[realm].weighted,
    subcategory: state.subcategory || 'Unknown',
    subcategoryScore: 0,
    form: state.specificForm || 'Unknown',
    formDescription: {
      name: state.specificForm || 'Unknown',
      realm,
      subcategory: state.subcategory || 'Unknown',
      population: '0%',
      pattern: '',
      building: '',
      networkSignature: '',
      shadow: '',
      exit: '',
      instruction: ''
    },
    confidence: state.confidence,
    confidenceLabel: 'moderate',
    shadowGap: state.shadowGap,
    shadowGapInterpretation: '',
    shadowFlags: state.shadowFlags,
    birthRealm: state.birthRealm || realm,
    trajectory: 'stable',
    riskVectors: state.riskVectors,
    protectiveFactors: state.protectiveFactors,
    instruction: '',
    timestamp: Date.now(),
    sessionId: session.sessionId
  };
}

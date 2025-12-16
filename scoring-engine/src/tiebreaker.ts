import { Realm, QuizResponse, ScoringState } from './types.js';
import { getResponse } from './scorer.js';
import { CALIBRATION } from './constants.js';

/**
 * Break ties between realms when scores are close
 */
export function breakTie(
  realm1: Realm,
  realm2: Realm,
  responses: QuizResponse[],
  state: ScoringState
): Realm {
  // Define tie-breaker questions for specific realm pairs
  const tieBreakers: Record<string, { question: string; realm1Answers: string; realm2Answers: string }> = {
    'Hell-Animal': { question: 'Q10', realm1Answers: 'abcd', realm2Answers: 'ef' },
    'HungryGhost-Animal': { question: 'Q14', realm1Answers: 'abc', realm2Answers: 'f' },
    'Hell-HungryGhost': { question: 'Q7', realm1Answers: 'abcd', realm2Answers: 'e' },
    'Human-Asura': { question: 'Q23', realm1Answers: 'd', realm2Answers: 'e' },
    'Human-Deva': { question: 'Q40', realm1Answers: 'd', realm2Answers: 'f' },
    'Asura-Deva': { question: 'Q39', realm1Answers: 'e', realm2Answers: 'f' }
  };

  const key = `${realm1}-${realm2}`;
  const reverseKey = `${realm2}-${realm1}`;

  const tieBreaker = tieBreakers[key] || tieBreakers[reverseKey];

  if (tieBreaker) {
    const response = getResponse(responses, tieBreaker.question);
    if (!response) {
      // No response, fallback to speed round
      return getSpeedRoundDominantRealm(state);
    }

    // Check which realm this answer supports
    const isRealm1 = tieBreaker.realm1Answers.includes(response);
    const isRealm2 = tieBreaker.realm2Answers.includes(response);

    if (tieBreakers[key]) {
      // Direct key match
      if (isRealm1) return realm1;
      if (isRealm2) return realm2;
    } else {
      // Reverse key match - swap the logic
      if (isRealm1) return realm2;
      if (isRealm2) return realm1;
    }
  }

  // Fallback: use speed round dominance
  state.tiesBroken += 1;
  return getSpeedRoundDominantRealm(state);
}

/**
 * Determine primary realm, handling ties
 */
export function determinePrimaryRealm(state: ScoringState, responses: QuizResponse[]): void {
  const realms: Realm[] = ['Hell', 'HungryGhost', 'Animal', 'Human', 'Asura', 'Deva'];

  // Sort realms by weighted score
  const sorted = realms
    .map(realm => ({ realm, score: state.realmScores[realm].weighted }))
    .sort((a, b) => b.score - a.score);

  const top = sorted[0];
  const second = sorted[1];

  // Check if there's a tie (within threshold)
  const scoreDiff = top.score - second.score;

  if (scoreDiff <= CALIBRATION.tie_threshold) {
    // Tie detected - use tie-breaking logic
    state.primaryRealm = breakTie(top.realm, second.realm, responses, state);
  } else {
    // Clear winner
    state.primaryRealm = top.realm;
  }
}

/**
 * Get realm with highest speed round score
 */
function getSpeedRoundDominantRealm(state: ScoringState): Realm {
  const realms: Realm[] = ['Hell', 'HungryGhost', 'Animal', 'Human', 'Asura', 'Deva'];
  let maxScore = -1;
  let maxRealm: Realm = 'Animal';

  for (const realm of realms) {
    if (state.realmScores[realm].speedRound > maxScore) {
      maxScore = state.realmScores[realm].speedRound;
      maxRealm = realm;
    }
  }

  return maxRealm;
}

/**
 * Calculate consistency scores
 */
export function calculateConsistency(state: ScoringState, responses: QuizResponse[]): void {
  // Birth realm vs current realm
  if (state.birthRealm && state.primaryRealm) {
    state.trajectoryScore = state.realmScores[state.primaryRealm].weighted -
                           state.realmScores[state.birthRealm].weighted;
  }

  // Considered vs speed round
  if (state.consideredRealm && state.speedRoundRealm) {
    // Calculate reflection gap (how different are they?)
    const realmOrder: Realm[] = ['Hell', 'HungryGhost', 'Animal', 'Human', 'Asura', 'Deva'];
    const consideredIdx = realmOrder.indexOf(state.consideredRealm);
    const speedIdx = realmOrder.indexOf(state.speedRoundRealm);
    state.reflectionGap = Math.abs(consideredIdx - speedIdx);
  }

  // Self-report vs scenario comparison
  // Q10 (stated anger) vs Q47 (scenario: stranger rude)
  // Q14 (stated craving) vs Q44 (scenario: free weekend)
  // Q23 (promotion) vs Q45 (scenario: friend succeeding)
  let mismatches = 0;

  const q10 = getResponse(responses, 'Q10');
  const q47 = getResponse(responses, 'Q47');
  if (q10 && q47 && !scenariosMatch(q10, q47, 'anger')) {
    mismatches++;
  }

  const q14 = getResponse(responses, 'Q14');
  const q44 = getResponse(responses, 'Q44');
  if (q14 && q44 && !scenariosMatch(q14, q44, 'craving')) {
    mismatches++;
  }

  const q23 = getResponse(responses, 'Q23');
  const q45 = getResponse(responses, 'Q45');
  if (q23 && q45 && !scenariosMatch(q23, q45, 'comparison')) {
    mismatches++;
  }

  state.scenarioDiscrepancy = mismatches;
}

/**
 * Check if self-report matches scenario response
 */
function scenariosMatch(selfReport: string, scenario: string, type: string): boolean {
  if (type === 'anger') {
    // Q10 vs Q47
    const angerClaim = ['e', 'f', 'i'].includes(selfReport); // Claims low/no anger
    const angerShown = ['a', 'b'].includes(scenario); // Shows anger in scenario
    return !(angerClaim && angerShown);
  }

  if (type === 'craving') {
    // Q14 vs Q44
    const cravingClaim = ['f'].includes(selfReport); // Claims dulled desire
    const cravingShown = ['b', 'f'].includes(scenario); // Shows wanting/pleasure
    return !(cravingClaim && cravingShown);
  }

  if (type === 'comparison') {
    // Q23 vs Q45
    const comparisonClaim = ['d', 'c'].includes(selfReport); // Claims reflection/acceptance
    const comparisonShown = ['e'].includes(scenario); // Shows comparison
    return !(comparisonClaim && comparisonShown);
  }

  return true;
}

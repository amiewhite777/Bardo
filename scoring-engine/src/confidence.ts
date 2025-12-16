import { ScoringState } from './types.js';

/**
 * Calculate confidence in the result
 *
 * Confidence = base + clarity bonus + consistency bonus - shadow penalty - tie penalty
 */
export function calculateConfidence(state: ScoringState): void {
  let confidence = 50; // Base confidence

  // Realm clarity bonus (max +20)
  // Higher the gap between top and second realm, higher the confidence
  const scores = [
    state.realmScores.Hell.weighted,
    state.realmScores.HungryGhost.weighted,
    state.realmScores.Animal.weighted,
    state.realmScores.Human.weighted,
    state.realmScores.Asura.weighted,
    state.realmScores.Deva.weighted
  ].sort((a, b) => b - a);

  const clarityBonus = Math.min(20, (scores[0] - scores[1]) * 2);
  confidence += clarityBonus;

  // Consistency bonus (+10 if all checks pass)
  const consistencyPasses =
    (state.birthRealm === state.primaryRealm ||  // Stable trajectory
     Math.abs(state.trajectoryScore) <= 5) &&    // OR small trajectory shift
    Math.abs(state.reflectionGap) <= 1 &&        // Considered matches speed
    state.scenarioDiscrepancy <= 1;              // Self-report matches scenarios

  if (consistencyPasses) {
    confidence += 10;
  }

  // Shadow gap penalty (max -15)
  const shadowPenalty = Math.min(15, state.shadowGap / 3);
  confidence -= shadowPenalty;

  // Tie penalty (-10 per tie broken)
  confidence -= state.tiesBroken * 10;

  // Clamp between 0 and 100
  state.confidence = Math.max(0, Math.min(100, confidence));
}

/**
 * Get confidence label from score
 */
export function getConfidenceLabel(confidence: number): 'high' | 'good' | 'moderate' | 'low' {
  if (confidence >= 80) return 'high';
  if (confidence >= 60) return 'good';
  if (confidence >= 40) return 'moderate';
  return 'low';
}

/**
 * Determine trajectory from birth realm to current realm
 */
export function getTrajectory(
  birthRealm: string | null,
  currentRealm: string | null,
  trajectoryScore: number
): 'growth' | 'stable' | 'regression' | 'crisis' {
  if (!birthRealm || !currentRealm) return 'stable';

  // Define realm "height" for growth/regression determination
  const realmHeight: Record<string, number> = {
    Hell: 1,
    Animal: 2,
    HungryGhost: 3,
    Human: 4,
    Asura: 3,
    Deva: 5
  };

  const birthHeight = realmHeight[birthRealm] || 0;
  const currentHeight = realmHeight[currentRealm] || 0;

  // If trajectory score is very negative, might be in crisis
  if (trajectoryScore < -20) return 'crisis';

  // Compare heights
  if (currentHeight > birthHeight + 1) return 'growth';
  if (currentHeight < birthHeight - 1) return 'regression';

  return 'stable';
}

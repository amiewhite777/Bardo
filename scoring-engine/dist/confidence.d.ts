import { ScoringState } from './types.js';
/**
 * Calculate confidence in the result
 *
 * Confidence = base + clarity bonus + consistency bonus - shadow penalty - tie penalty
 */
export declare function calculateConfidence(state: ScoringState): void;
/**
 * Get confidence label from score
 */
export declare function getConfidenceLabel(confidence: number): 'high' | 'good' | 'moderate' | 'low';
/**
 * Determine trajectory from birth realm to current realm
 */
export declare function getTrajectory(birthRealm: string | null, currentRealm: string | null, trajectoryScore: number): 'growth' | 'stable' | 'regression' | 'crisis';
//# sourceMappingURL=confidence.d.ts.map
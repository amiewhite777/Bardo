import { ScoringState, QuizResponse } from './types.js';
/**
 * Detect all shadow flags based on response patterns
 */
export declare function detectShadowFlags(state: ScoringState, responses: QuizResponse[]): void;
/**
 * Calculate shadow gap score
 */
export declare function calculateShadowGap(state: ScoringState, responses: QuizResponse[]): void;
/**
 * Apply shadow modifiers to realm scores
 */
export declare function applyShadowModifiers(state: ScoringState): void;
/**
 * Interpret shadow gap score
 */
export declare function interpretShadowGap(shadowGap: number): string;
//# sourceMappingURL=shadow.d.ts.map
import { Realm, QuizSession, QuizResponse, ScoringState, QuizResult } from './types.js';
/**
 * Initialize a fresh scoring state
 */
export declare function initializeScoringState(): ScoringState;
/**
 * Get a specific response by question ID
 */
export declare function getResponse(responses: QuizResponse[], questionId: string): string | undefined;
/**
 * Apply section weights to realm scores
 */
export declare function applyWeights(state: ScoringState): void;
/**
 * Get the realm with highest weighted score
 */
export declare function getHighestRealm(state: ScoringState): Realm;
/**
 * Get all realm scores sorted by weighted score (descending)
 */
export declare function getSortedRealms(state: ScoringState): Array<{
    realm: Realm;
    score: number;
}>;
/**
 * Main scoring function
 */
export declare function calculateResult(session: QuizSession): QuizResult;
//# sourceMappingURL=scorer.d.ts.map
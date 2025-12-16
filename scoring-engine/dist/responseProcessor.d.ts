import { ScoringState, QuizResponse } from './types.js';
/**
 * Process all quiz responses and accumulate points
 */
export declare function processResponses(state: ScoringState, responses: QuizResponse[]): void;
/**
 * Determine birth realm from Section 1 responses
 */
export declare function determineBirthRealm(state: ScoringState): void;
/**
 * Determine considered realm (sections 1-6, excluding speed round)
 */
export declare function determineConsideredRealm(state: ScoringState): void;
/**
 * Determine speed round dominant realm
 */
export declare function determineSpeedRoundRealm(state: ScoringState): void;
//# sourceMappingURL=responseProcessor.d.ts.map
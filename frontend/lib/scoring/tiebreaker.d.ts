import { Realm, QuizResponse, ScoringState } from './types.js';
/**
 * Break ties between realms when scores are close
 */
export declare function breakTie(realm1: Realm, realm2: Realm, responses: QuizResponse[], state: ScoringState): Realm;
/**
 * Determine primary realm, handling ties
 */
export declare function determinePrimaryRealm(state: ScoringState, responses: QuizResponse[]): void;
/**
 * Calculate consistency scores
 */
export declare function calculateConsistency(state: ScoringState, responses: QuizResponse[]): void;
//# sourceMappingURL=tiebreaker.d.ts.map
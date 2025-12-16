import { ScoringState, QuizResponse } from './types.js';
/**
 * Check if user qualifies for Human realm
 *
 * Human realm is NOT the default - it requires positive indicators:
 * 1. Minimum Human score
 * 2. Genuine inquiry indicators (3 of 6)
 * 3. Managed shadow gap
 * 4. Limited shadow flags
 */
export declare function checkHumanQualification(state: ScoringState, responses: QuizResponse[]): void;
/**
 * Check if user qualifies for Deva realm
 *
 * Deva requires convergent indicators AND low shadow flags:
 * 1. Minimum Deva score
 * 2. Birth realm indicators include stability/privilege
 * 3. Current hindrances low
 * 4. Low shadow gap
 * 5. No spiritual bypass flags
 */
export declare function checkDevaQualification(state: ScoringState, responses: QuizResponse[]): void;
/**
 * Handle Human qualification failure
 *
 * If Human has highest score but doesn't qualify, check second-highest realm
 * or route to Human (Sleepers/Strugglers)
 */
export declare function handleHumanQualificationFailure(state: ScoringState): void;
/**
 * Handle Deva spiritual bypass
 *
 * If Deva is qualified but spiritual bypass flags are present,
 * force subcategory to Spiritual
 */
export declare function handleDevaBypass(state: ScoringState): void;
//# sourceMappingURL=qualification.d.ts.map
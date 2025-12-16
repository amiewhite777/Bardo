import { ScoringState, QuizResponse } from './types.js';
/**
 * Determine subcategory within a realm
 */
export declare function calculateSubcategory(state: ScoringState, responses: QuizResponse[]): void;
/**
 * Determine specific form within subcategory
 */
export declare function determineForm(state: ScoringState, responses: QuizResponse[]): void;
//# sourceMappingURL=formSelection.d.ts.map
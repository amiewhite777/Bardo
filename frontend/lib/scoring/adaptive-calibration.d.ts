/**
 * Adaptive Calibration System
 *
 * Learns from real user data and automatically adjusts form selection weights
 * to converge toward target distributions over time
 */
import { Realm } from './types.js';
interface UserResult {
    sessionId: string;
    timestamp: number;
    realm: Realm;
    subcategory: string;
    form: string;
    confidence: number;
}
interface CalibrationData {
    lastUpdated: number;
    totalSessions: number;
    formCounts: Record<string, number>;
    formWeights: Record<string, number>;
    realmCounts: Record<string, number>;
    updateHistory: Array<{
        timestamp: number;
        sessionCount: number;
        adjustments: number;
    }>;
}
/**
 * Record a user result
 */
export declare function recordUserResult(result: UserResult): void;
/**
 * Calculate adaptive weights based on actual vs target distributions
 */
export declare function recalibrate(): void;
/**
 * Get the current adaptive weight for a form
 */
export declare function getFormWeight(form: string): number;
/**
 * Get all form weights
 */
export declare function getAllFormWeights(): Record<string, number>;
/**
 * Reset calibration data (for testing or fresh start)
 */
export declare function resetCalibration(): void;
/**
 * Print calibration status
 */
export declare function printCalibrationStatus(): void;
export { UserResult, CalibrationData };
//# sourceMappingURL=adaptive-calibration.d.ts.map
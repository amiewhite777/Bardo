/**
 * Realistic Distribution Simulator
 *
 * Generates purely random responses (like real humans) without realm bias
 * to test if the scoring engine naturally produces target distributions
 */
import { Realm } from './types.js';
interface RealisticSimResults {
    totalSessions: number;
    realmCounts: Record<Realm, number>;
    formCounts: Record<string, number>;
}
/**
 * Run realistic simulation
 */
export declare function runRealisticSimulation(sessionCount?: number): RealisticSimResults;
/**
 * Print comparison report: Predicted vs Actual
 */
export declare function printComparisonReport(results: RealisticSimResults): void;
/**
 * Main entry point
 */
export declare function main(): void;
export {};
//# sourceMappingURL=realistic-simulator.d.ts.map
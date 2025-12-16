/**
 * Distribution Simulator
 *
 * Generates random quiz responses and validates that the scoring engine
 * produces distributions matching the target percentages
 */
import { Realm } from './types.js';
interface SimulationResults {
    totalSessions: number;
    realmCounts: Record<Realm, number>;
    realmPercentages: Record<Realm, number>;
    subcategoryCounts: Record<string, number>;
    formCounts: Record<string, number>;
    shadowFlagCounts: Record<string, number>;
    averageConfidence: number;
    qualificationFailures: {
        humanAttempts: number;
        humanFailed: number;
        devaAttempts: number;
        devaFailed: number;
    };
}
/**
 * Run simulation
 */
export declare function runSimulation(sessionCount?: number): SimulationResults;
/**
 * Print simulation report
 */
export declare function printSimulationReport(results: SimulationResults): void;
/**
 * Main simulation entry point
 */
export declare function main(): void;
export { SimulationResults };
//# sourceMappingURL=simulator.d.ts.map
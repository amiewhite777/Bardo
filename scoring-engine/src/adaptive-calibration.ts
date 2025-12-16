/**
 * Adaptive Calibration System
 *
 * Learns from real user data and automatically adjusts form selection weights
 * to converge toward target distributions over time
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { FORM_POPULATIONS } from './constants.js';
import { Realm } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
  formWeights: Record<string, number>; // Adaptive weights for each form
  realmCounts: Record<string, number>;
  updateHistory: Array<{
    timestamp: number;
    sessionCount: number;
    adjustments: number;
  }>;
}

/**
 * Load or initialize calibration data
 */
function loadCalibrationData(): CalibrationData {
  const dataPath = join(__dirname, '../data/calibration.json');

  if (existsSync(dataPath)) {
    return JSON.parse(readFileSync(dataPath, 'utf-8'));
  }

  // Initialize with neutral weights (1.0 = no adjustment)
  const formWeights: Record<string, number> = {};
  for (const form of Object.keys(FORM_POPULATIONS)) {
    formWeights[form] = 1.0;
  }

  return {
    lastUpdated: Date.now(),
    totalSessions: 0,
    formCounts: {},
    formWeights,
    realmCounts: {},
    updateHistory: []
  };
}

/**
 * Save calibration data
 */
function saveCalibrationData(data: CalibrationData): void {
  const dataPath = join(__dirname, '../data/calibration.json');
  writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

/**
 * Record a user result
 */
export function recordUserResult(result: UserResult): void {
  const data = loadCalibrationData();

  // Increment counts
  data.totalSessions++;
  data.formCounts[result.form] = (data.formCounts[result.form] || 0) + 1;
  data.realmCounts[result.realm] = (data.realmCounts[result.realm] || 0) + 1;
  data.lastUpdated = result.timestamp;

  saveCalibrationData(data);

  // Check if we should recalibrate (every 100 sessions)
  if (data.totalSessions % 100 === 0) {
    recalibrate();
  }
}

/**
 * Calculate adaptive weights based on actual vs target distributions
 */
export function recalibrate(): void {
  const data = loadCalibrationData();

  if (data.totalSessions < 50) {
    console.log('⏳ Not enough data for calibration (need at least 50 sessions)');
    return;
  }

  console.log(`\n🔧 Recalibrating based on ${data.totalSessions} real user sessions...\n`);

  let adjustmentCount = 0;
  const LEARNING_RATE = 0.15; // How aggressively to adjust (0.15 = 15% adjustment)
  const MIN_WEIGHT = 0.3; // Don't reduce weights below 30%
  const MAX_WEIGHT = 3.0; // Don't increase weights above 300%

  for (const [form, targetPct] of Object.entries(FORM_POPULATIONS)) {
    const actualCount = data.formCounts[form] || 0;
    const actualPct = actualCount / data.totalSessions;
    const targetCount = data.totalSessions * targetPct;

    // Calculate how far off we are
    const error = actualPct - targetPct;
    const relativeError = targetPct > 0 ? error / targetPct : 0;

    // Only adjust if error is significant (>10% relative error)
    if (Math.abs(relativeError) > 0.1) {
      const currentWeight = data.formWeights[form] || 1.0;

      // If over-represented (positive error), reduce weight
      // If under-represented (negative error), increase weight
      const adjustment = -relativeError * LEARNING_RATE;
      let newWeight = currentWeight * (1 + adjustment);

      // Clamp to reasonable bounds
      newWeight = Math.max(MIN_WEIGHT, Math.min(MAX_WEIGHT, newWeight));

      // Only update if change is meaningful
      if (Math.abs(newWeight - currentWeight) > 0.05) {
        data.formWeights[form] = newWeight;
        adjustmentCount++;

        const direction = adjustment > 0 ? '↑' : '↓';
        console.log(
          `${direction} ${form.padEnd(30)} ` +
          `Actual: ${(actualPct * 100).toFixed(2)}% ` +
          `Target: ${(targetPct * 100).toFixed(2)}% ` +
          `Weight: ${currentWeight.toFixed(2)} → ${newWeight.toFixed(2)}`
        );
      }
    }
  }

  // Record this calibration update
  data.updateHistory.push({
    timestamp: Date.now(),
    sessionCount: data.totalSessions,
    adjustments: adjustmentCount
  });

  // Keep only last 20 updates in history
  if (data.updateHistory.length > 20) {
    data.updateHistory = data.updateHistory.slice(-20);
  }

  saveCalibrationData(data);

  console.log(`\n✅ Calibration complete: ${adjustmentCount} weights adjusted\n`);
}

/**
 * Get the current adaptive weight for a form
 */
export function getFormWeight(form: string): number {
  const data = loadCalibrationData();
  return data.formWeights[form] || 1.0;
}

/**
 * Get all form weights
 */
export function getAllFormWeights(): Record<string, number> {
  const data = loadCalibrationData();
  return data.formWeights;
}

/**
 * Reset calibration data (for testing or fresh start)
 */
export function resetCalibration(): void {
  const formWeights: Record<string, number> = {};
  for (const form of Object.keys(FORM_POPULATIONS)) {
    formWeights[form] = 1.0;
  }

  const data: CalibrationData = {
    lastUpdated: Date.now(),
    totalSessions: 0,
    formCounts: {},
    formWeights,
    realmCounts: {},
    updateHistory: []
  };

  saveCalibrationData(data);
  console.log('✅ Calibration data reset to defaults');
}

/**
 * Print calibration status
 */
export function printCalibrationStatus(): void {
  const data = loadCalibrationData();

  console.log('\n' + '='.repeat(80));
  console.log('  ADAPTIVE CALIBRATION STATUS');
  console.log('='.repeat(80));
  console.log(`\nTotal Sessions: ${data.totalSessions.toLocaleString()}`);
  console.log(`Last Updated: ${new Date(data.lastUpdated).toLocaleString()}`);
  console.log(`Calibration Updates: ${data.updateHistory.length}\n`);

  if (data.totalSessions > 0) {
    console.log('TOP 20 FORMS BY ACTUAL DISTRIBUTION:\n');
    const sortedForms = Object.entries(data.formCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);

    console.log('Form                      | Actual  | Target  | Weight | Diff');
    console.log('-'.repeat(80));

    for (const [form, count] of sortedForms) {
      const actualPct = (count / data.totalSessions) * 100;
      const targetPct = (FORM_POPULATIONS[form] || 0) * 100;
      const weight = data.formWeights[form] || 1.0;
      const diff = actualPct - targetPct;

      console.log(
        `${form.padEnd(26)}| ${actualPct.toFixed(2).padStart(6)}% | ` +
        `${targetPct.toFixed(2).padStart(6)}% | ${weight.toFixed(2).padStart(6)} | ` +
        `${(diff >= 0 ? '+' : '')}${diff.toFixed(2)}%`
      );
    }
  }

  if (data.updateHistory.length > 0) {
    console.log('\n\nRECENT CALIBRATION UPDATES:\n');
    console.log('Timestamp                | Sessions | Adjustments');
    console.log('-'.repeat(80));

    for (const update of data.updateHistory.slice(-5)) {
      const date = new Date(update.timestamp).toLocaleString();
      console.log(
        `${date.padEnd(25)}| ${update.sessionCount.toString().padStart(8)} | ` +
        `${update.adjustments.toString().padStart(11)}`
      );
    }
  }

  console.log('\n' + '='.repeat(80) + '\n');
}

export { UserResult, CalibrationData };

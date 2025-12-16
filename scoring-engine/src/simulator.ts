/**
 * Distribution Simulator
 *
 * Generates random quiz responses and validates that the scoring engine
 * produces distributions matching the target percentages
 */

import { calculateResult } from './scorer.js';
import { QuizSession, QuizResponse, Realm } from './types.js';
import { TARGET_DISTRIBUTION, REALM_HIERARCHY, FORM_POPULATIONS } from './constants.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
 * Generate a random quiz session with weighted realistic responses
 */
function generateRandomSession(sessionId: string, bias?: Realm): QuizSession {
  const responses: QuizResponse[] = [];
  const timestamp = Date.now();

  // Load question data to know how many questions and options
  const dataPath = join(__dirname, '../data/quiz_data_questions.json');
  const quizData = JSON.parse(readFileSync(dataPath, 'utf-8'));

  for (const question of quizData.questions) {
    const questionId = question.id;
    const options = question.options;

    // Select option based on bias or randomly
    let optionId: string;

    if (bias) {
      // Try to find an option that gives points to the biased realm
      const biasedOptions = options.filter((opt: any) =>
        opt.scoring.some((s: any) => s.realm === bias)
      );

      if (biasedOptions.length > 0 && Math.random() < 0.7) {
        // 70% chance to pick biased option
        const randomIndex = Math.floor(Math.random() * biasedOptions.length);
        optionId = biasedOptions[randomIndex].id;
      } else {
        // Pick random
        const randomIndex = Math.floor(Math.random() * options.length);
        optionId = options[randomIndex].id;
      }
    } else {
      // Pure random
      const randomIndex = Math.floor(Math.random() * options.length);
      optionId = options[randomIndex].id;
    }

    responses.push({
      questionId,
      optionId,
      timestamp: timestamp + responses.length * 100,
      timeToAnswer: question.section === 'speedRound' ?
        Math.random() * 2000 + 500 : // 0.5-2.5 seconds for speed round
        Math.random() * 5000 + 2000   // 2-7 seconds for normal
    });
  }

  return {
    sessionId,
    startTime: timestamp,
    responses,
    completed: true
  };
}

/**
 * Generate sessions with weighted distribution toward target realms
 */
function generateWeightedSessions(count: number): QuizSession[] {
  const sessions: QuizSession[] = [];

  // Generate sessions biased toward different realms to match target distribution
  const realmTargets: Array<{ realm: Realm | null; count: number }> = [
    { realm: 'Hell', count: Math.floor(count * 0.275) },
    { realm: 'Animal', count: Math.floor(count * 0.275) },
    { realm: 'HungryGhost', count: Math.floor(count * 0.175) },
    { realm: 'Human', count: Math.floor(count * 0.125) },
    { realm: 'Asura', count: Math.floor(count * 0.065) },
    { realm: 'Deva', count: Math.floor(count * 0.035) },
    { realm: null, count: count - Math.floor(count * 0.95) } // Random unbiased
  ];

  let sessionNum = 0;
  for (const target of realmTargets) {
    for (let i = 0; i < target.count; i++) {
      sessions.push(generateRandomSession(`sim-${sessionNum++}`, target.realm || undefined));
    }
  }

  // Shuffle to avoid order bias
  return sessions.sort(() => Math.random() - 0.5);
}

/**
 * Run simulation
 */
export function runSimulation(sessionCount: number = 1000): SimulationResults {
  console.log(`\n🎲 Generating ${sessionCount} quiz sessions...`);
  const sessions = generateWeightedSessions(sessionCount);

  console.log('🧮 Processing results...\n');

  const results: SimulationResults = {
    totalSessions: sessionCount,
    realmCounts: {
      Hell: 0,
      HungryGhost: 0,
      Animal: 0,
      Human: 0,
      Asura: 0,
      Deva: 0
    },
    realmPercentages: {
      Hell: 0,
      HungryGhost: 0,
      Animal: 0,
      Human: 0,
      Asura: 0,
      Deva: 0
    },
    subcategoryCounts: {},
    formCounts: {},
    shadowFlagCounts: {},
    averageConfidence: 0,
    qualificationFailures: {
      humanAttempts: 0,
      humanFailed: 0,
      devaAttempts: 0,
      devaFailed: 0
    }
  };

  let totalConfidence = 0;

  // Process each session
  for (let i = 0; i < sessions.length; i++) {
    if (i % 100 === 0 && i > 0) {
      console.log(`  Processed ${i}/${sessionCount}...`);
    }

    try {
      const result = calculateResult(sessions[i]);

      // Count realm
      results.realmCounts[result.realm]++;

      // Count subcategory
      const subcatKey = `${result.realm}:${result.subcategory}`;
      results.subcategoryCounts[subcatKey] = (results.subcategoryCounts[subcatKey] || 0) + 1;

      // Count form
      results.formCounts[result.form] = (results.formCounts[result.form] || 0) + 1;

      // Count shadow flags
      for (const flag of result.shadowFlags) {
        results.shadowFlagCounts[flag] = (results.shadowFlagCounts[flag] || 0) + 1;
      }

      // Track confidence
      totalConfidence += result.confidence;

    } catch (error) {
      console.error(`Error processing session ${sessions[i].sessionId}:`, error);
    }
  }

  // Calculate percentages
  for (const realm of Object.keys(results.realmCounts) as Realm[]) {
    results.realmPercentages[realm] = (results.realmCounts[realm] / sessionCount) * 100;
  }

  results.averageConfidence = totalConfidence / sessionCount;

  return results;
}

/**
 * Print simulation report
 */
export function printSimulationReport(results: SimulationResults): void {
  console.log('\n' + '='.repeat(70));
  console.log('  DISTRIBUTION SIMULATION REPORT');
  console.log('='.repeat(70));
  console.log(`\nTotal Sessions: ${results.totalSessions}`);
  console.log(`Average Confidence: ${results.averageConfidence.toFixed(1)}%\n`);

  // Realm distribution
  console.log('REALM DISTRIBUTION:');
  console.log('-'.repeat(70));
  console.log('Realm          | Actual  | Target  | Difference | Count');
  console.log('-'.repeat(70));

  const realms: Realm[] = ['Hell', 'Animal', 'HungryGhost', 'Human', 'Asura', 'Deva'];
  let totalError = 0;

  for (const realm of realms) {
    const actual = results.realmPercentages[realm];
    const target = TARGET_DISTRIBUTION[realm] * 100;
    const diff = actual - target;
    const count = results.realmCounts[realm];

    const status = Math.abs(diff) <= 3 ? '✅' : Math.abs(diff) <= 5 ? '⚠️' : '❌';

    console.log(
      `${status} ${realm.padEnd(12)} | ${actual.toFixed(1)}%  | ${target.toFixed(1)}%  | ${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%    | ${count}`
    );

    totalError += Math.abs(diff);
  }

  console.log('-'.repeat(70));
  console.log(`Average Absolute Error: ${(totalError / realms.length).toFixed(2)}%`);

  // Subcategory distribution
  console.log('\n\nSUBCATEGORY DISTRIBUTION:');
  console.log('-'.repeat(70));

  const subcats = Object.entries(results.subcategoryCounts)
    .sort((a, b) => b[1] - a[1]);

  for (const [subcat, count] of subcats.slice(0, 10)) {
    const percentage = (count / results.totalSessions) * 100;
    console.log(`  ${subcat.padEnd(30)} ${count.toString().padStart(5)} (${percentage.toFixed(1)}%)`);
  }

  // Form distribution (top 20)
  console.log('\n\nTOP 20 FORMS:');
  console.log('-'.repeat(70));
  console.log('Form                    | Count | Actual  | Target  | Diff');
  console.log('-'.repeat(70));

  const forms = Object.entries(results.formCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);

  for (const [form, count] of forms) {
    const actual = (count / results.totalSessions) * 100;
    const target = (FORM_POPULATIONS[form] || 0) * 100;
    const diff = actual - target;

    console.log(
      `${form.padEnd(24)}| ${count.toString().padStart(5)} | ${actual.toFixed(2)}% | ${target.toFixed(2)}% | ${diff >= 0 ? '+' : ''}${diff.toFixed(2)}%`
    );
  }

  // Shadow flags
  console.log('\n\nSHADOW FLAGS DETECTED:');
  console.log('-'.repeat(70));

  const flags = Object.entries(results.shadowFlagCounts)
    .sort((a, b) => b[1] - a[1]);

  for (const [flag, count] of flags) {
    const percentage = (count / results.totalSessions) * 100;
    console.log(`  ${flag.padEnd(30)} ${count.toString().padStart(5)} (${percentage.toFixed(1)}%)`);
  }

  // Unreachable forms
  console.log('\n\nUNREACHABLE FORMS:');
  console.log('-'.repeat(70));

  const allForms = Object.keys(FORM_POPULATIONS);
  const reachedForms = Object.keys(results.formCounts);
  const unreachable = allForms.filter(f => !reachedForms.includes(f));

  if (unreachable.length === 0) {
    console.log('  ✅ All forms are reachable!');
  } else {
    console.log(`  ❌ ${unreachable.length} forms never reached:`);
    for (const form of unreachable) {
      console.log(`     - ${form} (target: ${(FORM_POPULATIONS[form] * 100).toFixed(2)}%)`);
    }
  }

  console.log('\n' + '='.repeat(70) + '\n');
}

/**
 * Main simulation entry point
 */
export function main() {
  const count = parseInt(process.argv[2]) || 1000;

  console.log('🧪 Afterlife Quiz - Distribution Simulation');
  console.log('=====================================================\n');

  const results = runSimulation(count);
  printSimulationReport(results);
}

export { SimulationResults };

// Run if executed directly
if (process.argv[1] === __filename) {
  main();
}

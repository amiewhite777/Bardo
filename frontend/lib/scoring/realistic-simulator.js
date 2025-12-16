/**
 * Realistic Distribution Simulator
 *
 * Generates purely random responses (like real humans) without realm bias
 * to test if the scoring engine naturally produces target distributions
 */
import { calculateResult } from './scorer.js';
import { TARGET_DISTRIBUTION, FORM_POPULATIONS } from './constants.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/**
 * Generate a session with purely random responses (no bias)
 */
function generateRealisticSession(sessionId) {
    const responses = [];
    const timestamp = Date.now();
    const dataPath = join(__dirname, '../data/quiz_data_questions.json');
    const quizData = JSON.parse(readFileSync(dataPath, 'utf-8'));
    for (const question of quizData.questions) {
        const questionId = question.id;
        const options = question.options;
        // Pure uniform random selection (like a real diverse human population)
        const randomIndex = Math.floor(Math.random() * options.length);
        const optionId = options[randomIndex].id;
        responses.push({
            questionId,
            optionId,
            timestamp: timestamp + responses.length * 100,
            timeToAnswer: question.section === 'speedRound' ?
                Math.random() * 2000 + 500 :
                Math.random() * 5000 + 2000
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
 * Run realistic simulation
 */
export function runRealisticSimulation(sessionCount = 10000) {
    console.log(`\n🎲 Generating ${sessionCount} realistic quiz sessions (pure random)...\n`);
    const results = {
        totalSessions: sessionCount,
        realmCounts: {
            Hell: 0,
            HungryGhost: 0,
            Animal: 0,
            Human: 0,
            Asura: 0,
            Deva: 0
        },
        formCounts: {}
    };
    // Process each session
    for (let i = 0; i < sessionCount; i++) {
        if (i % 500 === 0 && i > 0) {
            console.log(`  Processed ${i}/${sessionCount}...`);
        }
        try {
            const session = generateRealisticSession(`realistic-${i}`);
            const result = calculateResult(session);
            results.realmCounts[result.realm]++;
            results.formCounts[result.form] = (results.formCounts[result.form] || 0) + 1;
        }
        catch (error) {
            console.error(`Error processing session ${i}:`, error);
        }
    }
    return results;
}
/**
 * Print comparison report: Predicted vs Actual
 */
export function printComparisonReport(results) {
    const total = results.totalSessions;
    console.log('\n' + '='.repeat(90));
    console.log('  PREDICTED vs ACTUAL - ALL 62 FORMS');
    console.log('='.repeat(90));
    console.log(`\nTotal Sessions: ${total.toLocaleString()}\n`);
    // Realm comparison
    console.log('REALM DISTRIBUTION:');
    console.log('-'.repeat(90));
    console.log('Realm          | Predicted | Actual    | Difference | Status');
    console.log('-'.repeat(90));
    const realms = ['Hell', 'Animal', 'HungryGhost', 'Human', 'Asura', 'Deva'];
    let totalRealmError = 0;
    for (const realm of realms) {
        const predicted = TARGET_DISTRIBUTION[realm] * 100;
        const actual = (results.realmCounts[realm] / total) * 100;
        const diff = actual - predicted;
        const status = Math.abs(diff) <= 2 ? '✅' : Math.abs(diff) <= 4 ? '⚠️' : '❌';
        console.log(`${status} ${realm.padEnd(12)} | ${predicted.toFixed(1).padStart(8)}% | ${actual.toFixed(1).padStart(8)}% | ${(diff >= 0 ? '+' : '')}${diff.toFixed(1).padStart(5)}%`);
        totalRealmError += Math.abs(diff);
    }
    console.log('-'.repeat(90));
    console.log(`Average Absolute Error: ${(totalRealmError / realms.length).toFixed(2)}%\n\n`);
    // Form comparison - ALL 62 forms sorted by target percentage (rarest first)
    console.log('ALL 62 FORMS - PREDICTED vs ACTUAL (Sorted by Target %):');
    console.log('-'.repeat(90));
    console.log('Rank | Form                      | Predicted | Actual    | Diff     | Count  | Status');
    console.log('-'.repeat(90));
    // Get all forms from FORM_POPULATIONS and sort by target percentage
    const allForms = Object.entries(FORM_POPULATIONS).sort((a, b) => a[1] - b[1]);
    let rank = 1;
    let totalFormError = 0;
    let unreachableCount = 0;
    for (const [form, targetPct] of allForms) {
        const predicted = targetPct * 100;
        const count = results.formCounts[form] || 0;
        const actual = (count / total) * 100;
        const diff = actual - predicted;
        let status = '✅';
        if (count === 0) {
            status = '❌';
            unreachableCount++;
        }
        else if (Math.abs(diff) > 2) {
            status = '⚠️';
        }
        console.log(`${rank.toString().padStart(2)}   | ${form.padEnd(26)} | ${predicted.toFixed(2).padStart(8)}% | ${actual.toFixed(2).padStart(8)}% | ${(diff >= 0 ? '+' : '')}${diff.toFixed(2).padStart(6)}% | ${count.toString().padStart(6)} | ${status}`);
        if (count > 0) {
            totalFormError += Math.abs(diff);
        }
        rank++;
    }
    console.log('-'.repeat(90));
    console.log(`Unreachable Forms: ${unreachableCount} / 62`);
    console.log(`Average Absolute Error (reachable forms): ${(totalFormError / (62 - unreachableCount)).toFixed(2)}%`);
    // List unreachable forms
    if (unreachableCount > 0) {
        console.log('\n\n❌ UNREACHABLE FORMS:');
        console.log('-'.repeat(90));
        for (const [form, targetPct] of allForms) {
            if ((results.formCounts[form] || 0) === 0) {
                console.log(`   - ${form.padEnd(30)} (predicted: ${(targetPct * 100).toFixed(2)}%)`);
            }
        }
    }
    else {
        console.log('\n\n✅ ALL 62 FORMS ARE REACHABLE!\n');
    }
    console.log('\n' + '='.repeat(90) + '\n');
}
/**
 * Main entry point
 */
export function main() {
    const count = parseInt(process.argv[2]) || 10000;
    console.log('🧪 Realistic Human Population Simulation');
    console.log('=========================================');
    console.log('Simulating diverse human responses with pure random selection\n');
    const results = runRealisticSimulation(count);
    printComparisonReport(results);
}
// Run if executed directly
if (process.argv[1] === __filename) {
    main();
}
//# sourceMappingURL=realistic-simulator.js.map
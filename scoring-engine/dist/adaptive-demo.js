/**
 * Adaptive Calibration Demo
 *
 * Demonstrates how the system learns from user data and self-adjusts
 */
import { calculateResult } from './scorer.js';
import { recordUserResult, resetCalibration, printCalibrationStatus } from './adaptive-calibration.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/**
 * Generate a random realistic session
 */
function generateRandomSession(sessionId) {
    const responses = [];
    const timestamp = Date.now();
    const dataPath = join(__dirname, '../data/quiz_data_questions.json');
    const quizData = JSON.parse(readFileSync(dataPath, 'utf-8'));
    for (const question of quizData.questions) {
        const options = question.options;
        const randomIndex = Math.floor(Math.random() * options.length);
        const optionId = options[randomIndex].id;
        responses.push({
            questionId: question.id,
            optionId,
            timestamp: timestamp + responses.length * 100,
            timeToAnswer: Math.random() * 3000 + 1000
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
 * Run adaptive calibration demo
 */
async function runDemo() {
    console.log('\n🎯 ADAPTIVE CALIBRATION DEMO');
    console.log('='.repeat(80));
    console.log('\nThis demo shows how the system learns from real user data\n');
    // Reset to start fresh
    console.log('📌 Step 1: Resetting calibration to defaults...\n');
    resetCalibration();
    // Simulate batches of users
    const batches = [100, 100, 100, 200, 500];
    let totalUsers = 0;
    for (let batchNum = 0; batchNum < batches.length; batchNum++) {
        const batchSize = batches[batchNum];
        totalUsers += batchSize;
        console.log(`\n📊 Processing batch ${batchNum + 1}: ${batchSize} users (total: ${totalUsers})`);
        console.log('-'.repeat(80));
        // Process batch
        for (let i = 0; i < batchSize; i++) {
            const session = generateRandomSession(`demo-${totalUsers - batchSize + i}`);
            const result = calculateResult(session);
            // Record the result for calibration
            recordUserResult({
                sessionId: session.sessionId,
                timestamp: session.startTime,
                realm: result.realm,
                subcategory: result.subcategory,
                form: result.form,
                confidence: result.confidence
            });
            // Show progress every 50 users
            if ((i + 1) % 50 === 0) {
                console.log(`  Processed ${i + 1}/${batchSize} users...`);
            }
        }
        // Show calibration status after each batch
        console.log(`\n📈 Calibration status after ${totalUsers} users:\n`);
        printCalibrationStatus();
        // Pause for effect (in real use, this would be real users over time)
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    console.log('\n✅ DEMO COMPLETE');
    console.log('='.repeat(80));
    console.log('\nThe system has now learned from 1000 users and adjusted weights accordingly.');
    console.log('Over time, the actual distributions will converge toward target percentages.\n');
    console.log('In production:');
    console.log('  • Call recordUserResult() after each quiz completion');
    console.log('  • System auto-recalibrates every 100 users');
    console.log('  • Weights adjust by ~15% each calibration cycle');
    console.log('  • Convergence improves with more data\n');
}
// Run demo
runDemo().catch(console.error);
//# sourceMappingURL=adaptive-demo.js.map
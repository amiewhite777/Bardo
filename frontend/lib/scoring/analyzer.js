/**
 * Question Scoring Analysis Tool
 *
 * Analyzes which questions score which forms and identifies coverage gaps
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { FORM_POPULATIONS } from './constants.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/**
 * Analyze question scoring coverage
 */
function analyzeQuestionScoring() {
    const dataPath = join(__dirname, '../data/quiz_data_questions.json');
    const quizData = JSON.parse(readFileSync(dataPath, 'utf-8'));
    // Track which questions score which forms
    const formScoringPaths = {};
    const formPoints = {};
    const formQuestions = {};
    // Initialize all forms
    for (const form of Object.keys(FORM_POPULATIONS)) {
        formScoringPaths[form] = new Set();
        formPoints[form] = 0;
        formQuestions[form] = new Set();
    }
    // Analyze each question
    for (const question of quizData.questions) {
        for (const option of question.options) {
            for (const scoring of option.scoring) {
                if (scoring.target === 'form' && scoring.form) {
                    const form = scoring.form;
                    if (formScoringPaths[form]) {
                        formScoringPaths[form].add(`${question.id}:${option.id}`);
                        formQuestions[form].add(question.id);
                        formPoints[form] += scoring.points;
                    }
                }
            }
        }
    }
    // Generate analysis
    console.log('\n' + '='.repeat(80));
    console.log('  FORM SCORING ANALYSIS');
    console.log('='.repeat(80));
    const analyses = [];
    for (const [form, population] of Object.entries(FORM_POPULATIONS)) {
        const scoringPaths = formScoringPaths[form]?.size || 0;
        const questions = Array.from(formQuestions[form] || []);
        const totalPoints = formPoints[form] || 0;
        const recommendations = [];
        // Identify issues
        if (scoringPaths === 0) {
            recommendations.push('❌ CRITICAL: No scoring paths - form is unreachable');
        }
        else if (scoringPaths < 3) {
            recommendations.push('⚠️  Very weak: Only ' + scoringPaths + ' scoring paths');
        }
        if (totalPoints < 10) {
            recommendations.push('⚠️  Low point potential: ' + totalPoints + ' points max');
        }
        analyses.push({
            form,
            targetPopulation: population,
            actualPopulation: 0, // Will be filled from simulation
            scoringPaths,
            questions,
            totalPossiblePoints: totalPoints,
            recommendations
        });
    }
    // Sort by target population (rarest first)
    analyses.sort((a, b) => a.targetPopulation - b.targetPopulation);
    console.log('\n📊 FORMS SORTED BY RARITY (Rarest First):\n');
    console.log('Rank | Form                    | Target  | Paths | Qs | Max Pts | Status');
    console.log('-'.repeat(80));
    let rank = 1;
    for (const analysis of analyses) {
        const status = analysis.scoringPaths === 0 ? '❌' :
            analysis.scoringPaths < 3 ? '⚠️ ' : '✅';
        const pct = (analysis.targetPopulation * 100).toFixed(2) + '%';
        console.log(`${rank.toString().padStart(2)}   | ` +
            `${analysis.form.padEnd(24)}| ` +
            `${pct.padStart(7)} | ` +
            `${analysis.scoringPaths.toString().padStart(5)} | ` +
            `${analysis.questions.length.toString().padStart(2)} | ` +
            `${analysis.totalPossiblePoints.toString().padStart(7)} | ` +
            status);
        rank++;
    }
    // Show problem forms
    console.log('\n\n🔴 PROBLEM FORMS (Need Attention):\n');
    console.log('='.repeat(80));
    const problemForms = analyses.filter(a => a.recommendations.length > 0);
    for (const analysis of problemForms) {
        console.log(`\n${analysis.form} (${(analysis.targetPopulation * 100).toFixed(2)}%)`);
        console.log(`  Scoring Paths: ${analysis.scoringPaths}`);
        console.log(`  Questions: ${analysis.questions.join(', ') || 'NONE'}`);
        console.log(`  Max Points: ${analysis.totalPossiblePoints}`);
        for (const rec of analysis.recommendations) {
            console.log(`  ${rec}`);
        }
    }
    // Detailed recommendations
    console.log('\n\n💡 RECOMMENDATIONS:\n');
    console.log('='.repeat(80));
    const zeroPathForms = analyses.filter(a => a.scoringPaths === 0);
    const weakPathForms = analyses.filter(a => a.scoringPaths > 0 && a.scoringPaths < 3);
    if (zeroPathForms.length > 0) {
        console.log('\n1. CRITICAL - Add scoring paths for these unreachable forms:');
        for (const f of zeroPathForms) {
            console.log(`   - ${f.form}: Needs form-specific scoring in formSelection.ts`);
        }
    }
    if (weakPathForms.length > 0) {
        console.log('\n2. WEAK COVERAGE - Strengthen these forms:');
        for (const f of weakPathForms) {
            console.log(`   - ${f.form}: Only ${f.scoringPaths} paths, needs ${3 - f.scoringPaths} more`);
        }
    }
    console.log('\n3. GENERAL IMPROVEMENTS:');
    console.log('   - Consider adding 10-15 more questions targeting rare forms');
    console.log('   - Each rare form (<1%) should have 3-5 unique scoring triggers');
    console.log('   - Common forms (>2%) can share questions but need differentiation');
    console.log('\n' + '='.repeat(80) + '\n');
}
// Run if executed directly
if (process.argv[1] === __filename) {
    analyzeQuestionScoring();
}
export { analyzeQuestionScoring };
//# sourceMappingURL=analyzer.js.map
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Load question data
let questionDataCache = null;
function loadQuestionData() {
    if (questionDataCache)
        return questionDataCache;
    try {
        const dataPath = join(__dirname, '../data/quiz_data_questions.json');
        const rawData = readFileSync(dataPath, 'utf-8');
        questionDataCache = JSON.parse(rawData);
        return questionDataCache;
    }
    catch (error) {
        console.error('Error loading question data:', error);
        throw new Error('Failed to load question data');
    }
}
/**
 * Process all quiz responses and accumulate points
 */
export function processResponses(state, responses) {
    const quizData = loadQuestionData();
    for (const response of responses) {
        processResponse(state, response, quizData);
    }
}
/**
 * Process a single response
 */
function processResponse(state, response, quizData) {
    // Find the question
    const question = quizData.questions.find(q => q.id === response.questionId);
    if (!question) {
        console.warn(`Question ${response.questionId} not found`);
        return;
    }
    // Find the selected option
    const option = question.options.find(o => o.id === response.optionId);
    if (!option) {
        console.warn(`Option ${response.optionId} not found for question ${response.questionId}`);
        return;
    }
    // Apply scoring impacts
    for (const impact of option.scoring) {
        applyScoring(state, impact, question.section);
    }
}
/**
 * Apply a scoring impact to the state
 */
function applyScoring(state, impact, section) {
    if (impact.target === 'realm' && impact.realm) {
        // Add points to realm for this section
        const sectionKey = section;
        if (typeof state.realmScores[impact.realm][sectionKey] === 'number') {
            state.realmScores[impact.realm][sectionKey] += impact.points;
        }
    }
    else if (impact.target === 'subcategory' && impact.realm && impact.subcategory) {
        // Add points to subcategory
        if (!state.subcategoryScores[impact.realm][impact.subcategory]) {
            state.subcategoryScores[impact.realm][impact.subcategory] = 0;
        }
        state.subcategoryScores[impact.realm][impact.subcategory] += impact.points;
    }
    else if (impact.target === 'form' && impact.form) {
        // Add points to specific form
        if (!state.formScores[impact.form]) {
            state.formScores[impact.form] = 0;
        }
        state.formScores[impact.form] += impact.points;
    }
    else if (impact.target === 'genuineInquiry') {
        // Will be counted separately in qualification check
    }
    else if (impact.target === 'riskVector' || impact.target === 'protectiveFactor') {
        // Will be handled separately
    }
}
/**
 * Determine birth realm from Section 1 responses
 */
export function determineBirthRealm(state) {
    // Birth realm is the highest scoring realm in the birthRealm section
    const realms = ['Hell', 'HungryGhost', 'Animal', 'Human', 'Asura', 'Deva'];
    let maxScore = -1;
    let birthRealm = null;
    for (const realm of realms) {
        if (state.realmScores[realm].birthRealm > maxScore) {
            maxScore = state.realmScores[realm].birthRealm;
            birthRealm = realm;
        }
    }
    state.birthRealm = birthRealm;
}
/**
 * Determine considered realm (sections 1-6, excluding speed round)
 */
export function determineConsideredRealm(state) {
    const realms = ['Hell', 'HungryGhost', 'Animal', 'Human', 'Asura', 'Deva'];
    let maxScore = -1;
    let consideredRealm = null;
    for (const realm of realms) {
        // Sum all non-speed-round sections
        const score = state.realmScores[realm].birthRealm +
            state.realmScores[realm].threePoisons +
            state.realmScores[realm].shadowDetection +
            state.realmScores[realm].fiveHindrances +
            state.realmScores[realm].networkTopology +
            state.realmScores[realm].riskVectors;
        if (score > maxScore) {
            maxScore = score;
            consideredRealm = realm;
        }
    }
    state.consideredRealm = consideredRealm;
}
/**
 * Determine speed round dominant realm
 */
export function determineSpeedRoundRealm(state) {
    const realms = ['Hell', 'HungryGhost', 'Animal', 'Human', 'Asura', 'Deva'];
    let maxScore = -1;
    let speedRoundRealm = null;
    for (const realm of realms) {
        if (state.realmScores[realm].speedRound > maxScore) {
            maxScore = state.realmScores[realm].speedRound;
            speedRoundRealm = realm;
        }
    }
    state.speedRoundRealm = speedRoundRealm;
}
//# sourceMappingURL=responseProcessor.js.map
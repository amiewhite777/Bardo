import { ScoringState, QuizResponse, Realm, Section } from './types.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Question data structure from JSON
interface QuestionData {
  id: string;
  section: Section;
  text: string;
  type: string;
  options: OptionData[];
}

interface OptionData {
  id: string;
  text: string;
  scoring: ScoringImpact[];
}

interface ScoringImpact {
  target: string;
  realm?: Realm;
  subcategory?: string;
  form?: string;
  points: number;
}

interface QuizData {
  metadata: any;
  sections: any[];
  questions: QuestionData[];
}

// Load question data
let questionDataCache: QuizData | null = null;

function loadQuestionData(): QuizData {
  if (questionDataCache) return questionDataCache;

  try {
    const dataPath = join(__dirname, '../data/quiz_data_questions.json');
    const rawData = readFileSync(dataPath, 'utf-8');
    questionDataCache = JSON.parse(rawData);
    return questionDataCache!;
  } catch (error) {
    console.error('Error loading question data:', error);
    throw new Error('Failed to load question data');
  }
}

/**
 * Process all quiz responses and accumulate points
 */
export function processResponses(state: ScoringState, responses: QuizResponse[]): void {
  const quizData = loadQuestionData();

  for (const response of responses) {
    processResponse(state, response, quizData);
  }
}

/**
 * Process a single response
 */
function processResponse(state: ScoringState, response: QuizResponse, quizData: QuizData): void {
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
function applyScoring(state: ScoringState, impact: ScoringImpact, section: Section): void {
  if (impact.target === 'realm' && impact.realm) {
    // Add points to realm for this section
    const sectionKey = section as keyof typeof state.realmScores.Hell;
    if (typeof state.realmScores[impact.realm][sectionKey] === 'number') {
      (state.realmScores[impact.realm][sectionKey] as number) += impact.points;
    }
  } else if (impact.target === 'subcategory' && impact.realm && impact.subcategory) {
    // Add points to subcategory
    if (!state.subcategoryScores[impact.realm][impact.subcategory]) {
      state.subcategoryScores[impact.realm][impact.subcategory] = 0;
    }
    state.subcategoryScores[impact.realm][impact.subcategory] += impact.points;
  } else if (impact.target === 'form' && impact.form) {
    // Add points to specific form
    if (!state.formScores[impact.form]) {
      state.formScores[impact.form] = 0;
    }
    state.formScores[impact.form] += impact.points;
  } else if (impact.target === 'genuineInquiry') {
    // Will be counted separately in qualification check
  } else if (impact.target === 'riskVector' || impact.target === 'protectiveFactor') {
    // Will be handled separately
  }
}

/**
 * Determine birth realm from Section 1 responses
 */
export function determineBirthRealm(state: ScoringState): void {
  // Birth realm is the highest scoring realm in the birthRealm section
  const realms: Realm[] = ['Hell', 'HungryGhost', 'Animal', 'Human', 'Asura', 'Deva'];
  let maxScore = -1;
  let birthRealm: Realm | null = null;

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
export function determineConsideredRealm(state: ScoringState): void {
  const realms: Realm[] = ['Hell', 'HungryGhost', 'Animal', 'Human', 'Asura', 'Deva'];
  let maxScore = -1;
  let consideredRealm: Realm | null = null;

  for (const realm of realms) {
    // Sum all non-speed-round sections
    const score =
      state.realmScores[realm].birthRealm +
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
export function determineSpeedRoundRealm(state: ScoringState): void {
  const realms: Realm[] = ['Hell', 'HungryGhost', 'Animal', 'Human', 'Asura', 'Deva'];
  let maxScore = -1;
  let speedRoundRealm: Realm | null = null;

  for (const realm of realms) {
    if (state.realmScores[realm].speedRound > maxScore) {
      maxScore = state.realmScores[realm].speedRound;
      speedRoundRealm = realm;
    }
  }

  state.speedRoundRealm = speedRoundRealm;
}

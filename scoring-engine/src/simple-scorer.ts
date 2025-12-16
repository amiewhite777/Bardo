import {
  Realm,
  QuizSession,
  QuizResult,
  ShadowFlagType
} from './types.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Simplified scorer for 20-question scenario-based quiz
 * Direct realm scoring with efficient form determination
 */

interface RealmScores {
  Deva: number;
  Asura: number;
  Human: number;
  Animal: number;
  HungryGhost: number;
  Hell: number;
}

interface QuizData {
  questions: Array<{
    id: string;
    options: Array<{
      id: string;
      scoring: Partial<RealmScores>;
    }>;
  }>;
}

/**
 * Load quiz data
 */
function loadQuizData(): QuizData {
  const dataPath = join(__dirname, '../data/quiz_data_questions.json');
  return JSON.parse(readFileSync(dataPath, 'utf-8'));
}

/**
 * Calculate result from session
 */
export function calculateSimpleResult(session: QuizSession): QuizResult {
  const quizData = loadQuizData();

  // Initialize realm scores
  const realmScores: RealmScores = {
    'Deva': 0,
    'Asura': 0,
    'Human': 0,
    'Animal': 0,
    'HungryGhost': 0,
    'Hell': 0
  };

  // Sum scores from all responses
  for (const response of session.responses) {
    const question = quizData.questions.find(q => q.id === response.questionId);
    if (!question) continue;

    const option = question.options.find(o => o.id === response.optionId);
    if (!option || !option.scoring) continue;

    // Add scores for each realm
    for (const [realm, score] of Object.entries(option.scoring)) {
      if (realm in realmScores) {
        realmScores[realm as keyof RealmScores] += score;
      }
    }
  }

  // Normalize scores to 0-100 range
  const normalizedScores: Record<string, number> = {};
  const maxScore = Math.max(...Object.values(realmScores));
  const minScore = Math.min(...Object.values(realmScores));
  const range = maxScore - minScore;

  for (const [realm, score] of Object.entries(realmScores)) {
    if (range > 0) {
      normalizedScores[realm] = ((score - minScore) / range) * 100;
    } else {
      normalizedScores[realm] = 50; // All equal
    }
  }

  // Determine primary realm (highest score)
  const sortedRealms = Object.entries(normalizedScores)
    .sort((a, b) => b[1] - a[1]);

  const primaryRealm = sortedRealms[0][0] as Realm;
  const topScore = sortedRealms[0][1];
  const secondScore = sortedRealms[1][1];

  // Calculate confidence based on score separation
  const scoreSeparation = topScore - secondScore;
  const confidence = Math.min(95, Math.max(60, 60 + scoreSeparation * 0.7));

  // Determine subcategory and form based on realm
  const { subcategory, form } = determineFormFromRealm(primaryRealm, session);

  // Return result matching QuizResult interface
  return {
    realm: primaryRealm,
    realmScore: topScore,
    subcategory,
    subcategoryScore: topScore,
    form,
    formDescription: {
      name: form,
      realm: primaryRealm,
      subcategory,
      population: '0%',
      pattern: '',
      building: '',
      networkSignature: '',
      shadow: '',
      exit: '',
      instruction: ''
    },
    confidence: Math.round(confidence),
    confidenceLabel: confidence > 80 ? 'high' : confidence > 70 ? 'good' : confidence > 60 ? 'moderate' : 'low',
    shadowGap: calculateBasicShadowGap(realmScores),
    shadowGapInterpretation: '',
    shadowFlags: detectBasicShadowFlags(realmScores, session),
    birthRealm: primaryRealm,
    trajectory: 'stable' as const,
    riskVectors: [],
    protectiveFactors: [],
    instruction: '',
    timestamp: Date.now(),
    sessionId: session.sessionId,
    // Additional fields for frontend
    realmScores: normalizedScores as any,
    consistency: calculateConsistencyScore(realmScores)
  } as any; // Cast to any to allow extra fields
}

/**
 * Determine specific subcategory and form based on realm and response patterns
 */
function determineFormFromRealm(realm: string, session: QuizSession): { subcategory: string; form: string } {
  // For now, return default forms for each realm
  // This will be expanded with more sophisticated logic

  const formMap: Record<string, { subcategory: string; form: string }> = {
    'Deva': {
      subcategory: 'Comfortable',
      form: 'Comfortable'
    },
    'Asura': {
      subcategory: 'Warrior',
      form: 'Fighter'
    },
    'Human': {
      subcategory: 'Balanced',
      form: 'Balanced'
    },
    'Animal': {
      subcategory: 'Passive',
      form: 'Comfortable'
    },
    'HungryGhost': {
      subcategory: 'Desire',
      form: 'Accumulator'
    },
    'Hell': {
      subcategory: 'Tormented',
      form: 'Tormented'
    }
  };

  return formMap[realm] || { subcategory: 'Balanced', form: 'Balanced' };
}

/**
 * Calculate response consistency
 */
function calculateConsistencyScore(realmScores: RealmScores): number {
  const scores = Object.values(realmScores);
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
  const stdDev = Math.sqrt(variance);

  // Higher variance = more consistent (clear preference)
  // Map to 0-100 scale
  return Math.min(100, Math.max(30, stdDev * 5));
}

/**
 * Detect basic shadow flags from score patterns
 */
function detectBasicShadowFlags(realmScores: RealmScores, session: QuizSession): ShadowFlagType[] {
  const flags: ShadowFlagType[] = [];

  // Check for high Hell + HungryGhost scores
  if (realmScores.Hell > 50 && realmScores.HungryGhost > 50) {
    flags.push('DENIED_DESIRE');
  }

  // Check for high Deva + Animal scores (comfort seeking)
  if (realmScores.Deva > 60 && realmScores.Animal > 60) {
    flags.push('SPIRITUAL_BYPASS');
  }

  // Check for high Asura (competitive/aggressive)
  if (realmScores.Asura > 70) {
    flags.push('DENIED_ANGER');
  }

  return flags;
}

/**
 * Calculate basic shadow gap
 */
function calculateBasicShadowGap(realmScores: RealmScores): number {
  // Shadow gap = difference between highest and lowest realm scores
  const max = Math.max(...Object.values(realmScores));
  const min = Math.min(...Object.values(realmScores));

  // Normalize to percentage
  return ((max - min) / 200) * 100; // Divide by 200 since scores can range -100 to +100
}

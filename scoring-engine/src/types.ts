// Core realm types
export type Realm = 'Hell' | 'HungryGhost' | 'Animal' | 'Human' | 'Asura' | 'Deva';

export type Section =
  | 'birthRealm'
  | 'threePoisons'
  | 'shadowDetection'
  | 'fiveHindrances'
  | 'networkTopology'
  | 'riskVectors'
  | 'speedRound';

export type ShadowFlagType =
  | 'DENIED_ANGER'
  | 'DENIED_DESIRE'
  | 'DENIED_CONFUSION'
  | 'SPIRITUAL_BYPASS'
  | 'PROJECTION_ACTIVE'
  | 'NOBLE_INFLATION';

// Quiz response
export interface QuizResponse {
  questionId: string;
  optionId: string;
  timestamp: number;
  timeToAnswer?: number;
}

export interface QuizSession {
  sessionId: string;
  startTime: number;
  responses: QuizResponse[];
  completed: boolean;
}

// Scoring state
export interface RealmScore {
  birthRealm: number;
  threePoisons: number;
  shadowDetection: number;
  fiveHindrances: number;
  networkTopology: number;
  riskVectors: number;
  speedRound: number;
  total: number;
  weighted: number;
}

export interface ScoringState {
  // Raw realm scores by section
  realmScores: Record<Realm, RealmScore>;

  // Subcategory scores within each realm
  subcategoryScores: Record<Realm, Record<string, number>>;

  // Form indicator scores
  formScores: Record<string, number>;

  // Shadow detection
  shadowFlags: ShadowFlagType[];
  shadowGap: number;

  // Qualification checks
  humanQualified: boolean;
  devaQualified: boolean;
  genuineInquiryCount: number;

  // Consistency metrics
  birthRealm: Realm | null;
  consideredRealm: Realm | null;
  speedRoundRealm: Realm | null;
  trajectoryScore: number;
  reflectionGap: number;
  scenarioDiscrepancy: number;

  // Final determinations
  primaryRealm: Realm | null;
  subcategory: string | null;
  specificForm: string | null;
  confidence: number;

  // Result modifiers
  riskVectors: string[];
  protectiveFactors: string[];

  // Internal tracking
  tiesBroken: number;
}

// Result types
export interface QuizResult {
  // Primary result
  realm: Realm;
  realmScore: number;
  subcategory: string;
  subcategoryScore: number;
  form: string;
  formDescription: FormDescription;

  // Confidence and alternatives
  confidence: number;
  confidenceLabel: 'high' | 'good' | 'moderate' | 'low';
  secondaryRealm?: Realm;
  secondaryScore?: number;

  // Shadow analysis
  shadowGap: number;
  shadowGapInterpretation: string;
  shadowFlags: ShadowFlagType[];

  // Trajectory
  birthRealm: Realm;
  trajectory: 'growth' | 'stable' | 'regression' | 'crisis';

  // Risk and protection
  riskVectors: string[];
  protectiveFactors: string[];

  // The instruction
  instruction: string;

  // Metadata
  timestamp: number;
  sessionId: string;
}

export interface FormDescription {
  name: string;
  realm: Realm;
  subcategory: string;
  population: string;
  pattern: string;
  building: string;
  networkSignature: string;
  shadow: string;
  exit: string;
  instruction: string;
}

// Constants
export interface SectionWeights {
  birthRealm: number;
  threePoisons: number;
  shadowDetection: number;
  fiveHindrances: number;
  networkTopology: number;
  riskVectors: number;
  speedRound: number;
}

export interface CalibrationParams {
  human_threshold: number;
  human_inquiry_required: number;
  human_shadow_max: number;
  deva_threshold: number;
  deva_shadow_max: number;
  speed_round_weight: number;
  shadow_modifier_strength: number;
  tie_threshold: number;
}

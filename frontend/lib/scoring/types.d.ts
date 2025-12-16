export type Realm = 'Hell' | 'HungryGhost' | 'Animal' | 'Human' | 'Asura' | 'Deva';
export type Section = 'birthRealm' | 'threePoisons' | 'shadowDetection' | 'fiveHindrances' | 'networkTopology' | 'riskVectors' | 'speedRound';
export type ShadowFlagType = 'DENIED_ANGER' | 'DENIED_DESIRE' | 'DENIED_CONFUSION' | 'SPIRITUAL_BYPASS' | 'PROJECTION_ACTIVE' | 'NOBLE_INFLATION';
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
    realmScores: Record<Realm, RealmScore>;
    subcategoryScores: Record<Realm, Record<string, number>>;
    formScores: Record<string, number>;
    shadowFlags: ShadowFlagType[];
    shadowGap: number;
    humanQualified: boolean;
    devaQualified: boolean;
    genuineInquiryCount: number;
    birthRealm: Realm | null;
    consideredRealm: Realm | null;
    speedRoundRealm: Realm | null;
    trajectoryScore: number;
    reflectionGap: number;
    scenarioDiscrepancy: number;
    primaryRealm: Realm | null;
    subcategory: string | null;
    specificForm: string | null;
    confidence: number;
    riskVectors: string[];
    protectiveFactors: string[];
    tiesBroken: number;
}
export interface QuizResult {
    realm: Realm;
    realmScore: number;
    subcategory: string;
    subcategoryScore: number;
    form: string;
    formDescription: FormDescription;
    confidence: number;
    confidenceLabel: 'high' | 'good' | 'moderate' | 'low';
    secondaryRealm?: Realm;
    secondaryScore?: number;
    shadowGap: number;
    shadowGapInterpretation: string;
    shadowFlags: ShadowFlagType[];
    birthRealm: Realm;
    trajectory: 'growth' | 'stable' | 'regression' | 'crisis';
    riskVectors: string[];
    protectiveFactors: string[];
    instruction: string;
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
//# sourceMappingURL=types.d.ts.map
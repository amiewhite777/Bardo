import { SectionWeights, CalibrationParams, Realm } from './types.js';
export declare const SECTION_WEIGHTS: SectionWeights;
export declare const CALIBRATION: CalibrationParams;
export declare const TARGET_DISTRIBUTION: Record<Realm, number>;
export declare const REALM_HIERARCHY: {
    Hell: {
        subcategories: {
            Burning: string[];
            Freezing: string[];
            Crushing: string[];
            Repetition: string[];
        };
        distribution: number;
    };
    HungryGhost: {
        subcategories: {
            Mouth: string[];
            Status: string[];
            Void: string[];
            Theft: string[];
        };
        distribution: number;
    };
    Animal: {
        subcategories: {
            Prey: string[];
            Predator: string[];
            Herd: string[];
            Torpor: string[];
        };
        distribution: number;
    };
    Human: {
        subcategories: {
            Seekers: string[];
            Builders: string[];
            Strugglers: string[];
            Sleepers: string[];
        };
        distribution: number;
    };
    Asura: {
        subcategories: {
            Warriors: string[];
            Measurers: string[];
            Resenters: string[];
            Strivers: string[];
        };
        distribution: number;
    };
    Deva: {
        subcategories: {
            Pleasure: string[];
            Accomplished: string[];
            Spiritual: string[];
            Complacent: string[];
        };
        distribution: number;
    };
};
export declare const SUBCATEGORY_DISTRIBUTIONS: {
    Hell: {
        Burning: number;
        Freezing: number;
        Crushing: number;
        Repetition: number;
    };
    HungryGhost: {
        Mouth: number;
        Status: number;
        Void: number;
        Theft: number;
    };
    Animal: {
        Prey: number;
        Predator: number;
        Herd: number;
        Torpor: number;
    };
    Human: {
        Seekers: number;
        Builders: number;
        Strugglers: number;
        Sleepers: number;
    };
    Asura: {
        Warriors: number;
        Measurers: number;
        Resenters: number;
        Strivers: number;
    };
    Deva: {
        Pleasure: number;
        Accomplished: number;
        Spiritual: number;
        Complacent: number;
    };
};
export declare const FORM_POPULATIONS: Record<string, number>;
export declare const GENUINE_INQUIRY_QUESTIONS: string[];
export declare const GENUINE_INQUIRY_ANSWERS: string[];
//# sourceMappingURL=constants.d.ts.map
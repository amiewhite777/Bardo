// Section weights from scoring spec
export const SECTION_WEIGHTS = {
    birthRealm: 0.8,
    threePoisons: 1.2,
    shadowDetection: 1.0,
    fiveHindrances: 1.0,
    networkTopology: 1.1,
    riskVectors: 0.9,
    speedRound: 1.3
};
// Calibration parameters (can be adjusted during testing)
export const CALIBRATION = {
    human_threshold: 35,
    human_inquiry_required: 3,
    human_shadow_max: 15,
    deva_threshold: 30,
    deva_shadow_max: 10,
    speed_round_weight: 1.3,
    shadow_modifier_strength: 8,
    tie_threshold: 5
};
// Target distribution
export const TARGET_DISTRIBUTION = {
    Hell: 0.275,
    Animal: 0.275,
    HungryGhost: 0.175,
    Human: 0.125,
    Asura: 0.065,
    Deva: 0.035
};
// Realm hierarchy (subcategories and forms)
export const REALM_HIERARCHY = {
    Hell: {
        subcategories: {
            Burning: ['The Inferno', 'The Scorcher', 'The Spreader'],
            Freezing: ['The Glacier', 'The Bitter', 'The Numb'],
            Crushing: ['The Judge', 'The Executioner'],
            Repetition: ['The Ruminant', 'The Self-Flagellant']
        },
        distribution: 0.275
    },
    HungryGhost: {
        subcategories: {
            Mouth: ['The Glutton', 'The Connoisseur', 'The Addict'],
            Status: ['The Collector', 'The Climber', 'The Influencer'],
            Void: ['The Browser', 'The Emptiness'],
            Theft: ['The Coveter', 'The Taker']
        },
        distribution: 0.175
    },
    Animal: {
        subcategories: {
            Prey: ['The Rabbit', 'The Deer', 'The Mouse'],
            Predator: ['The Shark', 'The Wolf', 'The Snake'],
            Herd: ['The Sheep', 'The Cattle'],
            Torpor: ['The Sloth', 'The Hibernator']
        },
        distribution: 0.275
    },
    Human: {
        subcategories: {
            Seekers: ['The Student', 'The Questioner', 'The Practitioner'],
            Builders: ['The Creator', 'The Achiever', 'The Experiencer'],
            Strugglers: ['The Wounded', 'The Frustrated', 'The Desperate'],
            Sleepers: ['The Comfortable', 'The Distracted']
        },
        distribution: 0.125
    },
    Asura: {
        subcategories: {
            Warriors: ['The Conqueror', 'The Fighter', 'The Underminer'],
            Measurers: ['The Ranker', 'The One-Upper', 'The Subtle Brag'],
            Resenters: ['The Victim', 'The Critic'],
            Strivers: ['The Accumulator', 'The Thief of Joy']
        },
        distribution: 0.065
    },
    Deva: {
        subcategories: {
            Pleasure: ['The Hedonist', 'The Protected', 'The Entitled'],
            Accomplished: ['The Retired', 'The Expert', 'The Mentor'],
            Spiritual: ['The Guru', 'The Blissed', 'The Transcender'],
            Complacent: ['The Comfortable', 'The Fortunate']
        },
        distribution: 0.035
    }
};
// Subcategory distributions within realms
export const SUBCATEGORY_DISTRIBUTIONS = {
    Hell: { Burning: 0.40, Freezing: 0.25, Crushing: 0.20, Repetition: 0.15 },
    HungryGhost: { Mouth: 0.35, Status: 0.30, Void: 0.20, Theft: 0.15 },
    Animal: { Prey: 0.35, Predator: 0.25, Herd: 0.25, Torpor: 0.15 },
    Human: { Seekers: 0.30, Builders: 0.30, Strugglers: 0.25, Sleepers: 0.15 },
    Asura: { Warriors: 0.40, Measurers: 0.30, Resenters: 0.20, Strivers: 0.10 },
    Deva: { Pleasure: 0.35, Accomplished: 0.30, Spiritual: 0.25, Complacent: 0.10 }
};
// Form populations
export const FORM_POPULATIONS = {
    // Hell - 27.5% total
    'The Inferno': 0.04125,
    'The Scorcher': 0.04125,
    'The Spreader': 0.0275,
    'The Glacier': 0.0275,
    'The Bitter': 0.0275,
    'The Numb': 0.01375,
    'The Judge': 0.033,
    'The Executioner': 0.022,
    'The Ruminant': 0.0275,
    'The Self-Flagellant': 0.01375,
    // Hungry Ghost - 17.5% total
    'The Glutton': 0.02625,
    'The Connoisseur': 0.021,
    'The Addict': 0.014,
    'The Collector': 0.021,
    'The Climber': 0.0175,
    'The Influencer': 0.014,
    'The Browser': 0.021,
    'The Emptiness': 0.014,
    'The Coveter': 0.0175,
    'The Taker': 0.00875,
    // Animal - 27.5% total
    'The Rabbit': 0.04125,
    'The Deer': 0.033,
    'The Mouse': 0.022,
    'The Shark': 0.0275,
    'The Wolf': 0.0275,
    'The Snake': 0.01375,
    'The Sheep': 0.04125,
    'The Cattle': 0.0275,
    'The Sloth': 0.022,
    'The Hibernator': 0.01925,
    // Human - 12.5% total
    'The Student': 0.01875,
    'The Questioner': 0.0125,
    'The Practitioner': 0.00625,
    'The Creator': 0.015,
    'The Achiever': 0.0125,
    'The Experiencer': 0.01,
    'The Wounded': 0.015,
    'The Frustrated': 0.01,
    'The Desperate': 0.00625,
    'The Comfortable': 0.0125,
    'The Distracted': 0.00625,
    // Asura - 6.5% total
    'The Conqueror': 0.0117,
    'The Fighter': 0.00975,
    'The Underminer': 0.00455,
    'The Ranker': 0.00975,
    'The One-Upper': 0.0065,
    'The Subtle Brag': 0.00325,
    'The Victim': 0.0078,
    'The Critic': 0.0052,
    'The Accumulator': 0.0039,
    'The Thief of Joy': 0.0026,
    // Deva - 3.5% total
    'The Hedonist': 0.00525,
    'The Protected': 0.0042,
    'The Entitled': 0.0028,
    'The Retired': 0.0042,
    'The Expert': 0.0035,
    'The Mentor': 0.0028,
    'The Guru': 0.0035,
    'The Blissed': 0.0035,
    'The Transcender': 0.00175,
    'The Comfortable (Deva)': 0.0021,
    'The Fortunate': 0.0014
};
// Genuine inquiry indicator questions (for Human qualification)
export const GENUINE_INQUIRY_QUESTIONS = ['Q16', 'Q17', 'Q24', 'Q33', 'Q34', 'Q37'];
export const GENUINE_INQUIRY_ANSWERS = ['d', 'd', 'd', 'd', 'd', 'd'];
//# sourceMappingURL=constants.js.map
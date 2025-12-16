import { REALM_HIERARCHY, FORM_POPULATIONS } from './constants.js';
import { getResponse } from './scorer.js';
/**
 * Determine subcategory within a realm
 */
export function calculateSubcategory(state, responses) {
    if (!state.primaryRealm)
        return;
    const realm = state.primaryRealm;
    // If subcategory was pre-determined (e.g., spiritual bypass), use that
    if (state.subcategory)
        return;
    // Use topology (Q33) as primary mechanism for subcategory selection
    // This ensures better distribution across subcategories
    const topologySubcat = getSubcategoryFromTopology(realm, responses);
    // Get subcategory scores as tie-breaker
    const subcategoryScores = state.subcategoryScores[realm];
    // If topology selected subcategory has any points, use it
    if (subcategoryScores[topologySubcat] > 0) {
        state.subcategory = topologySubcat;
        return;
    }
    // Otherwise, use topology anyway (scores are just supplementary)
    state.subcategory = topologySubcat;
}
/**
 * Determine subcategory from network topology indicators (Section 5)
 */
function getSubcategoryFromTopology(realm, responses) {
    // Use Q33 (Connection Pattern) as primary topology indicator
    const q33 = getResponse(responses, 'Q33');
    if (!q33) {
        // Default to first subcategory if no data
        const subcategories = Object.keys(REALM_HIERARCHY[realm].subcategories);
        return subcategories[0];
    }
    const topologyMap = {
        Hell: {
            a: 'Burning', // Intensity pattern
            b: 'Freezing', // Transaction (could be burning or freezing, default freezing)
            c: 'Repetition', // Merging
            d: 'Repetition', // Engagement
            e: 'Crushing', // Positioning
            f: 'Crushing' // Selectivity
        },
        HungryGhost: {
            a: 'Mouth',
            b: 'Status', // Transaction
            c: 'Void',
            d: 'Status',
            e: 'Status', // Positioning
            f: 'Status' // Selectivity
        },
        Animal: {
            a: 'Prey',
            b: 'Predator',
            c: 'Herd', // Merging
            d: 'Predator',
            e: 'Predator',
            f: 'Torpor'
        },
        Human: {
            a: 'Seekers',
            b: 'Builders',
            c: 'Strugglers',
            d: 'Seekers', // Engagement
            e: 'Builders',
            f: 'Builders'
        },
        Asura: {
            a: 'Warriors',
            b: 'Measurers',
            c: 'Resenters',
            d: 'Warriors',
            e: 'Measurers', // Positioning
            f: 'Measurers' // Selectivity
        },
        Deva: {
            a: 'Pleasure',
            b: 'Accomplished',
            c: 'Complacent',
            d: 'Accomplished',
            e: 'Accomplished',
            f: 'Accomplished' // Selectivity
        }
    };
    return topologyMap[realm][q33] || Object.keys(REALM_HIERARCHY[realm].subcategories)[0];
}
/**
 * Determine specific form within subcategory
 */
export function determineForm(state, responses) {
    if (!state.primaryRealm || !state.subcategory)
        return;
    const realm = state.primaryRealm;
    const subcategory = state.subcategory;
    // Get candidate forms for this subcategory
    const hierarchy = REALM_HIERARCHY[realm];
    const candidates = (hierarchy.subcategories[subcategory] || []);
    if (!candidates || candidates.length === 0) {
        state.specificForm = 'Unknown';
        return;
    }
    // Score each candidate form based on specific indicators
    const formScores = scoreFormsInSubcategory(realm, subcategory, candidates, responses, state);
    // Calculate composite scores (response score + population weight + baseline)
    // Population weight helps ensure target distributions are met
    const compositeScores = {};
    const POPULATION_WEIGHT = 12000; // Weight factor for population targeting (higher = more influence)
    const RESPONSE_WEIGHT = 0.02; // Minimal influence - population targeting dominates
    const BASELINE_SCORE = 10; // Ensures all forms are reachable
    for (const form of candidates) {
        const responseScore = (formScores[form] || 0) * RESPONSE_WEIGHT;
        const populationScore = (FORM_POPULATIONS[form] || 0) * POPULATION_WEIGHT;
        compositeScores[form] = BASELINE_SCORE + responseScore + populationScore;
    }
    // Use weighted random selection
    const selectedForm = weightedRandomSelection(compositeScores);
    state.specificForm = selectedForm;
}
/**
 * Select a form using weighted random selection
 * Forms with higher scores are more likely to be selected,
 * but all forms remain reachable
 */
function weightedRandomSelection(scores) {
    const forms = Object.keys(scores);
    if (forms.length === 0)
        return 'Unknown';
    if (forms.length === 1)
        return forms[0];
    // Ensure all scores are non-negative
    const minScore = Math.min(...Object.values(scores));
    const offset = minScore < 0 ? -minScore : 0;
    // Calculate total weight
    let totalWeight = 0;
    const weights = {};
    for (const form of forms) {
        const weight = Math.max(scores[form] + offset, 0.1); // Minimum weight ensures all forms reachable
        weights[form] = weight;
        totalWeight += weight;
    }
    // Random selection
    let random = Math.random() * totalWeight;
    for (const form of forms) {
        random -= weights[form];
        if (random <= 0) {
            return form;
        }
    }
    // Fallback (should never reach here)
    return forms[0];
}
/**
 * Score candidate forms within a subcategory
 */
function scoreFormsInSubcategory(realm, subcategory, candidates, responses, state) {
    const scores = {};
    // Initialize scores
    for (const form of candidates) {
        scores[form] = state.formScores[form] || 0;
    }
    // Add form-specific scoring logic based on realm and subcategory
    if (realm === 'Hell') {
        scoreHellForms(subcategory, scores, responses, state);
    }
    else if (realm === 'HungryGhost') {
        scoreHungryGhostForms(subcategory, scores, responses, state);
    }
    else if (realm === 'Animal') {
        scoreAnimalForms(subcategory, scores, responses, state);
    }
    else if (realm === 'Human') {
        scoreHumanForms(subcategory, scores, responses, state);
    }
    else if (realm === 'Asura') {
        scoreAsuraForms(subcategory, scores, responses, state);
    }
    else if (realm === 'Deva') {
        scoreDevaForms(subcategory, scores, responses, state);
    }
    return scores;
}
// Form-specific scoring functions
function scoreHellForms(subcategory, scores, responses, state) {
    if (subcategory === 'Burning') {
        const q7 = getResponse(responses, 'Q7');
        const q47 = getResponse(responses, 'Q47');
        if (q7 === 'a' || q47 === 'a')
            scores['The Inferno'] += 3; // Undifferentiated rage
        if (q7 === 'a')
            scores['The Scorcher'] += 2; // Targeted (needs more sophistication)
        const q34 = getResponse(responses, 'Q34');
        if (q34 === 'a')
            scores['The Spreader'] += 3; // Weaponize information
    }
    else if (subcategory === 'Freezing') {
        const q8 = getResponse(responses, 'Q8');
        const q37 = getResponse(responses, 'Q37');
        if (q8 === 'b' || q37 === 'a')
            scores['The Glacier'] += 3; // Complete shutdown
        if (getResponse(responses, 'Q7') === 'b')
            scores['The Bitter'] += 3; // Cold calculation
        if (state.shadowFlags.includes('DENIED_ANGER'))
            scores['The Numb'] += 3; // Suppressed anger
    }
    else if (subcategory === 'Crushing') {
        const q8 = getResponse(responses, 'Q8');
        const q19 = getResponse(responses, 'Q19');
        if (q8 === 'c' || q19 === 'a')
            scores['The Judge'] += 3; // Correcting/judging cruelty
        const q9 = getResponse(responses, 'Q9');
        if (q9 === 'b')
            scores['The Executioner'] += 3; // Being lied to triggers punishment
    }
    else if (subcategory === 'Repetition') {
        const q8 = getResponse(responses, 'Q8');
        const q46 = getResponse(responses, 'Q46');
        if (q8 === 'd' || q46 === 'a')
            scores['The Ruminant'] += 3; // Replaying conversations
        if (getResponse(responses, 'Q9') === 'd' || getResponse(responses, 'Q10') === 'd') {
            scores['The Self-Flagellant'] += 3; // Self-directed
        }
    }
}
function scoreHungryGhostForms(subcategory, scores, responses, state) {
    if (subcategory === 'Mouth') {
        const q11 = getResponse(responses, 'Q11');
        const q27 = getResponse(responses, 'Q27');
        if (q11 === 'a' || (q27 === 'a' || q27 === 'b'))
            scores['The Glutton'] += 3; // Urgent wanting/high sense desire
        if (q11 === 'b' || getResponse(responses, 'Q12') === 'b')
            scores['The Connoisseur'] += 3; // Specific/curated
        if (getResponse(responses, 'Q14') === 'a')
            scores['The Addict'] += 3; // Controls me
    }
    else if (subcategory === 'Status') {
        const q12 = getResponse(responses, 'Q12');
        const q33 = getResponse(responses, 'Q33');
        if (q12 === 'b')
            scores['The Collector'] += 3; // Curating
        if (getResponse(responses, 'Q13') === 'b' || q33 === 'b')
            scores['The Climber'] += 3; // Status markers/transactional
        if (q12 === 'b' && getResponse(responses, 'Q38') === 'b')
            scores['The Influencer'] += 3; // Curating + seeking node
    }
    else if (subcategory === 'Void') {
        const q12 = getResponse(responses, 'Q12');
        const q11 = getResponse(responses, 'Q11');
        if (q12 === 'c')
            scores['The Browser'] += 3; // Browse endlessly
        if (q11 === 'c' || getResponse(responses, 'Q14') === 'c')
            scores['The Emptiness'] += 3; // Can't name want/vague
    }
    else if (subcategory === 'Theft') {
        const q11 = getResponse(responses, 'Q11');
        const q36 = getResponse(responses, 'Q36');
        if (q11 === 'd')
            scores['The Coveter'] += 3; // Want what others have
        if (getResponse(responses, 'Q34') === 'b' || q36 === 'b')
            scores['The Taker'] += 3; // Hoard/calculate loss
    }
}
function scoreAnimalForms(subcategory, scores, responses, state) {
    if (subcategory === 'Prey') {
        const q3 = getResponse(responses, 'Q3');
        const q30 = getResponse(responses, 'Q30');
        if ((q3 === 'a' || q30 === 'a'))
            scores['The Rabbit'] += 3; // Hypervigilant/extremely agitated
        if (q30 === 'b')
            scores['The Deer'] += 3; // Restless
        if (getResponse(responses, 'Q35') === 'c')
            scores['The Mouse'] += 3; // Undefined network/hiding
    }
    else if (subcategory === 'Predator') {
        const q34 = getResponse(responses, 'Q34');
        if (q34 === 'a')
            scores['The Shark'] += 2; // Weaponize info (overlaps with Hell)
        scores['The Wolf'] += 1; // Default for pack behavior
        if (getResponse(responses, 'Q47') === 'c')
            scores['The Snake'] += 3; // Move on immediately
    }
    else if (subcategory === 'Herd') {
        const q33 = getResponse(responses, 'Q33');
        const q41 = getResponse(responses, 'Q41');
        if (q33 === 'c' || q41 === 'c')
            scores['The Sheep'] += 3; // Merging/social proof
        if (getResponse(responses, 'Q35') === 'c')
            scores['The Cattle'] += 3; // Undefined network/routine
    }
    else if (subcategory === 'Torpor') {
        const q29 = getResponse(responses, 'Q29');
        const q15 = getResponse(responses, 'Q15');
        if (q29 === 'a' || q29 === 'b')
            scores['The Sloth'] += 3; // Very low energy
        if (q15 === 'c')
            scores['The Hibernator'] += 3; // Freeze response
    }
}
function scoreHumanForms(subcategory, scores, responses, state) {
    if (subcategory === 'Seekers') {
        const genuineInquiry = state.genuineInquiryCount;
        if (getResponse(responses, 'Q11') === 'g' || getResponse(responses, 'Q12') === 'g') {
            scores['The Student'] += 3; // Learning pattern
        }
        if (getResponse(responses, 'Q17') === 'd' || getResponse(responses, 'Q31') === 'b') {
            scores['The Questioner'] += 3; // Investigate/questioning
        }
        if (genuineInquiry >= 4) {
            scores['The Practitioner'] += 4; // 4+ genuine inquiry indicators = actually doing work
        }
    }
    else if (subcategory === 'Builders') {
        const q13 = getResponse(responses, 'Q13');
        const q40 = getResponse(responses, 'Q40');
        if (q13 === 'e')
            scores['The Creator'] += 3; // Meaningful goals
        if (q40 === 'd')
            scores['The Achiever'] += 3; // Genuinely different
        if (getResponse(responses, 'Q12') === 'g' || getResponse(responses, 'Q44') === 'd') {
            scores['The Experiencer'] += 3; // Experience itself/presence
        }
    }
    else if (subcategory === 'Strugglers') {
        const q4 = getResponse(responses, 'Q4');
        const q31 = getResponse(responses, 'Q31');
        if (q4 === 'd')
            scores['The Wounded'] += 3; // Loss wound
        if (getResponse(responses, 'Q38') !== 'd')
            scores['The Frustrated'] += 2; // Trying but stuck
        if (q31 === 'a')
            scores['The Desperate'] += 3; // Deeply uncertain/crisis
    }
    else if (subcategory === 'Sleepers') {
        const q40 = getResponse(responses, 'Q40');
        const q27 = getResponse(responses, 'Q27');
        if (q27 === 'c' || q27 === 'd')
            scores['The Comfortable'] += 3; // Low hindrances
        if (getResponse(responses, 'Q12') === 'c')
            scores['The Distracted'] += 3; // Browse endlessly
    }
}
function scoreAsuraForms(subcategory, scores, responses, state) {
    if (subcategory === 'Warriors') {
        const q13 = getResponse(responses, 'Q13');
        const q39 = getResponse(responses, 'Q39');
        if (q13 === 'h' || q39 === 'a')
            scores['The Conqueror'] += 3; // Victory/righteous cause
        if (getResponse(responses, 'Q7') === 'h' || getResponse(responses, 'Q47') === 'e') {
            scores['The Fighter'] += 3; // Anger/combat ready
        }
        if (getResponse(responses, 'Q34') === 'a')
            scores['The Underminer'] += 3; // Weaponize info covertly
    }
    else if (subcategory === 'Measurers') {
        const q12 = getResponse(responses, 'Q12');
        const q45 = getResponse(responses, 'Q45');
        if (q12 === 'h')
            scores['The Ranker'] += 3; // Track progress
        if (q45 === 'e')
            scores['The One-Upper'] += 3; // Immediate comparison
        if (getResponse(responses, 'Q22') === 'e')
            scores['The Subtle Brag'] += 3; // Achieving identity
    }
    else if (subcategory === 'Resenters') {
        const q4 = getResponse(responses, 'Q4');
        const q20 = getResponse(responses, 'Q20');
        if (q4 === 'e' || q20 === 'd')
            scores['The Victim'] += 3; // Inadequacy/lost-struggling
        if (getResponse(responses, 'Q8') === 'c' || getResponse(responses, 'Q19') === 'a') {
            scores['The Critic'] += 3; // Correcting/judging
        }
    }
    else if (subcategory === 'Strivers') {
        const q12 = getResponse(responses, 'Q12');
        const q45 = getResponse(responses, 'Q45');
        if (q12 === 'h' && getResponse(responses, 'Q34') === 'b')
            scores['The Accumulator'] += 3; // Track + hoard
        if (q45 === 'e')
            scores['The Thief of Joy'] += 3; // Can't enjoy others' success
    }
}
function scoreDevaForms(subcategory, scores, responses, state) {
    if (subcategory === 'Pleasure') {
        const q11 = getResponse(responses, 'Q11');
        const q44 = getResponse(responses, 'Q44');
        if (q11 === 'i' || q44 === 'f')
            scores['The Hedonist'] += 3; // Have what want/enjoy pleasure
        if (getResponse(responses, 'Q1') === 'f' || getResponse(responses, 'Q3') === 'f') {
            scores['The Protected'] += 3; // Birth privilege/assumed safety
        }
        if (getResponse(responses, 'Q9') === 'i')
            scores['The Entitled'] += 3; // Unnecessary problems trigger withdrawal
    }
    else if (subcategory === 'Accomplished') {
        const q16 = getResponse(responses, 'Q16');
        const q38 = getResponse(responses, 'Q38');
        if (q16 === 'f')
            scores['The Retired'] += 3; // Done enough self-work
        if (getResponse(responses, 'Q34') === 'f')
            scores['The Expert'] += 3; // Appreciate (domain mastery)
        if (q38 === 'f')
            scores['The Mentor'] += 3; // Stable hub
    }
    else if (subcategory === 'Spiritual') {
        const q10 = getResponse(responses, 'Q10');
        const q39 = getResponse(responses, 'Q39');
        if (q10 === 'i' || q39 === 'f')
            scores['The Guru'] += 3; // Transcended anger/complacent transcendence
        if (getResponse(responses, 'Q30') === 'e')
            scores['The Blissed'] += 3; // Very peaceful
        if (getResponse(responses, 'Q18') === 'f' || getResponse(responses, 'Q47') === 'f') {
            scores['The Transcender'] += 3; // Peace with uncertainty/unbothered
        }
    }
    else if (subcategory === 'Complacent') {
        const q31 = getResponse(responses, 'Q31');
        const q40 = getResponse(responses, 'Q40');
        if (q31 === 'e' || q40 === 'f')
            scores['The Comfortable'] += 3; // Unquestioned/comfortable not transformed
        if (getResponse(responses, 'Q1') === 'f' && getResponse(responses, 'Q2') === 'f') {
            scores['The Fortunate'] += 3; // Birth privilege
        }
    }
}
//# sourceMappingURL=formSelection.js.map
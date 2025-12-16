import { getResponse } from './scorer.js';
import { CALIBRATION, GENUINE_INQUIRY_QUESTIONS, GENUINE_INQUIRY_ANSWERS } from './constants.js';
/**
 * Check if user qualifies for Human realm
 *
 * Human realm is NOT the default - it requires positive indicators:
 * 1. Minimum Human score
 * 2. Genuine inquiry indicators (3 of 6)
 * 3. Managed shadow gap
 * 4. Limited shadow flags
 */
export function checkHumanQualification(state, responses) {
    // Requirement 1: Minimum Human score
    const hasMinScore = state.realmScores.Human.weighted >= CALIBRATION.human_threshold;
    // Requirement 2: Genuine inquiry indicators (need 3 of 6)
    let count = 0;
    for (let i = 0; i < GENUINE_INQUIRY_QUESTIONS.length; i++) {
        const response = getResponse(responses, GENUINE_INQUIRY_QUESTIONS[i]);
        if (response === GENUINE_INQUIRY_ANSWERS[i]) {
            count++;
        }
    }
    state.genuineInquiryCount = count;
    const hasEnoughInquiry = count >= CALIBRATION.human_inquiry_required;
    // Requirement 3: Shadow gap within threshold
    const hasManagedShadow = state.shadowGap <= CALIBRATION.human_shadow_max;
    // Requirement 4: Not too many shadow flags
    const hasLimitedFlags = state.shadowFlags.length <= 2;
    // All requirements must be met
    state.humanQualified = hasMinScore && hasEnoughInquiry && hasManagedShadow && hasLimitedFlags;
}
/**
 * Check if user qualifies for Deva realm
 *
 * Deva requires convergent indicators AND low shadow flags:
 * 1. Minimum Deva score
 * 2. Birth realm indicators include stability/privilege
 * 3. Current hindrances low
 * 4. Low shadow gap
 * 5. No spiritual bypass flags
 */
export function checkDevaQualification(state, responses) {
    // Requirement 1: Minimum Deva score
    const hasMinScore = state.realmScores.Deva.weighted >= CALIBRATION.deva_threshold;
    // Requirement 2: Birth realm indicators include stability/privilege (Q1f, Q2f, Q3f)
    const q1Response = getResponse(responses, 'Q1');
    const q2Response = getResponse(responses, 'Q2');
    const q3Response = getResponse(responses, 'Q3');
    const hasBirthPrivilege = q1Response === 'f' || q2Response === 'f' || q3Response === 'f';
    // Requirement 3: Current hindrances low (Q27-31 mostly d or e answers)
    const hindranceQuestions = ['Q27', 'Q28', 'Q29', 'Q30', 'Q31'];
    let lowHindranceCount = 0;
    for (const qId of hindranceQuestions) {
        const response = getResponse(responses, qId);
        if (response === 'd' || response === 'e') {
            lowHindranceCount++;
        }
    }
    const hasLowHindrances = lowHindranceCount >= 3;
    // Requirement 4: Low shadow gap
    const hasLowShadowGap = state.shadowGap <= CALIBRATION.deva_shadow_max;
    // Requirement 5: No spiritual bypass flags
    const noSpiritualBypass = !state.shadowFlags.includes('SPIRITUAL_BYPASS');
    // All requirements must be met (except spiritual bypass can override)
    state.devaQualified = hasMinScore && hasBirthPrivilege && hasLowHindrances && hasLowShadowGap;
    // Special case: If Deva indicators present but with spiritual bypass flags
    if (hasMinScore && state.shadowFlags.includes('SPIRITUAL_BYPASS')) {
        state.devaQualified = true; // Still Deva, but will route to Spiritual subcategory
    }
}
/**
 * Handle Human qualification failure
 *
 * If Human has highest score but doesn't qualify, check second-highest realm
 * or route to Human (Sleepers/Strugglers)
 */
export function handleHumanQualificationFailure(state) {
    if (!state.humanQualified && state.primaryRealm === 'Human') {
        const sortedRealms = getSortedRealmScores(state);
        const secondHighest = sortedRealms[1];
        // If second-highest is close (within 10 points), use that
        if (sortedRealms[0].score - secondHighest.score <= 10) {
            state.primaryRealm = secondHighest.realm;
        }
        else {
            // Otherwise, route to Human (Sleepers) or Human (Strugglers)
            // Check if they're struggling vs. comfortable
            const isStruggling = state.realmScores.Human.total > 0 && state.genuineInquiryCount >= 1;
            if (isStruggling) {
                state.subcategory = 'Strugglers';
            }
            else {
                state.subcategory = 'Sleepers';
            }
        }
    }
}
/**
 * Handle Deva spiritual bypass
 *
 * If Deva is qualified but spiritual bypass flags are present,
 * force subcategory to Spiritual
 */
export function handleDevaBypass(state) {
    if (state.devaQualified && state.primaryRealm === 'Deva') {
        if (state.shadowFlags.includes('SPIRITUAL_BYPASS')) {
            state.subcategory = 'Spiritual';
            state.riskVectors.push('Spiritual bypass detected - using transcendence to avoid reality');
        }
    }
}
// Helper function
function getSortedRealmScores(state) {
    const realms = ['Hell', 'HungryGhost', 'Animal', 'Human', 'Asura', 'Deva'];
    return realms
        .map(realm => ({ realm, score: state.realmScores[realm].weighted }))
        .sort((a, b) => b.score - a.score);
}
//# sourceMappingURL=qualification.js.map
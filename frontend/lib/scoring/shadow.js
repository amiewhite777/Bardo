import { getResponse } from './scorer.js';
/**
 * Detect all shadow flags based on response patterns
 */
export function detectShadowFlags(state, responses) {
    // DENIED_ANGER: Claims not to feel anger but has Hell indicators elsewhere
    const q10Response = getResponse(responses, 'Q10');
    if ((q10Response === 'e' || q10Response === 'i') && state.realmScores.Hell.total > 20) {
        state.shadowFlags.push('DENIED_ANGER');
    }
    // DENIED_DESIRE: Claims dulled desire but has HG indicators elsewhere
    const q14Response = getResponse(responses, 'Q14');
    if (q14Response === 'f' && state.realmScores.HungryGhost.total > 20) {
        state.shadowFlags.push('DENIED_DESIRE');
    }
    // DENIED_CONFUSION: Claims certainty but has Animal indicators elsewhere
    const q16Response = getResponse(responses, 'Q16');
    if (q16Response === 'a' && state.realmScores.Animal.total > 20) {
        state.shadowFlags.push('DENIED_CONFUSION');
    }
    // SPIRITUAL_BYPASS: Combination of transcendence claims
    const q10i = q10Response === 'i';
    const q18Response = getResponse(responses, 'Q18');
    const q18f = q18Response === 'f';
    const q31Response = getResponse(responses, 'Q31');
    const q31e = q31Response === 'e';
    if ((q10i && q18f) || (q10i && q31e) || (q18f && q31e)) {
        state.shadowFlags.push('SPIRITUAL_BYPASS');
    }
    // PROJECTION_ACTIVE: What you judge matches your own realm
    const q19Response = getResponse(responses, 'Q19');
    if (q19Response) {
        const projectionMap = {
            a: 'Hell',
            b: 'HungryGhost',
            c: 'Animal',
            d: 'Human',
            e: 'Asura',
            f: 'Deva'
        };
        const projectedRealm = projectionMap[q19Response];
        const highestRealm = getHighestRealmForProjection(state);
        if (projectedRealm === highestRealm) {
            state.shadowFlags.push('PROJECTION_ACTIVE');
        }
    }
    // NOBLE_INFLATION: Big gap between self-image and critic-image
    const q20Response = getResponse(responses, 'Q20');
    const q22Response = getResponse(responses, 'Q22');
    if (q20Response && q22Response) {
        if (isPositiveSelfImage(q22Response) && isNegativeCriticImage(q20Response)) {
            state.shadowFlags.push('NOBLE_INFLATION');
        }
    }
}
/**
 * Calculate shadow gap score
 */
export function calculateShadowGap(state, responses) {
    // Component 1: Self-image vs critic-image gap
    const q22Response = getResponse(responses, 'Q22');
    const q20Response = getResponse(responses, 'Q20');
    const selfImageScore = getSelfImageScore(q22Response);
    const criticImageScore = getCriticImageScore(q20Response);
    const imageGap = Math.abs(selfImageScore - criticImageScore);
    // Component 2: Acknowledged vs detected shadow
    const q25Response = getResponse(responses, 'Q25');
    const acknowledgedShadow = getAcknowledgedShadowScore(q25Response);
    const detectedShadow = state.shadowFlags.length * 5;
    const shadowDiscrepancy = Math.abs(acknowledgedShadow - detectedShadow);
    // Component 3: Projection score
    const projectionScore = state.shadowFlags.includes('PROJECTION_ACTIVE')
        ? getProjectionStrength(responses) * 3
        : 0;
    state.shadowGap = imageGap + shadowDiscrepancy + projectionScore;
}
/**
 * Apply shadow modifiers to realm scores
 */
export function applyShadowModifiers(state) {
    const SHADOW_MODIFIER = 8;
    if (state.shadowFlags.includes('DENIED_ANGER')) {
        state.realmScores.Hell.weighted += SHADOW_MODIFIER;
        // Reduce stated realm (likely Human or Deva)
        const statedRealm = getHighestRealmForProjection(state);
        if (statedRealm !== 'Hell') {
            state.realmScores[statedRealm].weighted -= 5;
        }
    }
    if (state.shadowFlags.includes('DENIED_DESIRE')) {
        state.realmScores.HungryGhost.weighted += SHADOW_MODIFIER;
        const statedRealm = getHighestRealmForProjection(state);
        if (statedRealm !== 'HungryGhost') {
            state.realmScores[statedRealm].weighted -= 5;
        }
    }
    if (state.shadowFlags.includes('DENIED_CONFUSION')) {
        state.realmScores.Animal.weighted += SHADOW_MODIFIER;
        const statedRealm = getHighestRealmForProjection(state);
        if (statedRealm !== 'Animal') {
            state.realmScores[statedRealm].weighted -= 5;
        }
    }
    if (state.shadowFlags.includes('SPIRITUAL_BYPASS')) {
        state.realmScores.Deva.weighted -= 10;
        // Will be routed to Deva (Spiritual) subcategory if still Deva
    }
    if (state.shadowFlags.includes('PROJECTION_ACTIVE')) {
        // Add points to projected realm
        // This requires knowing which realm was projected
    }
}
// Helper functions
function getHighestRealmForProjection(state) {
    const realms = ['Hell', 'HungryGhost', 'Animal', 'Human', 'Asura', 'Deva'];
    let maxScore = -1;
    let maxRealm = 'Animal';
    for (const realm of realms) {
        if (state.realmScores[realm].weighted > maxScore) {
            maxScore = state.realmScores[realm].weighted;
            maxRealm = realm;
        }
    }
    return maxRealm;
}
function isPositiveSelfImage(answer) {
    // Q22: Noble story - d, e, f are more positive
    return answer === 'd' || answer === 'e' || answer === 'f';
}
function isNegativeCriticImage(answer) {
    // Q20: Worst critic - a, b, c are more negative
    return answer === 'a' || answer === 'b' || answer === 'c';
}
function getSelfImageScore(answer) {
    if (!answer)
        return 0;
    // Q22 scoring: a-f on scale from negative to positive
    const scores = {
        a: -3, // Righteous
        b: -2, // Discerning
        c: -1, // Peaceful
        d: 1, // Growing
        e: 2, // Achieving
        f: 3 // Blessed
    };
    return scores[answer] || 0;
}
function getCriticImageScore(answer) {
    if (!answer)
        return 0;
    // Q20 scoring: a-f from most negative to least negative
    const scores = {
        a: -5, // Angry/harsh/mean
        b: -4, // Selfish/greedy
        c: -3, // Lazy/checked-out
        d: -2, // Lost/struggling
        e: -1, // Jealous/competitive
        f: 0 // Entitled/spoiled
    };
    return scores[answer] || 0;
}
function getAcknowledgedShadowScore(answer) {
    if (!answer)
        return 0;
    // Q25: What shadow pattern do you KNOW you have
    // Each acknowledgment = 5 points
    return 5;
}
function getProjectionStrength(responses) {
    // Could be enhanced to measure intensity of judgment in Q19
    return 1;
}
/**
 * Interpret shadow gap score
 */
export function interpretShadowGap(shadowGap) {
    if (shadowGap <= 10) {
        return 'Integrated shadow awareness - you have good insight into your patterns.';
    }
    else if (shadowGap <= 20) {
        return 'Normal shadow gap - some patterns may be harder to see than others.';
    }
    else if (shadowGap <= 30) {
        return 'Significant denial detected - there may be patterns you\'re not seeing. Consider working with a therapist or trusted friend who can reflect back what they observe.';
    }
    else {
        return 'Major shadow territory - the quiz detected significant gaps between how you see yourself and what your responses suggest. This isn\'t bad - it\'s valuable information. Shadow work with a skilled practitioner could be helpful.';
    }
}
//# sourceMappingURL=shadow.js.map
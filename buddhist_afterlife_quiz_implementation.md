# BUDDHIST AFTERLIFE QUIZ: IMPLEMENTATION SPECIFICATION

## FOR CLAUDE CODE

This document contains everything needed to implement the Buddhist Afterlife Quiz. Read this in conjunction with the three companion files:
- `buddhist_afterlife_quiz_questions.md` - All 50 questions with scoring keys
- `buddhist_afterlife_quiz_scoring.md` - Complete scoring algorithm
- `buddhist_afterlife_quiz_forms.md` - All 62 result descriptions

---

## PART 1: PROJECT OVERVIEW

### 1.1 What This Is

A psychological/spiritual assessment quiz that maps users to one of 62 specific "forms" across 6 Buddhist realms. It's based on:
- Traditional Buddhist psychology (Six Realms, Three Poisons, Five Hindrances)
- Nodal Theory (network science applied to consciousness)
- Shadow psychology (projection, denial, self-deception patterns)

### 1.2 What It Must Achieve

1. **Accurate sorting** - People should land in forms that genuinely describe their patterns
2. **Target distribution** - Results should approximate:
   - Hell: 27.5%
   - Animal: 27.5%
   - Hungry Ghost: 17.5%
   - Human: 12.5%
   - Asura: 6.5%
   - Deva: 3.5%

3. **Psychological validity** - Shadow detection should work; speed round should catch what considered answers miss
4. **Compelling experience** - Questions should feel insightful, results should feel seen

### 1.3 Critical Design Principles

**Human realm is NOT default.** Most people are running Hell, Animal, or Hungry Ghost patterns unconsciously. The quiz should reveal this accurately, not flatter users into thinking they're more conscious than they are.

**Shadow detection is real.** The quiz doesn't just take self-report at face value. It cross-references, checks for inconsistencies, and uses the pattern of self-deception as diagnostic data.

**Speed round reveals truth.** Pre-reflective responses often contradict considered answers. When they do, speed round is weighted as more accurate.

**Results are not identity.** The framing throughout should be "what you're building" not "who you are." This is a weather report, not a prophecy.

---

## PART 2: DATA STRUCTURES

### 2.1 Question Schema

```typescript
interface Question {
  id: string;                    // e.g., "Q1", "Q7", "Q43"
  section: Section;              // Which of 7 sections
  text: string;                  // The question text
  subtext?: string;              // Optional instructional text
  options: Option[];             // Answer choices
  type: 'single' | 'speed';      // Regular or speed round
  shadowFlag?: ShadowFlagType;   // If this question can trigger shadow flags
}

interface Option {
  id: string;                    // e.g., "a", "b", "c"
  text: string;                  // Answer text
  scoring: ScoringImpact[];      // What this answer affects
}

interface ScoringImpact {
  target: ScoringTarget;         // What gets points
  points: number;                // How many points
  condition?: string;            // Optional conditional logic
}

type ScoringTarget = 
  | { type: 'realm'; realm: Realm }
  | { type: 'subcategory'; realm: Realm; subcategory: string }
  | { type: 'form'; form: string }
  | { type: 'shadowFlag'; flag: ShadowFlagType }
  | { type: 'genuineInquiry' }
  | { type: 'protectiveFactor'; factor: string };

type Realm = 'Hell' | 'HungryGhost' | 'Animal' | 'Human' | 'Asura' | 'Deva';

type Section = 
  | 'birthRealm'           // Section 1: 6 questions
  | 'threePoisons'         // Section 2: 12 questions
  | 'shadowDetection'      // Section 3: 8 questions
  | 'fiveHindrances'       // Section 4: 6 questions
  | 'networkTopology'      // Section 5: 6 questions
  | 'riskVectors'          // Section 6: 4 questions
  | 'speedRound';          // Section 7: 8 questions

type ShadowFlagType = 
  | 'DENIED_ANGER'
  | 'DENIED_DESIRE'
  | 'DENIED_CONFUSION'
  | 'SPIRITUAL_BYPASS'
  | 'PROJECTION_ACTIVE'
  | 'NOBLE_INFLATION';
```

### 2.2 User Response Schema

```typescript
interface QuizResponse {
  odId: string;                  // Question ID
  optionId: string;              // Selected option
  timestamp: number;             // When answered (for speed round timing)
  timeToAnswer?: number;         // Milliseconds to answer (speed round)
}

interface QuizSession {
  sessionId: string;
  startTime: number;
  responses: QuizResponse[];
  completed: boolean;
}
```

### 2.3 Scoring State Schema

```typescript
interface ScoringState {
  // Raw realm scores by section
  realmScores: {
    [key in Realm]: {
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
  };
  
  // Subcategory scores within each realm
  subcategoryScores: {
    [key in Realm]: {
      [subcategory: string]: number;
    }
  };
  
  // Form indicator scores
  formScores: {
    [formName: string]: number;
  };
  
  // Shadow detection
  shadowFlags: ShadowFlagType[];
  shadowGap: number;
  
  // Qualification checks
  humanQualified: boolean;
  devaQualified: boolean;
  genuineInquiryCount: number;
  
  // Consistency metrics
  birthRealm: Realm;
  consideredRealm: Realm;
  speedRoundRealm: Realm;
  trajectoryScore: number;
  reflectionGap: number;
  scenarioDiscrepancy: number;
  
  // Final determinations
  primaryRealm: Realm;
  subcategory: string;
  specificForm: string;
  confidence: number;
  
  // Result modifiers
  riskVectors: string[];
  protectiveFactors: string[];
}
```

### 2.4 Result Schema

```typescript
interface QuizResult {
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

interface FormDescription {
  name: string;
  realm: Realm;
  subcategory: string;
  population: string;           // e.g., "4.125%"
  pattern: string;              // "The Pattern" section
  building: string;             // "What You're Building" section
  networkSignature: string;     // "The Network Signature" section
  shadow: string;               // "The Shadow" section
  exit: string;                 // "The Exit" section
  instruction: string;          // "The Instruction"
}
```

---

## PART 3: SCORING ALGORITHM IMPLEMENTATION

### 3.1 Section Weights

```typescript
const SECTION_WEIGHTS: { [key in Section]: number } = {
  birthRealm: 0.8,
  threePoisons: 1.2,
  shadowDetection: 1.0,
  fiveHindrances: 1.0,
  networkTopology: 1.1,
  riskVectors: 0.9,
  speedRound: 1.3
};
```

### 3.2 Main Scoring Function

```typescript
function calculateResult(session: QuizSession): QuizResult {
  // Step 1: Initialize scoring state
  const state = initializeScoringState();
  
  // Step 2: Process all responses, accumulate points
  for (const response of session.responses) {
    processResponse(response, state);
  }
  
  // Step 3: Apply section weights
  applyWeights(state);
  
  // Step 4: Detect shadow flags
  detectShadowFlags(state, session.responses);
  
  // Step 5: Calculate shadow gap
  calculateShadowGap(state, session.responses);
  
  // Step 6: Apply shadow modifiers
  applyShadowModifiers(state);
  
  // Step 7: Check Human/Deva qualification
  checkQualifications(state);
  
  // Step 8: Determine primary realm
  determinePrimaryRealm(state);
  
  // Step 9: Calculate subcategory
  calculateSubcategory(state);
  
  // Step 10: Determine specific form
  determineForm(state);
  
  // Step 11: Calculate consistency scores
  calculateConsistency(state, session.responses);
  
  // Step 12: Calculate confidence
  calculateConfidence(state);
  
  // Step 13: Generate result object
  return generateResult(state);
}
```

### 3.3 Shadow Flag Detection

```typescript
function detectShadowFlags(state: ScoringState, responses: QuizResponse[]): void {
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
  
  // SPIRITUAL_BYPASS: Combination of transcendence claims
  const q10i = q10Response === 'i';
  const q18f = getResponse(responses, 'Q18') === 'f';
  const q31e = getResponse(responses, 'Q31') === 'e';
  if ((q10i && q18f) || (q10i && q31e) || (q18f && q31e)) {
    state.shadowFlags.push('SPIRITUAL_BYPASS');
  }
  
  // PROJECTION_ACTIVE: What you judge matches your own realm
  const q19Response = getResponse(responses, 'Q19');
  const projectionMap: { [key: string]: Realm } = {
    'a': 'Hell',
    'b': 'HungryGhost', 
    'c': 'Animal',
    'd': 'Human',
    'e': 'Asura',
    'f': 'Deva'
  };
  const projectedRealm = projectionMap[q19Response];
  const highestRealm = getHighestRealm(state);
  if (projectedRealm === highestRealm) {
    state.shadowFlags.push('PROJECTION_ACTIVE');
  }
  
  // NOBLE_INFLATION: Big gap between self-image and critic-image
  const q20Response = getResponse(responses, 'Q20');
  const q22Response = getResponse(responses, 'Q22');
  // If Q22 is positive self-image and Q20 is very negative
  if (isPositiveSelfImage(q22Response) && isNegativeCriticImage(q20Response)) {
    state.shadowFlags.push('NOBLE_INFLATION');
  }
}
```

### 3.4 Shadow Gap Calculation

```typescript
function calculateShadowGap(state: ScoringState, responses: QuizResponse[]): void {
  // Component 1: Self-image vs critic-image gap
  const selfImageScore = getSelfImageScore(getResponse(responses, 'Q22'));
  const criticImageScore = getCriticImageScore(getResponse(responses, 'Q20'));
  const imageGap = Math.abs(selfImageScore - criticImageScore);
  
  // Component 2: Acknowledged vs detected shadow
  const acknowledgedShadow = getAcknowledgedShadowScore(getResponse(responses, 'Q25'));
  const detectedShadow = state.shadowFlags.length * 5;
  const shadowDiscrepancy = Math.abs(acknowledgedShadow - detectedShadow);
  
  // Component 3: Projection score
  const projectionScore = state.shadowFlags.includes('PROJECTION_ACTIVE') ? 
    getProjectionStrength(responses) * 3 : 0;
  
  state.shadowGap = imageGap + shadowDiscrepancy + projectionScore;
}
```

### 3.5 Human Qualification Check

```typescript
function checkHumanQualification(state: ScoringState, responses: QuizResponse[]): void {
  // Requirement 1: Minimum Human score
  const hasMinScore = state.realmScores.Human.weighted >= 35;
  
  // Requirement 2: Genuine inquiry indicators (need 3 of 6)
  const genuineInquiryQuestions = ['Q16', 'Q17', 'Q24', 'Q33', 'Q34', 'Q37'];
  const genuineInquiryAnswers = ['d', 'd', 'd', 'd', 'd', 'd'];
  
  let count = 0;
  for (let i = 0; i < genuineInquiryQuestions.length; i++) {
    if (getResponse(responses, genuineInquiryQuestions[i]) === genuineInquiryAnswers[i]) {
      count++;
    }
  }
  state.genuineInquiryCount = count;
  const hasEnoughInquiry = count >= 3;
  
  // Requirement 3: Shadow gap within threshold
  const hasManagedShadow = state.shadowGap <= 15;
  
  // Requirement 4: Not too many shadow flags
  const hasLimitedFlags = state.shadowFlags.length <= 2;
  
  state.humanQualified = hasMinScore && hasEnoughInquiry && hasManagedShadow && hasLimitedFlags;
}
```

### 3.6 Tie-Breaking Implementation

```typescript
function breakTie(realm1: Realm, realm2: Realm, responses: QuizResponse[]): Realm {
  const tieBreakers: { [key: string]: { question: string; realm1Answer: string; realm2Answer: string } } = {
    'Hell-Animal': { question: 'Q10', realm1Answer: 'abcd', realm2Answer: 'ef' },
    'HungryGhost-Animal': { question: 'Q14', realm1Answer: 'abc', realm2Answer: 'f' },
    'Hell-HungryGhost': { question: 'Q7', realm1Answer: 'abcd', realm2Answer: 'e' },
    'Human-Asura': { question: 'Q23', realm1Answer: 'd', realm2Answer: 'e' },
    'Human-Deva': { question: 'Q40', realm1Answer: 'd', realm2Answer: 'f' },
    'Asura-Deva': { question: 'Q39', realm1Answer: 'e', realm2Answer: 'f' }
  };
  
  const key = `${realm1}-${realm2}`;
  const reverseKey = `${realm2}-${realm1}`;
  
  const tieBreaker = tieBreakers[key] || tieBreakers[reverseKey];
  
  if (tieBreaker) {
    const response = getResponse(responses, tieBreaker.question);
    if (tieBreaker.realm1Answer.includes(response)) {
      return tieBreakers[key] ? realm1 : realm2;
    } else {
      return tieBreakers[key] ? realm2 : realm1;
    }
  }
  
  // Fallback: use speed round dominance
  return getSpeedRoundDominantRealm(responses);
}
```

### 3.7 Form Selection

```typescript
function determineForm(state: ScoringState): void {
  const realm = state.primaryRealm;
  const subcategory = state.subcategory;
  
  // Get candidate forms for this subcategory
  const candidates = FORMS_BY_SUBCATEGORY[realm][subcategory];
  
  // Score each candidate
  const formScores: { [form: string]: number } = {};
  
  for (const form of candidates) {
    formScores[form] = state.formScores[form] || 0;
  }
  
  // Find highest scoring form
  let maxScore = -1;
  let selectedForm = candidates[0];
  const ties: string[] = [];
  
  for (const [form, score] of Object.entries(formScores)) {
    if (score > maxScore) {
      maxScore = score;
      selectedForm = form;
      ties.length = 0;
      ties.push(form);
    } else if (score === maxScore) {
      ties.push(form);
    }
  }
  
  // If tie, use population as tiebreaker (more common forms win)
  if (ties.length > 1) {
    selectedForm = ties.reduce((a, b) => 
      FORM_POPULATIONS[a] > FORM_POPULATIONS[b] ? a : b
    );
  }
  
  state.specificForm = selectedForm;
}
```

### 3.8 Confidence Calculation

```typescript
function calculateConfidence(state: ScoringState): void {
  let confidence = 50; // Base confidence
  
  // Realm clarity bonus (max +20)
  const scores = Object.values(state.realmScores).map(r => r.weighted);
  scores.sort((a, b) => b - a);
  const clarityBonus = Math.min(20, (scores[0] - scores[1]) * 2);
  confidence += clarityBonus;
  
  // Consistency bonus (+10 if all checks pass)
  const consistencyPasses = 
    state.birthRealm === state.primaryRealm || // Stable trajectory
    Math.abs(state.reflectionGap) <= 1 &&      // Considered matches speed
    state.scenarioDiscrepancy <= 1;            // Self-report matches scenarios
  if (consistencyPasses) {
    confidence += 10;
  }
  
  // Shadow gap penalty (max -15)
  const shadowPenalty = Math.min(15, state.shadowGap / 3);
  confidence -= shadowPenalty;
  
  // Tie penalty (-10 per tie broken)
  // Track this during realm determination
  confidence -= state.tiesBroken * 10;
  
  state.confidence = Math.max(0, Math.min(100, confidence));
}
```

---

## PART 4: USER INTERFACE SPECIFICATION

### 4.1 Overall Flow

```
Landing Page
    ↓
Introduction (What this is, what it measures, consent)
    ↓
Section 1: Birth Realm Calibration (6 questions)
    ↓
Section 2: Three Poisons Assessment (12 questions)
    ↓
Section 3: Shadow Detection (8 questions)
    ↓
Section 4: Five Hindrances (6 questions)
    ↓
Section 5: Network Topology (6 questions)
    ↓
Section 6: Risk Vectors (4 questions)
    ↓
Speed Round Instructions
    ↓
Section 7: Speed Round (8 questions, timed presentation)
    ↓
Processing Animation
    ↓
Result Page
```

### 4.2 Question Presentation

**Standard Questions (Sections 1-6):**
- Display question text prominently
- Show all options as clickable cards/buttons
- No timer visible
- Allow changing answer before proceeding
- "Continue" button appears after selection
- Progress indicator shows section and overall progress

**Speed Round (Section 7):**
- Pre-instruction: "Answer with your FIRST instinct. Don't overthink."
- Questions appear one at a time
- Options presented in randomized order each time
- No "Continue" button - selection immediately advances
- Subtle timing indicator (not stressful, but present)
- Record time-to-answer for each question
- No ability to go back

### 4.3 Section Transitions

Between sections, display brief context:

**Before Section 1:**
"First, we'll ask about your early environment. This establishes baseline patterns - where you started, not where you are now."

**Before Section 2:**
"Now we'll explore your relationship with the three root patterns: aversion, craving, and confusion."

**Before Section 3:**
"These questions explore what's harder to see about yourself. Answer honestly - the quiz works better when you do."

**Before Section 4:**
"A quick check on your current state. What's present for you right now?"

**Before Section 5:**
"How do you connect with others? These patterns shape your experience."

**Before Section 6:**
"Where might your current patterns lead? What are your risk areas?"

**Before Section 7:**
"SPEED ROUND: Answer with your gut. First instinct only. Don't think - just respond."

### 4.4 Result Page Structure

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  YOUR RESULT                                                │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  [REALM NAME]                                        │   │
│  │  [Subcategory] → [Specific Form]                     │   │
│  │                                                      │   │
│  │  "You are currently generating the conditions for    │   │
│  │   [Form Name] - one of [X]% of people."             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  CONFIDENCE: [██████████░░] 72% - Likely Pattern           │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  THE PATTERN                                                │
│  [Pattern description text]                                 │
│                                                             │
│  WHAT YOU'RE BUILDING                                       │
│  [Building description text]                                │
│                                                             │
│  THE NETWORK SIGNATURE                                      │
│  [Network signature text]                                   │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  THE SHADOW                                                 │
│  [Shadow description text]                                  │
│                                                             │
│  Shadow Gap: [Score] - [Interpretation]                     │
│  [If shadow flags present, note them]                       │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  TRAJECTORY                                                 │
│  Birth Pattern: [Birth Realm]                               │
│  Current Pattern: [Current Realm]                           │
│  Direction: [Growth/Stable/Regression]                      │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  RISK VECTORS                                               │
│  • [Risk 1]                                                 │
│  • [Risk 2]                                                 │
│                                                             │
│  PROTECTIVE FACTORS                                         │
│  • [Protection 1]                                           │
│  • [Protection 2]                                           │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  THE EXIT                                                   │
│  [Exit description text]                                    │
│                                                             │
│  ═══════════════════════════════════════════════════════   │
│                                                             │
│  THE INSTRUCTION                                            │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                      │   │
│  │  [The specific instruction for this form]            │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  [Share Result] [Take Again] [Learn More About Realms]      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4.5 Visual Design Guidelines

**Tone:** Serious but not clinical. Spiritual but not woo. Direct but compassionate.

**Color Palette Suggestion (per realm):**
- Hell: Deep reds, black, ember orange
- Hungry Ghost: Sickly greens, hollow whites, grey
- Animal: Earth tones, muted greens, brown
- Human: Warm neutrals, soft gold, cream
- Asura: Sharp greens, competitive red, silver
- Deva: Ethereal blues, white, gold

**Typography:**
- Headers: Strong, clear
- Body: Readable, not too decorative
- Instructions: Emphasized, possibly italicized

**Animations:**
- Minimal, purposeful
- Processing animation should feel meaningful, not decorative
- Result reveal should have appropriate weight

---

## PART 5: EDGE CASES AND ERROR HANDLING

### 5.1 Scoring Edge Cases

**All realm scores within 5 points:**
- Report low confidence
- Show top 2-3 possibilities
- Suggest retake with more honest answers
- Frame as "You may be in transition between patterns"

**Human highest but doesn't qualify:**
- Check second-highest realm
- If second-highest is close, use that
- If Human score is much higher, route to Human (Sleepers) or Human (Strugglers)
- Explain in result that Human realm requires not just absence of pathology

**Deva highest but shows spiritual bypass flags:**
- Still route to Deva
- Force subcategory to "Spiritual"
- Flag Guru/Blissed/Transcender traps prominently in result
- Include additional warning in result text

**Speed round completely contradicts considered sections:**
- Weight speed round results higher (+5 to speed round realm)
- Note discrepancy in result
- Add to shadow gap score
- Include in result: "Your first instincts suggest a different pattern than your considered answers..."

### 5.2 Technical Edge Cases

**User abandons mid-quiz:**
- Save progress to localStorage/session
- Offer to resume on return
- After 24 hours, offer fresh start

**User takes quiz multiple times:**
- Allow retakes
- Don't show previous results until new result is complete
- Optional: track changes over time

**Network/API errors:**
- All scoring happens client-side (no API calls needed for core function)
- Results can be saved locally
- Sharing features gracefully degrade

### 5.3 Accessibility

- All questions keyboard navigable
- Screen reader compatible
- No time pressure on standard questions (only speed round)
- Color not sole indicator of meaning
- Appropriate contrast ratios

---

## PART 6: DATA CONSTANTS

### 6.1 Realm Hierarchy

```typescript
const REALM_HIERARCHY = {
  Hell: {
    subcategories: {
      'Burning': ['The Inferno', 'The Scorcher', 'The Spreader'],
      'Freezing': ['The Glacier', 'The Bitter', 'The Numb'],
      'Crushing': ['The Judge', 'The Executioner'],
      'Repetition': ['The Ruminant', 'The Self-Flagellant']
    },
    distribution: 0.275
  },
  HungryGhost: {
    subcategories: {
      'Mouth': ['The Glutton', 'The Connoisseur', 'The Addict'],
      'Status': ['The Collector', 'The Climber', 'The Influencer'],
      'Void': ['The Browser', 'The Emptiness'],
      'Theft': ['The Coveter', 'The Taker']
    },
    distribution: 0.175
  },
  Animal: {
    subcategories: {
      'Prey': ['The Rabbit', 'The Deer', 'The Mouse'],
      'Predator': ['The Shark', 'The Wolf', 'The Snake'],
      'Herd': ['The Sheep', 'The Cattle'],
      'Torpor': ['The Sloth', 'The Hibernator']
    },
    distribution: 0.275
  },
  Human: {
    subcategories: {
      'Seekers': ['The Student', 'The Questioner', 'The Practitioner'],
      'Builders': ['The Creator', 'The Achiever', 'The Experiencer'],
      'Strugglers': ['The Wounded', 'The Frustrated', 'The Desperate'],
      'Sleepers': ['The Comfortable', 'The Distracted']
    },
    distribution: 0.125
  },
  Asura: {
    subcategories: {
      'Warriors': ['The Conqueror', 'The Fighter', 'The Underminer'],
      'Measurers': ['The Ranker', 'The One-Upper', 'The Subtle Brag'],
      'Resenters': ['The Victim', 'The Critic'],
      'Strivers': ['The Accumulator', 'The Thief of Joy']
    },
    distribution: 0.065
  },
  Deva: {
    subcategories: {
      'Pleasure': ['The Hedonist', 'The Protected', 'The Entitled'],
      'Accomplished': ['The Retired', 'The Expert', 'The Mentor'],
      'Spiritual': ['The Guru', 'The Blissed', 'The Transcender'],
      'Complacent': ['The Comfortable', 'The Fortunate']
    },
    distribution: 0.035
  }
};
```

### 6.2 Form Populations

```typescript
const FORM_POPULATIONS = {
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
  'The Comfortable (Human)': 0.0125,
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
```

### 6.3 Subcategory Distributions Within Realms

```typescript
const SUBCATEGORY_DISTRIBUTIONS = {
  Hell: {
    'Burning': 0.40,
    'Freezing': 0.25,
    'Crushing': 0.20,
    'Repetition': 0.15
  },
  HungryGhost: {
    'Mouth': 0.35,
    'Status': 0.30,
    'Void': 0.20,
    'Theft': 0.15
  },
  Animal: {
    'Prey': 0.35,
    'Predator': 0.25,
    'Herd': 0.25,
    'Torpor': 0.15
  },
  Human: {
    'Seekers': 0.30,
    'Builders': 0.30,
    'Strugglers': 0.25,
    'Sleepers': 0.15
  },
  Asura: {
    'Warriors': 0.40,
    'Measurers': 0.30,
    'Resenters': 0.20,
    'Strivers': 0.10
  },
  Deva: {
    'Pleasure': 0.35,
    'Accomplished': 0.30,
    'Spiritual': 0.25,
    'Complacent': 0.10
  }
};
```

---

## PART 7: TESTING SPECIFICATION

### 7.1 Calibration Test Cases

**Case 1: Amie (Creator's calibration)**
- Birth Realm: Hell (Struggler pattern - physical trauma, early network reorganization)
- Current: Human (Practitioner emerging)
- Expected risk vectors: Guru trap, Blissed trap, Conqueror trap
- Expected protective factors: Multiple AI cross-checks, concern about grandiosity, shadow engagement

**Case 2: Clear Hell Pattern**
- Answer all anger questions with explosive/resentment options
- Speed round should confirm
- Expected: Hell realm, likely Burning or Repetition subcategory

**Case 3: Spiritual Bypass**
- Claim transcendence of anger (Q10i)
- Claim peace with uncertainty (Q18f)
- Claim no doubt (Q31e)
- BUT show Hell/HG indicators elsewhere
- Expected: Spiritual bypass flag triggered, possible Deva (Spiritual) with warning

**Case 4: Human Qualification Failure**
- High Human score on poisons
- BUT few genuine inquiry indicators
- High shadow gap
- Expected: Routed to Human (Sleepers) or adjacent realm

**Case 5: Speed Round Contradiction**
- Considered answers point to Human/Deva
- Speed round answers point to Hell/Animal
- Expected: Speed round weighted higher, discrepancy noted in result

### 7.2 Distribution Testing

After implementing, run 1000+ simulated quiz completions with randomized answers weighted toward realistic patterns. Check:
- Overall realm distribution matches targets (±3%)
- Subcategory distributions within realms are reasonable
- No form is unreachable
- Rare forms (The Fortunate, The Transcender) are actually achievable

### 7.3 Shadow Detection Testing

Create test cases that should trigger each shadow flag:
- DENIED_ANGER: Q10e + high Hell elsewhere
- DENIED_DESIRE: Q14f + high HG elsewhere
- SPIRITUAL_BYPASS: Q10i + Q18f + Q31e combinations
- PROJECTION_ACTIVE: Q19 matches highest realm
- NOBLE_INFLATION: Q22 positive + Q20 negative

Verify flags trigger correctly and modify scores appropriately.

---

## PART 8: FUTURE ENHANCEMENTS (Optional)

### 8.1 Trajectory Tracking
- Store results over time
- Show movement between realms
- Visualize transformation or stagnation

### 8.2 Community Features
- Anonymous aggregate data
- "Others with your pattern found these practices helpful"
- Compare (anonymously) with population distributions

### 8.3 Deeper Diagnostics
- Optional extended sections for specific realms
- More granular form differentiation
- Additional shadow detection questions

### 8.4 Integration with Practice
- Suggested practices based on form
- Daily reminders tied to The Instruction
- Check-in quizzes for tracking

---

## PART 9: IMPORTANT CAVEATS

### 9.1 This Is Not Therapy
The quiz results are not clinical diagnoses. Include appropriate disclaimers:
- "This is a tool for self-reflection, not a professional assessment"
- "If you're experiencing mental health difficulties, please seek appropriate support"
- "These patterns are not identity - they're current tendencies that can change"

### 9.2 Shadow Detection Limitations
The quiz can detect SOME shadow material through inconsistency, but cannot:
- See actual unconscious content
- Know behavior vs. stated values
- Predict with certainty

Include humility in result presentation: "The shadow described here is the quiz's best inference. You may recognize it, or there may be deeper material the quiz cannot see."

### 9.3 Cultural Sensitivity
Buddhist cosmology comes from specific cultural contexts. The quiz should:
- Not require Buddhist belief or practice
- Work for secular users
- Avoid exoticizing or appropriating
- Present realms as psychological patterns, not literal afterlife destinations

---

## SUMMARY: BUILD ORDER

1. **Data Layer First**
   - Implement all question data
   - Implement form descriptions
   - Implement constants (populations, distributions)

2. **Scoring Engine**
   - Basic point accumulation
   - Section weighting
   - Shadow detection
   - Qualification checks
   - Tie-breaking
   - Confidence calculation

3. **Quiz Flow**
   - Question presentation
   - Section transitions
   - Speed round (with timing)
   - Progress tracking

4. **Result Generation**
   - Result assembly
   - Result presentation
   - Share functionality

5. **Testing & Calibration**
   - Unit tests for scoring
   - Calibration test cases
   - Distribution verification
   - Shadow detection verification

6. **Polish**
   - Visual design
   - Animations
   - Responsive design
   - Accessibility

---

*End of Implementation Specification*

*Questions? The three companion files contain all the content this spec references.*

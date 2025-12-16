# BUDDHIST AFTERLIFE QUIZ: SCORING ALGORITHM

## DESIGN PHILOSOPHY

The scoring system must achieve accurate psychological sorting while hitting target distributions. Key insight: **Human realm is NOT the default**. Most people are running Hell, Animal, or Hungry Ghost patterns without knowing it. The quiz should reveal this, not flatter.

**Target Distribution (per 1,000,000):**
- Hell: 27.5% (275,000)
- Animal: 27.5% (275,000)
- Hungry Ghost: 17.5% (175,000)
- Human: 12.5% (125,000)
- Asura: 6.5% (65,000)
- Deva: 3.5% (35,000)

**Implication:** Human requires POSITIVE indicators, not just absence of pathology. Deva requires multiple convergent signals. Hell and Animal are where most unconscious patterns land.

---

## PART 1: REALM SCORING

### 1.1 Raw Point Accumulation

Each question contributes points to realm totals. Points accumulate across all sections.

**Point Values by Question Type:**

| Question Type | Primary Target | Secondary Target |
|---------------|----------------|------------------|
| Direct realm indicator | +3 to primary | +1 to secondary |
| Subcategory indicator | +2 to realm | +1 to subcategory |
| Shadow/projection | Variable (see shadow scoring) | — |
| Speed round | +2 to primary | — |

### 1.2 Section Weights

Not all sections contribute equally. Behavioral indicators weight higher than self-report.

| Section | Weight Multiplier | Rationale |
|---------|-------------------|-----------|
| 1. Birth Realm | 0.8x | Background, not current state |
| 2. Three Poisons | 1.2x | Core diagnostic |
| 3. Shadow Detection | 1.0x | Important but tricky to interpret |
| 4. Five Hindrances | 1.0x | Current state snapshot |
| 5. Network Topology | 1.1x | Behavioral pattern |
| 6. Risk Vectors | 0.9x | Predictive, not current |
| 7. Speed Round | 1.3x | Pre-reflective = truer |

### 1.3 Realm Score Calculation

```
REALM_SCORE[R] = Σ(section_points[R] × section_weight) + shadow_modifier[R] + consistency_modifier[R]
```

Where:
- R = each of the 6 realms
- section_points = raw points accumulated in that section
- section_weight = multiplier from table above
- shadow_modifier = adjustment based on shadow detection (see Part 3)
- consistency_modifier = adjustment based on cross-reference (see Part 4)

### 1.4 Human Realm Threshold

**Critical Rule:** Human realm requires meeting a POSITIVE threshold, not just having highest Human score.

```
HUMAN_QUALIFIED = TRUE if:
  - Human raw score ≥ 35 points AND
  - At least 3 of 6 "genuine inquiry" indicators present AND
  - Shadow gap score ≤ 15 (see Part 3) AND
  - No more than 2 shadow flags triggered
```

**Genuine Inquiry Indicators:**
1. Q16 answer d (actively working on understanding self)
2. Q17 answer d (investigate when lost)
3. Q24 answer d (thank and investigate critique)
4. Q33 answer d (genuine interest in mutual growth)
5. Q34 answer d (integrate and share knowledge)
6. Q37 answer d (adapt under stress, ask for and offer help)

If Human has highest score but HUMAN_QUALIFIED = FALSE:
- Check second-highest realm
- Apply "Sleeper" or "Struggler" subcategory modifier
- May result in Human (Sleepers/Strugglers) or drop to Animal/HG

### 1.5 Deva Realm Threshold

**Critical Rule:** Deva requires convergent indicators AND low shadow flags.

```
DEVA_QUALIFIED = TRUE if:
  - Deva raw score ≥ 30 points AND
  - Birth realm indicators include stability/privilege (Q1f, Q2f, Q3f) AND
  - Current hindrances low (Q27-31 mostly d or e answers) AND
  - Shadow gap score ≤ 10 AND
  - No "spiritual bypass" flags (Q10i, Q18f, Q31e combinations)
```

If Deva indicators present but with spiritual bypass flags:
- Route to Deva (Spiritual) subcategory
- Apply Guru/Blissed/Transcender form indicators

### 1.6 Tie-Breaking Rules

When two realms have scores within 5 points:

1. **Hell vs. Animal:** Check Q10 (anger relationship)
   - If anger is present and active → Hell
   - If anger is denied or muted → Animal

2. **HG vs. Animal:** Check Q14 (craving relationship)
   - If craving is active and named → HG
   - If craving is dulled or vague → Animal

3. **Hell vs. HG:** Check Q7 (anger response)
   - If response is a-d (hatred variants) → Hell
   - If response is e (craving compensation) → HG

4. **Human vs. Asura:** Check Q23 (promotion scenario)
   - If response is d (reflection) → Human
   - If response is e (comparison) → Asura

5. **Human vs. Deva:** Check Q40 (trajectory)
   - If response is d (genuinely different) → Human
   - If response is f (comfortable not transformed) → Deva

6. **Asura vs. Deva:** Check Q39 (likely trap)
   - If response is e (competitive virtue) → Asura
   - If response is f (complacent transcendence) → Deva

7. **Any remaining ties:** Default to the realm that appears MORE in Speed Round (Section 7)

---

## PART 2: SUBCATEGORY SCORING

Once realm is determined, subcategory is calculated from accumulated subcategory points + topology indicators.

### 2.1 Hell Subcategories

**Base distribution within Hell:** Burning 40%, Freezing 25%, Crushing 20%, Repetition 15%

| Subcategory | Key Indicators | Threshold |
|-------------|----------------|-----------|
| Burning | Q7a, Q8a, Q10a, Q37a, outward aggression pattern | Highest if explosive/external |
| Freezing | Q7b, Q8b, Q9a, Q10b, withdrawal pattern | Highest if cold/internal |
| Crushing | Q7c, Q8c, Q9b-c, Q10c, righteousness pattern | Highest if judgmental/certain |
| Repetition | Q7d, Q8d, Q9d, Q10d, self-directed pattern | Highest if ruminative/self-blame |

**Subcategory Score:**
```
HELL_SUB[S] = Σ(subcategory_indicators[S]) + topology_modifier
```

**Topology Modifier for Hell:**
- Q33a (intensity pattern) → +2 Burning or Freezing (check Q10 for which)
- Q35a (small intense network) → +1 to current leading subcategory
- Q38a (volatile hub) → +2 Burning

### 2.2 Hungry Ghost Subcategories

**Base distribution within HG:** Mouth 35%, Status 30%, Void 20%, Theft 15%

| Subcategory | Key Indicators | Threshold |
|-------------|----------------|-----------|
| Mouth | Q11a, Q12a, Q13a, Q14a, physical consumption | Highest if sensory craving |
| Status | Q11b, Q12b, Q13b, Q14b, social/achievement craving | Highest if recognition seeking |
| Void | Q11c, Q12c, Q13c, Q14c, unnamed emptiness | Highest if vague/existential |
| Theft | Q11d, Q12d, Q13d, comparative wanting | Highest if wanting what others have |

**Topology Modifier for HG:**
- Q33b (transactional relationships) → +2 Status or Theft
- Q34b (hoard information) → +1 Status
- Q36b (calculate loss in relationships) → +2 Theft

### 2.3 Animal Subcategories

**Base distribution within Animal:** Prey 35%, Predator 25%, Herd 25%, Torpor 15%

| Subcategory | Key Indicators | Threshold |
|-------------|----------------|-----------|
| Prey | Q3a (hypervigilance), Q30a-b (restlessness), anxiety pattern | Highest if fear-driven |
| Predator | Q34a (weaponize info), opportunistic pattern | Highest if taking without asking |
| Herd | Q33c (merging), Q41c (social proof), conformity pattern | Highest if following others |
| Torpor | Q15c (freeze), Q29a-b (low energy), Q31e (unquestioned) | Highest if checked out |

**Topology Modifier for Animal:**
- Q35c (undefined network) → +2 Torpor
- Q37c (freeze under stress) → +2 Prey or Torpor (check energy level)
- Q38c (peripheral node) → +1 Herd

### 2.4 Human Subcategories

**Base distribution within Human:** Seekers 30%, Builders 30%, Strugglers 25%, Sleepers 15%

| Subcategory | Key Indicators | Threshold |
|-------------|----------------|-----------|
| Seekers | Q11g, Q12g, Q13g, Q16d, investigation pattern | Highest if curiosity-driven |
| Builders | Q13e, Q16e, Q40d, creation/progress pattern | Highest if making things |
| Strugglers | Q4d (loss wound), Q26 (genuine care), working through difficulty | Highest if in active difficulty |
| Sleepers | Q31e, Q40f, Q48f, functioning without growth | Highest if coasting |

**Topology Modifier for Human:**
- Q33d (mutual growth) → +2 Seekers or Builders
- Q34d (integrate and share) → +2 Seekers
- Q38d (connector) → +2 Builders

**Special Rule:** If Human qualified but no clear subcategory dominance:
- High birth-struggle indicators (Q1a-c, Q2a-c, Q4a-c) → Strugglers
- Low current hindrance scores + high comfort → Sleepers
- Active investigation indicators → Seekers
- Creation/achievement indicators → Builders

### 2.5 Asura Subcategories

**Base distribution within Asura:** Warriors 40%, Measurers 30%, Resenters 20%, Strivers 10%

| Subcategory | Key Indicators | Threshold |
|-------------|----------------|-----------|
| Warriors | Q7h, Q13h, Q39a, Q41a, fighting pattern | Highest if combative |
| Measurers | Q8h, Q11h, Q12h, ranking pattern | Highest if comparison-focused |
| Resenters | Q4e (inadequacy wound), Q19e, victim pattern | Highest if grievance-focused |
| Strivers | Q3e (competing for safety), Q40e, accumulation pattern | Highest if achievement-hungry |

**Topology Modifier for Asura:**
- Q33e (positioning aware) → +2 Measurers
- Q35e (strategic network) → +2 Warriors or Strivers
- Q38e (competing hub) → +2 Warriors

### 2.6 Deva Subcategories

**Base distribution within Deva:** Pleasure 35%, Accomplished 30%, Spiritual 25%, Complacent 10%

| Subcategory | Key Indicators | Threshold |
|-------------|----------------|-----------|
| Pleasure | Q2f, Q11i, Q13i, Q44f, hedonic pattern | Highest if pleasure-focused |
| Accomplished | Q16f, Q22e, Q39d, mastery pattern | Highest if achievement-satisfied |
| Spiritual | Q10i, Q18f, Q39f, transcendence pattern | Highest if spiritual identity |
| Complacent | Q1f, Q3f, Q31e, Q40f, unexamined stability | Highest if simply comfortable |

**Topology Modifier for Deva:**
- Q33f (selective/high standards) → +1 Accomplished or Spiritual
- Q36f (adjust comfortably) → +2 Complacent
- Q38f (stable hub) → +1 to current leading subcategory

---

## PART 3: SHADOW SCORING

Shadow scoring serves two functions:
1. Detect denied/projected material that modifies realm assignment
2. Calculate "shadow gap" that affects result interpretation

### 3.1 Shadow Flags

**Shadow Flag Triggers:**

| Flag | Trigger Condition | Interpretation |
|------|-------------------|----------------|
| DENIED_ANGER | Q10e or Q10i AND Hell indicators elsewhere | Anger pushed to shadow |
| DENIED_DESIRE | Q11f or Q14f AND HG indicators elsewhere | Craving pushed to shadow |
| DENIED_CONFUSION | Q16a (certain) AND Animal indicators elsewhere | Confusion pushed to shadow |
| SPIRITUAL_BYPASS | Q10i + Q18f + Q31e combination | Using "transcendence" to avoid |
| PROJECTION_ACTIVE | Q19 answer matches own highest realm indicators | Projecting shadow onto others |
| NOBLE_INFLATION | Q22 strongly positive AND Q20 strongly negative | Self-image vs. critic gap |

### 3.2 Shadow Gap Calculation

```
SHADOW_GAP = |self_image_score - critic_image_score| + |acknowledged_shadow - detected_shadow| + projection_score
```

Where:
- self_image_score = derived from Q22 (noble story)
- critic_image_score = derived from Q20 (worst critic)
- acknowledged_shadow = Q25 score (what you know you have)
- detected_shadow = shadow flags triggered × 5
- projection_score = Q19 alignment with own realm × 3

**Shadow Gap Interpretation:**
- 0-10: Integrated shadow awareness (Human+ indicator)
- 11-20: Normal shadow gap (no modifier)
- 21-30: Significant denial (apply shadow modifier to realm)
- 31+: Major shadow territory (flag for result, suggest deeper work)

### 3.3 Shadow Modifiers

When shadow flags are triggered, they modify realm scoring:

```
if DENIED_ANGER:
    Hell_score += 8
    stated_realm_score -= 5

if DENIED_DESIRE:
    HG_score += 8
    stated_realm_score -= 5

if SPIRITUAL_BYPASS:
    Deva_score -= 10
    apply Deva(Spiritual) subcategory if still Deva
    flag Guru/Blissed/Transcender risk

if PROJECTION_ACTIVE:
    projected_realm_score += 5
    (what you judge is what you have)
```

### 3.4 Lie Pattern Analysis

Q26 (lie pattern) provides direct insight into attachment structure:

| Answer | Primary Attachment | Realm Indicator |
|--------|-------------------|-----------------|
| a | Protection/fear | Hell |
| b | Acquisition | HG |
| c | Avoidance | Animal |
| d | Connection (genuine or avoidant?) | Human or Animal |
| e | Status | Asura |
| f | Harmony (genuine or bypass?) | Human or Deva |

Cross-reference with other data:
- If Q26d but low genuine inquiry indicators → Animal (avoiding conflict)
- If Q26f but spiritual bypass flags → Deva (avoiding reality)

---

## PART 4: CONSISTENCY SCORING

Consistency scoring compares responses across sections to detect self-deception patterns and assess confidence.

### 4.1 Birth vs. Current Comparison

```
TRAJECTORY_SCORE = current_realm_score - birth_realm_score
```

Interpretation:
- Positive trajectory (birth Hell → current Human): Growth visible
- Negative trajectory (birth Human → current Hell): Regression or crisis
- Stable trajectory (birth ≈ current): Pattern persistence

### 4.2 Considered vs. Speed Round Comparison

```
REFLECTION_GAP = |considered_realm - speed_realm|
```

Where:
- considered_realm = highest realm from Sections 1-6
- speed_realm = highest realm from Section 7 only

Interpretation:
- Low gap (same realm): Integrated, responses consistent
- Medium gap (adjacent realms): Some shadow material
- High gap (distant realms): Significant self-deception, speed round likely truer

**If high reflection gap:** Weight Speed Round realm higher (+5 to speed_realm score)

### 4.3 Self-Report vs. Scenario Comparison

Compare:
- Q10 (stated anger relationship) vs. Q47 (scenario: stranger rude)
- Q14 (stated craving relationship) vs. Q44 (scenario: free weekend)
- Q23 (promotion scenario) vs. Q45 (scenario: friend succeeding)

```
SCENARIO_DISCREPANCY = count of mismatches between stated and scenario responses
```

Interpretation:
- 0-1 mismatches: Consistent self-knowledge
- 2-3 mismatches: Some blind spots
- 4+: Significant gap between self-image and behavior

### 4.4 Consistency Modifier

```
CONSISTENCY_MODIFIER[R] = 
    if R is consistent across all comparisons: +3
    if R shows minor inconsistency: 0
    if R shows major inconsistency: -5 to stated, +5 to detected
```

---

## PART 5: SPECIFIC FORM DETERMINATION

Once realm and subcategory are set, specific form is determined by fine-grained indicators.

### 5.1 Form Indicator Matrix

Each specific form has 2-3 key indicators that distinguish it from others in the same subcategory.

#### HELL FORMS

**Burning Hells:**
| Form | Key Indicators | Distinguishing Pattern |
|------|----------------|----------------------|
| The Inferno | Q7a + Q47a + explosive pattern | Undifferentiated rage, burns everything |
| The Scorcher | Q8a (weaponized intimacy) + targeted pattern | Knows exactly where to hurt |
| The Spreader | Q34a (weaponize info) + triangulation pattern | Creates conflict between others |

**Freezing Hells:**
| Form | Key Indicators | Distinguishing Pattern |
|------|----------------|----------------------|
| The Glacier | Q8b (cutting off) + Q37a (contract violently) | Complete shutdown, unreachable |
| The Bitter | Q7b (cold calculation) + long memory pattern | Frozen resentment, remembers everything |
| The Numb | Q10d + DENIED_ANGER + dissociation pattern | Hatred turned so far inward it's gone |

**Crushing Hells:**
| Form | Key Indicators | Distinguishing Pattern |
|------|----------------|----------------------|
| The Judge | Q8c (correcting) + Q19a (judges cruelty) | Constant evaluation, standards impossible |
| The Executioner | Q9b (being lied to) + punishment pattern | Decided you deserve consequences |

**Repetition Hells:**
| Form | Key Indicators | Distinguishing Pattern |
|------|----------------|----------------------|
| The Ruminant | Q8d (replaying) + Q46a (3am anger/replay) | Thought spirals, can't let go |
| The Self-Flagellant | Q9d (mistakes) + Q10d (self-blame) | Self-directed punishment |

#### HUNGRY GHOST FORMS

**Mouth Ghosts:**
| Form | Key Indicators | Distinguishing Pattern |
|------|----------------|----------------------|
| The Glutton | Q11a (urgent wanting) + Q27a-b (high sense desire) | Quantity over quality, can't stop |
| The Connoisseur | Q11b (specific wants) + Q12b (research/curate) | Quality obsession, sophisticated craving |
| The Addict | Q14a (controls me) + compulsion pattern | Lost agency to craving |

**Status Ghosts:**
| Form | Key Indicators | Distinguishing Pattern |
|------|----------------|----------------------|
| The Collector | Q12b (curating) + accumulation pattern | Things as identity markers |
| The Climber | Q13b (status markers) + Q33b (transactional) | Social position obsession |
| The Influencer | Q12b + Q38b (seeking node) + attention pattern | Craving being seen |

**Void Ghosts:**
| Form | Key Indicators | Distinguishing Pattern |
|------|----------------|----------------------|
| The Browser | Q12c (browse endlessly) + non-commitment pattern | Looking without landing |
| The Emptiness | Q11c (can't name want) + Q14c (vague craving) | Unnamed hole, existential hunger |

**Theft Ghosts:**
| Form | Key Indicators | Distinguishing Pattern |
|------|----------------|----------------------|
| The Coveter | Q11d (want what others have) + envy pattern | Desire activated by others' having |
| The Taker | Q34b (hoard) + Q36b (calculate loss) | Takes without reciprocity |

#### ANIMAL FORMS

**Prey Animals:**
| Form | Key Indicators | Distinguishing Pattern |
|------|----------------|----------------------|
| The Rabbit | Q3a (hypervigilant) + Q30a (extremely agitated) | Frozen anxiety, constant scanning |
| The Deer | Q30b (restless) + flight pattern | Startle response, ready to run |
| The Mouse | Q35c (undefined network) + hiding pattern | Small, invisible, hiding |

**Predator Animals:**
| Form | Key Indicators | Distinguishing Pattern |
|------|----------------|----------------------|
| The Shark | Q34a (weaponize) + constant motion pattern | Never stops, always hunting |
| The Wolf | Pack hunting + strategic predation | Social predator, group dynamics |
| The Snake | Q47c (move on immediately) + cold opportunism | Patient, strikes when advantageous |

**Herd Animals:**
| Form | Key Indicators | Distinguishing Pattern |
|------|----------------|----------------------|
| The Sheep | Q33c (merging) + Q41c (social proof) | Follows, loses self in group |
| The Cattle | Q35c + routine pattern | Defined paths, doesn't question |

**Torpor Animals:**
| Form | Key Indicators | Distinguishing Pattern |
|------|----------------|----------------------|
| The Sloth | Q29a-b (very low energy) + minimal movement | Can barely function |
| The Hibernator | Q15c (freeze) + periodic pattern | Cycles of shutdown |

#### HUMAN FORMS

**Seekers:**
| Form | Key Indicators | Distinguishing Pattern |
|------|----------------|----------------------|
| The Student | Q11g + Q12g + learning pattern | Active learning, gathering |
| The Questioner | Q17d (investigate) + Q31b (questioning) | Inquiry as mode |
| The Practitioner | Q16d + 4+ genuine inquiry indicators | Actually doing the work |

**Builders:**
| Form | Key Indicators | Distinguishing Pattern |
|------|----------------|----------------------|
| The Creator | Q13e (meaningful goals) + making pattern | Creates new things |
| The Achiever | Q40d + completion pattern | Finishes what they start |
| The Experiencer | Q12g + Q44d + presence pattern | Values experience itself |

**Strugglers:**
| Form | Key Indicators | Distinguishing Pattern |
|------|----------------|----------------------|
| The Wounded | Q4d (loss) + healing pattern | Working through trauma |
| The Frustrated | Q38 not d + blocked pattern | Trying but stuck |
| The Desperate | Q31a (deeply uncertain) + crisis pattern | Acute difficulty |

**Sleepers:**
| Form | Key Indicators | Distinguishing Pattern |
|------|----------------|----------------------|
| The Comfortable | Low hindrances + Q40f + coasting | Functioning, not growing |
| The Distracted | Q12c + Q27c + scattered pattern | Attention captured elsewhere |

#### ASURA FORMS

**Warriors:**
| Form | Key Indicators | Distinguishing Pattern |
|------|----------------|----------------------|
| The Conqueror | Q13h (victory) + Q39a + dominance pattern | Must win, must be on top |
| The Fighter | Q7h + Q47 aggressive response | Combat-ready, looking for battles |
| The Underminer | Q34a + covert aggression pattern | Sabotage over direct conflict |

**Measurers:**
| Form | Key Indicators | Distinguishing Pattern |
|------|----------------|----------------------|
| The Ranker | Q12h (track progress) + explicit hierarchy | Knows exactly where everyone stands |
| The One-Upper | Q45 comparison + must exceed pattern | Whatever you did, they did more |
| The Subtle Brag | Q22e + covert status display | Humble-brags, stealth comparison |

**Resenters:**
| Form | Key Indicators | Distinguishing Pattern |
|------|----------------|----------------------|
| The Victim | Q4e + Q20d + grievance identity | Unfairness as core narrative |
| The Critic | Q8c + Q19 strong judgment | Constant evaluation of others |

**Strivers:**
| Form | Key Indicators | Distinguishing Pattern |
|------|----------------|----------------------|
| The Accumulator | Q12h + Q34b + never enough | Achievement hoarding |
| The Thief of Joy | Q45e + can't enjoy others' success | Others' wins feel like losses |

#### DEVA FORMS

**Pleasure Devas:**
| Form | Key Indicators | Distinguishing Pattern |
|------|----------------|----------------------|
| The Hedonist | Q11i + Q44f + pleasure priority | Life organized around enjoyment |
| The Protected | Q1f + Q3f + insulated pattern | Shielded from difficulty |
| The Entitled | Q9i + expectation pattern | Deserves good treatment |

**Accomplished Devas:**
| Form | Key Indicators | Distinguishing Pattern |
|------|----------------|----------------------|
| The Retired | Q16f (done enough) + completion pattern | Finished the game, now resting |
| The Expert | Q34f (appreciation) + mastery pattern | Domain authority, recognized |
| The Mentor | Q38f (stable hub) + teaching pattern | Helps others from arrived position |

**Spiritual Devas:**
| Form | Key Indicators | Distinguishing Pattern |
|------|----------------|----------------------|
| The Guru | Q10i + Q39f + teaching identity | Spiritual authority, may be trap |
| The Blissed | Q30e + positive affect pattern | Identifies with peaceful states |
| The Transcender | Q18f + Q47f + above-it-all pattern | Claims to have moved beyond |

**Complacent Devas:**
| Form | Key Indicators | Distinguishing Pattern |
|------|----------------|----------------------|
| The Comfortable | Q31e + Q40f + unexamined pattern | Life works, why question? |
| The Fortunate | Q1f + Q2f + luck pattern | Born lucky, assumes earned |

### 5.2 Form Selection Algorithm

```python
def select_form(realm, subcategory, answers, scores):
    # Get candidate forms for this subcategory
    candidates = FORMS[realm][subcategory]
    
    form_scores = {}
    for form in candidates:
        form_scores[form] = 0
        for indicator in FORM_INDICATORS[form]:
            if check_indicator(indicator, answers, scores):
                form_scores[form] += indicator.weight
    
    # Select highest scoring form
    selected = max(form_scores, key=form_scores.get)
    
    # If tie, use population distribution as tiebreaker
    # (more common forms win ties)
    if count_ties(form_scores) > 1:
        tied_forms = get_tied_forms(form_scores)
        selected = max(tied_forms, key=lambda f: POPULATION[f])
    
    return selected
```

---

## PART 6: CONFIDENCE SCORING

The quiz should report how confident it is in the result.

### 6.1 Confidence Calculation

```
CONFIDENCE = base_confidence 
    + realm_clarity_bonus
    + consistency_bonus
    - shadow_gap_penalty
    - tie_penalty
```

Where:
- base_confidence = 50
- realm_clarity_bonus = (highest_realm_score - second_highest) × 2 (max +20)
- consistency_bonus = +10 if all consistency checks pass
- shadow_gap_penalty = shadow_gap / 3 (max -15)
- tie_penalty = -10 per tie that required breaking

### 6.2 Confidence Interpretation

| Score | Interpretation | Report Language |
|-------|----------------|-----------------|
| 80+ | High confidence | "Clear pattern" |
| 60-79 | Good confidence | "Likely pattern" |
| 40-59 | Moderate confidence | "Probable pattern, some ambiguity" |
| Below 40 | Low confidence | "Pattern suggested but uncertain" |

### 6.3 When to Report Multiple Results

If confidence is below 50 AND two realms are within 8 points:
- Report primary result
- Note secondary possibility
- Frame as "You may be between [Realm A] and [Realm B]"

---

## PART 7: DISTRIBUTION CALIBRATION

The scoring must be calibrated to achieve target distribution. This requires testing and adjustment.

### 7.1 Calibration Method

1. Run quiz on calibration sample (known cases)
2. Check distribution against targets
3. Adjust thresholds if needed

### 7.2 Threshold Adjustments

If distribution skews from targets:

**Too many Human results:**
- Increase Human qualification threshold
- Add genuine inquiry indicator requirements
- Increase shadow gap penalty for Human

**Too few Hell/Animal results:**
- Decrease these realms' score requirements
- Weight Speed Round higher (catches denied anger/confusion)
- Expand shadow modifier effects

**Too many/few Deva results:**
- Adjust Deva qualification threshold
- Tighten/loosen spiritual bypass detection
- Modify birth privilege indicators

### 7.3 Calibration Parameters

```python
CALIBRATION = {
    'human_threshold': 35,           # Minimum Human score to qualify
    'human_inquiry_required': 3,      # Minimum genuine inquiry indicators
    'human_shadow_max': 15,           # Maximum shadow gap for Human
    'deva_threshold': 30,             # Minimum Deva score to qualify
    'deva_shadow_max': 10,            # Maximum shadow gap for Deva
    'speed_round_weight': 1.3,        # Multiplier for speed round
    'shadow_modifier_strength': 8,    # Points added/removed by shadow flags
    'tie_threshold': 5,               # Points difference that triggers tiebreaker
}
```

These can be adjusted based on testing results.

---

## PART 8: OUTPUT STRUCTURE

### 8.1 Result Components

The final result includes:

1. **Primary Realm** (1 of 6)
2. **Subcategory** (1 of 4 within realm)
3. **Specific Form** (1 of 62 total)
4. **Shadow Gap Score** (0-50+)
5. **Risk Vectors** (likely traps)
6. **Protective Factors** (what's working)
7. **Trajectory** (birth → current direction)
8. **Confidence** (how certain the diagnosis)
9. **The Instruction** (specific guidance for this form)

### 8.2 Result Object

```python
result = {
    'realm': 'Hell',
    'realm_score': 47,
    'subcategory': 'Repetition',
    'subcategory_score': 18,
    'form': 'The Ruminant',
    'form_confidence': 72,
    
    'shadow_gap': 14,
    'shadow_flags': ['DENIED_DESIRE'],
    
    'birth_realm': 'Hell',
    'trajectory': 'stable',
    
    'risk_vectors': ['Spiritual bypass if seeking relief'],
    'protective_factors': ['Awareness of pattern', 'Seeking help'],
    
    'secondary_realm': 'Hungry Ghost',
    'secondary_score': 38,
    
    'consistency_score': 0.75,
    'confidence': 68,
    
    'instruction': 'The exit is not thinking your way out...'
}
```

---

## IMPLEMENTATION NOTES

### Order of Operations

1. Calculate raw realm scores (all sections)
2. Apply section weights
3. Detect shadow flags
4. Calculate shadow gap
5. Apply shadow modifiers to realm scores
6. Check qualification thresholds (Human, Deva)
7. Determine primary realm
8. Calculate subcategory scores
9. Determine subcategory
10. Calculate form indicators
11. Determine specific form
12. Calculate consistency scores
13. Calculate confidence
14. Generate result object

### Edge Cases

- **All scores similar:** Report low confidence, suggest retake with more honesty
- **Many shadow flags:** Flag for review, result may reflect defended state
- **Birth/current major mismatch:** Note transformation or crisis in trajectory
- **Speed round contradicts considered:** Weight speed round, note discrepancy

---

*End of Scoring Algorithm v1.0*

*Next: 62 Specific Form Descriptions + The Instruction for each*

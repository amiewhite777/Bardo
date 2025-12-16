# Adaptive Calibration System

## Overview

The Afterlife Quiz includes an **adaptive calibration system** that learns from real user data and automatically adjusts form selection weights to converge toward target distributions over time.

## How It Works

### 1. Initial State
- All forms start with neutral weight of **1.0** (no adjustment)
- Target percentages are defined in `FORM_POPULATIONS`
- System uses probabilistic selection based on target percentages

### 2. Data Collection
Every time a real user completes the quiz:
```typescript
import { calculateResult, recordUserResult } from 'afterlife-quiz-scoring';

const result = calculateResult(session);

// Record this result for calibration
recordUserResult({
  sessionId: session.sessionId,
  timestamp: session.startTime,
  realm: result.realm,
  subcategory: result.subcategory,
  form: result.form,
  confidence: result.confidence
});
```

### 3. Automatic Recalibration
- **Triggers every 100 users** automatically
- Compares actual distribution vs target distribution
- Adjusts weights for forms that are over/under-represented

### 4. Weight Adjustment Algorithm
```
For each form:
  error = actualPercentage - targetPercentage
  relativeError = error / targetPercentage

  If |relativeError| > 10%:
    adjustment = -relativeError * LEARNING_RATE (15%)
    newWeight = currentWeight * (1 + adjustment)

    Clamp to bounds: 0.3 ≤ newWeight ≤ 3.0
```

### 5. Applied During Selection
```typescript
// In formSelection.ts
const adaptiveWeight = getFormWeight(form); // 0.3 to 3.0
compositeScore = baseline + responseScore + (populationScore * adaptiveWeight);
```

**Effects:**
- **Over-represented forms** (actual > target): Weight decreases → less likely to be selected
- **Under-represented forms** (actual < target): Weight increases → more likely to be selected
- System converges toward targets over time with real user data

## Usage

### In Your Application

```typescript
import {
  calculateResult,
  recordUserResult,
  printCalibrationStatus
} from 'afterlife-quiz-scoring';

// After user completes quiz
const result = calculateResult(userSession);

// Record for calibration (async operation, doesn't block)
recordUserResult({
  sessionId: userSession.sessionId,
  timestamp: Date.now(),
  realm: result.realm,
  subcategory: result.subcategory,
  form: result.form,
  confidence: result.confidence
});

// Return result to user immediately
return result;
```

### CLI Management

```bash
# View current calibration status
npm run build && node dist/calibration-cli.js status

# Manually trigger recalibration
npm run build && node dist/calibration-cli.js recalibrate

# Reset calibration (WARNING: deletes all learned data)
npm run build && node dist/calibration-cli.js reset
```

### Demo

Run the adaptive calibration demo to see it in action:

```bash
npm run build && node dist/adaptive-demo.js
```

This simulates 1000 users taking the quiz and shows how the system learns and adjusts weights.

## Calibration Data Storage

Data is stored in `scoring-engine/data/calibration.json`:

```json
{
  "lastUpdated": 1700000000000,
  "totalSessions": 1523,
  "formCounts": {
    "The Sloth": 45,
    "The Wolf": 38,
    ...
  },
  "formWeights": {
    "The Sloth": 0.72,  // Reduced (over-represented)
    "The Wolf": 1.34,   // Increased (under-represented)
    ...
  },
  "realmCounts": {...},
  "updateHistory": [...]
}
```

## Configuration

Adjust these constants in `adaptive-calibration.ts`:

```typescript
const LEARNING_RATE = 0.15;  // 15% adjustment per cycle (higher = faster learning)
const MIN_WEIGHT = 0.3;      // Minimum weight (prevents forms from vanishing)
const MAX_WEIGHT = 3.0;      // Maximum weight (prevents extreme over-correction)
```

## Expected Behavior

### Short Term (0-500 users)
- Initial distributions may not match targets
- First recalibrations make large adjustments
- System is still learning patterns

### Medium Term (500-2000 users)
- Distributions begin converging toward targets
- Adjustments become smaller and more precise
- Most forms reach ±2% of target

### Long Term (2000+ users)
- High accuracy: most forms within ±1% of target
- Adaptive weights stabilize
- System handles population drift automatically

## Benefits

1. **Self-Correcting**: Automatically fixes distribution skews without manual intervention
2. **Learns from Reality**: Adapts to actual user behavior patterns
3. **Population Drift Handling**: Adjusts if user demographics change over time
4. **No Downtime**: Updates happen in background, no service interruption
5. **Transparent**: Full history and status available via CLI

## Monitoring

Regularly check calibration status:

```bash
node dist/calibration-cli.js status
```

Look for:
- ✅ Forms within ±2% of target
- ⚠️  Forms with large errors (>5%)
- 📊 Weight distributions (most should be 0.7-1.5 range)
- 📈 Update history (adjustments should decrease over time)

## Example Output

```
ADAPTIVE CALIBRATION STATUS
====================================
Total Sessions: 1,523
Last Updated: 12/15/2024, 3:42:15 PM
Calibration Updates: 15

TOP 20 FORMS BY ACTUAL DISTRIBUTION:

Form                      | Actual  | Target  | Weight | Diff
------------------------------------------------------------------
The Sloth                 |   2.89% |   2.20% |   0.72 | +0.69%
The Wolf                  |   2.43% |   2.75% |   1.34 | -0.32%
The Sheep                 |   4.26% |   4.13% |   0.98 | +0.13%
...
```

## Troubleshooting

**Q: A form is still unreachable after 1000+ users**
- Check if form has any scoring paths in questions
- Verify subcategory routing is working
- May need to add targeted questions for that form

**Q: Distributions aren't converging**
- Increase LEARNING_RATE for faster adjustments
- Check if POPULATION_WEIGHT is high enough (should be 10000+)
- Verify real user data is being recorded

**Q: Want to start fresh**
```bash
node dist/calibration-cli.js reset
```

## Integration Checklist

- [ ] Call `recordUserResult()` after each quiz completion
- [ ] Set up monitoring/alerting for calibration status
- [ ] Schedule periodic status checks (weekly)
- [ ] Back up `calibration.json` regularly
- [ ] Document expected distributions for your user base
- [ ] Test calibration with simulated users first
- [ ] Monitor convergence metrics over first 1000 users

## Future Enhancements

Potential improvements:
- Subcategory-level adaptive weights
- Realm-level balancing
- Time-of-day adjustments
- Demographic-specific calibrations
- A/B testing support
- Confidence-weighted learning

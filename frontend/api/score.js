import { calculateSimpleResult, recordUserResult } from '../lib/scoring/index.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = req.body;

    if (!session || !session.responses || !Array.isArray(session.responses)) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    // Calculate the result using simplified scorer
    const result = calculateSimpleResult(session);

    // Record for adaptive calibration
    try {
      recordUserResult({
        sessionId: session.sessionId,
        timestamp: session.startTime || Date.now(),
        realm: result.realm,
        subcategory: result.subcategory,
        form: result.form,
        confidence: result.confidence
      });
    } catch (calibrationError) {
      // Don't fail the request if calibration fails
      console.error('Calibration recording failed:', calibrationError);
    }

    // Return the result
    return res.status(200).json(result);
  } catch (error) {
    console.error('Scoring error:', error);
    return res.status(500).json({ 
      error: 'Failed to calculate result',
      details: error.message 
    });
  }
}

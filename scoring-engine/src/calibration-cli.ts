/**
 * Calibration CLI Tool
 *
 * Command-line interface for managing adaptive calibration
 */

import {
  printCalibrationStatus,
  resetCalibration,
  recalibrate
} from './adaptive-calibration.js';

const command = process.argv[2];

switch (command) {
  case 'status':
    printCalibrationStatus();
    break;

  case 'recalibrate':
    recalibrate();
    break;

  case 'reset':
    console.log('\n⚠️  Are you sure you want to reset all calibration data?');
    console.log('This will delete all learned weights and user data.\n');
    // In production, add confirmation prompt
    resetCalibration();
    break;

  default:
    console.log('\n📊 Adaptive Calibration CLI\n');
    console.log('Usage:');
    console.log('  node dist/calibration-cli.js status       - Show current calibration status');
    console.log('  node dist/calibration-cli.js recalibrate  - Manually trigger recalibration');
    console.log('  node dist/calibration-cli.js reset        - Reset calibration to defaults\n');
    break;
}

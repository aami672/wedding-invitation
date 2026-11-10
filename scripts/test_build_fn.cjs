const fs = require('fs');
const path = require('path');

// Let's test if buildFn generates clean HTML with 3D folding doors, single event, etc.
const wizPath = path.join(__dirname, '../src/components/studio/StudioWizard.jsx');
const wizCode = fs.readFileSync(wizPath, 'utf8');

const startMarker = 'const standaloneHtml = `<!DOCTYPE html>';
const endMarker = '</html>`;';

const startIdx = wizCode.indexOf(startMarker);
const endIdx = wizCode.indexOf(endMarker, startIdx);

console.log('Bounds found:', startIdx !== -1, endIdx !== -1);

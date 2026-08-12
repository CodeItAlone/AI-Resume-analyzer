import assert from 'node:assert';
import { computeOverallScore } from '../lib/scorer';

console.log('Running unit test for computeOverallScore...');

const skills = 83;
const experience = 100;
const education = 100;
const semantic = 88;

// Locked formula: (83 * 0.40) + (100 * 0.25) + (100 * 0.15) + (88 * 0.20)
// 33.2 + 25 + 15 + 17.6 = 90.8 -> Math.round = 91
const result = computeOverallScore(skills, experience, education, semantic);
const expected = Math.round(83 * 0.40 + 100 * 0.25 + 100 * 0.15 + 88 * 0.20);

assert.strictEqual(result, expected, `Expected ${expected} but got ${result}`);
console.log(`✅ TEST PASSED: computeOverallScore(${skills}, ${experience}, ${education}, ${semantic}) = ${result} (Expected ${expected})`);

import assert from 'node:assert';
import { normalizeSkillName, areSkillsEquivalent } from '../lib/normalization/skills';
import { computeOverallScore } from '../lib/scorer';
import { resolveCandidateEvidence } from '../lib/evidence/resolver';
import { CandidateProfile } from '../lib/types/resume';

console.log('=== RUNNING UPGRADED ARCHITECTURE SUITE ===');

// Test 1: Skill Normalization
console.log('Test 1: Skill Normalization');
assert.strictEqual(normalizeSkillName('react.js'), 'React');
assert.strictEqual(normalizeSkillName('postgres'), 'PostgreSQL');
assert.strictEqual(normalizeSkillName('k8s'), 'Kubernetes');
assert.strictEqual(areSkillsEquivalent('ts', 'TypeScript'), true);
console.log('✅ PASS: Skill Normalization');

// Test 2: Scorer Worked Example Regression
console.log('Test 2: Scorer Worked Example Regression');
const score = computeOverallScore(83, 100, 100, 88);
assert.strictEqual(score, 91);
console.log('✅ PASS: Scorer Regression');

// Test 3: Evidence Strength Resolution (Claimed vs Supported)
console.log('Test 3: Evidence Strength Resolution');
const mockCandidate: CandidateProfile = {
  basics: { name: 'Subrato Kundu' },
  totalExperienceYears: 5,
  skills: ['React', 'Java', 'AWS'], // AWS listed in skills section only
  education: [{ degree: "Bachelor's Degree" }],
  experience: [
    {
      company: 'Tech Corp',
      title: 'Full Stack Engineer',
      responsibilities: ['Developed REST APIs using React and Java'],
    },
  ],
  projects: [],
};

const evidence = resolveCandidateEvidence(mockCandidate);

const awsEvidence = evidence.find(e => e.normalizedSkill === 'AWS');
assert.strictEqual(awsEvidence?.status, 'CLAIMED');
assert.strictEqual(awsEvidence?.overallStrength, 0.3);

const javaEvidence = evidence.find(e => e.normalizedSkill === 'Java');
assert.strictEqual(javaEvidence?.status, 'SUPPORTED');
assert.strictEqual(javaEvidence?.overallStrength, 0.8);

console.log('✅ PASS: Evidence Strength Resolution (AWS = CLAIMED, Java = SUPPORTED)');

console.log('=== ALL UPGRADE REGRESSION TESTS PASSED ===');

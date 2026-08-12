export interface CanonicalSkill {
  canonical: string;
  aliases: string[];
  category?: 'frontend' | 'backend' | 'database' | 'devops' | 'mobile' | 'language' | 'cloud' | 'tool';
}

export const CANONICAL_SKILL_DICTIONARY: CanonicalSkill[] = [
  { canonical: 'React', aliases: ['react.js', 'reactjs', 'react native'] },
  { canonical: 'TypeScript', aliases: ['ts', 'typescript.js'] },
  { canonical: 'JavaScript', aliases: ['js', 'javascript.js', 'ecmascript'] },
  { canonical: 'Node.js', aliases: ['node', 'nodejs', 'node js'] },
  { canonical: 'Next.js', aliases: ['next', 'nextjs', 'next js'] },
  { canonical: 'PostgreSQL', aliases: ['postgres', 'postgresql db', 'psql'] },
  { canonical: 'MongoDB', aliases: ['mongo', 'mongodb db'] },
  { canonical: 'Python', aliases: ['py', 'python3', 'python 3'] },
  { canonical: 'Java', aliases: ['core java', 'java8', 'java11', 'java17'] },
  { canonical: 'Spring Boot', aliases: ['spring', 'springboot', 'spring framework'] },
  { canonical: 'Docker', aliases: ['docker container', 'containerization'] },
  { canonical: 'Kubernetes', aliases: ['k8s', 'k8', 'kube'] },
  { canonical: 'AWS', aliases: ['amazon web services', 'aws cloud', 'ec2', 's3', 'lambda'] },
  { canonical: 'GCP', aliases: ['google cloud', 'google cloud platform'] },
  { canonical: 'Azure', aliases: ['microsoft azure', 'azure cloud'] },
  { canonical: 'Tailwind CSS', aliases: ['tailwind', 'tailwindcss'] },
  { canonical: 'REST API', aliases: ['rest', 'restful', 'restful api', 'rest apis'] },
  { canonical: 'GraphQL', aliases: ['gql'] },
  { canonical: 'Git', aliases: ['github', 'gitlab', 'version control'] },
  { canonical: 'CI/CD', aliases: ['continuous integration', 'github actions', 'jenkins'] },
];

export function normalizeSkillName(rawSkill: string): string {
  if (!rawSkill || !rawSkill.trim()) return '';

  const clean = rawSkill.toLowerCase().trim();

  for (const item of CANONICAL_SKILL_DICTIONARY) {
    if (item.canonical.toLowerCase() === clean) return item.canonical;
    if (item.aliases.some(alias => alias.toLowerCase() === clean)) {
      return item.canonical;
    }
  }

  // Generic formatting capitalization for unlisted skills
  return rawSkill.trim().replace(/\b\w/g, char => char.toUpperCase());
}

export function areSkillsEquivalent(skillA: string, skillB: string): boolean {
  if (!skillA || !skillB) return false;
  return normalizeSkillName(skillA) === normalizeSkillName(skillB);
}

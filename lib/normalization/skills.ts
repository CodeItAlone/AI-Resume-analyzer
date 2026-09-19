export interface CanonicalSkill {
  canonical: string;
  aliases: string[];
  category?: 'frontend' | 'backend' | 'database' | 'devops' | 'mobile' | 'language' | 'cloud' | 'tool' | 'methodology';
}

export const CANONICAL_SKILL_DICTIONARY: CanonicalSkill[] = [
  // Languages
  { canonical: 'JavaScript', aliases: ['js', 'javascript.js', 'ecmascript', 'es6', 'es2020'], category: 'language' },
  { canonical: 'TypeScript', aliases: ['ts', 'typescript.js'], category: 'language' },
  { canonical: 'Python', aliases: ['py', 'python3', 'python 3'], category: 'language' },
  { canonical: 'Java', aliases: ['core java', 'java8', 'java11', 'java17', 'java 17', 'java 21'], category: 'language' },
  { canonical: 'C++', aliases: ['cpp', 'c plus plus'], category: 'language' },
  { canonical: 'C#', aliases: ['csharp', 'c sharp', '.net'], category: 'language' },
  { canonical: 'Go', aliases: ['golang', 'go language'], category: 'language' },
  { canonical: 'Rust', aliases: ['rustlang', 'rust-lang'], category: 'language' },
  { canonical: 'PHP', aliases: ['php7', 'php8'], category: 'language' },
  { canonical: 'Ruby', aliases: ['ruby on rails', 'rails'], category: 'language' },
  { canonical: 'Swift', aliases: ['swiftui'], category: 'language' },
  { canonical: 'Kotlin', aliases: ['kotlin/android'], category: 'language' },
  { canonical: 'SQL', aliases: ['structured query language', 't-sql', 'pl/sql'], category: 'language' },
  { canonical: 'HTML/CSS', aliases: ['html', 'html5', 'css', 'css3'], category: 'frontend' },

  // Frontend
  { canonical: 'React', aliases: ['react.js', 'reactjs', 'react native'], category: 'frontend' },
  { canonical: 'Next.js', aliases: ['next', 'nextjs', 'next js', 'next.js 14', 'next.js 15'], category: 'frontend' },
  { canonical: 'Vue.js', aliases: ['vue', 'vuejs', 'vue 3', 'nuxt', 'nuxtjs'], category: 'frontend' },
  { canonical: 'Angular', aliases: ['angularjs', 'angular 2+', 'angular 17'], category: 'frontend' },
  { canonical: 'Svelte', aliases: ['sveltekit', 'svelte.js'], category: 'frontend' },
  { canonical: 'Tailwind CSS', aliases: ['tailwind', 'tailwindcss'], category: 'frontend' },
  { canonical: 'Redux', aliases: ['redux toolkit', 'rtk', 'zustand'], category: 'frontend' },

  // Backend
  { canonical: 'Node.js', aliases: ['node', 'nodejs', 'node js'], category: 'backend' },
  { canonical: 'Express', aliases: ['express.js', 'expressjs'], category: 'backend' },
  { canonical: 'Spring Boot', aliases: ['spring', 'springboot', 'spring framework', 'spring mvc'], category: 'backend' },
  { canonical: 'Django', aliases: ['django rest framework', 'drf'], category: 'backend' },
  { canonical: 'FastAPI', aliases: ['fast api', 'fastapi framework'], category: 'backend' },
  { canonical: 'Flask', aliases: ['flask framework'], category: 'backend' },
  { canonical: 'NestJS', aliases: ['nest.js', 'nest js'], category: 'backend' },
  { canonical: 'GraphQL', aliases: ['gql', 'apollo graphql'], category: 'backend' },
  { canonical: 'REST API', aliases: ['rest', 'restful', 'restful api', 'rest apis', 'api design'], category: 'backend' },
  { canonical: 'Microservices', aliases: ['microservice', 'micro-services'], category: 'backend' },

  // Database
  { canonical: 'PostgreSQL', aliases: ['postgres', 'postgresql db', 'psql'], category: 'database' },
  { canonical: 'MySQL', aliases: ['mariadb', 'my-sql'], category: 'database' },
  { canonical: 'MongoDB', aliases: ['mongo', 'mongodb db', 'mongoose'], category: 'database' },
  { canonical: 'Redis', aliases: ['redis cache'], category: 'database' },
  { canonical: 'SQLite', aliases: ['sqlite3'], category: 'database' },
  { canonical: 'Elasticsearch', aliases: ['elastic search', 'elk'], category: 'database' },

  // Cloud & DevOps
  { canonical: 'AWS', aliases: ['amazon web services', 'aws cloud', 'ec2', 's3', 'lambda', 'ecs', 'eks', 'dynamodb'], category: 'cloud' },
  { canonical: 'GCP', aliases: ['google cloud', 'google cloud platform', 'bigquery', 'cloud run'], category: 'cloud' },
  { canonical: 'Azure', aliases: ['microsoft azure', 'azure cloud', 'azure devops'], category: 'cloud' },
  { canonical: 'Docker', aliases: ['docker container', 'containerization', 'dockerfile', 'docker-compose'], category: 'devops' },
  { canonical: 'Kubernetes', aliases: ['k8s', 'k8', 'kube', 'helm'], category: 'devops' },
  { canonical: 'CI/CD', aliases: ['continuous integration', 'github actions', 'jenkins', 'gitlab ci'], category: 'devops' },
  { canonical: 'Terraform', aliases: ['infrastructure as code', 'iac'], category: 'devops' },
  { canonical: 'Linux', aliases: ['ubuntu', 'debian', 'centos', 'bash', 'unix', 'shell scripting'], category: 'devops' },
  { canonical: 'Git', aliases: ['github', 'gitlab', 'version control', 'bitbucket'], category: 'tool' },

  // AI & Data
  { canonical: 'Machine Learning', aliases: ['ml', 'deep learning', 'ai', 'artificial intelligence'], category: 'tool' },
  { canonical: 'PyTorch', aliases: ['torch'], category: 'tool' },
  { canonical: 'TensorFlow', aliases: ['tf', 'keras'], category: 'tool' },
  { canonical: 'OpenAI API', aliases: ['openai', 'llm', 'large language models', 'langchain', 'llamaindex'], category: 'tool' },
  { canonical: 'Pandas', aliases: ['numpy', 'scipy', 'data analysis'], category: 'tool' },
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

/**
 * Scans arbitrary text and extracts all recognizable canonical skills present in the text.
 */
export function extractSkillsFromText(text: string): string[] {
  if (!text || !text.trim()) return [];

  const lowerText = ` ${text.toLowerCase().replace(/[^a-z0-9+#./\s-]/g, ' ')} `;
  const matched = new Set<string>();

  for (const item of CANONICAL_SKILL_DICTIONARY) {
    const canonicalLower = item.canonical.toLowerCase();
    
    // Check canonical name as a whole word boundary
    const canonicalRegex = new RegExp(`(?:^|[\\s,;()/\\[\\]])${escapeRegex(canonicalLower)}(?:$|[\\s,;()/\\[\\]])`, 'i');
    if (canonicalRegex.test(lowerText)) {
      matched.add(item.canonical);
      continue;
    }

    // Check aliases
    for (const alias of item.aliases) {
      const aliasRegex = new RegExp(`(?:^|[\\s,;()/\\[\\]])${escapeRegex(alias.toLowerCase())}(?:$|[\\s,;()/\\[\\]])`, 'i');
      if (aliasRegex.test(lowerText)) {
        matched.add(item.canonical);
        break;
      }
    }
  }

  return Array.from(matched);
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

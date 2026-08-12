export * from './resume';
export * from './job';
export * from './evidence';
export * from './matching';
export * from './scoring';
export * from './analysis';

// Backward compatibility alias imports for existing codebase
export type { CandidateProfile as ResumeData } from './resume';
export type { JobRequirementModel as JobDescriptionData } from './job';

export type RequirementType = 'REQUIRED' | 'PREFERRED' | 'BONUS' | 'RESPONSIBILITY' | 'CONTEXT';

export interface JobRequirement {
  id: string;
  text: string;
  category: 'skill' | 'experience' | 'education' | 'certification' | 'responsibility';
  requirementType: RequirementType;
  normalizedSkill?: string;
  criticality: number; // 0.0 to 1.0 (1.0 = Critical)
  importance: number;  // Weight relative to section
  evidenceExpected?: boolean;
}

export interface JobRequirementModel {
  jobTitle: string;
  seniorityLevel?: string;
  requirements: JobRequirement[];
  requiredSkills: string[];
  preferredSkills: string[];
  experienceRequiredYears: number;
  educationRequired: string;
  keywords: string[];
}

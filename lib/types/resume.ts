export interface CandidateBasics {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface CandidateWorkExperience {
  company: string;
  title: string;
  startDate?: string;
  endDate?: string;
  years?: number;
  responsibilities?: string[];
  achievements?: string[];
  technologies?: string[];
}

export interface CandidateEducation {
  degree: string;
  institution?: string;
  year?: string;
  fieldOfStudy?: string;
}

export interface CandidateProject {
  name: string;
  description?: string;
  technologies?: string[];
  githubUrl?: string;
  liveUrl?: string;
  highlights?: string[];
}

export interface CandidateProfile {
  basics: CandidateBasics;
  summary?: string;
  currentTitle?: string;
  totalExperienceYears: number;
  skills: string[];
  education: CandidateEducation[];
  experience: CandidateWorkExperience[];
  projects?: CandidateProject[];
  certifications?: string[];
  achievements?: string[];
}

export const API_URL = "http://localhost:5000";
export const templateNames = ["SampleResume","T1"];

export interface ResumeData {
  id: string | null;
  template: string | null;
  order: Array<string>;
  personalDetails: {
    name: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    location: string;
    country: string;
  };
  summary: string;
  workExperience: Array<{
    id: string;
    company: string;
    role: string;
    duration: string;
    description: string;
    bulletPoints: Array<string>;
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    year: string;
    description: string;
    grade: string;
    location: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
    level: string;
    key: string;
    value: string;
  }>;
  projects: Array<{
    id: string;
    title: string;
    link: string;
    description: string;
    bulletPoints: Array<string>;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    year: string;
    description: string;
    bulletPoints: Array<string>;
    isBulletPoints: boolean;
  }>;
  languages: Array<{
    id: string;
    language: string;
    level: string;
  }>
}



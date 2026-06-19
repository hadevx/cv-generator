export interface PersonalInfo {
  fullName: string
  title: string
  email: string
  phone: string
  location: string
  website: string
  linkedin: string
  summary: string
}

export interface Experience {
  id: string
  company: string
  role: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  gpa: string
  description: string
}

export interface Skill {
  id: string
  name: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
}

export interface SkillGroup {
  id: string
  name: string
  skills: Skill[]
}

export interface Project {
  id: string
  name: string
  description: string
  url: string
  technologies: string
}

export interface CVData {
  personal: PersonalInfo
  experiences: Experience[]
  education: Education[]
  skills: SkillGroup[]
  projects: Project[]
  theme: 'classic' | 'modern' | 'minimal' | 'executive' | 'creative' | 'tech'
  accentColor: string
  showSkillLevel: boolean
  language: 'en' | 'ar'
}

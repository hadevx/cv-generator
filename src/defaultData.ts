import type { CVData } from './types'

export const defaultCV: CVData = {
  personal: {
    fullName: 'Alex Johnson',
    title: 'Full Stack Developer',
    email: 'alex@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'alexjohnson.dev',
    linkedin: 'linkedin.com/in/alexjohnson',
    summary:
      'Passionate full stack developer with 5+ years of experience building scalable web applications. Skilled in React, Node.js, and cloud infrastructure.',
  },
  experiences: [
    {
      id: '1',
      company: 'TechCorp Inc.',
      role: 'Senior Full Stack Developer',
      startDate: '2022-01',
      endDate: '',
      current: true,
      description:
        'Led development of microservices architecture serving 1M+ users. Mentored junior developers and drove adoption of TypeScript across the team.',
    },
    {
      id: '2',
      company: 'StartupXYZ',
      role: 'Frontend Developer',
      startDate: '2020-03',
      endDate: '2021-12',
      current: false,
      description:
        'Built and maintained React applications. Improved page load speed by 40% through code splitting and lazy loading.',
    },
  ],
  education: [
    {
      id: '1',
      institution: 'University of California',
      degree: "Bachelor's",
      field: 'Computer Science',
      startDate: '2016-09',
      endDate: '2020-05',
      gpa: '3.8',
      description: '',
    },
  ],
  skills: [
    {
      id: '1',
      name: 'Frontend',
      skills: [
        { id: '1-1', name: 'React', level: 'Expert' },
        { id: '1-2', name: 'TypeScript', level: 'Expert' },
      ],
    },
    {
      id: '2',
      name: 'Backend',
      skills: [
        { id: '2-1', name: 'Node.js', level: 'Advanced' },
        { id: '2-2', name: 'PostgreSQL', level: 'Advanced' },
      ],
    },
    {
      id: '3',
      name: 'DevOps',
      skills: [
        { id: '3-1', name: 'Docker', level: 'Intermediate' },
        { id: '3-2', name: 'AWS', level: 'Intermediate' },
      ],
    },
  ],
  projects: [
    {
      id: '1',
      name: 'OpenTask',
      description: 'Open-source project management tool with real-time collaboration.',
      url: 'github.com/alex/opentask',
      technologies: 'React, Node.js, Socket.io, PostgreSQL',
    },
  ],
  theme: 'modern',
  accentColor: '#2563eb',
  showSkillLevel: true,
  language: 'en',
}

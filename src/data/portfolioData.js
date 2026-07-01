// ============================================
// PORTFOLIO DATA — Aryan Yadav
// All editable content lives here.
// ============================================

export const profile = {
  name: 'Aryan Yadav',
  role: 'Software Developer | Full Stack | Open Source',
  location: 'India',
  email: 'aryanyadav30705@gmail.com',
  resumePath: '/resume.pdf',
};

export const socials = {
  instagram: 'https://instagram.com/wakeeuparyan',
  linkedin:  'https://linkedin.com/in/aryan-kumar-yadav/',
  github:    'https://github.com/Aryan-Kr-Yadav',
  leetcode:  'https://leetcode.com/u/Aryan_Kumar_Yadav/',
  email:     'mailto:aryanyadav30705@gmail.com',
};

export const githubUsername  = 'Aryan-Kr-Yadav';
export const leetcodeUsername = 'Aryan_Kumar_Yadav';

export const navLinks = [
  { label: 'Home',       href: '#home' },
  { label: 'About',      href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills',     href: '#skills' },
  { label: 'Projects',   href: '#projects' },
  { label: 'GitHub',     href: '#github' },
  { label: 'LeetCode',   href: '#leetcode' },
  { label: 'Memories',   href: '#memories' },
  { label: 'Resume',     href: '#resume' },
  { label: 'Contact',    href: '#contact' },
];

export const experience = [
  {
    title: 'Open Source Contributor',
    period: '2025 — Present',
    description: 'Contributing to open source projects, fixing issues, improving documentation, and collaborating with amazing developers from around the world.',
  },
  {
    title: 'GDG ABESEC Member',
    period: '2024 — Present',
    description: 'Organizing coding events, workshops, hackathons, and tech talks for hundreds of students as part of Google Developer Group ABESEC.',
  },
  {
    title: 'Trishul ABESEC Member',
    period: '2024 — Present',
    description: 'Active member of the college defense society, building leadership, discipline, and teamwork through structured programs.',
  },
];

export const skillsStats = [
  { label: 'Languages',  value: '05' },
  { label: 'Frameworks', value: '04' },
  { label: 'Databases',  value: '02' },
  { label: 'Tools',      value: '08' },
];

export const skillCategories = [
  { category: 'Languages',  items: ['C++', 'Python', 'JavaScript', 'SQL', 'HTML/CSS'] },
  { category: 'Frameworks', items: ['React', 'Node.js', 'Express', 'Flask'] },
  { category: 'Databases',  items: ['MongoDB', 'MySQL'] },
  { category: 'Tools',      items: ['Git', 'GitHub', 'VS Code', 'Postman', 'Linux', 'Docker', 'OpenCV', 'MediaPipe'] },
];

export const projects = [
  {
    title: 'FocusLens',
    tagline: 'AI Eye-Tracking Monitor',
    description: 'Real-time AI attention monitoring system using Python, OpenCV and MediaPipe — tracks blinks, head position and generates a focus score.',
    stack: ['Python', 'OpenCV', 'MediaPipe', 'NumPy'],
    liveUrl: 'https://github.com/Aryan-Kr-Yadav',
    githubUrl: 'https://github.com/Aryan-Kr-Yadav',
  },
  {
    title: 'KrishiMitra AI',
    tagline: 'Agricultural AI Assistant',
    description: 'AI-powered agricultural assistant that identifies crop diseases from photos and recommends treatments in local languages for farmers.',
    stack: ['Python', 'AI API', 'Flask', 'HTML/CSS'],
    liveUrl: 'https://github.com/Aryan-Kr-Yadav',
    githubUrl: 'https://github.com/Aryan-Kr-Yadav',
  },
  {
    title: 'ABES Boys Hostel',
    tagline: 'Campus Management Portal',
    description: 'Official website for ABES Engineering College Boys Hostel — facilities, rooms, amenities and contact management in pure vanilla web tech.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    liveUrl: 'https://github.com/Aryan-Kr-Yadav',
    githubUrl: 'https://github.com/Aryan-Kr-Yadav',
  },
];

export const memories = [
  { title: 'College Fest',          category: 'Events'     },
  { title: 'Hackathon 2.0',         category: 'Events'     },
  { title: 'Late Night Debugging',  category: 'Grind'      },
  { title: 'Team Outing',           category: 'Friends'    },
  { title: 'Tech Talk',             category: 'Events'     },
  { title: 'Achievement Unlocked',  category: 'Milestones' },
  { title: 'Friends Forever',       category: 'Friends'    },
  { title: 'Random Clicks',         category: 'Candid'     },
];

// Fallback LeetCode breakdown (used when API is unavailable)
export const leetcodeBreakdown = [
  { level: 'Easy',   count: 20, color: '#5B8A6F' },
  { level: 'Medium', count: 15, color: '#C99A3D' },
  { level: 'Hard',   count: 5,  color: '#A8462F' },
];

export const footerData = {
  left:   'Thank you for visiting',
  center: '© 2025 Aryan Yadav. All rights reserved.',
  right:  'Keep coding. Keep growing.',
};

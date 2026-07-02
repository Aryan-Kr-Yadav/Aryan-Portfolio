// ============================================
// PORTFOLIO DATA — Aryan Yadav
// All editable content lives here.
// ============================================

import focuslens from '../assets/images/focuslens.png';
import krishimitra from '../assets/images/krishimitra.png';
import hostel from '../assets/images/hostel.png';
import GDGEvent from '../assets/images/GDGEvent.png';
import Trishul from '../assets/images/Trishul.png';
import hackathon from '../assets/images/hackathon.png';
import friendgroup from '../assets/images/friendgroup.png';
import gdg from '../assets/images/gdg.png';
import marathon from '../assets/images/marathon.png';
import college from '../assets/images/college.png';
import dp from '../assets/images/dp.png';

export const profile = {
  name: 'Aryan Kumar Yadav',
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
    period: '2026 — Present',
    description: 'Contributing bug fixes, documentation improvements, and feature enhancements while collaborating with developers across the global open-source community.',
  },
  {
    title: 'GDG ABESEC Member',
    period: '2025 — Present',
    description: 'Organizing coding events, workshops, hackathons, and tech talks for hundreds of students as part of Google Developer Group ABESEC.',
  },
  {
    title: 'Trishul ABESEC Member',
    period: '2025 — Present',
    description: 'Active member of the college defence aspirant society, building leadership, discipline, and teamwork through structured programs.',
  },
];

export const skillsStats = [
  { label: 'Languages',  value: '06' },
  { label: 'Frameworks', value: '03' },
  { label: 'Databases',  value: '01' },
  { label: 'Tools',      value: '07' },
];

export const skillCategories = [
  { category: 'Languages',  items: ['C++', 'C', 'Python', 'Java', 'JavaScript', 'HTML/CSS'] },
  { category: 'Frameworks', items: ['React', 'Tailwind CSS', 'Bootstrap'] },
  { category: 'Databases',  items: ['MySQL'] },
  { category: 'Tools',      items: ['Git', 'GitHub', 'VS Code', 'Figma', 'Canva', 'Capcut', 'Netlify'] },
];

export const projects = [
  {
    title: 'FocusLens',
    image : focuslens,
    tagline: 'AI Eye-Tracking Monitor',
    description: 'Real-time AI attention monitoring system using Python, OpenCV and MediaPipe — tracks blinks, head position and generates a focus score.',
    stack: ['Python', 'OpenCV', 'MediaPipe', 'NumPy'],
    liveUrl: 'https://github.com/Aryan-Kr-Yadav',
    githubUrl: 'https://github.com/Aryan-Kr-Yadav',
  },
  {
    title: 'KrishiMitra AI',
    image : krishimitra ,
    tagline: 'Agricultural AI Assistant',
    description: 'AI-powered agricultural assistant that identifies crop diseases from photos and recommends treatments in local languages for farmers.',
    stack: ['Python', 'AI API', 'Flask', 'HTML/CSS'],
    liveUrl: 'https://github.com/Aryan-Kr-Yadav',
    githubUrl: 'https://github.com/Aryan-Kr-Yadav',
  },
  {
    title: 'ABES Boys Hostel',
    image : hostel ,
    tagline: 'Campus Management Portal',
    description: 'Official website for ABES Engineering College Boys Hostel — facilities, rooms, amenities and contact management in pure vanilla web tech.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    liveUrl: 'https://github.com/Aryan-Kr-Yadav',
    githubUrl: 'https://github.com/Aryan-Kr-Yadav',
  },
];

export const memories = [
  { title: 'GDG MIND THE GAP', image : GDGEvent,  category: 'Events'     },
  { title: 'Trishul Event', image : Trishul , category: 'Events'     },
  { title: 'Hackathon', image : hackathon  , category: 'Grind'      },
  { title: 'Friends Forever', image : friendgroup  ,category: 'Friends'    },
  { title: 'Tech Talk', image : gdg  , category: 'Events'     },
  { title: 'Achievement Unlocked', image : marathon ,  category: 'Milestones' },
  { title: 'Friends Forever', image : college ,  category: 'Friends'    },
  { title: 'Random Clicks', image : dp ,  category: 'Candid'     },
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

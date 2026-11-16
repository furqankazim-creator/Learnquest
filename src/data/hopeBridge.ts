export const HOPE_BRIDGE_URL = 'https://hopebirdgedigital.site/';
export const HOPE_BRIDGE_ANGEL_TALK_URL = 'https://hopebirdgedigital.site/apps/angel-talk';
export const HOPE_BRIDGE_EMAIL = 'hello@hopebridgedigital.com';
export const HOPE_BRIDGE_MISSION = 'Calm, family-first digital tools that empower autistic children and children with speech, language, and attention needs at home, school, and in therapy.';

export const HOPE_BRIDGE_PILLARS = [
  'Privacy-First',
  'Therapist-Guided',
  'Sensory-Friendly',
  'Bilingual',
] as const;

export const BLOOM_FEATURES = [
  { ico: '🗣️', title: 'AI Text-to-Visual Learning', desc: 'Every typed or spoken sentence is transformed into an instant visual illustration.' },
  { ico: '📍', title: 'Interactive Spatial Learning', desc: 'Understand positions — under, above, behind, beside, between — through interactive visual scenes.' },
  { ico: '🔢', title: 'Visual Mathematics', desc: 'Learn numbers, calculations, shapes and maths story problems through pictures and animations.' },
  { ico: '🎬', title: 'Video-Based Learning', desc: 'Watch educational videos organised by topic, subject and grade level with step-by-step visuals.' },
  { ico: '📚', title: 'Grade-Based Curriculum', desc: 'Structured learning content for Grades 1–5 covering English, Mathematics and Science.' },
  { ico: '📖', title: 'Topic-Wise Lessons', desc: 'Organised chapters, explanatory videos, visual examples and practice activities.' },
] as const;

export const BLOOM_VIDEO_STEPS = [
  { num: '1', title: 'Select Grade', desc: 'Choose Grade 1, 2, 3, 4 or 5.' },
  { num: '2', title: 'Choose Subject', desc: 'English, Mathematics or Science.' },
  { num: '3', title: 'Select Topic', desc: 'Browse chapters and individual learning topics.' },
  { num: '4', title: 'Watch Video', desc: 'Learn through animated explanations and examples.' },
  { num: '5', title: 'Practice & Test', desc: 'Complete interactive exercises and topic-based questions.' },
  { num: '6', title: 'Track Progress', desc: 'Monitor completed videos, quiz scores and learning progress.' },
] as const;

export const HOPE_BRIDGE_APPS = [
  {
    name: 'Angel Artic',
    ico: '😇',
    tagline: 'Speak • Play • Shine',
    category: 'Speech Sound Practice',
    color: '#6C5CE7',
    audience: 'Children with speech sound delays, articulation challenges, or autism.',
    description: 'Gentle speech sound practice with 17 sounds, visual mouth guides, and parent-friendly custom word support.',
    details: ['17 speech sounds and stretch decks', 'Microphone voice-gate for real effort', 'Custom words with photos and recordings'],
  },
  {
    name: 'Angel Talk',
    ico: '💬',
    tagline: 'A voice for every child',
    category: 'AAC Communication',
    color: '#00B6C7',
    audience: 'Non-verbal or minimally verbal children and teens.',
    description: 'Picture-based communication tiles, bilingual voices, calming routines, and custom photo supports.',
    details: ['14,800+ communication symbols', 'English and Arabic voice support', 'Visual routines and breathing pacer'],
  },
  {
    name: 'BloomLearn',
    ico: '🌸',
    tagline: 'Say it. See it. Learn it.',
    category: 'Visual Learning',
    color: '#1DB954',
    audience: 'Children in Grades 1–5 developing language and cognition.',
    description: 'AI-powered lessons that turn text and speech into visual learning scenes across English, Maths and Science.',
    details: ['AI text-to-visual learning', 'Video lessons by grade and topic', 'Progress tracking with practice activities'],
  },
  {
    name: 'Bloom Focus',
    ico: '🎯',
    tagline: 'Little minds. Big focus.',
    category: 'Attention & Focus',
    color: '#FF9F43',
    audience: 'Children with ADHD, attention difficulties, or sensory pacing needs.',
    description: 'Short, low-arousal attention activities designed for children who need calm, structured practice.',
    details: ['Adaptive difficulty scaling', 'Short daily sessions', 'Focus and response consistency tracking'],
  },
  {
    name: 'Nexia Bridge',
    ico: '🤝',
    tagline: 'One child. One team. One shared picture.',
    category: 'Care Collaboration',
    color: '#FF5D8F',
    audience: 'Parents, SLPs, OTs, educators, and clinic teams.',
    description: 'Shared planning for families, therapists, and teachers with secure records and collaborative goals.',
    details: ['Unified care records', 'Role-based secure access', 'Shared IEP and therapy goals'],
  },
] as const;

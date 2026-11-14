// Buddy characters a child can pick as their learning buddy.
export type Char = { id: string; e: string; name: string; group: string; bg?: string; custom?: boolean };

export const GROUPS = ['Animals', 'Super heroes', 'Fantasy', 'Space & robots', 'Helpers', 'Dinosaurs & dragons'] as const;

const c = (group: string, id: string, e: string, name: string): Char => ({ id, e, name, group });

export const CHARACTERS: Char[] = [
  // Animals
  c('Animals', 'fox', '🦊', 'Fox'), c('Animals', 'panda', '🐼', 'Panda'), c('Animals', 'lion', '🦁', 'Lion'), c('Animals', 'rabbit', '🐰', 'Rabbit'),
  c('Animals', 'frog', '🐸', 'Frog'), c('Animals', 'unicorn', '🦄', 'Unicorn'), c('Animals', 'octopus', '🐙', 'Octopus'), c('Animals', 'tiger', '🐯', 'Tiger'),
  c('Animals', 'bear', '🐻', 'Bear'), c('Animals', 'koala', '🐨', 'Koala'), c('Animals', 'monkey', '🐵', 'Monkey'), c('Animals', 'penguin', '🐧', 'Penguin'),
  c('Animals', 'owl', '🦉', 'Owl'), c('Animals', 'dolphin', '🐬', 'Dolphin'), c('Animals', 'turtle', '🐢', 'Turtle'), c('Animals', 'elephant', '🐘', 'Elephant'),
  c('Animals', 'puppy', '🐶', 'Puppy'), c('Animals', 'kitten', '🐱', 'Kitten'), c('Animals', 'butterfly', '🦋', 'Butterfly'), c('Animals', 'hedgehog', '🦔', 'Hedgehog'),
  // Super heroes and heroines
  c('Super heroes', 'hero', '🦸', 'Super Hero'), c('Super heroes', 'heroine', '🦸‍♀️', 'Super Heroine'), c('Super heroes', 'captain', '🦸‍♂️', 'Captain Brave'),
  c('Super heroes', 'ninja', '🥷', 'Shadow Ninja'), c('Super heroes', 'fencer', '🤺', 'Swift Fencer'), c('Super heroes', 'prince', '🤴', 'Prince'),
  c('Super heroes', 'princess', '👸', 'Princess'), c('Super heroes', 'wrestler', '🦹', 'Mighty Mask'), c('Super heroes', 'lifeguard', '🏊', 'Water Hero'),
  c('Super heroes', 'sprinter', '🏃', 'Speedy'), c('Super heroes', 'strong', '💪', 'Strong Star'), c('Super heroes', 'star', '🌟', 'Star Spark'),
  // Fantasy
  c('Fantasy', 'wizard', '🧙', 'Wizard'), c('Fantasy', 'witch', '🧙‍♀️', 'Good Witch'), c('Fantasy', 'fairy', '🧚', 'Fairy'), c('Fantasy', 'fairyboy', '🧚‍♂️', 'Pixie'),
  c('Fantasy', 'mermaid', '🧜‍♀️', 'Mermaid'), c('Fantasy', 'merman', '🧜‍♂️', 'Merman'), c('Fantasy', 'genie', '🧞', 'Genie'), c('Fantasy', 'elf', '🧝', 'Elf'),
  c('Fantasy', 'elfgirl', '🧝‍♀️', 'Forest Elf'),
  // Space and robots
  c('Space & robots', 'astronaut', '🧑‍🚀', 'Astronaut'), c('Space & robots', 'astrogirl', '👩‍🚀', 'Space Girl'), c('Space & robots', 'astroboy', '👨‍🚀', 'Space Boy'),
  c('Space & robots', 'alien', '👽', 'Alien'), c('Space & robots', 'robot', '🤖', 'Robot'), c('Space & robots', 'rocket', '🚀', 'Rocket'), c('Space & robots', 'ufo', '🛸', 'Flying Saucer'),
  // Helpers
  c('Helpers', 'firefighter', '🧑‍🚒', 'Firefighter'), c('Helpers', 'officer', '👮', 'Police Officer'), c('Helpers', 'detective', '🕵️', 'Detective'),
  c('Helpers', 'doctor', '🧑‍⚕️', 'Doctor'), c('Helpers', 'scientist', '🧑‍🔬', 'Scientist'), c('Helpers', 'artist', '🧑‍🎨', 'Artist'),
  c('Helpers', 'chef', '🧑‍🍳', 'Chef'), c('Helpers', 'pilot', '🧑‍✈️', 'Pilot'), c('Helpers', 'farmer', '🧑‍🌾', 'Farmer'), c('Helpers', 'teacher', '🧑‍🏫', 'Teacher'),
  // Dinosaurs and dragons
  c('Dinosaurs & dragons', 'trex', '🦖', 'T-Rex'), c('Dinosaurs & dragons', 'dino', '🦕', 'Long Neck'), c('Dinosaurs & dragons', 'dragon', '🐉', 'Dragon'),
];

export const DEFAULT_FAVS = ['fox', 'panda', 'lion', 'rabbit', 'frog', 'unicorn', 'octopus', 'rocket'];
export const MAX_FAVS = 8;

// background colours for characters (the first is the app's sunny yellow)
export const CHAR_COLORS = ['#FFC93C', '#FF8FAB', '#7FB8FF', '#6EE0A0', '#FFA24D', '#B7A6FF', '#5ED6CC', '#FF7B7B', '#C9E36B', '#E3B7FF'];

export type Custom = { id: string; e: string; name: string; bg: string };

export function allChars(custom: Custom[]): Char[] {
  return [...custom.map((x): Char => ({ id: x.id, e: x.e, name: x.name, group: 'My characters', bg: x.bg, custom: true })), ...CHARACTERS];
}
export function findChar(id: string, custom: Custom[]): Char | undefined {
  return allChars(custom).find((x) => x.id === id);
}

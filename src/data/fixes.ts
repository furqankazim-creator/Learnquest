// Quality overrides applied on top of the original bank + extras.
// Key = `${subject}${year}.${index in the pool}` (E/S/M, year 1-6, index 0-23).
// Indices 0-11 are the original 12; 12-23 are the extras (hand-written English/Science).
import type { RawQ } from './questions';

export const FIX: Record<string, RawQ> = {
  // ---------------- English: originals ----------------
  'E1.11': ['Which mark goes at the end of a telling sentence?', 'Full stop .', 'Comma ,', "Apostrophe '", 'Capital letter A', '✏️', 'A telling sentence ends with a full stop.'],
  'E2.4': ['Pick the adjective: “The ___ cake is yummy.”', 'big', 'eat', 'run', 'jump', '🎂', 'Adjectives describe nouns: a big cake.'],
  'E2.7': ['Which word joins these: “I like tea ___ cake.”', 'and', 'the', 'a', 'is', '☕', '“and” joins two things together.'],
  'E2.10': ['Add -er to “tall” to compare two things:', 'taller', 'tallest', 'more tall', 'talling', '🦒', 'Taller compares two things.'],
  'E2.11': ['Which word is a compound word?', 'sunflower', 'sunny', 'flowers', 'sun', '🌻', 'sun + flower = sunflower.'],
  'E3.8': ['Which part of a non-fiction book helps you find a topic quickly?', 'Contents page', 'Blurb', 'Title picture', 'Dedication', '📖', 'The contents page lists chapters and page numbers.'],
  'E4.1': ['One dog owns a bone. Which is correct?', 'the dog’s bone', 'the dogs bone', 'the dogs’ bone', 'the dog,s bone', '🦴', 'For one owner, add ’s after the noun.'],
  'E4.5': ['Which is correct?', 'an hour', 'a hour', 'an hours', 'a hours', '⏰', '“hour” starts with a vowel sound, so we say “an”.'],
  'E4.6': ['Which sentence is punctuated correctly?', '“Help!” shouted Tom.', 'Help! shouted Tom.', '“Help shouted Tom!”', '“Help!” Shouted Tom.', '🆘', 'Speech marks go around the spoken words only.'],
  'E5.1': ['Write the plural of “baby”.', 'babies', 'babys', 'babyes', 'baby’s', '👶', 'Change the y to i, then add -es.'],
  'E5.8': ['Which word means a person who does magic?', 'magician', 'magicaly', 'magicness', 'magics', '🎩', 'magic + -ian = magician.'],
  'E6.3': ['Which sentence is punctuated correctly?', 'It’s raining, so we are staying in.', 'Its raining, so we are staying in.', 'It’s raining so, we are staying in.', 'Its’ raining, so we are staying in.', '🌧️', 'It’s is short for “it is”.'],

  // ---------------- clearer wording / overlapping answers ----------------
  'E2.0': ['Which sentence has a capital letter AND a full stop?', 'The cat sat on the mat.', 'the cat sat on the mat', 'The cat sat on the mat', 'the cat sat on the mat.', '🐱', 'A sentence starts with a capital letter and ends with a full stop.'],
  'E1.19': ['Which word means the same as “glad”?', 'happy', 'sad', 'cross', 'tired', '😊', 'Glad and happy mean the same.'],
  'E3.15': ['Which word is the adjective in “The tiny kitten purred”?', 'tiny', 'kitten', 'purred', 'The', '🐱', 'An adjective describes a noun.'],
  'E3.22': ['Which word ends with the suffix “-ful”?', 'helpful', 'funnel', 'fuel', 'fall', '🤝', 'help + ful = full of help.'],

  // ---------------- Science: originals ----------------
  'S1.1': ['Which animal has a very long neck?', 'Giraffe', 'Elephant', 'Deer', 'Lion', '🦒', 'A giraffe’s long neck helps it reach leaves.'],
  'S2.8': ['What happens first when a seed starts to grow?', 'The seed germinates (sprouts)', 'The flower opens', 'The fruit falls', 'The leaf dries', '🌱', 'Germination: the seed sprouts a root and a shoot.'],
  'S3.0': ['Which rock is made from layers of sand and mud?', 'Sedimentary rock', 'Igneous rock', 'Metamorphic rock', 'Glass', '🪨', 'Sedimentary rocks form from layers pressed together.'],
  'S3.10': ['Which light source is natural?', 'The Sun', 'A torch', 'A lamp', 'A candle', '☀️', 'Natural light sources are not made by people.'],
  'S3.11': ['What do we call the spreading of seeds by wind, water or animals?', 'Dispersal', 'Germination', 'Pollination', 'Evaporation', '🌬️', 'Seeds are dispersed so new plants have room to grow.'],
  'S4.3': ['When an object vibrates faster, the sound has a…', 'higher pitch', 'lower pitch', 'quieter volume', 'shorter echo', '🎵', 'Faster vibrations make a higher pitch.'],
  'S4.4': ['Which teeth are sharp and pointed for tearing meat?', 'Canines', 'Molars', 'Incisors', 'Gums', '🦷', 'Canines are the pointed teeth.'],
  'S4.6': ['Which state of matter takes the shape of its container but keeps its volume?', 'Liquid', 'Solid', 'Gas', 'Ice', '💧', 'A liquid flows to fit its container; a gas spreads to fill it.'],

  // ---------------- Maths: original wording ----------------
  'M3.10': ['One tenth of 50 is…', '5', '6', '4', '7', '🔢', '50 ÷ 10 = 5.'],
  'M5.0': ['3/5 of 25 is…', '15', '16', '14', '17', '🍕', '25 ÷ 5 = 5, then 5 × 3 = 15.'],

  // ---------------- Science extras: replace duplicates of an existing concept ----------------
  'S1.14': ['Which part of a plant is green and catches sunlight?', 'leaf', 'root', 'seed', 'soil', '🍃', 'Leaves use sunlight to make food.'],
  'S2.12': ['In which season do many trees lose their leaves?', 'autumn', 'spring', 'summer', 'winter', '🍂', 'Leaves change colour and fall in autumn.'],
  'S2.13': ['Which of these is an insect?', 'ant', 'spider', 'snail', 'worm', '🐜', 'Insects have six legs and three body parts.'],
  'S3.16': ['What happens when two north poles of magnets meet?', 'They push apart', 'They pull together', 'They stick', 'Nothing', '🧲', 'Like poles repel; opposite poles attract.'],
  'S3.19': ['Which foods give us quick energy: bread, pasta and rice?', 'Carbohydrates', 'Protein', 'Vitamins', 'Water', '🍞', 'Carbohydrates are our body’s main source of energy.'],
  'S3.21': ['What is a reflection?', 'Light bouncing off a surface', 'Light passing through glass', 'Light being made', 'Light disappearing', '🪞', 'Mirrors reflect light.'],
  'S3.22': ['Which material is opaque (it blocks light)?', 'wood', 'glass', 'clear plastic', 'air', '🪵', 'Opaque materials cast shadows.'],
  'S4.12': ['Which part of the body absorbs nutrients from digested food?', 'Small intestine', 'Windpipe', 'Heart', 'Skull', '🌀', 'Nutrients pass into the blood in the small intestine.'],
  'S4.13': ['What does a battery do in a circuit?', 'Pushes the electric current round', 'Switches the bulb off', 'Cuts the wire', 'Makes the light', '🔋', 'The battery gives the circuit its energy.'],
  'S4.16': ['What happens if there is a gap in a circuit?', 'The bulb will not light', 'The bulb gets brighter', 'The battery grows', 'Nothing changes', '🔌', 'Current only flows round a complete circuit.'],
  'S4.18': ['What is evaporation?', 'A liquid turning into a gas', 'A gas turning into a liquid', 'A liquid turning into a solid', 'A solid turning into a gas', '☀️', 'Puddles dry up through evaporation.'],
  'S4.20': ['What is a predator?', 'An animal that hunts and eats other animals', 'A plant that makes its own food', 'An animal that eats only plants', 'A baby animal', '🦅', 'Hawks and lions are predators.'],
  'S4.21': ['What do we call how loud a sound is?', 'volume', 'pitch', 'echo', 'speed', '🔊', 'Bigger vibrations make a louder sound.'],
  'S5.13': ['Which is the largest planet in our solar system?', 'Jupiter', 'Earth', 'Mars', 'Mercury', '🪐', 'Jupiter is the biggest planet.'],
  'S5.14': ['What is the Sun?', 'A star', 'A planet', 'A moon', 'A comet', '☀️', 'The Sun is a star at the centre of our solar system.'],
  'S5.16': ['What hatches from a frog’s egg?', 'A tadpole', 'A froglet', 'A fish', 'A caterpillar', '🐸', 'Frog life cycle: egg → tadpole → froglet → frog.'],
  'S5.17': ['Which method gets salt back from salty water?', 'evaporating the water', 'filtering', 'using a magnet', 'freezing', '🧂', 'The water evaporates and leaves the salt behind.'],
  'S5.18': ['What is friction?', 'A force that slows things when surfaces rub together', 'A force that pulls things to the Earth', 'A force that makes light', 'A type of magnet', '🛷', 'Rough surfaces create more friction.'],
  'S5.20': ['How many planets are in our solar system?', '8', '7', '9', '10', '🪐', 'There are eight planets.'],
  'S5.22': ['Which solid dissolves in water?', 'sugar', 'sand', 'stone', 'wood', '🍬', 'Sugar dissolves; sand does not.'],
  'S6.12': ['What do red blood cells carry around the body?', 'Oxygen', 'Germs', 'Light', 'Sound', '🩸', 'Red blood cells carry oxygen.'],
  'S6.13': ['Which blood vessels carry blood back to the heart?', 'veins', 'arteries', 'nerves', 'bones', '🫀', 'Veins return blood to the heart.'],
  'S6.15': ['What happens when light hits a mirror?', 'It reflects (bounces off)', 'It disappears', 'It turns into sound', 'It stops', '🪞', 'Mirrors bounce light back.'],
  'S6.16': ['Electric current is measured in…', 'amperes (amps)', 'volts', 'metres', 'grams', '⚡', 'Current is measured with an ammeter, in amps.'],
  'S6.19': ['What do fossils help scientists find out?', 'What life was like long ago', 'What the weather will be', 'How fast light travels', 'How old a tree is today', '🦴', 'Fossils are clues to past life.'],
};

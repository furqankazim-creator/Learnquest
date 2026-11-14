// Small pictures for answer choices, so a child who cannot read a word yet can still see it.
// Only used when most of a question's four answers are things we can draw.
const D: Record<string, string> = {};
const add = (e: string, ...words: string[]) => words.forEach((w) => { D[w] = e; });

// animals
add('🐄', 'cow'); add('🦁', 'lion'); add('🐺', 'wolf'); add('🦊', 'fox'); add('🐝', 'bee'); add('🦒', 'giraffe'); add('🐘', 'elephant', 'big', 'large', 'huge', 'enormous', 'gigantic');
add('🦌', 'deer'); add('🐕', 'dog', 'mammal', 'mammals', 'puppy'); add('🐈', 'cat'); add('🐱', 'kitten'); add('🦆', 'duck'); add('🐦', 'bird', 'birds'); add('🐟', 'fish', 'tadpole');
add('🐍', 'snake'); add('🐸', 'frog', 'amphibian', 'amphibians'); add('🐔', 'hen', 'chicken'); add('🐥', 'chick'); add('🦉', 'owl'); add('🦋', 'butterfly'); add('🕷️', 'spider', 'arachnids');
add('🐜', 'ant', 'insects', 'insect', 'tiny', 'minibeast'); add('🐇', 'rabbit'); add('🐑', 'sheep', 'lamb'); add('🐴', 'horse'); add('🐷', 'pig'); add('🐭', 'mouse', 'small');
add('🐋', 'whale'); add('🦇', 'bat'); add('🦈', 'shark'); add('🐢', 'tortoise', 'turtle', 'slow'); add('🐪', 'camel'); add('🐻', 'bear'); add('🐒', 'monkey'); add('🪱', 'worm');
add('🐌', 'snail'); add('🐮', 'calf'); add('🐛', 'caterpillar'); add('🐞', 'ladybird'); add('🪲', 'beetle'); add('🐬', 'dolphin'); add('🐧', 'penguin'); add('🦅', 'eagle', 'hawk');
add('🦜', 'parrot'); add('🐐', 'goat'); add('🦎', 'lizard', 'reptile', 'reptiles'); add('🐿️', 'squirrel'); add('🐻‍❄️', 'polar bear'); add('🦔', 'hedgehog'); add('🐓', 'rooster');
// body
add('👃', 'nose'); add('👂', 'ear', 'ears'); add('👁️', 'eye'); add('👀', 'eyes'); add('🦶', 'foot', 'feet'); add('✋', 'hand', 'hands'); add('👅', 'tongue'); add('👄', 'mouth');
add('❤️', 'heart'); add('🫁', 'lungs'); add('🧠', 'brain'); add('🦴', 'bones', 'bone', 'skeleton'); add('🦷', 'teeth', 'tooth', 'molars', 'canines', 'incisors'); add('💀', 'skull');
add('🦵', 'legs', 'leg'); add('💪', 'arms', 'muscles', 'muscle');
// nature and weather
add('🌳', 'tree', 'trees'); add('🌸', 'flower', 'spring'); add('🍃', 'leaf', 'leaves'); add('🌰', 'seed', 'seeds'); add('☀️', 'sun', 'summer', 'sunny', 'warm');
add('🌙', 'moon'); add('⭐', 'star', 'stars'); add('☁️', 'cloud', 'clouds'); add('🌧️', 'rain', 'rainy'); add('❄️', 'snow', 'winter', 'cold', 'snowy', 'freezing'); add('💨', 'wind', 'windy');
add('🌈', 'rainbow'); add('🔥', 'fire', 'hot'); add('💧', 'water'); add('🧊', 'ice'); add('🪨', 'rock', 'stone', 'rocks', 'pebble'); add('🏖️', 'sand', 'beach'); add('⛰️', 'mountain');
add('🌋', 'volcano'); add('🌊', 'sea', 'ocean', 'waves'); add('🌿', 'grass'); add('🏜️', 'desert'); add('🌍', 'earth'); add('🍂', 'autumn'); add('♨️', 'boiling', 'steam');
// food
add('🍎', 'apple', 'apples', 'fruit'); add('🍌', 'banana'); add('🍞', 'bread'); add('🥛', 'milk'); add('🧀', 'cheese'); add('🥚', 'egg', 'eggs'); add('🥕', 'carrot'); add('🍇', 'grapes');
add('🍓', 'strawberry'); add('🍊', 'orange'); add('🍕', 'pizza'); add('🍰', 'cake'); add('🍬', 'sweets', 'sweet'); add('🥔', 'crisps'); add('🍫', 'chocolate'); add('🍚', 'rice'); add('🍝', 'pasta');
add('🍖', 'meat'); add('🥦', 'vegetables', 'broccoli');
// things and materials
add('⚽', 'ball', 'football', 'kick'); add('📖', 'book', 'read'); add('🪑', 'chair', 'table'); add('🎒', 'bag'); add('🎩', 'hat'); add('🧥', 'coat'); add('👟', 'shoe', 'shoes');
add('🚗', 'car'); add('🚌', 'bus'); add('🚲', 'bike'); add('⛵', 'boat'); add('✈️', 'plane', 'aeroplane'); add('🏠', 'house', 'home'); add('🏫', 'school'); add('🚪', 'door');
add('🪟', 'window', 'glass'); add('🕐', 'clock'); add('🔑', 'key'); add('🖊️', 'pen'); add('✏️', 'pencil'); add('☕', 'cup'); add('🥄', 'spoon', 'metal spoon', 'wooden spoon');
add('🛏️', 'bed'); add('☂️', 'umbrella'); add('🔦', 'torch'); add('💡', 'lamp', 'bulb'); add('🕯️', 'candle'); add('🧲', 'magnet'); add('🪞', 'mirror'); add('🪵', 'wood', 'log');
add('🔩', 'metal', 'iron', 'steel'); add('🧴', 'plastic'); add('📄', 'paper', 'card'); add('🧵', 'cloth'); add('🧶', 'wool'); add('🧽', 'sponge'); add('🪙', 'copper', 'coin', 'money');
add('🧱', 'brick'); add('🎈', 'balloon', 'rubber'); add('🔔', 'buzzer', 'bell'); add('🔋', 'battery'); add('🔌', 'wire');
// actions
add('🏃', 'run', 'running'); add('🤸', 'jump'); add('🏊', 'swim'); add('🚶', 'walk'); add('🍽️', 'eat'); add('😴', 'sleep', 'tired', 'weary', 'exhausted'); add('🎤', 'sing'); add('💃', 'dance');
add('✍️', 'write'); add('🎮', 'play');
// feelings
add('😊', 'happy', 'glad', 'pleased', 'cheerful'); add('😢', 'sad'); add('😠', 'angry', 'cross'); add('😄', 'joyful', 'delighted'); add('😨', 'scared'); add('🤩', 'excited', 'thrilled', 'eager');
add('🥱', 'bored'); add('😡', 'furious');
// colours
add('🔴', 'red'); add('🔵', 'blue'); add('🟢', 'green'); add('🟡', 'yellow'); add('⚫', 'black'); add('⚪', 'white'); add('🟠', 'orange colour'); add('🟣', 'purple'); add('🟤', 'brown');
add('👴', 'old'); add('🆕', 'new', 'modern'); add('🧒', 'child'); add('🧑', 'children');

// senses, states of matter, space, science words
add('👀', 'sight'); add('👂', 'hearing'); add('👃', 'smell'); add('👅', 'taste'); add('✋', 'touch');
add('🧊', 'solid'); add('💧', 'liquid'); add('💨', 'gas'); add('💡', 'light'); add('🔊', 'sound', 'loud'); add('🧲', 'magnetism'); add('🌬️', 'air'); add('🫧', 'oxygen'); add('☁️', 'carbon dioxide');
add('🧂', 'salt'); add('🌿', 'plants'); add('🦠', 'virus', 'bacteria'); add('☄️', 'comet'); add('🪐', 'planet', 'saturn'); add('🔴', 'mars'); add('🟡', 'venus'); add('🟤', 'jupiter'); add('⚪', 'mercury'); add('🔵', 'neptune');
add('👍', 'thumb'); add('🚰', 'tap'); add('🍟', 'chip'); add('🥫', 'tin'); add('🥤', 'fizzy drinks'); add('🏞️', 'lake'); add('🪟', 'glass');
const clean = (s: string) => s.toLowerCase().replace(/\(.*?\)/g, '').replace(/[.…!?,]+$/g, '').replace(/^(a|an|the)\s+/, '').trim();
const lookup = (s: string): string | undefined => {
  const k = clean(s);
  if (D[k]) return D[k];
  if (k.endsWith('s') && D[k.slice(0, -1)]) return D[k.slice(0, -1)];
  if (k.endsWith('es') && D[k.slice(0, -2)]) return D[k.slice(0, -2)];
  return undefined;
};

// emoji for each of the four options, or null when most of them cannot be drawn (then no pictures are shown)
export function emojiForOptions(opts: string[]): (string | undefined)[] | null {
  const out = opts.map(lookup);
  const hit = out.filter(Boolean).length;
  if (hit < 3) return null;
  // two different answers must not share the same picture
  const seen = new Set<string>();
  for (let i = 0; i < out.length; i++) { const e = out[i]; if (!e) continue; if (seen.has(e)) out[i] = undefined; else seen.add(e); }
  return out.filter(Boolean).length >= 3 ? out : null;
}

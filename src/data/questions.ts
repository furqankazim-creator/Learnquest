// Format: [question, correctAnswer, wrong1, wrong2, wrong3, emoji]
export type RawQ = [string, string, string, string, string, string] | [string, string, string, string, string, string, string];
export type Bank = Record<number, RawQ[]>;
export const ENG: Bank = {
 "1": [
  [
   "Which picture starts with the sound /s/?",
   "Sun",
   "Cat",
   "Dog",
   "Apple",
   "☀️"
  ],
  [
   "Which word says “the”?",
   "the",
   "cat",
   "run",
   "big",
   "👀"
  ],
  [
   "Which word is a CVC word?",
   "cat",
   "tree",
   "school",
   "play",
   "🐱"
  ],
  [
   "Which letter makes the first sound in “pig”?",
   "p",
   "b",
   "d",
   "t",
   "🐷"
  ],
  [
   "Which sentence starts with a capital letter?",
   "The dog ran.",
   "the dog ran",
   "dog The ran",
   "ran dog the",
   "✏️"
  ],
  [
   "Tap the word that rhymes with “hat”.",
   "cat",
   "hen",
   "pig",
   "sun",
   "🎩"
  ],
  [
   "Which word means the opposite of “big”?",
   "small",
   "huge",
   "tall",
   "wide",
   "🐜"
  ],
  [
   "Which is a naming word (a noun)?",
   "apple",
   "run",
   "jump",
   "happy",
   "🍎"
  ],
  [
   "Which word has the “ee” sound?",
   "tree",
   "cat",
   "pot",
   "sun",
   "🌳"
  ],
  [
   "Finish the sentence: “I can ___ the ball.”",
   "kick",
   "kickly",
   "kicked ball",
   "the kick",
   "⚽"
  ],
  [
   "Which word starts with /b/?",
   "ball",
   "sun",
   "fish",
   "egg",
   "🏀"
  ],
  [
   "Which mark ends a sentence?",
   "Full stop .",
   "Comma ,",
   "Question mark only ?",
   "Apostrophe '",
   "✏️"
  ]
 ],
 "2": [
  [
   "Which sentence is correct?",
   "The cat sat on the mat.",
   "the cat sat on the mat",
   "The cat sat on the mat",
   "the cat sat on the mat.",
   "🐱"
  ],
  [
   "Add -ing: run → ___",
   "running",
   "runing",
   "runss",
   "runned",
   "🏃"
  ],
  [
   "Which word is a verb?",
   "jump",
   "table",
   "happy",
   "blue",
   "🤸"
  ],
  [
   "Which word means more than one dog?",
   "dogs",
   "doges",
   "dog's",
   "doggy",
   "🐶"
  ],
  [
   "Pick the adjective: “The ___ cake is yummy.”",
   "big",
   "eat",
   "cake",
   "yummy is",
   "🎂"
  ],
  [
   "Which word rhymes with “cake”?",
   "lake",
   "cup",
   "pen",
   "fish",
   "🍰"
  ],
  [
   "What do we add to “play” to talk about yesterday?",
   "-ed (played)",
   "-ing",
   "-s",
   "nothing",
   "⏰"
  ],
  [
   "Which word joins these: “I like tea ___ cake.”",
   "and",
   "but is",
   "the",
   "a",
   "☕"
  ],
  [
   "Which is the correct spelling?",
   "because",
   "becos",
   "becouse",
   "becuz",
   "✏️"
  ],
  [
   "Which sentence asks a question?",
   "Where is my bag?",
   "Where is my bag.",
   "I have a bag",
   "My bag is here",
   "🎒"
  ],
  [
   "Add -er to “tall” to compare:",
   "taller",
   "tallest one",
   "more tall",
   "talling",
   "🦒"
  ],
  [
   "Which word is a compound word?",
   "sunflower",
   "sunny",
   "flower pot",
   "sun",
   "🌻"
  ]
 ],
 "3": [
  [
   "Which word is a verb in “The dog barked loudly”?",
   "barked",
   "dog",
   "loudly",
   "the",
   "🐶"
  ],
  [
   "Add a prefix to make the opposite of “happy”.",
   "unhappy",
   "rehappy",
   "dishappy",
   "happyful",
   "🙂"
  ],
  [
   "Which word is an adverb?",
   "quickly",
   "quick",
   "dog",
   "blue",
   "💨"
  ],
  [
   "Which sentence uses speech marks correctly?",
   "“Come here,” said Sam.",
   "Come here said Sam.",
   "“Come here said Sam”",
   "Come 'here' Sam",
   "💬"
  ],
  [
   "Which word is a synonym for “happy”?",
   "joyful",
   "sad",
   "angry",
   "tired",
   "😊"
  ],
  [
   "Pick the conjunction: “I stayed home ___ it rained.”",
   "because",
   "apple",
   "ran",
   "the",
   "🌧️"
  ],
  [
   "Which is the correct plural of “box”?",
   "boxes",
   "boxs",
   "boxies",
   "box's",
   "📦"
  ],
  [
   "Which word is a homophone of “see”?",
   "sea",
   "saw",
   "seen",
   "say",
   "🌊"
  ],
  [
   "Which heading helps us find facts in a non-fiction book?",
   "Contents page",
   "Blurb",
   "Chapter fun",
   "Picture",
   "📖"
  ],
  [
   "Add the prefix “re-” to “play”. What does it mean?",
   "Play again",
   "Never play",
   "Play loudly",
   "Stop playing",
   "🔁"
  ],
  [
   "Which sentence is in the past tense?",
   "She walked to school.",
   "She walks to school.",
   "She will walk.",
   "She is walking now",
   "🚶"
  ],
  [
   "Which word class is “under” in “under the table”?",
   "Preposition",
   "Verb",
   "Noun",
   "Adjective",
   "🍽️"
  ]
 ],
 "4": [
  [
   "Choose the fronted adverbial: “___, the children ran outside.”",
   "Later",
   "Laterly",
   "The later",
   "Run later",
   "🏃"
  ],
  [
   "Where does the apostrophe go? “the dogs bone”",
   "dog's",
   "dogs' bone is",
   "do'gs",
   "no apostrophe",
   "🦴"
  ],
  [
   "Which word is a possessive pronoun?",
   "mine",
   "I",
   "me",
   "run",
   "🎁"
  ],
  [
   "Which sentence uses a comma correctly?",
   "We bought apples, pears and bananas.",
   "We bought, apples pears, bananas",
   "We bought apples pears, and, bananas",
   "Apples, we bought pears bananas",
   "🍌"
  ],
  [
   "Which word is a synonym for “ancient”?",
   "very old",
   "brand new",
   "tiny",
   "loud",
   "🏺"
  ],
  [
   "Pick the correct determiner: “___ hour”",
   "an",
   "a",
   "the a",
   "some hour",
   "⏰"
  ],
  [
   "Which sentence is punctuated correctly?",
   "“Help!” shouted Tom.",
   "Help shouted Tom!",
   "“Help shouted” Tom!",
   "Help! shouted Tom“”",
   "🆘"
  ],
  [
   "Which is the standard English sentence?",
   "I did it well.",
   "I done it good.",
   "I did it goodly.",
   "I done well it.",
   "✅"
  ],
  [
   "Which word has a silent letter?",
   "knight",
   "cat",
   "sun",
   "pig",
   "🏰"
  ],
  [
   "What is a paragraph?",
   "A group of sentences about one idea",
   "One word",
   "A picture",
   "The title",
   "📄"
  ],
  [
   "Which phrase uses personification?",
   "The wind whispered.",
   "The wind blew.",
   "It was windy.",
   "Wind is air.",
   "🍃"
  ],
  [
   "Add the suffix to “care” to mean full of care:",
   "careful",
   "careless one",
   "caringly",
   "care's",
   "💗"
  ]
 ],
 "5": [
  [
   "Which sentence uses a modal verb?",
   "You must wear a coat.",
   "You wear a coat.",
   "You wore a coat.",
   "You are wearing a coat.",
   "🧥"
  ],
  [
   "Write the plural of “baby”.",
   "babies",
   "babys",
   "babies'",
   "baby's only",
   "👶"
  ],
  [
   "Which sentence uses brackets (parenthesis) correctly?",
   "My teacher (Mrs Lee) is kind.",
   "My teacher Mrs Lee) is kind(",
   "My (teacher Mrs) Lee is kind",
   "My teacher Mrs Lee is (kind",
   "👩‍🏫"
  ],
  [
   "Which word is a relative pronoun?",
   "who",
   "run",
   "happy",
   "very",
   "🧑"
  ],
  [
   "Pick the formal sentence:",
   "“I request your help.”",
   "“Gimme a hand!”",
   "“Help me, yeah?”",
   "“Oi, help!”",
   "🎩"
  ],
  [
   "Which verb is in the present perfect?",
   "She has finished.",
   "She finishes yesterday.",
   "She will finish.",
   "She finishing.",
   "✅"
  ],
  [
   "Which word means “to guess using clues”?",
   "infer",
   "shout",
   "copy",
   "skip",
   "🔍"
  ],
  [
   "Choose the correct homophone: “___ going to win.”",
   "They're",
   "Their",
   "There",
   "Theyre",
   "🏆"
  ],
  [
   "Which suffix turns “magic” into a person?",
   "magician",
   "magicaly",
   "magicness",
   "magics",
   "🎩"
  ],
  [
   "Which sentence has a relative clause?",
   "The boy who won smiled.",
   "The boy won.",
   "Boy smiled won.",
   "The smiling boy a won.",
   "🏅"
  ],
  [
   "What does the prefix “mis-” mean in “misunderstand”?",
   "Wrongly",
   "Again",
   "Before",
   "Very",
   "❓"
  ],
  [
   "Which is an example of a metaphor?",
   "He is a shining star.",
   "He is like a star.",
   "He runs fast.",
   "The star shines.",
   "⭐"
  ]
 ],
 "6": [
  [
   "Change to passive: “The cat chased the mouse.” → “The mouse ___ by the cat.”",
   "was chased",
   "chased",
   "is chase",
   "chasing",
   "🐭"
  ],
  [
   "Which sentence is in the subjunctive?",
   "If I were rich, I would travel.",
   "I am rich.",
   "I was rich yesterday.",
   "Rich I am.",
   "💭"
  ],
  [
   "Which word is an antonym for “expand”?",
   "contract",
   "grow",
   "stretch",
   "open",
   "📦"
  ],
  [
   "Pick the correct punctuation: “Its raining ___”",
   "; it's a wet day",
   "— its' a wet day",
   "; its' raining day",
   "— it a wet day",
   "🌧️"
  ],
  [
   "Which sentence uses the active voice?",
   "The chef cooked dinner.",
   "Dinner was cooked by the chef.",
   "Dinner is cooked.",
   "Cooked dinner was.",
   "👨‍🍳"
  ],
  [
   "Which word is spelled correctly?",
   "necessary",
   "neccessary",
   "nesessary",
   "necessery",
   "✏️"
  ],
  [
   "What is a main clause?",
   "It makes sense on its own",
   "It needs another clause",
   "One word only",
   "A question",
   "📝"
  ],
  [
   "Which phrase is a simile?",
   "As brave as a lion",
   "A lion of bravery",
   "Brave lion heart",
   "The bravest",
   "🦁"
  ],
  [
   "Choose the formal conjunction: “___ it rained, we stayed in.”",
   "As",
   "Coz",
   "Yeah",
   "So like",
   "🌧️"
  ],
  [
   "Which sentence uses a colon correctly?",
   "Bring these: pens, paper, glue.",
   "Bring: these pens paper glue",
   "Bring these pens: paper, glue:",
   "Bring these, pens: paper glue",
   "🎒"
  ],
  [
   "What does “bias” mean in a text?",
   "One-sided opinion",
   "A true fact",
   "A picture",
   "The ending",
   "📰"
  ],
  [
   "Which verb form is the past perfect?",
   "had eaten",
   "eats",
   "will eat",
   "eating",
   "🍽️"
  ]
 ]
};

export const MATH: Bank = {
 "1": [
  [
   "3 + 2 = ?",
   "5",
   "6",
   "4",
   "7",
   "🎈"
  ],
  [
   "5 + 1 = ?",
   "6",
   "7",
   "5",
   "8",
   "🎈"
  ],
  [
   "4 + 3 = ?",
   "7",
   "8",
   "6",
   "9",
   "🍎"
  ],
  [
   "7 − 2 = ?",
   "5",
   "6",
   "4",
   "7",
   "🍌"
  ],
  [
   "9 − 4 = ?",
   "5",
   "6",
   "4",
   "7",
   "⭐"
  ],
  [
   "6 + 2 = ?",
   "8",
   "9",
   "7",
   "10",
   "🐶"
  ],
  [
   "2 + 8 = ?",
   "10",
   "11",
   "9",
   "12",
   "🔟"
  ],
  [
   "10 − 3 = ?",
   "7",
   "8",
   "6",
   "9",
   "🌈"
  ],
  [
   "Count in 2s: 2, 4, 6, ___",
   "8",
   "9",
   "7",
   "10",
   "🔢"
  ],
  [
   "Half of 6 is…",
   "3",
   "4",
   "2",
   "5",
   "🍰"
  ],
  [
   "1 more than 9 is…",
   "10",
   "11",
   "9",
   "12",
   "☝️"
  ],
  [
   "Which shape has 3 sides?",
   "Triangle",
   "Square",
   "Circle",
   "Rectangle",
   "🔺"
  ]
 ],
 "2": [
  [
   "24 + 15 = ?",
   "39",
   "40",
   "38",
   "41",
   "➕"
  ],
  [
   "47 − 12 = ?",
   "35",
   "36",
   "34",
   "37",
   "➖"
  ],
  [
   "Half of 12 is…",
   "6",
   "7",
   "5",
   "8",
   "🍰"
  ],
  [
   "Count in 5s: 5, 10, 15, ___",
   "20",
   "21",
   "19",
   "22",
   "🖐️"
  ],
  [
   "4 × 5 = ?",
   "20",
   "21",
   "19",
   "22",
   "✖️"
  ],
  [
   "6 × 2 = ?",
   "12",
   "13",
   "11",
   "14",
   "✖️"
  ],
  [
   "30 + 40 = ?",
   "70",
   "71",
   "69",
   "72",
   "➕"
  ],
  [
   "85 − 30 = ?",
   "55",
   "56",
   "54",
   "57",
   "➖"
  ],
  [
   "Quarter of 8 is…",
   "2",
   "3",
   "1",
   "4",
   "🍕"
  ],
  [
   "7 + 8 = ?",
   "15",
   "16",
   "14",
   "17",
   "➕"
  ],
  [
   "Double 9 is…",
   "18",
   "19",
   "17",
   "20",
   "👯"
  ],
  [
   "How many minutes are in half an hour?",
   "30",
   "15",
   "60",
   "45",
   "🕐"
  ]
 ],
 "3": [
  [
   "7 × 4 = ?",
   "28",
   "29",
   "27",
   "30",
   "✖️"
  ],
  [
   "456 + 237 = ?",
   "693",
   "694",
   "692",
   "695",
   "➕"
  ],
  [
   "3 × 8 = ?",
   "24",
   "25",
   "23",
   "26",
   "✖️"
  ],
  [
   "100 − 45 = ?",
   "55",
   "56",
   "54",
   "57",
   "➖"
  ],
  [
   "⅓ of 12 is…",
   "4",
   "5",
   "3",
   "6",
   "🍕"
  ],
  [
   "250 + 250 = ?",
   "500",
   "501",
   "499",
   "502",
   "➕"
  ],
  [
   "6 × 3 = ?",
   "18",
   "19",
   "17",
   "20",
   "✖️"
  ],
  [
   "24 ÷ 4 = ?",
   "6",
   "7",
   "5",
   "8",
   "➗"
  ],
  [
   "345 − 128 = ?",
   "217",
   "218",
   "216",
   "219",
   "➖"
  ],
  [
   "9 × 3 = ?",
   "27",
   "28",
   "26",
   "29",
   "✖️"
  ],
  [
   "⅒ of 50 is…",
   "5",
   "6",
   "4",
   "7",
   "🍰"
  ],
  [
   "A square has a side of 5 cm. Its perimeter is…",
   "20 cm",
   "10 cm",
   "25 cm",
   "15 cm",
   "📐"
  ]
 ],
 "4": [
  [
   "12 × 12 = ?",
   "144",
   "145",
   "143",
   "146",
   "✖️"
  ],
  [
   "7 × 8 = ?",
   "56",
   "57",
   "55",
   "58",
   "✖️"
  ],
  [
   "1000 − 650 = ?",
   "350",
   "351",
   "349",
   "352",
   "➖"
  ],
  [
   "9 × 6 = ?",
   "54",
   "55",
   "53",
   "56",
   "✖️"
  ],
  [
   "48 ÷ 6 = ?",
   "8",
   "9",
   "7",
   "10",
   "➗"
  ],
  [
   "Double 35 is…",
   "70",
   "71",
   "69",
   "72",
   "👯"
  ],
  [
   "234 × 3 = ?",
   "702",
   "703",
   "701",
   "704",
   "✖️"
  ],
  [
   "Quarter of 100 is…",
   "25",
   "26",
   "24",
   "27",
   "🍕"
  ],
  [
   "6 × 7 = ?",
   "42",
   "43",
   "41",
   "44",
   "✖️"
  ],
  [
   "864 − 299 = ?",
   "565",
   "566",
   "564",
   "567",
   "➖"
  ],
  [
   "0.7 + 0.4 = ?",
   "1.1",
   "0.11",
   "11",
   "1.0",
   "🔢"
  ],
  [
   "A rectangle is 6 cm by 4 cm. Its area is…",
   "24 cm²",
   "20 cm²",
   "10 cm²",
   "28 cm²",
   "📐"
  ]
 ],
 "5": [
  [
   "⅗ of 25 is…",
   "15",
   "16",
   "14",
   "17",
   "🍕"
  ],
  [
   "15% of 200 is…",
   "30",
   "31",
   "29",
   "32",
   "💯"
  ],
  [
   "4326 ÷ 6 = ?",
   "721",
   "722",
   "720",
   "723",
   "➗"
  ],
  [
   "25 × 4 = ?",
   "100",
   "101",
   "99",
   "102",
   "✖️"
  ],
  [
   "13 × 7 = ?",
   "91",
   "92",
   "90",
   "93",
   "✖️"
  ],
  [
   "5000 − 2750 = ?",
   "2250",
   "2251",
   "2249",
   "2252",
   "➖"
  ],
  [
   "120 ÷ 8 = ?",
   "15",
   "16",
   "14",
   "17",
   "➗"
  ],
  [
   "3 × 3 × 3 (3 cubed) is…",
   "27",
   "28",
   "26",
   "29",
   "🧊"
  ],
  [
   "Half of 450 is…",
   "225",
   "226",
   "224",
   "227",
   "🍰"
  ],
  [
   "17 × 6 = ?",
   "102",
   "103",
   "101",
   "104",
   "✖️"
  ],
  [
   "Which number is prime?",
   "7",
   "9",
   "15",
   "21",
   "🔢"
  ],
  [
   "0.5 + 0.75 = ?",
   "1.25",
   "0.125",
   "1.02",
   "0.8",
   "🔢"
  ]
 ],
 "6": [
  [
   "n + 7 = 15. What is n?",
   "8",
   "9",
   "7",
   "10",
   "🔤"
  ],
  [
   "15% of 300 is…",
   "45",
   "46",
   "44",
   "47",
   "💯"
  ],
  [
   "144 ÷ 12 = ?",
   "12",
   "13",
   "11",
   "14",
   "➗"
  ],
  [
   "25% of 80 is…",
   "20",
   "21",
   "19",
   "22",
   "💯"
  ],
  [
   "−5 + 8 = ?",
   "3",
   "4",
   "2",
   "5",
   "🌡️"
  ],
  [
   "Mean of 3, 5 and 7 is…",
   "5",
   "6",
   "4",
   "7",
   "📊"
  ],
  [
   "1.5 × 6 = ?",
   "9",
   "10",
   "8",
   "11",
   "✖️"
  ],
  [
   "⅔ of 90 is…",
   "60",
   "61",
   "59",
   "62",
   "🍕"
  ],
  [
   "If 3 pencils cost 90p, how much do 7 pencils cost?",
   "210p",
   "180p",
   "240p",
   "150p",
   "✏️"
  ],
  [
   "⅔ + ¼ = ?",
   "11/12",
   "3/7",
   "1",
   "5/12",
   "🍕"
  ],
  [
   "A triangle has base 8 cm and height 5 cm. Its area is…",
   "20 cm²",
   "40 cm²",
   "13 cm²",
   "26 cm²",
   "🔺"
  ],
  [
   "Simplify the ratio 12 : 8",
   "3 : 2",
   "6 : 2",
   "12 : 4",
   "2 : 3",
   "⚖️"
  ]
 ]
};

export const SCI: Bank = {
 "1": [
  [
   "Which animal eats only plants?",
   "Cow",
   "Lion",
   "Wolf",
   "Fox",
   "🐄"
  ],
  [
   "Match the name: which animal has a very long neck?",
   "Giraffe",
   "Elephant",
   "Deer",
   "Lion",
   "🦒"
  ],
  [
   "Which body part do we use to smell?",
   "Nose",
   "Ear",
   "Eye",
   "Foot",
   "👃"
  ],
  [
   "What do plants need to grow?",
   "Sunlight and water",
   "Darkness only",
   "Snow",
   "Nothing",
   "🌱"
  ],
  [
   "Which material is hard and shiny?",
   "Metal spoon",
   "Wooden spoon",
   "Sponge",
   "Cloth",
   "🥄"
  ],
  [
   "Which season is cold with snow?",
   "Winter",
   "Summer",
   "Spring",
   "Autumn",
   "❄️"
  ],
  [
   "Which animal is a pet that says “woof”?",
   "Dog",
   "Cat",
   "Cow",
   "Duck",
   "🐶"
  ],
  [
   "Which part of a plant is under the ground?",
   "Roots",
   "Flower",
   "Leaf",
   "Stem",
   "🌷"
  ],
  [
   "Which of these can fly?",
   "Bird",
   "Fish",
   "Snake",
   "Frog",
   "🐦"
  ],
  [
   "What do we call a baby dog?",
   "Puppy",
   "Kitten",
   "Calf",
   "Cub",
   "🐶"
  ],
  [
   "Which material would keep rain off best?",
   "Plastic",
   "Paper",
   "Sponge",
   "Card",
   "☔"
  ],
  [
   "How many legs does a spider have?",
   "8",
   "6",
   "4",
   "10",
   "🕷️"
  ]
 ],
 "2": [
  [
   "In a food chain grass → rabbit → ___, what eats the rabbit?",
   "Fox",
   "Cow",
   "Sheep",
   "Bee",
   "🦊"
  ],
  [
   "Where does a fish live?",
   "In water",
   "In a tree",
   "In the desert",
   "Under a rock only",
   "🐟"
  ],
  [
   "What do plants need to grow well?",
   "Light, water and warmth",
   "Only darkness",
   "Only cold",
   "Nothing at all",
   "🌻"
  ],
  [
   "A tadpole grows into a…",
   "Frog",
   "Fish",
   "Bird",
   "Butterfly",
   "🐸"
  ],
  [
   "Which material is best for a window?",
   "Glass",
   "Wood",
   "Fabric",
   "Paper",
   "🪟"
  ],
  [
   "Which animal is nocturnal (awake at night)?",
   "Owl",
   "Hen",
   "Cow",
   "Butterfly",
   "🦉"
  ],
  [
   "What is a habitat?",
   "Where a living thing lives",
   "A type of food",
   "A baby animal",
   "A plant's leaf",
   "🏠"
  ],
  [
   "Which of these is alive?",
   "Tree",
   "Rock",
   "Toy car",
   "Book",
   "🌳"
  ],
  [
   "Seeds grow into plants. What comes first?",
   "The seed germinates (sprouts)",
   "The flower opens",
   "The fruit falls",
   "The leaf dries",
   "🌱"
  ],
  [
   "Which material can be squashed and stretched?",
   "Play dough",
   "Glass",
   "Stone",
   "Metal bar",
   "🟠"
  ],
  [
   "What do humans need to stay healthy?",
   "Food, water, exercise and sleep",
   "Only sweets",
   "Only TV",
   "Nothing",
   "🍎"
  ],
  [
   "Which animal group do spiders belong to?",
   "Arachnids",
   "Insects",
   "Fish",
   "Birds",
   "🕷️"
  ]
 ],
 "3": [
  [
   "Which rock is made from layers of sand and mud?",
   "Sedimentary rock",
   "Ice",
   "Chalk paint",
   "Plastic",
   "🪨"
  ],
  [
   "Which material is attracted to a magnet?",
   "Iron",
   "Wood",
   "Plastic",
   "Rubber",
   "🧲"
  ],
  [
   "What does the stem of a plant do?",
   "Holds it up and carries water",
   "Makes seeds",
   "Catches sunlight only",
   "Eats insects",
   "🌿"
  ],
  [
   "Why do shadows change during the day?",
   "The Sun appears to move across the sky",
   "The Moon pushes them",
   "Clouds stretch them",
   "Wind blows them",
   "☀️"
  ],
  [
   "Which part of our body do muscles help to move?",
   "Bones (the skeleton)",
   "Hair",
   "Nails",
   "Teeth only",
   "💪"
  ],
  [
   "What is pollination?",
   "Pollen moving to a flower so seeds can form",
   "Watering a plant",
   "Cutting a plant",
   "A plant sleeping",
   "🐝"
  ],
  [
   "Which food group helps our bones stay strong?",
   "Dairy (milk, cheese, yoghurt)",
   "Sweets",
   "Fizzy drinks",
   "Crisps",
   "🦴"
  ],
  [
   "A force that pulls things to the ground is…",
   "Gravity",
   "Friction",
   "Magnetism",
   "Light",
   "🌍"
  ],
  [
   "Which of these is a fossil?",
   "Ancient remains turned to rock",
   "A fresh leaf",
   "A living fish",
   "A plastic dinosaur",
   "🦕"
  ],
  [
   "What do the roots of a plant take in?",
   "Water and minerals",
   "Sunlight",
   "Pollen",
   "Insects",
   "🌱"
  ],
  [
   "Which light source is natural?",
   "The Sun",
   "A torch",
   "A lamp",
   "A candle only",
   "☀️"
  ],
  [
   "How are seeds spread by the wind called?",
   "Dispersal",
   "Growing",
   "Sleeping",
   "Eating",
   "🌬️"
  ]
 ],
 "4": [
  [
   "Which part of the digestive system breaks food into tiny pieces and juices?",
   "Stomach",
   "Heart",
   "Lungs",
   "Brain",
   "🫃"
  ],
  [
   "Which material is an electrical conductor?",
   "Metal (copper wire)",
   "Rubber",
   "Wood",
   "Plastic",
   "🔌"
  ],
  [
   "In the water cycle, water vapour turning back to liquid is called…",
   "Condensation",
   "Evaporation",
   "Freezing",
   "Melting",
   "💧"
  ],
  [
   "What makes a sound when it vibrates faster?",
   "A higher pitch",
   "A lower pitch",
   "No sound",
   "A quieter sound",
   "🎵"
  ],
  [
   "Which teeth are sharp and pointed for tearing meat?",
   "Canines",
   "Molars",
   "Incisors",
   "Milk teeth",
   "🦷"
  ],
  [
   "A switch in a circuit does what?",
   "Opens and closes the circuit to turn things on/off",
   "Makes electricity",
   "Stores water",
   "Changes the bulb colour",
   "💡"
  ],
  [
   "Which state of matter takes the shape of its container but keeps its volume?",
   "Liquid",
   "Solid",
   "Gas only",
   "Ice only",
   "🥤"
  ],
  [
   "Which of these is a producer in a food chain?",
   "Grass",
   "Rabbit",
   "Fox",
   "Lion",
   "🌾"
  ],
  [
   "Sound travels best through…",
   "Solids",
   "A vacuum (empty space)",
   "Nothing at all",
   "Only water",
   "🔊"
  ],
  [
   "Which gas do plants take in for photosynthesis?",
   "Carbon dioxide",
   "Oxygen only",
   "Helium",
   "Smoke",
   "🌿"
  ],
  [
   "What happens to water at 0°C?",
   "It freezes into ice",
   "It boils",
   "It evaporates",
   "It disappears",
   "🧊"
  ],
  [
   "Which group do humans belong to?",
   "Mammals",
   "Reptiles",
   "Amphibians",
   "Insects",
   "🧑"
  ]
 ],
 "5": [
  [
   "Why do we have day and night?",
   "The Earth spins on its axis",
   "The Sun moves around us",
   "The Moon covers the Sun daily",
   "Clouds hide the Sun",
   "🌍"
  ],
  [
   "Which force slows a parachute down?",
   "Air resistance",
   "Gravity only",
   "Magnetism",
   "Friction of the ground",
   "🪂"
  ],
  [
   "Which material change is reversible?",
   "Melting chocolate",
   "Burning wood",
   "Cooking an egg",
   "Rusting iron",
   "🍫"
  ],
  [
   "A tadpole is the young of which animal group?",
   "Amphibians",
   "Mammals",
   "Birds",
   "Reptiles",
   "🐸"
  ],
  [
   "Which planet is known as the Red Planet?",
   "Mars",
   "Venus",
   "Jupiter",
   "Saturn",
   "🔴"
  ],
  [
   "What does gravity do?",
   "Pulls objects towards the Earth",
   "Pushes objects away",
   "Makes things float forever",
   "Stops all movement",
   "🌍"
  ],
  [
   "When salt dissolves in water, the salt is called the…",
   "Solute",
   "Solvent",
   "Mixture only",
   "Gas",
   "🧂"
  ],
  [
   "Which life cycle stage comes after the caterpillar?",
   "Chrysalis (pupa)",
   "Egg",
   "Adult butterfly",
   "Larva again",
   "🦋"
  ],
  [
   "How long does Earth take to orbit the Sun once?",
   "About 365 days (1 year)",
   "1 day",
   "28 days",
   "10 years",
   "🗓️"
  ],
  [
   "Which force can stretch or squash a spring?",
   "A push or pull (force)",
   "Light",
   "Sound",
   "Heat only",
   "🌀"
  ],
  [
   "Which of these mixtures can be separated with a sieve?",
   "Sand and stones",
   "Salt and water",
   "Milk and tea",
   "Air",
   "🪣"
  ],
  [
   "The Moon's light comes from…",
   "Sunlight reflecting off it",
   "Its own fire",
   "City lights",
   "Stars shining on it only",
   "🌙"
  ]
 ],
 "6": [
  [
   "What does the heart do?",
   "Pumps blood around the body",
   "Makes food",
   "Helps us breathe in air",
   "Stores memories",
   "❤️"
  ],
  [
   "Why do finches on different islands have different beaks?",
   "Adaptation to different foods",
   "They chose new beaks",
   "The wind bent them",
   "They are different ages",
   "🐦"
  ],
  [
   "How do we see an object?",
   "Light reflects off it into our eyes",
   "Our eyes shine light out",
   "The object makes light always",
   "Through sound waves",
   "👁️"
  ],
  [
   "What happens to a bulb if voltage increases?",
   "It gets brighter",
   "It gets dimmer",
   "It turns off",
   "Nothing changes",
   "💡"
  ],
  [
   "Which micro-organism is used to make bread rise?",
   "Yeast (a fungus)",
   "A virus",
   "A bacterium only",
   "Mould paint",
   "🍞"
  ],
  [
   "Who created the classification system for living things?",
   "Carl Linnaeus",
   "Isaac Newton",
   "Charles Darwin only",
   "Albert Einstein",
   "🌿"
  ],
  [
   "Blood carries ___ around the body.",
   "Oxygen and nutrients",
   "Only water",
   "Bones",
   "Air bubbles",
   "🩸"
  ],
  [
   "What is evolution?",
   "Species changing over a very long time",
   "An animal growing up",
   "Seasons changing",
   "Plants growing fast",
   "🦒"
  ],
  [
   "Which vessel carries blood away from the heart?",
   "Artery",
   "Vein",
   "Capillary only",
   "Nerve",
   "🫀"
  ],
  [
   "Light travels…",
   "In straight lines",
   "In circles",
   "Only downwards",
   "Through nothing",
   "🔦"
  ],
  [
   "Inherited characteristics come from…",
   "Our parents (genes)",
   "The food we eat",
   "The weather",
   "Our friends",
   "🧬"
  ],
  [
   "Which circuit component measures how hard electricity is pushed?",
   "Voltmeter",
   "Switch",
   "Bulb",
   "Wire",
   "🔋"
  ]
 ]
};

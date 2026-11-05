import type { GradeBand } from '../types'

/**
 * Micro-lessons shown before a practice round: a short idea in plain words,
 * then one worked example. One lesson per (subject, band) pair that has quiz
 * items, on the band's most common topic. Budget: idea ≤ 45 words,
 * example ≤ 40 words.
 */
export interface Lesson {
  subjectId: string
  band: GradeBand
  title: string
  idea: string
  example: string
}

export const LESSONS: Lesson[] = [
  // ---------------------------------------------------------------- Maths
  {
    subjectId: 'maths',
    band: '1-5',
    title: 'Adding with tens and ones',
    idea: 'Big numbers are made of tens and ones. Add the tens first. Then add the ones. Put the two answers together.',
    example: 'Ali has Rs 27. His aunt gives him Rs 15. Tens: 20 + 10 = 30. Ones: 7 + 5 = 12. Together: 30 + 12 = 42. Ali has Rs 42.',
  },
  {
    subjectId: 'maths',
    band: '6-8',
    title: 'Sharing in a ratio',
    idea: 'A ratio compares two amounts, like 3:2. To share using a ratio, add the parts to find the total number of parts. Divide the amount by that total to find one part, then multiply.',
    example: 'Share 30 mangoes between Sana and Hina in the ratio 3:2. Total parts: 3 + 2 = 5. One part: 30 ÷ 5 = 6. Sana gets 3 × 6 = 18, Hina gets 2 × 6 = 12.',
  },
  {
    subjectId: 'maths',
    band: '9-10',
    title: 'Solving a quadratic by factorising',
    idea: 'A quadratic equation has an x² term. Write it as something = 0, then split it into two brackets that multiply to give it. If a product is zero, one of the brackets must be zero.',
    example: 'Solve x² − 5x + 6 = 0. Find two numbers that multiply to 6 and add to −5: −2 and −3. So (x − 2)(x − 3) = 0, giving x = 2 or x = 3.',
  },
  {
    subjectId: 'maths',
    band: '11-12',
    title: 'Differentiating powers of x',
    idea: 'The derivative tells you how fast a function changes. For a power of x, bring the power down in front and reduce the power by one. Constants disappear, and you differentiate each term separately.',
    example: 'For y = 3x⁴ + 2x − 7: 3x⁴ becomes 12x³, 2x becomes 2, and −7 becomes 0. So dy/dx = 12x³ + 2. At x = 1 the slope is 14.',
  },

  // -------------------------------------------------------------- English
  {
    subjectId: 'english',
    band: '1-5',
    title: 'Naming words and doing words',
    idea: 'A noun is a naming word. It names a person, place or thing. A verb is a doing word. It tells us what someone does.',
    example: 'Read this: "Ahmed kicks the ball." Ahmed is a person, so it is a noun. Ball is a thing, so it is a noun. Kicks is what Ahmed does. It is a verb.',
  },
  {
    subjectId: 'english',
    band: '6-8',
    title: 'Present, past and future',
    idea: 'The tense of a verb shows when something happens. Present tense is now, past tense already happened, and future tense will happen later. Many past verbs end in -ed, and future often uses "will".',
    example: 'Present: "Zara plays cricket." Past: "Zara played cricket yesterday." Future: "Zara will play cricket tomorrow." Only the verb changes to show the time.',
  },
  {
    subjectId: 'english',
    band: '9-10',
    title: 'Active and passive voice',
    idea: 'In the active voice the doer comes first. In the passive voice the thing acted on comes first, and we use a form of "be" plus the past participle. The doer can follow "by" or be left out.',
    example: 'Active: "The chef cooked the biryani." Passive: "The biryani was cooked by the chef." The tense stays the same: "cooked" (past) becomes "was cooked".',
  },
  {
    subjectId: 'english',
    band: '11-12',
    title: 'Correcting a sentence',
    idea: 'Most sentence errors come from a few sources: subject and verb not agreeing, the wrong tense, a misplaced word, or a wrong preposition. Find the subject, find its verb, then check that they match in number and time.',
    example: '"Each of the students have a laptop." The subject is "each", which is singular, so the verb must be "has". Correct: "Each of the students has a laptop."',
  },

  // ----------------------------------------------------------------- Urdu
  {
    subjectId: 'urdu',
    band: '6-8',
    title: 'اسم، فعل اور صفت',
    idea: 'کسی شخص، جگہ یا چیز کے نام کو اسم کہتے ہیں۔ جو لفظ کسی کام کا ہونا بتائے وہ فعل ہے۔ جو لفظ اسم کی خوبی یا خامی بتائے اسے صفت کہتے ہیں۔',
    example: 'جملہ: "احمد میٹھا آم کھاتا ہے۔" احمد اور آم اسم ہیں کیونکہ یہ نام ہیں۔ "میٹھا" آم کی خوبی بتاتا ہے، اس لیے صفت ہے۔ "کھاتا ہے" فعل ہے۔',
  },
  {
    subjectId: 'urdu',
    band: '9-10',
    title: 'ضمیر کیا ہے؟',
    idea: 'ضمیر وہ لفظ ہے جو اسم کی جگہ استعمال ہوتا ہے تاکہ ایک ہی نام بار بار نہ دہرانا پڑے۔ میں، تم، وہ، یہ اور ہم عام ضمیریں ہیں۔',
    example: '"عائشہ لاہور گئی۔ عائشہ نے مینارِ پاکستان دیکھا۔" دوسری بار نام کی جگہ ضمیر لکھیں: "عائشہ لاہور گئی۔ اس نے مینارِ پاکستان دیکھا۔"',
  },

  // ------------------------------------------------------ General science
  {
    subjectId: 'general-science',
    band: '1-5',
    title: 'Solid, liquid and gas',
    idea: 'Everything around us is matter. Matter can be solid, liquid or gas. Heat can change it from one to another.',
    example: 'Put ice in a glass on a hot Karachi day. The solid ice melts into liquid water. Boil the water in a pot. It turns into steam, a gas.',
  },
  {
    subjectId: 'general-science',
    band: '6-8',
    title: 'Cells: the building blocks',
    idea: 'All living things are made of cells. The nucleus controls the cell, the cell membrane lets things in and out, and cytoplasm fills the inside. Plant cells also have a cell wall and chloroplasts for making food.',
    example: 'A leaf from a mango tree is green because its cells have chloroplasts. A cell from your cheek has no chloroplasts or cell wall, because animals do not make their own food.',
  },

  // ------------------------------------------------------- Social studies
  {
    subjectId: 'social-studies',
    band: '1-5',
    title: 'How Pakistan was made',
    idea: 'Pakistan became a free country on 14 August 1947. Quaid-e-Azam Muhammad Ali Jinnah led the struggle. Allama Iqbal shared the dream of a Muslim homeland.',
    example: 'Every year on 14 August, families in Lahore and Karachi put up green flags. They celebrate the day Pakistan was born. Our first leader was Quaid-e-Azam.',
  },
  {
    subjectId: 'social-studies',
    band: '6-8',
    title: 'The Indus Valley Civilisation',
    idea: 'About 4,500 years ago, people built planned cities along the Indus River. Mohenjo-daro and Harappa had straight streets, brick houses and covered drains. The river gave them water for farming and a route for trade.',
    example: 'Mohenjo-daro, in Sindh near Larkana, had a Great Bath and drains under its streets. Many modern towns still struggle with drainage, yet these people planned it thousands of years ago.',
  },

  // ------------------------------------------------------------ Islamiyat
  {
    subjectId: 'islamiyat',
    band: '6-8',
    title: 'The five pillars of Islam',
    idea: 'Islam rests on five pillars, the duties every Muslim keeps. They are Shahadah (declaring faith), Salah (prayer five times a day), Zakat (giving to those in need), Sawm (fasting in Ramadan) and Hajj (pilgrimage to Makkah).',
    example: 'A family that saves Rs 100,000 for a year pays Zakat at 2.5%: 100,000 × 2.5 ÷ 100 = Rs 2,500, given to people in need.',
  },

  // ---------------------------------------------------- Computer studies
  {
    subjectId: 'computer-studies',
    band: '6-8',
    title: 'What an algorithm is',
    idea: 'An algorithm is a list of clear steps that solves a problem. The steps must be in the right order and leave no room for guessing. Computers follow algorithms exactly, so every step must be precise.',
    example: 'Making chai: 1. Boil water. 2. Add tea leaves. 3. Add milk and sugar. 4. Boil again. 5. Strain into a cup. Swap steps 1 and 5 and it no longer works.',
  },

  // ------------------------------------------------------------- Physics
  {
    subjectId: 'physics',
    band: '9-10',
    title: 'Speed, velocity and acceleration',
    idea: 'Speed is distance divided by time. Velocity is speed in a given direction. Acceleration is how quickly velocity changes: change in velocity divided by the time taken, measured in m/s².',
    example: 'A bus leaves a stop in Islamabad and reaches 20 m/s in 10 s. Acceleration = (20 − 0) ÷ 10 = 2 m/s². Its velocity rises by 2 m/s every second.',
  },
  {
    subjectId: 'physics',
    band: '11-12',
    title: 'Adding vectors by components',
    idea: 'A vector has both size and direction. To add vectors, split each into horizontal and vertical components, add the components separately, then rebuild the result with Pythagoras and trigonometry.',
    example: 'A boat moves 3 m/s east while the river pushes it 4 m/s north. Resultant = √(3² + 4²) = 5 m/s, at tan⁻¹(4/3) ≈ 53° north of east.',
  },

  // ----------------------------------------------------------- Chemistry
  {
    subjectId: 'chemistry',
    band: '9-10',
    title: 'Inside an atom',
    idea: 'An atom has a tiny nucleus of protons and neutrons, with electrons in shells around it. The atomic number is the number of protons. The mass number is protons plus neutrons. Shells fill 2, then 8, then 8.',
    example: 'Sodium has atomic number 11 and mass number 23. Protons = 11, electrons = 11, neutrons = 23 − 11 = 12. Electron arrangement: 2, 8, 1.',
  },
  {
    subjectId: 'chemistry',
    band: '11-12',
    title: 'Moles and stoichiometry',
    idea: 'A mole is 6.02 × 10²³ particles. Moles = mass ÷ molar mass. A balanced equation gives the mole ratio between reactants and products, which lets you predict how much product forms.',
    example: '2H₂ + O₂ → 2H₂O. Burning 4 g of hydrogen: 4 ÷ 2 = 2 mol H₂, which gives 2 mol H₂O. Mass of water = 2 × 18 = 36 g.',
  },

  // ------------------------------------------------------------- Biology
  {
    subjectId: 'biology',
    band: '9-10',
    title: 'How enzymes work',
    idea: 'Enzymes are proteins that speed up reactions in living things without being used up. Each enzyme has an active site that fits one substrate, like a lock and key. Too much heat or the wrong pH changes the shape and stops it working.',
    example: 'Amylase in your saliva starts breaking down the starch in roti into sugar. Chew a piece for a minute and it begins to taste slightly sweet.',
  },
  {
    subjectId: 'biology',
    band: '11-12',
    title: 'DNA, genes and chromosomes',
    idea: 'DNA is a double helix of nucleotides. Bases pair A with T and C with G. A gene is a stretch of DNA that codes for a protein, and DNA is packed into chromosomes. Humans have 46 chromosomes in 23 pairs.',
    example: 'If one strand reads A T G C C A, the matching strand reads T A C G G T. If a DNA sample is 30% A, it is also 30% T, leaving 20% each for C and G.',
  },

  // ---------------------------------------------------- Computer science
  {
    subjectId: 'computer-science',
    band: '9-10',
    title: 'Counting in binary',
    idea: 'Computers store everything as 0s and 1s. In binary, each place value doubles from right to left: 1, 2, 4, 8, 16 and so on. To convert to decimal, add the place values that have a 1.',
    example: 'Binary 1011: place values 8, 4, 2, 1. The 1s sit under 8, 2 and 1. So 8 + 2 + 1 = 11 in decimal.',
  },
  {
    subjectId: 'computer-science',
    band: '11-12',
    title: 'Loops in C',
    idea: 'A loop repeats a block of code. A for loop has three parts: start, condition and update. The body runs while the condition is true, and the update moves the loop towards stopping.',
    example: 'for (int i = 1; i <= 5; i++) sum += i; starts at 1, runs while i ≤ 5 and adds 1 each time. It adds 1 + 2 + 3 + 4 + 5, so sum ends as 15.',
  },

  // ----------------------------------------------------------- Economics
  {
    subjectId: 'economics',
    band: '9-10',
    title: 'Demand and supply',
    idea: 'Demand is how much people want to buy at each price; when price rises, demand usually falls. Supply is how much sellers offer; when price rises, supply usually rises. The market price settles where the two meet.',
    example: 'When the mango crop is small, supply falls and prices in Multan rise. In a bumper season, sellers have too many mangoes, so the price drops until people buy them.',
  },
  {
    subjectId: 'economics',
    band: '11-12',
    title: 'Price elasticity of demand',
    idea: 'Price elasticity measures how strongly demand reacts to a price change: percentage change in quantity divided by percentage change in price. Above 1 is elastic, below 1 is inelastic. Necessities tend to be inelastic.',
    example: 'Petrol rises 10% and sales fall 2%. Elasticity = 2 ÷ 10 = 0.2, which is inelastic: people still need to drive. A 10% rise in cinema tickets cutting sales 25% gives 2.5, which is elastic.',
  },

  // ---------------------------------------------------------- Accounting
  {
    subjectId: 'accounting',
    band: '11-12',
    title: 'The accounting equation',
    idea: 'Every business balances: Assets = Liabilities + Capital. Every transaction changes at least two items so the equation always holds. This is the basis of double-entry bookkeeping.',
    example: 'Sara starts a shop in Karachi with Rs 500,000 of her own money and a Rs 200,000 bank loan. Assets (cash) Rs 700,000 = Liabilities Rs 200,000 + Capital Rs 500,000.',
  },

  // --------------------------------------------------------- Pak studies
  {
    subjectId: 'pak-studies',
    band: '9-10',
    title: 'Milestones in the making of Pakistan',
    idea: 'The demand for Pakistan grew step by step. The All-India Muslim League was founded in Dhaka in 1906. Allama Iqbal proposed a separate Muslim state at Allahabad in 1930. The Lahore Resolution of 1940 made it a formal demand.',
    example: 'Put events in order with a timeline: 1906 Muslim League, 1930 Allahabad Address, 1940 Lahore Resolution at Minto Park (now Iqbal Park), 1947 independence.',
  },
]

export function lessonFor(subjectId: string, band: GradeBand): Lesson | undefined {
  return LESSONS.find((l) => l.subjectId === subjectId && l.band === band)
}

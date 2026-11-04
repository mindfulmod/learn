import type { GradeBand, QuizItem } from '../types'

type Diff = 1 | 2 | 3

let counter = 0
function q(
  subjectId: string,
  band: GradeBand,
  topic: string,
  difficulty: Diff,
  question: string,
  options: string[],
  answer: number,
  explanation: string,
): QuizItem {
  counter += 1
  return { id: `${subjectId}-${band}-${counter}`, subjectId, band, topic, difficulty, question, options, answer, explanation }
}

/**
 * Practice item bank. Each subject and grade band has a small set of
 * questions across topics and difficulty levels. Questions follow the
 * national curriculum outlines in subjects.ts.
 */
export const QUIZ_ITEMS: QuizItem[] = [
  // ====================================================== Mathematics 1-5
  q('maths', '1-5', 'Number sense', 1, 'What is 27 + 15?', ['32', '42', '41', '52'], 1, '27 + 15: add the tens (20 + 10 = 30) and units (7 + 5 = 12). 30 + 12 = 42.'),
  q('maths', '1-5', 'Number sense', 1, 'Which number is the biggest?', ['809', '890', '908', '899'], 2, 'Compare the hundreds first (all 8 or 9). 908 has 9 hundreds, so it is biggest.'),
  q('maths', '1-5', 'Multiplication', 2, 'What is 7 × 8?', ['54', '56', '63', '48'], 1, '7 × 8 = 56. A trick: 5, 6, 7, 8 → 56 = 7 × 8.'),
  q('maths', '1-5', 'Division', 2, 'Ahmed shares 36 sweets equally among 4 friends. How many does each get?', ['8', '9', '12', '6'], 1, '36 ÷ 4 = 9.'),
  q('maths', '1-5', 'Fractions', 2, 'Which fraction is equal to one half?', ['2/6', '3/6', '2/5', '1/3'], 1, '3/6 simplifies to 1/2 because 3 is half of 6.'),
  q('maths', '1-5', 'Money and time', 1, 'A copy costs Rs 45 and a pencil costs Rs 15. How much do both cost?', ['Rs 50', 'Rs 55', 'Rs 60', 'Rs 65'], 2, '45 + 15 = 60.'),
  q('maths', '1-5', 'Geometry', 2, 'How many sides does a hexagon have?', ['5', '6', '7', '8'], 1, '"Hexa" means six. A hexagon has 6 sides.'),
  q('maths', '1-5', 'Percentages', 3, 'What is 25% of 80?', ['15', '20', '25', '40'], 1, '25% is one quarter. 80 ÷ 4 = 20.'),
  q('maths', '1-5', 'Perimeter and area', 3, 'A rectangle is 6 cm long and 4 cm wide. What is its area?', ['10 cm²', '20 cm²', '24 cm²', '48 cm²'], 2, 'Area = length × width = 6 × 4 = 24 cm².'),
  q('maths', '1-5', 'Factors and multiples', 3, 'What is the LCM of 4 and 6?', ['10', '12', '24', '2'], 1, 'Multiples of 4: 4, 8, 12. Multiples of 6: 6, 12. The smallest shared one is 12.'),

  // ====================================================== Mathematics 6-8
  q('maths', '6-8', 'Integers', 1, 'What is (−8) + 5?', ['−13', '−3', '3', '13'], 1, 'Start at −8 and move 5 to the right: −3.'),
  q('maths', '6-8', 'Ratio and proportion', 2, 'The ratio of boys to girls in a class is 3:2. If there are 30 students, how many are girls?', ['10', '12', '15', '18'], 1, '3 + 2 = 5 parts. 30 ÷ 5 = 6 per part. Girls = 2 × 6 = 12.'),
  q('maths', '6-8', 'Linear equations', 2, 'Solve for x: 3x − 7 = 11', ['4', '6', '18', '3'], 1, 'Add 7: 3x = 18. Divide by 3: x = 6.'),
  q('maths', '6-8', 'Exponents', 2, 'What is 2⁵?', ['10', '16', '25', '32'], 3, '2 × 2 × 2 × 2 × 2 = 32.'),
  q('maths', '6-8', 'Geometry', 2, 'The angles of a triangle are 50° and 60°. What is the third angle?', ['60°', '70°', '80°', '90°'], 1, 'Angles in a triangle add to 180°. 180 − 50 − 60 = 70°.'),
  q('maths', '6-8', 'Pythagoras theorem', 3, 'A right triangle has legs of 6 cm and 8 cm. What is the hypotenuse?', ['10 cm', '12 cm', '14 cm', '48 cm'], 0, '6² + 8² = 36 + 64 = 100. √100 = 10 cm.'),
  q('maths', '6-8', 'Statistics', 1, 'What is the mean of 4, 8, 6, 10 and 2?', ['5', '6', '7', '8'], 1, 'Sum = 30. 30 ÷ 5 = 6.'),
  q('maths', '6-8', 'Algebraic expressions', 2, 'Simplify: 4a + 3b − 2a + b', ['2a + 4b', '6a + 2b', '2a + 2b', '6a + 4b'], 0, '4a − 2a = 2a and 3b + b = 4b.'),
  q('maths', '6-8', 'Sets', 3, 'If A = {1, 2, 3, 4} and B = {3, 4, 5}, what is A ∩ B?', ['{1, 2, 3, 4, 5}', '{3, 4}', '{1, 2}', '{5}'], 1, 'Intersection means elements in both sets: 3 and 4.'),
  q('maths', '6-8', 'Percentages', 3, 'A shirt priced Rs 1200 is sold at a 15% discount. What is the sale price?', ['Rs 1020', 'Rs 1050', 'Rs 1080', 'Rs 1140'], 0, '15% of 1200 = 180. 1200 − 180 = 1020.'),

  // ====================================================== Mathematics 9-10
  q('maths', '9-10', 'Matrices', 1, 'What is the order of the matrix [[1, 2, 3], [4, 5, 6]]?', ['3 × 2', '2 × 3', '2 × 2', '3 × 3'], 1, 'Order is rows × columns: 2 rows and 3 columns.'),
  q('maths', '9-10', 'Logarithms', 2, 'What is log₁₀ 1000?', ['2', '3', '10', '100'], 1, '10³ = 1000, so the log is 3.'),
  q('maths', '9-10', 'Factorisation', 2, 'Factorise x² − 9.', ['(x − 3)²', '(x + 3)(x − 3)', '(x + 9)(x − 1)', '(x − 9)(x + 1)'], 1, 'Difference of two squares: a² − b² = (a + b)(a − b).'),
  q('maths', '9-10', 'Quadratic equations', 2, 'The roots of x² − 5x + 6 = 0 are:', ['2 and 3', '−2 and −3', '1 and 6', '−1 and −6'], 0, '(x − 2)(x − 3) = 0 gives x = 2 or 3.'),
  q('maths', '9-10', 'Theory of quadratic equations', 3, 'If the discriminant b² − 4ac is negative, the roots are:', ['Real and equal', 'Real and unequal', 'Complex (imaginary)', 'Rational'], 2, 'A negative discriminant means no real square root, so the roots are complex.'),
  q('maths', '9-10', 'Trigonometry', 2, 'What is sin 30°?', ['1/2', '√3/2', '1', '√2/2'], 0, 'sin 30° = 1/2. Remember sin 30 = cos 60 = 1/2.'),
  q('maths', '9-10', 'Variations', 2, 'If y varies directly as x and y = 12 when x = 4, find y when x = 7.', ['15', '19', '21', '28'], 2, 'y = kx; k = 3. y = 3 × 7 = 21.'),
  q('maths', '9-10', 'Sets and functions', 3, 'Which of these is a function from {1, 2, 3} to {a, b}?', ['{(1,a), (1,b), (2,a)}', '{(1,a), (2,a), (3,b)}', '{(1,a), (2,b)}', '{(2,a), (2,b), (3,a)}'], 1, 'Every input must appear exactly once. Only option B maps each of 1, 2, 3 once.'),
  q('maths', '9-10', 'Basic statistics', 1, 'The median of 3, 9, 7, 5, 11 is:', ['5', '7', '9', '35'], 1, 'Ordered: 3, 5, 7, 9, 11. The middle value is 7.'),
  q('maths', '9-10', 'Real and complex numbers', 3, 'Simplify i⁴ where i = √−1.', ['−1', '1', 'i', '−i'], 1, 'i² = −1, so i⁴ = (i²)² = (−1)² = 1.'),

  // ====================================================== Mathematics 11-12
  q('maths', '11-12', 'Sequences and series', 2, 'The 10th term of the arithmetic sequence 3, 7, 11, ... is:', ['39', '43', '37', '41'], 0, 'aₙ = a + (n − 1)d = 3 + 9 × 4 = 39.'),
  q('maths', '11-12', 'Permutation and combination', 2, 'How many ways can 3 students be chosen from 5?', ['10', '15', '60', '125'], 0, '⁵C₃ = 5! / (3! × 2!) = 10.'),
  q('maths', '11-12', 'Differentiation', 2, 'd/dx (x³ + 2x) = ?', ['3x² + 2', 'x² + 2', '3x + 2', '3x²'], 0, 'Power rule: 3x² for x³, and 2 for 2x.'),
  q('maths', '11-12', 'Integration', 3, '∫ 2x dx = ?', ['x² + C', '2x² + C', 'x + C', '2 + C'], 0, 'The antiderivative of 2x is x², plus the constant C.'),
  q('maths', '11-12', 'Functions and limits', 3, 'lim (x→2) (x² − 4)/(x − 2) = ?', ['0', '2', '4', 'Undefined'], 2, 'Factor: (x − 2)(x + 2)/(x − 2) = x + 2 → 4.'),
  q('maths', '11-12', 'Trigonometric identities', 2, 'sin²θ + cos²θ = ?', ['0', '1', 'tan²θ', '2'], 1, 'The fundamental Pythagorean identity.'),
  q('maths', '11-12', 'Vectors', 2, 'The magnitude of the vector 3i + 4j is:', ['5', '7', '12', '25'], 0, '√(3² + 4²) = √25 = 5.'),
  q('maths', '11-12', 'Binomial theorem', 3, 'The coefficient of x² in (1 + x)⁵ is:', ['5', '10', '20', '25'], 1, '⁵C₂ = 10.'),
  q('maths', '11-12', 'Analytical geometry', 2, 'The slope of the line 2x + 3y = 6 is:', ['2/3', '−2/3', '3/2', '−3/2'], 1, 'Rewrite as y = (−2/3)x + 2. Slope is −2/3.'),
  q('maths', '11-12', 'Probability', 1, 'A die is rolled once. The probability of getting an even number is:', ['1/6', '1/3', '1/2', '2/3'], 2, 'Even numbers: 2, 4, 6. That is 3 of 6 = 1/2.'),

  // ====================================================== English 1-5
  q('english', '1-5', 'Nouns and verbs', 1, 'Which word is a verb? "The cat jumps over the wall."', ['cat', 'jumps', 'wall', 'the'], 1, 'A verb is an action word. "Jumps" is the action.'),
  q('english', '1-5', 'Tenses', 2, 'Choose the past tense: "Yesterday, Sara ___ to school."', ['go', 'goes', 'went', 'going'], 2, '"Went" is the past tense of "go".'),
  q('english', '1-5', 'Plurals', 1, 'What is the plural of "child"?', ['childs', 'childes', 'children', 'childrens'], 2, '"Child" has an irregular plural: "children".'),
  q('english', '1-5', 'Adjectives', 1, 'Which word describes the noun? "A beautiful garden."', ['A', 'beautiful', 'garden', 'none'], 1, 'An adjective describes a noun. "Beautiful" describes the garden.'),
  q('english', '1-5', 'Comprehension', 2, '"Ali woke up late, so he missed the bus." Why did Ali miss the bus?', ['The bus was broken', 'He woke up late', 'He walked to school', 'It was raining'], 1, 'The word "so" tells us the reason: he woke up late.'),
  q('english', '1-5', 'Punctuation', 2, 'Which sentence is correctly punctuated?', ['where is my bag', 'Where is my bag?', 'where is my bag?', 'Where is my bag.'], 1, 'A question starts with a capital letter and ends with a question mark.'),
  q('english', '1-5', 'Opposites', 1, 'What is the opposite of "generous"?', ['kind', 'selfish', 'happy', 'brave'], 1, 'Generous means giving freely; selfish is the opposite.'),
  q('english', '1-5', 'Pronouns', 2, '"Fatima lost ___ book."', ['she', 'her', 'hers', 'him'], 1, '"Her" is the possessive pronoun used before a noun.'),

  // ====================================================== English 6-8
  q('english', '6-8', 'Active and passive voice', 2, 'Change to passive: "The teacher praised the student."', ['The student praised the teacher.', 'The student was praised by the teacher.', 'The student is praising the teacher.', 'The teacher was praised by the student.'], 1, 'Passive: object becomes subject, use "was" + past participle.'),
  q('english', '6-8', 'Direct and indirect speech', 3, 'He said, "I am tired." In indirect speech:', ['He said that he is tired.', 'He said that he was tired.', 'He said that I am tired.', 'He says that he was tired.'], 1, 'Present becomes past and "I" becomes "he".'),
  q('english', '6-8', 'Parts of speech', 1, 'In "She sings beautifully", the word "beautifully" is a(n):', ['adjective', 'adverb', 'noun', 'verb'], 1, 'It describes how she sings, so it is an adverb.'),
  q('english', '6-8', 'Vocabulary', 2, 'Which word means "very happy"?', ['miserable', 'elated', 'anxious', 'ordinary'], 1, '"Elated" means extremely happy.'),
  q('english', '6-8', 'Tenses', 2, '"By next year, I ___ this book." (future perfect)', ['will finish', 'will have finished', 'finished', 'am finishing'], 1, 'Future perfect = will have + past participle.'),
  q('english', '6-8', 'Comprehension', 2, '"Although it was raining, the match continued." The word "although" shows:', ['cause', 'contrast', 'time', 'addition'], 1, '"Although" introduces a contrast between rain and the match continuing.'),
  q('english', '6-8', 'Idioms', 3, 'What does "once in a blue moon" mean?', ['Very rarely', 'Every night', 'At full moon', 'Very often'], 0, 'A blue moon is rare, so the idiom means rarely.'),
  q('english', '6-8', 'Sentence structure', 2, 'Which is a compound sentence?', ['I like tea.', 'I like tea, but my brother likes coffee.', 'Because I like tea.', 'Liking tea.'], 1, 'Two independent clauses joined by "but" make a compound sentence.'),

  // ====================================================== English 9-10
  q('english', '9-10', 'Grammar: voice', 2, 'Identify the voice: "The letter has been written by Amna."', ['Active', 'Passive', 'Imperative', 'Interrogative'], 1, '"Has been written by" is passive voice.'),
  q('english', '9-10', 'Pair of words', 2, 'Which pair is correctly matched?', ['Principal = main; Principle = rule', 'Principal = rule; Principle = main', 'Both mean rule', 'Both mean main'], 0, '"Principal" means main (or head of school); "principle" is a rule or belief.'),
  q('english', '9-10', 'Narration', 3, 'She said to me, "Will you help me?" Indirect speech:', ['She asked me if I would help her.', 'She told me will you help me.', 'She asked me will I help her.', 'She said me if I will help her.'], 0, 'Questions become "asked ... if", and "will" becomes "would".'),
  q('english', '9-10', 'Comprehension', 2, '"The author argues that discipline, not talent, decides success." The main idea is:', ['Talent is everything', 'Discipline matters more than talent', 'Success is luck', 'Talent and discipline are equal'], 1, 'The sentence directly contrasts discipline and talent in favour of discipline.'),
  q('english', '9-10', 'Essay writing', 1, 'A good essay introduction should:', ['List every point in detail', 'State the topic and main idea', 'Only ask questions', 'Repeat the title three times'], 1, 'The introduction frames the topic and thesis; details come in the body.'),
  q('english', '9-10', 'Idioms', 2, '"To burn the midnight oil" means:', ['To waste fuel', 'To study or work late at night', 'To cook at night', 'To be angry'], 1, 'The idiom refers to working late by lamplight.'),
  q('english', '9-10', 'Grammar: tenses', 2, '"He ___ here since 2015."', ['lives', 'is living', 'has lived', 'lived'], 2, '"Since" with an ongoing state uses the present perfect.'),
  q('english', '9-10', 'Poetry', 3, 'A comparison using "like" or "as" is called a:', ['metaphor', 'simile', 'personification', 'alliteration'], 1, 'A simile compares using "like" or "as".'),

  // ====================================================== English 11-12
  q('english', '11-12', 'Punctuation', 2, 'Which sentence uses the semicolon correctly?', ['I came; late.', 'I came late; the meeting had started.', 'I came; late the meeting had started.', 'I; came late.'], 1, 'A semicolon joins two closely related independent clauses.'),
  q('english', '11-12', 'Vocabulary', 2, '"Ubiquitous" means:', ['rare', 'present everywhere', 'ancient', 'hidden'], 1, 'Ubiquitous describes something found everywhere.'),
  q('english', '11-12', 'Literature', 2, 'In "Goodbye Mr Chips", Mr Chips is a:', ['doctor', 'schoolmaster', 'soldier', 'lawyer'], 1, 'Mr Chipping is a teacher at Brookfield School.'),
  q('english', '11-12', 'Sentence correction', 3, 'Choose the correct sentence.', ['Neither of the boys were present.', 'Neither of the boys was present.', 'Neither of the boy was present.', 'Neither boys was present.'], 1, '"Neither" is singular, so it takes "was".'),
  q('english', '11-12', 'Essay writing', 2, 'The purpose of a topic sentence is to:', ['End the essay', 'State the main idea of a paragraph', 'Add a quotation', 'List references'], 1, 'Each paragraph begins with a topic sentence giving its main idea.'),
  q('english', '11-12', 'Translation', 3, 'Best translation of "وقت کسی کا انتظار نہیں کرتا":', ['Time waits for no one.', 'Time is money.', 'Wait for the right time.', 'No one has time.'], 0, 'Literal and idiomatic: time waits for no one.'),

  // ====================================================== Urdu 6-8 and 9-10
  q('urdu', '6-8', 'Qawaid', 1, '"کتاب" کس قسم کا لفظ ہے؟', ['اسم', 'فعل', 'صفت', 'حرف'], 0, 'کتاب ایک چیز کا نام ہے، اس لیے یہ اسم ہے۔'),
  q('urdu', '6-8', 'Wahid aur jama', 1, '"کتاب" کی جمع کیا ہے؟', ['کتابیں', 'کتابوں', 'کتب', 'کتابے'], 0, 'کتاب کی عام جمع "کتابیں" ہے (عربی جمع "کتب" بھی درست ہے، مگر عام استعمال "کتابیں")۔'),
  q('urdu', '6-8', 'Muhawaray', 2, '"آنکھ کا تارا" کا مطلب ہے:', ['بہت پیارا', 'ایک ستارہ', 'آنکھ کی بیماری', 'روشنی'], 0, 'آنکھ کا تارا یعنی بہت عزیز اور پیارا۔'),
  q('urdu', '6-8', 'Zarb-ul-misal', 2, '"جیسی کرنی ویسی بھرنی" کا مفہوم:', ['محنت کا پھل', 'جو کرو گے وہی پاؤ گے', 'صبر کا پھل میٹھا', 'وقت قیمتی ہے'], 1, 'یہ کہاوت عمل اور اس کے نتیجے کے بارے میں ہے۔'),
  q('urdu', '6-8', 'Grammar', 2, '"وہ تیز دوڑتا ہے" میں "تیز" کیا ہے؟', ['اسم', 'فعل', 'متعلق فعل', 'ضمیر'], 2, '"تیز" فعل "دوڑتا" کی کیفیت بتاتا ہے، اس لیے متعلق فعل ہے۔'),
  q('urdu', '9-10', 'Nazm aur ghazal', 2, 'شاعرِ مشرق کس شاعر کو کہا جاتا ہے؟', ['مرزا غالب', 'علامہ اقبال', 'فیض احمد فیض', 'میر تقی میر'], 1, 'علامہ محمد اقبال کو شاعرِ مشرق کہا جاتا ہے۔'),
  q('urdu', '9-10', 'Grammar', 2, 'ایک ایسا لفظ جو اسم کی جگہ استعمال ہو:', ['صفت', 'ضمیر', 'فعل', 'حرف'], 1, 'ضمیر اسم کی جگہ استعمال ہوتی ہے، جیسے وہ، یہ، میں۔'),
  q('urdu', '9-10', 'Tashreeh', 3, '"خودی کو کر بلند اتنا کہ ہر تقدیر سے پہلے" یہ مصرع کس کا ہے؟', ['غالب', 'اقبال', 'فیض', 'جوش'], 1, 'یہ علامہ اقبال کا مشہور شعر ہے۔'),
  q('urdu', '9-10', 'Khat', 1, 'رسمی خط میں سب سے پہلے کیا لکھا جاتا ہے؟', ['خلاصہ', 'پتا اور تاریخ', 'دستخط', 'اختتام'], 1, 'خط کے آغاز میں لکھنے والے کا پتا اور تاریخ آتی ہے۔'),
  q('urdu', '9-10', 'Jumlon ki durusti', 2, 'درست جملہ منتخب کریں:', ['میں نے کتاب پڑھی۔', 'میں کتاب پڑھی۔', 'میں نے کتاب پڑھا۔', 'مجھے کتاب پڑھی۔'], 0, 'ماضی میں "نے" کے ساتھ فعل مفعول (کتاب، مؤنث) کے مطابق ہوتا ہے: پڑھی۔'),

  // ====================================================== General Science 1-5
  q('general-science', '1-5', 'Living things', 1, 'Which of these is a living thing?', ['Rock', 'Tree', 'Chair', 'Cloud'], 1, 'A tree grows, needs water and reproduces, so it is living.'),
  q('general-science', '1-5', 'Plants', 1, 'Which part of a plant makes food using sunlight?', ['Root', 'Stem', 'Leaf', 'Flower'], 2, 'Leaves contain chlorophyll and make food by photosynthesis.'),
  q('general-science', '1-5', 'States of matter', 2, 'When water is heated to 100°C it turns into:', ['Ice', 'Steam', 'Rain', 'Dew'], 1, 'Boiling water becomes steam (water vapour).'),
  q('general-science', '1-5', 'Human body', 2, 'Which organ pumps blood around the body?', ['Lungs', 'Brain', 'Heart', 'Stomach'], 2, 'The heart is a muscle that pumps blood.'),
  q('general-science', '1-5', 'Earth and space', 1, 'Which planet do we live on?', ['Mars', 'Earth', 'Venus', 'Jupiter'], 1, 'We live on Earth, the third planet from the Sun.'),
  q('general-science', '1-5', 'Force and motion', 2, 'What force pulls things down towards the Earth?', ['Magnetism', 'Friction', 'Gravity', 'Electricity'], 2, 'Gravity pulls objects toward the centre of the Earth.'),
  q('general-science', '1-5', 'Food chains', 3, 'In the chain grass → goat → lion, the goat is a:', ['producer', 'herbivore', 'carnivore', 'decomposer'], 1, 'The goat eats plants, so it is a herbivore (primary consumer).'),
  q('general-science', '1-5', 'Light and sound', 2, 'Sound travels fastest through:', ['Air', 'Water', 'Steel', 'Vacuum'], 2, 'Sound travels faster through solids like steel than through liquids or gases.'),
  q('general-science', '1-5', 'Electricity', 3, 'Which material lets electricity pass through easily?', ['Rubber', 'Plastic', 'Copper', 'Wood'], 2, 'Copper is a conductor; the others are insulators.'),

  // ====================================================== General Science 6-8
  q('general-science', '6-8', 'Cells', 1, 'The basic unit of life is the:', ['Atom', 'Cell', 'Organ', 'Tissue'], 1, 'All living things are made of cells.'),
  q('general-science', '6-8', 'Atomic structure', 2, 'Which particle in an atom has a negative charge?', ['Proton', 'Neutron', 'Electron', 'Nucleus'], 2, 'Electrons are negative, protons positive, neutrons neutral.'),
  q('general-science', '6-8', 'Elements and compounds', 2, 'Water (H₂O) is a:', ['Element', 'Compound', 'Mixture', 'Metal'], 1, 'Water is two elements chemically bonded, so it is a compound.'),
  q('general-science', '6-8', 'Acids and bases', 2, 'A solution with pH 2 is:', ['Strongly acidic', 'Neutral', 'Weakly basic', 'Strongly basic'], 0, 'pH below 7 is acidic; 2 is strongly acidic.'),
  q('general-science', '6-8', 'Forces and pressure', 3, 'Pressure is calculated as:', ['Force × Area', 'Force ÷ Area', 'Area ÷ Force', 'Mass × Velocity'], 1, 'Pressure = Force / Area, measured in pascals.'),
  q('general-science', '6-8', 'Digestion', 2, 'Where does most digestion and absorption of food happen?', ['Mouth', 'Stomach', 'Small intestine', 'Large intestine'], 2, 'The small intestine absorbs most nutrients.'),
  q('general-science', '6-8', 'Heat transfer', 2, 'Heat from the Sun reaches Earth by:', ['Conduction', 'Convection', 'Radiation', 'Evaporation'], 2, 'Radiation needs no medium, so it crosses space.'),
  q('general-science', '6-8', 'Electricity and circuits', 3, 'In a series circuit, if one bulb breaks:', ['Others stay on', 'All bulbs go off', 'Bulbs get brighter', 'Nothing changes'], 1, 'A series circuit has one path; a break stops the whole current.'),
  q('general-science', '6-8', 'Reproduction in plants', 2, 'Pollen is produced by which part of a flower?', ['Stigma', 'Anther', 'Ovary', 'Petal'], 1, 'The anther (part of the stamen) makes pollen.'),
  q('general-science', '6-8', 'Space science', 1, 'The Moon shines because it:', ['Burns gas', 'Reflects sunlight', 'Has its own light', 'Is very hot'], 1, 'The Moon reflects light from the Sun.'),

  // ====================================================== Social studies 1-5 and 6-8
  q('social-studies', '1-5', 'Provinces of Pakistan', 1, 'What is the capital of Pakistan?', ['Karachi', 'Lahore', 'Islamabad', 'Peshawar'], 2, 'Islamabad has been the capital since the 1960s.'),
  q('social-studies', '1-5', 'National symbols', 1, 'The national animal of Pakistan is the:', ['Lion', 'Markhor', 'Deer', 'Camel'], 1, 'The markhor, a wild goat, is the national animal.'),
  q('social-studies', '1-5', 'Pakistan Movement', 2, 'Who is called Quaid-e-Azam?', ['Allama Iqbal', 'Muhammad Ali Jinnah', 'Liaquat Ali Khan', 'Sir Syed Ahmad Khan'], 1, 'Muhammad Ali Jinnah, the founder of Pakistan.'),
  q('social-studies', '1-5', 'Map reading', 2, 'If you face north, which direction is on your right?', ['West', 'South', 'East', 'North'], 2, 'East is to the right when facing north.'),
  q('social-studies', '1-5', 'Physical features', 2, 'The highest mountain in Pakistan is:', ['Nanga Parbat', 'K2', 'Rakaposhi', 'Tirich Mir'], 1, 'K2 (8,611 m) is the second highest mountain in the world.'),
  q('social-studies', '1-5', 'Pakistan Movement', 1, 'Pakistan became independent in:', ['1940', '1947', '1956', '1971'], 1, '14 August 1947.'),
  q('social-studies', '6-8', 'Indus Valley', 2, 'Mohenjo-daro is in which province?', ['Punjab', 'Sindh', 'Balochistan', 'KP'], 1, 'Mohenjo-daro is in Larkana district, Sindh.'),
  q('social-studies', '6-8', 'Pakistan Movement', 2, 'The Lahore Resolution was passed in:', ['1930', '1940', '1946', '1947'], 1, '23 March 1940, now celebrated as Pakistan Day.'),
  q('social-studies', '6-8', 'World geography', 1, 'The largest continent is:', ['Africa', 'Europe', 'Asia', 'North America'], 2, 'Asia is the largest by area and population.'),
  q('social-studies', '6-8', 'Muslim rule', 2, 'Who built the Badshahi Mosque in Lahore?', ['Akbar', 'Shah Jahan', 'Aurangzeb', 'Babur'], 2, 'Emperor Aurangzeb built it in 1673.'),
  q('social-studies', '6-8', 'Pakistan since 1947', 3, 'Pakistan’s first constitution was adopted in:', ['1947', '1956', '1962', '1973'], 1, 'The 1956 constitution made Pakistan an Islamic Republic.'),
  q('social-studies', '6-8', 'Environment', 2, 'Which gas is mainly responsible for global warming?', ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Helium'], 2, 'Carbon dioxide traps heat in the atmosphere.'),

  // ====================================================== Islamiyat 6-8
  q('islamiyat', '6-8', 'Pillars of Islam', 1, 'How many pillars of Islam are there?', ['3', '4', '5', '6'], 2, 'Shahadah, Salah, Zakat, Sawm and Hajj.'),
  q('islamiyat', '6-8', 'Quran', 1, 'The first surah of the Holy Quran is:', ['Al-Baqarah', 'Al-Fatihah', 'Al-Ikhlas', 'An-Nas'], 1, 'Surah Al-Fatihah, "The Opening".'),
  q('islamiyat', '6-8', 'Seerat', 2, 'The Holy Prophet (PBUH) was born in which city?', ['Madinah', 'Makkah', 'Taif', 'Jerusalem'], 1, 'He was born in Makkah in the Year of the Elephant.'),
  q('islamiyat', '6-8', 'Khulafa-e-Rashideen', 2, 'The first Caliph of Islam was:', ['Hazrat Umar (RA)', 'Hazrat Abu Bakr (RA)', 'Hazrat Usman (RA)', 'Hazrat Ali (RA)'], 1, 'Hazrat Abu Bakr Siddiq (RA).'),
  q('islamiyat', '6-8', 'Ibadaat', 2, 'Zakat is normally paid at what rate on savings?', ['1%', '2.5%', '5%', '10%'], 1, 'Two and a half percent of qualifying wealth held for a lunar year.'),
  q('islamiyat', '6-8', 'Ethics', 1, 'Which quality did the Prophet (PBUH) have that earned him the title "Al-Amin"?', ['Bravery', 'Trustworthiness', 'Wealth', 'Poetry'], 1, 'Al-Amin means the trustworthy one.'),

  // ====================================================== Computer studies 6-8
  q('computer-studies', '6-8', 'Hardware and software', 1, 'Which of these is hardware?', ['Microsoft Word', 'Keyboard', 'Windows', 'Chrome'], 1, 'Hardware is physical; a keyboard is hardware.'),
  q('computer-studies', '6-8', 'Algorithms', 2, 'An algorithm is:', ['A computer brand', 'A step-by-step set of instructions', 'A type of virus', 'A web browser'], 1, 'Algorithms are ordered steps to solve a problem.'),
  q('computer-studies', '6-8', 'Flowcharts', 2, 'In a flowchart, a diamond shape shows a:', ['Start', 'Process', 'Decision', 'Output'], 2, 'Diamonds represent yes/no decisions.'),
  q('computer-studies', '6-8', 'Spreadsheets', 2, 'In a spreadsheet, =SUM(A1:A3) will:', ['Multiply A1 by A3', 'Add A1, A2 and A3', 'Count the cells', 'Find the largest'], 1, 'SUM adds all values in the range.'),
  q('computer-studies', '6-8', 'Networks', 1, 'The "www" in a website address stands for:', ['World Wide Web', 'Web World Wide', 'Wide Web World', 'World Web Wire'], 0, 'World Wide Web.'),
  q('computer-studies', '6-8', 'Digital citizenship', 1, 'A strong password should:', ['Be your name', 'Be "123456"', 'Mix letters, numbers and symbols', 'Be shared with friends'], 2, 'Long, mixed passwords are hard to guess, and should never be shared.'),
  q('computer-studies', '6-8', 'Programming', 3, 'In Python, what does print(2 + 3 * 2) show?', ['10', '8', '12', '7'], 1, 'Multiplication first: 3 × 2 = 6, then 2 + 6 = 8.'),

  // ====================================================== Physics 9-10
  q('physics', '9-10', 'Physical quantities', 1, 'The SI unit of force is the:', ['Joule', 'Newton', 'Watt', 'Pascal'], 1, 'Force is measured in newtons (N).'),
  q('physics', '9-10', 'Kinematics', 2, 'A car accelerates from rest at 2 m/s² for 5 s. Its final velocity is:', ['2.5 m/s', '7 m/s', '10 m/s', '25 m/s'], 2, 'v = u + at = 0 + 2 × 5 = 10 m/s.'),
  q('physics', '9-10', 'Dynamics', 2, 'Newton’s third law states that:', ['F = ma', 'Objects at rest stay at rest', 'Every action has an equal and opposite reaction', 'Energy is conserved'], 2, 'Action and reaction are equal and opposite.'),
  q('physics', '9-10', 'Work and energy', 2, 'A 2 kg object is lifted 5 m. Its gain in potential energy (g = 10 m/s²) is:', ['10 J', '50 J', '100 J', '200 J'], 2, 'PE = mgh = 2 × 10 × 5 = 100 J.'),
  q('physics', '9-10', 'Thermal properties', 2, 'Which process transfers heat without any medium?', ['Conduction', 'Convection', 'Radiation', 'Condensation'], 2, 'Radiation travels as electromagnetic waves.'),
  q('physics', '9-10', 'Waves', 2, 'A wave has frequency 50 Hz and wavelength 2 m. Its speed is:', ['25 m/s', '52 m/s', '100 m/s', '200 m/s'], 2, 'v = fλ = 50 × 2 = 100 m/s.'),
  q('physics', '9-10', 'Current electricity', 3, 'A 12 V battery drives 3 A through a resistor. The resistance is:', ['4 Ω', '36 Ω', '0.25 Ω', '15 Ω'], 0, 'R = V / I = 12 / 3 = 4 Ω.'),
  q('physics', '9-10', 'Geometrical optics', 2, 'A concave lens always produces an image that is:', ['Real and inverted', 'Virtual and erect', 'Real and erect', 'Virtual and inverted'], 1, 'Diverging lenses form virtual, erect, diminished images.'),
  q('physics', '9-10', 'Atomic and nuclear physics', 3, 'Which radiation has the greatest penetrating power?', ['Alpha', 'Beta', 'Gamma', 'All equal'], 2, 'Gamma rays penetrate most; alpha is stopped by paper.'),
  q('physics', '9-10', 'Gravitation', 3, 'If the distance between two masses doubles, the gravitational force becomes:', ['Half', 'Double', 'One quarter', 'Four times'], 2, 'F ∝ 1/r², so doubling r divides F by 4.'),

  // ====================================================== Physics 11-12
  q('physics', '11-12', 'Vectors', 2, 'Two forces of 3 N and 4 N act at right angles. The resultant is:', ['1 N', '5 N', '7 N', '12 N'], 1, '√(3² + 4²) = 5 N.'),
  q('physics', '11-12', 'Circular motion', 2, 'Centripetal acceleration is given by:', ['v/r', 'v²/r', 'r/v²', 'v²r'], 1, 'a = v²/r, directed toward the centre.'),
  q('physics', '11-12', 'Thermodynamics', 3, 'In an isothermal process, which quantity stays constant?', ['Pressure', 'Volume', 'Temperature', 'Heat'], 2, '"Iso-thermal" means constant temperature.'),
  q('physics', '11-12', 'Electrostatics', 2, 'Coulomb’s law states that force between charges is proportional to:', ['q₁q₂ / r', 'q₁q₂ / r²', 'r² / q₁q₂', 'q₁ + q₂'], 1, 'F = k q₁q₂ / r².'),
  q('physics', '11-12', 'Electromagnetic induction', 3, 'Lenz’s law is a consequence of conservation of:', ['Charge', 'Momentum', 'Energy', 'Mass'], 2, 'The induced current opposes the change, which follows from energy conservation.'),
  q('physics', '11-12', 'Modern physics', 2, 'The photoelectric effect shows that light behaves as:', ['Waves only', 'Particles (photons)', 'Sound', 'Heat'], 1, 'Einstein explained it with photons of energy hf.'),
  q('physics', '11-12', 'Oscillations', 2, 'The time period of a simple pendulum depends on:', ['Mass of bob', 'Amplitude', 'Length of string', 'Colour of bob'], 2, 'T = 2π√(L/g); it depends on length and g only.'),
  q('physics', '11-12', 'Nuclear physics', 3, 'In nuclear fission, a heavy nucleus:', ['Joins another nucleus', 'Splits into lighter nuclei', 'Emits only light', 'Gains mass'], 1, 'Fission is the splitting of a heavy nucleus like uranium-235.'),
  q('physics', '11-12', 'Alternating current', 3, 'A transformer works on the principle of:', ['Ohm’s law', 'Mutual induction', 'Static electricity', 'Thermionic emission'], 1, 'A changing current in the primary induces voltage in the secondary.'),

  // ====================================================== Chemistry 9-10
  q('chemistry', '9-10', 'Fundamentals', 1, 'The number of moles in 36 g of water (H₂O, M = 18) is:', ['1', '2', '18', '36'], 1, 'n = mass / molar mass = 36 / 18 = 2 mol.'),
  q('chemistry', '9-10', 'Structure of atoms', 2, 'An atom with 11 protons and 12 neutrons has mass number:', ['11', '12', '23', '1'], 2, 'Mass number = protons + neutrons = 23 (sodium).'),
  q('chemistry', '9-10', 'Periodic table', 2, 'Elements in the same group of the periodic table have the same:', ['Atomic mass', 'Number of valence electrons', 'Number of shells', 'Density'], 1, 'Groups share valence electron count and so similar chemistry.'),
  q('chemistry', '9-10', 'Chemical bonding', 2, 'NaCl is held together by which type of bond?', ['Covalent', 'Ionic', 'Metallic', 'Hydrogen'], 1, 'Sodium gives an electron to chlorine, forming ions.'),
  q('chemistry', '9-10', 'Solutions', 2, 'A solution that cannot dissolve any more solute at a given temperature is:', ['Dilute', 'Unsaturated', 'Saturated', 'Concentrated'], 2, 'Saturated solutions hold the maximum solute.'),
  q('chemistry', '9-10', 'Acids, bases and salts', 1, 'Which indicator turns red in acid and blue in base?', ['Phenolphthalein', 'Litmus', 'Methyl orange', 'Starch'], 1, 'Litmus: red in acid, blue in base.'),
  q('chemistry', '9-10', 'Electrochemistry', 3, 'In electrolysis, oxidation takes place at the:', ['Cathode', 'Anode', 'Both', 'Neither'], 1, 'Remember: "An Ox, Red Cat" (anode oxidation, reduction cathode).'),
  q('chemistry', '9-10', 'Hydrocarbons', 2, 'The general formula of alkanes is:', ['CₙH₂ₙ', 'CₙH₂ₙ₊₂', 'CₙH₂ₙ₋₂', 'CₙHₙ'], 1, 'Alkanes are saturated: CₙH₂ₙ₊₂.'),
  q('chemistry', '9-10', 'Chemical equilibrium', 3, 'Increasing pressure on N₂ + 3H₂ ⇌ 2NH₃ shifts equilibrium:', ['Left', 'Right', 'No change', 'Stops reaction'], 1, 'Fewer moles of gas on the right, so pressure favours ammonia.'),
  q('chemistry', '9-10', 'Environmental chemistry', 1, 'Which gas causes acid rain when it dissolves in rainwater?', ['Oxygen', 'Sulfur dioxide', 'Helium', 'Nitrogen'], 1, 'SO₂ forms sulfurous and sulfuric acid.'),

  // ====================================================== Chemistry 11-12
  q('chemistry', '11-12', 'Stoichiometry', 2, 'How many molecules are in 1 mole of CO₂?', ['6.02 × 10²³', '12', '44', '1'], 0, 'Avogadro’s number: 6.02 × 10²³ per mole.'),
  q('chemistry', '11-12', 'Gases', 2, 'According to Boyle’s law, at constant temperature pressure is:', ['Directly proportional to volume', 'Inversely proportional to volume', 'Independent of volume', 'Equal to volume'], 1, 'PV = constant.'),
  q('chemistry', '11-12', 'Atomic structure', 3, 'The maximum number of electrons in the 3rd shell is:', ['8', '18', '32', '2'], 1, '2n² = 2 × 9 = 18.'),
  q('chemistry', '11-12', 'Chemical bonding', 2, 'The shape of a methane (CH₄) molecule is:', ['Linear', 'Trigonal planar', 'Tetrahedral', 'Bent'], 2, 'Four bonding pairs, no lone pairs: tetrahedral, 109.5°.'),
  q('chemistry', '11-12', 'Reaction kinetics', 2, 'A catalyst speeds up a reaction by:', ['Raising temperature', 'Lowering activation energy', 'Increasing concentration', 'Changing ΔH'], 1, 'Catalysts provide a path with lower activation energy.'),
  q('chemistry', '11-12', 'Organic chemistry', 2, 'The functional group of alcohols is:', ['−COOH', '−OH', '−CHO', '−NH₂'], 1, 'Hydroxyl group −OH.'),
  q('chemistry', '11-12', 'Aromatic hydrocarbons', 3, 'Benzene has the molecular formula:', ['C₆H₁₂', 'C₆H₆', 'C₆H₁₄', 'C₆H₁₀'], 1, 'C₆H₆ with a delocalised ring.'),
  q('chemistry', '11-12', 'Electrochemistry', 3, 'A galvanic cell converts:', ['Electrical to chemical energy', 'Chemical to electrical energy', 'Heat to light', 'Light to heat'], 1, 'Spontaneous redox reactions produce electricity.'),
  q('chemistry', '11-12', 'Macromolecules', 1, 'Proteins are polymers of:', ['Glucose', 'Amino acids', 'Fatty acids', 'Nucleotides'], 1, 'Amino acids link by peptide bonds.'),

  // ====================================================== Biology 9-10
  q('biology', '9-10', 'Cells and tissues', 1, 'Which organelle is called the powerhouse of the cell?', ['Nucleus', 'Ribosome', 'Mitochondrion', 'Vacuole'], 2, 'Mitochondria release energy by respiration.'),
  q('biology', '9-10', 'Cell cycle', 2, 'Mitosis produces:', ['Two identical cells', 'Four different cells', 'One cell', 'Gametes'], 0, 'Mitosis gives two genetically identical daughter cells.'),
  q('biology', '9-10', 'Enzymes', 2, 'Enzymes are mostly made of:', ['Carbohydrates', 'Lipids', 'Proteins', 'Nucleic acids'], 2, 'Enzymes are biological catalysts made of protein.'),
  q('biology', '9-10', 'Bioenergetics', 2, 'The gas released during photosynthesis is:', ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Hydrogen'], 1, '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂.'),
  q('biology', '9-10', 'Transport', 2, 'Which blood cells carry oxygen?', ['White blood cells', 'Platelets', 'Red blood cells', 'Plasma'], 2, 'Red blood cells contain haemoglobin.'),
  q('biology', '9-10', 'Homeostasis', 3, 'The main organ that filters blood and makes urine is the:', ['Liver', 'Kidney', 'Lung', 'Pancreas'], 1, 'Kidneys filter waste from blood.'),
  q('biology', '9-10', 'Coordination and control', 2, 'The hormone that lowers blood sugar is:', ['Adrenaline', 'Insulin', 'Thyroxine', 'Glucagon'], 1, 'Insulin from the pancreas lowers blood glucose.'),
  q('biology', '9-10', 'Inheritance', 3, 'A cross between Tt and Tt pea plants gives what ratio of tall to short (T dominant)?', ['1:1', '2:1', '3:1', '4:0'], 2, 'TT, Tt, Tt, tt → 3 tall : 1 short.'),
  q('biology', '9-10', 'Biodiversity', 1, 'The scientific name Homo sapiens is written using:', ['Common naming', 'Binomial nomenclature', 'Trinomial naming', 'Latin numbering'], 1, 'Two-part names: genus and species.'),
  q('biology', '9-10', 'Reproduction', 2, 'In flowering plants, the male part of the flower is the:', ['Carpel', 'Stamen', 'Sepal', 'Ovary'], 1, 'The stamen has the anther and filament.'),

  // ====================================================== Biology 11-12
  q('biology', '11-12', 'Biological molecules', 2, 'DNA nucleotides contain which sugar?', ['Ribose', 'Deoxyribose', 'Glucose', 'Fructose'], 1, 'DNA = deoxyribonucleic acid.'),
  q('biology', '11-12', 'Viruses', 1, 'Viruses are considered acellular because they:', ['Have many cells', 'Lack a cell structure', 'Are plants', 'Have mitochondria'], 1, 'Viruses are just genetic material in a protein coat.'),
  q('biology', '11-12', 'Gaseous exchange', 2, 'Gas exchange in the lungs occurs in the:', ['Bronchi', 'Trachea', 'Alveoli', 'Larynx'], 2, 'Alveoli have thin walls and a large surface area.'),
  q('biology', '11-12', 'Nervous coordination', 2, 'The gap between two neurons is called a:', ['Axon', 'Synapse', 'Dendrite', 'Myelin'], 1, 'Neurotransmitters cross the synapse.'),
  q('biology', '11-12', 'Chromosomes and DNA', 3, 'In DNA, adenine pairs with:', ['Guanine', 'Cytosine', 'Thymine', 'Uracil'], 2, 'A–T and G–C base pairing.'),
  q('biology', '11-12', 'Variation and genetics', 3, 'A person with blood group AB has genotype:', ['IᴬIᴬ', 'IᴮIᴮ', 'IᴬIᴮ', 'ii'], 2, 'Co-dominance: both A and B alleles expressed.'),
  q('biology', '11-12', 'Evolution', 2, 'The theory of natural selection was proposed by:', ['Mendel', 'Darwin', 'Lamarck', 'Pasteur'], 1, 'Charles Darwin, On the Origin of Species (1859).'),
  q('biology', '11-12', 'Biotechnology', 2, 'PCR is a technique used to:', ['Cut DNA', 'Copy (amplify) DNA', 'Stain cells', 'Grow bacteria'], 1, 'Polymerase chain reaction makes millions of copies of DNA.'),
  q('biology', '11-12', 'Ecosystems', 1, 'Organisms that break down dead matter are called:', ['Producers', 'Consumers', 'Decomposers', 'Predators'], 2, 'Fungi and bacteria recycle nutrients.'),

  // ====================================================== Computer science 9-10
  q('computer-science', '9-10', 'Binary systems', 2, 'The binary number 1010 equals which decimal number?', ['8', '10', '12', '5'], 1, '8 + 0 + 2 + 0 = 10.'),
  q('computer-science', '9-10', 'Binary systems', 3, 'How many bits are in one byte?', ['4', '8', '16', '2'], 1, 'One byte = 8 bits.'),
  q('computer-science', '9-10', 'Algorithms', 1, 'Pseudocode is:', ['A programming language', 'Plain-language steps of an algorithm', 'A type of error', 'A hardware part'], 1, 'Pseudocode describes logic without strict syntax.'),
  q('computer-science', '9-10', 'Programming', 2, 'Which loop runs a fixed number of times in most languages?', ['while', 'for', 'if', 'switch'], 1, 'A for loop is designed for counted repetition.'),
  q('computer-science', '9-10', 'Programming', 2, 'What is the output? x = 5; if x > 3: print("A") else: print("B")', ['A', 'B', 'AB', 'Error'], 0, '5 > 3 is true, so A prints.'),
  q('computer-science', '9-10', 'Networks', 1, 'Which device connects a home network to the internet?', ['Printer', 'Router', 'Monitor', 'Scanner'], 1, 'A router directs traffic between the home network and the ISP.'),
  q('computer-science', '9-10', 'Data and privacy', 1, 'Phishing is:', ['A fishing game', 'Tricking people into giving passwords', 'A type of printer', 'Fast internet'], 1, 'Phishing uses fake messages to steal information.'),
  q('computer-science', '9-10', 'Programming', 3, 'In C, which data type stores a single character?', ['int', 'float', 'char', 'double'], 2, 'char holds one character.'),
  q('computer-science', '9-10', 'Web basics', 2, 'HTML is used to:', ['Style pages', 'Structure web pages', 'Store databases', 'Run servers'], 1, 'HTML defines the structure and content of a page.'),

  // ====================================================== Computer science 11-12
  q('computer-science', '11-12', 'Database design', 2, 'A primary key is:', ['Any text column', 'A unique identifier for each record', 'A password', 'A table name'], 1, 'Primary keys uniquely identify rows.'),
  q('computer-science', '11-12', 'SQL', 2, 'Which SQL command retrieves data?', ['INSERT', 'SELECT', 'DELETE', 'UPDATE'], 1, 'SELECT queries data from tables.'),
  q('computer-science', '11-12', 'Normalisation', 3, 'Normalisation mainly aims to:', ['Speed up the CPU', 'Reduce data redundancy', 'Encrypt data', 'Add more tables randomly'], 1, 'It organises tables to avoid duplicated data.'),
  q('computer-science', '11-12', 'C language', 2, 'In C, which header file is needed for printf?', ['<math.h>', '<stdio.h>', '<string.h>', '<stdlib.h>'], 1, 'stdio.h provides standard input/output.'),
  q('computer-science', '11-12', 'Loops', 2, 'How many times does this run? for (i = 0; i < 5; i++)', ['4', '5', '6', 'Infinite'], 1, 'i takes 0, 1, 2, 3, 4.'),
  q('computer-science', '11-12', 'Functions', 2, 'A function that calls itself is:', ['Iterative', 'Recursive', 'Static', 'Global'], 1, 'Recursion is when a function calls itself.'),
  q('computer-science', '11-12', 'Networks', 1, 'A LAN covers:', ['A city', 'A small area like a building', 'The whole world', 'A country'], 1, 'Local Area Network.'),
  q('computer-science', '11-12', 'Computer architecture', 2, 'The part of the CPU that does calculations is the:', ['Control unit', 'ALU', 'Register', 'Cache'], 1, 'Arithmetic Logic Unit.'),
  q('computer-science', '11-12', 'Security', 1, 'Software that secretly damages or steals data is called:', ['Firmware', 'Malware', 'Freeware', 'Middleware'], 1, 'Malware includes viruses, worms and spyware.'),

  // ====================================================== Economics 9-10 and 11-12
  q('economics', '9-10', 'Demand and supply', 2, 'When the price of a good rises, quantity demanded usually:', ['Rises', 'Falls', 'Stays the same', 'Doubles'], 1, 'The law of demand: higher price, lower quantity demanded.'),
  q('economics', '9-10', 'Basic problems', 1, 'Economics studies how people use:', ['Unlimited resources', 'Scarce resources', 'Only money', 'Only land'], 1, 'Scarcity is the central economic problem.'),
  q('economics', '9-10', 'Factors of production', 2, 'Which is NOT a factor of production?', ['Land', 'Labour', 'Money', 'Capital'], 2, 'The four factors are land, labour, capital and enterprise. Money is not one.'),
  q('economics', '9-10', 'Economy of Pakistan', 2, 'The largest sector of Pakistan’s GDP today is:', ['Agriculture', 'Industry', 'Services', 'Mining'], 2, 'Services make up over half of GDP.'),
  q('economics', '9-10', 'Money and banking', 1, 'Pakistan’s central bank is the:', ['HBL', 'State Bank of Pakistan', 'National Bank', 'World Bank'], 1, 'The SBP issues currency and sets monetary policy.'),
  q('economics', '11-12', 'Elasticity', 3, 'If a 10% price rise causes a 20% fall in demand, demand is:', ['Inelastic', 'Unit elastic', 'Elastic', 'Perfectly inelastic'], 2, 'Elasticity = 20/10 = 2, which is greater than 1.'),
  q('economics', '11-12', 'Market structures', 2, 'A market with a single seller is called:', ['Perfect competition', 'Monopoly', 'Oligopoly', 'Duopoly'], 1, 'Mono = one.'),
  q('economics', '11-12', 'National income', 2, 'GDP measures:', ['Total population', 'Value of goods and services produced in a country', 'Government debt', 'Exports only'], 1, 'Gross Domestic Product.'),
  q('economics', '11-12', 'Inflation', 2, 'Inflation means:', ['Falling prices', 'A general rise in prices', 'Rising wages only', 'More exports'], 1, 'A sustained increase in the general price level.'),
  q('economics', '11-12', 'International trade', 3, 'A country has a trade deficit when:', ['Exports exceed imports', 'Imports exceed exports', 'Exports equal imports', 'It has no trade'], 1, 'Imports greater than exports.'),

  // ====================================================== Accounting 11-12
  q('accounting', '11-12', 'Accounting equation', 1, 'The accounting equation is:', ['Assets = Liabilities + Capital', 'Assets = Liabilities − Capital', 'Capital = Assets + Liabilities', 'Liabilities = Assets + Capital'], 0, 'Assets are funded by owners (capital) and creditors (liabilities).'),
  q('accounting', '11-12', 'Journal', 2, 'When goods are bought for cash, which account is credited?', ['Purchases', 'Cash', 'Sales', 'Capital'], 1, 'Debit Purchases, credit Cash (cash goes out).'),
  q('accounting', '11-12', 'Trial balance', 2, 'A trial balance checks that:', ['Profit is high', 'Total debits equal total credits', 'Cash is positive', 'Stock is counted'], 1, 'It tests the arithmetic accuracy of double entry.'),
  q('accounting', '11-12', 'Depreciation', 3, 'A machine costs Rs 100,000 with 10% straight-line depreciation. Annual depreciation is:', ['Rs 1,000', 'Rs 10,000', 'Rs 90,000', 'Rs 100,000'], 1, '10% of 100,000 = 10,000 each year.'),
  q('accounting', '11-12', 'Final accounts', 2, 'Gross profit is:', ['Sales − Cost of goods sold', 'Sales − All expenses', 'Assets − Liabilities', 'Cash − Bank'], 0, 'Net profit comes after other expenses are deducted.'),
  q('accounting', '11-12', 'Bank reconciliation', 3, 'Unpresented cheques cause the bank statement balance to be:', ['Lower than cash book', 'Higher than cash book', 'Equal', 'Negative'], 1, 'The bank has not yet paid them, so its balance is higher.'),

  // ====================================================== Pakistan Studies 9-10
  q('pak-studies', '9-10', 'Ideology of Pakistan', 1, 'The Two-Nation Theory stated that Muslims and Hindus were:', ['One nation', 'Two separate nations', 'Three nations', 'Not nations'], 1, 'The basis of the demand for Pakistan.'),
  q('pak-studies', '9-10', 'Making of Pakistan', 2, 'The All-India Muslim League was founded in:', ['1885', '1906', '1930', '1940'], 1, 'Dhaka, December 1906.'),
  q('pak-studies', '9-10', 'Making of Pakistan', 2, 'Allama Iqbal’s Allahabad Address was delivered in:', ['1930', '1940', '1947', '1920'], 0, 'He proposed a separate Muslim state in 1930.'),
  q('pak-studies', '9-10', 'Land and environment', 2, 'The longest river in Pakistan is the:', ['Jhelum', 'Chenab', 'Indus', 'Ravi'], 2, 'The Indus runs about 3,180 km.'),
  q('pak-studies', '9-10', 'History of Pakistan', 3, 'The 1973 Constitution was passed during the government of:', ['Ayub Khan', 'Zulfikar Ali Bhutto', 'Zia-ul-Haq', 'Liaquat Ali Khan'], 1, 'It was adopted on 14 August 1973.'),
  q('pak-studies', '9-10', 'Economic development', 2, 'Pakistan’s largest export sector is:', ['Textiles', 'Oil', 'Cars', 'Electronics'], 0, 'Textiles and garments dominate exports.'),
  q('pak-studies', '9-10', 'Pakistan in world affairs', 1, 'Pakistan joined the United Nations in:', ['1945', '1947', '1950', '1956'], 1, '30 September 1947.'),
]

export function itemsFor(subjectId: string, band: GradeBand): QuizItem[] {
  return QUIZ_ITEMS.filter((i) => i.subjectId === subjectId && i.band === band)
}

/** Subject ids that have practice items for a band. */
export function subjectsWithItems(band: GradeBand): string[] {
  return [...new Set(QUIZ_ITEMS.filter((i) => i.band === band).map((i) => i.subjectId))]
}

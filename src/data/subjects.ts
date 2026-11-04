import type { Subject } from '../types'

const ALL = ['national', 'cambridge', 'akueb'] as const
const NAT_AKU = ['national', 'akueb'] as const
const CAM = ['cambridge'] as const

/**
 * Subject catalogue with syllabus outlines by grade band.
 * Outlines follow the Single National Curriculum (grades 1-8), the national
 * scheme of studies for SSC/HSSC, and Cambridge O/A Level syllabi. They are
 * summaries for guidance, not the official documents.
 */
export const SUBJECTS: Subject[] = [
  // ---------------------------------------------------------------- Foundation
  {
    id: 'english',
    name: 'English',
    urduName: 'انگریزی',
    area: 'language',
    description: 'Reading, writing, grammar and speaking. Needed for every stream and every entrance test.',
    boards: [...ALL],
    grades: [1, 12],
    units: [
      { grades: [1, 3], name: 'Early literacy', topics: ['Phonics and sight words', 'Simple sentences', 'Picture stories', 'Naming words and action words', 'Listening and speaking'] },
      { grades: [4, 5], name: 'Reading and writing', topics: ['Comprehension of short passages', 'Paragraph writing', 'Nouns, pronouns, verbs, adjectives', 'Tenses (present, past, future)', 'Letters and invitations', 'Dictionary skills'] },
      { grades: [6, 8], name: 'Grammar and composition', topics: ['Parts of speech in depth', 'Active and passive voice', 'Direct and indirect speech', 'Essay and story writing', 'Summary writing', 'Poetry appreciation', 'Formal and informal letters'] },
      { grades: [9, 10], name: 'SSC English', topics: ['Prose lessons and comprehension', 'Poems and paraphrasing', 'Translation (Urdu to English)', 'Essay and letter writing', 'Grammar: tenses, voice, narration', 'Pair of words and idioms', 'Summary and precis'] },
      { grades: [11, 12], name: 'HSSC English', topics: ['Short stories and one-act plays', 'Modern prose and poetry', 'Novel (e.g. Goodbye Mr Chips)', 'Essay writing on social issues', 'Translation of passages', 'Punctuation and sentence correction', 'Application and report writing'] },
    ],
  },
  {
    id: 'urdu',
    name: 'Urdu',
    urduName: 'اردو',
    area: 'language',
    description: 'National language: reading, writing, grammar and literature.',
    boards: [...ALL],
    grades: [1, 12],
    units: [
      { grades: [1, 3], name: 'Reading and writing basics', topics: ['Alphabet and joining letters', 'Simple words and sentences', 'Nazms and short stories', 'Listening and speaking'] },
      { grades: [4, 5], name: 'Qawaid and composition', topics: ['Ism, fail, sifat', 'Wahid and jama', 'Paragraph writing', 'Comprehension', 'Letter writing'] },
      { grades: [6, 8], name: 'Literature and grammar', topics: ['Prose and poetry lessons', 'Muhawaray and zarb-ul-misal', 'Mazmoon nigari', 'Khat and darkhwast', 'Grammar: jumla, fail ki qismain', 'Tashreeh of verses'] },
      { grades: [9, 10], name: 'SSC Urdu', topics: ['Nasr: essays and stories', 'Nazm and ghazal', 'Tashreeh and khulasa', 'Mazmoon on current topics', 'Grammar and tarkeeb', 'Jumlon ki durusti', 'Khat and darkhwast'] },
      { grades: [11, 12], name: 'HSSC Urdu', topics: ['Classical and modern nasr', 'Ghazal and nazm (Ghalib, Iqbal, Faiz)', 'Drama and afsana', 'Tashreeh with context', 'Mazmoon nigari', 'Translation from English'] },
    ],
  },
  {
    id: 'maths',
    name: 'Mathematics',
    urduName: 'ریاضی',
    area: 'maths',
    description: 'Numbers, algebra, geometry and problem solving. Compulsory until grade 10 and the gateway to engineering, computing and finance.',
    boards: [...ALL],
    grades: [1, 12],
    units: [
      { grades: [1, 3], name: 'Number sense', topics: ['Counting to 1000', 'Addition and subtraction', 'Introduction to multiplication and division', 'Shapes and patterns', 'Money, time and calendar', 'Measurement with units'] },
      { grades: [4, 5], name: 'Operations and fractions', topics: ['Long multiplication and division', 'Factors, multiples, HCF and LCM', 'Fractions and decimals', 'Percentages', 'Angles and triangles', 'Perimeter and area', 'Bar graphs and averages'] },
      { grades: [6, 8], name: 'Pre-algebra and geometry', topics: ['Integers and rational numbers', 'Ratio, rate and proportion', 'Algebraic expressions and linear equations', 'Exponents and square roots', 'Geometry: lines, angles, polygons, circles', 'Pythagoras theorem', 'Statistics: mean, median, mode', 'Sets and Venn diagrams'] },
      { grades: [9, 10], name: 'SSC Mathematics (Science group)', topics: ['Matrices and determinants', 'Real and complex numbers', 'Logarithms', 'Algebraic expressions and formulas', 'Factorisation', 'Linear and quadratic equations', 'Theory of quadratic equations', 'Variations', 'Partial fractions', 'Sets and functions', 'Basic statistics', 'Introduction to trigonometry', 'Geometry theorems: congruent triangles, parallelograms, chords of a circle', 'Practical geometry'] },
      { grades: [11, 12], name: 'HSSC Mathematics', topics: ['Number systems', 'Sets, functions and groups', 'Matrices and determinants', 'Quadratic equations', 'Partial fractions', 'Sequences and series', 'Permutation, combination and probability', 'Mathematical induction and binomial theorem', 'Trigonometric functions and identities', 'Functions and limits', 'Differentiation and its applications', 'Integration', 'Analytical geometry: straight line, conic sections', 'Linear inequalities and programming', 'Vectors'] },
    ],
  },
  {
    id: 'general-maths',
    name: 'General Mathematics',
    area: 'maths',
    description: 'Everyday mathematics for the Arts and Humanities groups at SSC.',
    boards: [...NAT_AKU],
    grades: [9, 10],
    units: [
      { grades: [9, 10], name: 'General Mathematics', topics: ['Percentage, ratio and proportion', 'Zakat, ushr and inheritance', 'Business mathematics: profit, loss, discount', 'Financial mathematics: simple and compound interest', 'Basic algebra and linear equations', 'Area and volume', 'Basic statistics'] },
    ],
  },
  {
    id: 'general-science',
    name: 'General Science',
    urduName: 'سائنس',
    area: 'science',
    description: 'Integrated science for grades 1-8, and a general science course for the Arts group at SSC.',
    boards: [...ALL],
    grades: [1, 10],
    units: [
      { grades: [1, 3], name: 'Exploring the world', topics: ['Living and non-living things', 'Plants and animals', 'Our body and senses', 'Water, air and weather', 'Materials around us', 'Day and night, Sun and Moon'] },
      { grades: [4, 5], name: 'Science foundations', topics: ['Classification of living things', 'Human body systems', 'Food chains and habitats', 'States of matter and changes', 'Force, motion and simple machines', 'Light, sound and heat', 'Electricity and magnets', 'Earth, space and the solar system'] },
      { grades: [6, 8], name: 'Middle school science', topics: ['Cells, tissues and organs', 'Reproduction in plants and animals', 'Nutrition, digestion and circulation', 'Elements, compounds and mixtures', 'Atomic structure and the periodic table', 'Chemical reactions, acids and bases', 'Forces, pressure and energy', 'Heat transfer and waves', 'Electricity and circuits', 'Earth science and environment', 'Space science'] },
      { grades: [9, 10], name: 'General Science (Arts group)', topics: ['Human health and disease', 'Food and nutrition', 'Environment and pollution', 'Energy resources', 'Everyday chemistry', 'Information technology basics'] },
    ],
  },
  {
    id: 'islamiyat',
    name: 'Islamiyat',
    urduName: 'اسلامیات',
    area: 'religious',
    description: 'Quran, Hadith, Seerat and Islamic values. Compulsory for Muslim students through grade 11.',
    boards: [...ALL],
    grades: [1, 11],
    units: [
      { grades: [1, 5], name: 'Foundations', topics: ['Kalma and basic beliefs', 'Short surahs and duas', 'Seerat of the Holy Prophet (PBUH)', 'Akhlaq: honesty, kindness, respect', 'Pillars of Islam'] },
      { grades: [6, 8], name: 'Beliefs and practices', topics: ['Quranic verses with translation', 'Selected Ahadith', 'Lives of the Khulafa-e-Rashideen', 'Ibadaat in detail', 'Islamic ethics and social life'] },
      { grades: [9, 11], name: 'SSC and HSSC Islamiyat', topics: ['Selected surahs with tafseer', 'Ahadith and their lessons', 'Seerat-un-Nabi (PBUH)', 'Islamic civilisation and welfare state', 'Huqooq-ul-Ibad', 'Important Islamic personalities'] },
    ],
  },
  {
    id: 'social-studies',
    name: 'Social Studies / History and Geography',
    urduName: 'معاشرتی علوم',
    area: 'social',
    description: 'Pakistan, its people, history and geography, and how society works.',
    boards: [...NAT_AKU],
    grades: [1, 8],
    units: [
      { grades: [1, 3], name: 'General Knowledge', topics: ['My family and school', 'Our neighbourhood', 'Provinces of Pakistan', 'National symbols', 'Good citizenship'] },
      { grades: [4, 5], name: 'Social Studies', topics: ['Map reading and directions', 'Physical features of Pakistan', 'Climate and resources', 'Pakistan Movement', 'Government and citizenship', 'Famous personalities'] },
      { grades: [6, 8], name: 'History and Geography', topics: ['Indus Valley and ancient civilisations', 'Muslim rule in the subcontinent', 'The Pakistan Movement in depth', 'Pakistan since 1947', 'World geography: continents, oceans, climate zones', 'Population and economic activity', 'Environmental issues'] },
    ],
  },
  {
    id: 'pak-studies',
    name: 'Pakistan Studies',
    urduName: 'مطالعہ پاکستان',
    area: 'social',
    description: 'History, geography and civics of Pakistan. Compulsory in grade 10 and grade 12.',
    boards: [...ALL],
    grades: [9, 12],
    units: [
      { grades: [9, 10], name: 'SSC Pakistan Studies', topics: ['Ideology of Pakistan', 'Making of Pakistan 1857-1947', 'Land and environment', 'History of Pakistan (part 1 and 2)', 'Economic development', 'Population, society and culture', 'Pakistan in world affairs'] },
      { grades: [11, 12], name: 'HSSC Pakistan Studies', topics: ['Historical background and ideology', 'Constitutional development', 'Economy of Pakistan', 'Foreign policy', 'Culture and languages', 'Pakistan and the Muslim world'] },
    ],
  },
  {
    id: 'computer-studies',
    name: 'Computer Studies / ICT',
    area: 'computing',
    description: 'Digital literacy, typing, basic coding and safe use of the internet.',
    boards: [...ALL],
    grades: [1, 8],
    units: [
      { grades: [1, 3], name: 'Getting started', topics: ['Parts of a computer', 'Mouse and keyboard skills', 'Paint and simple drawing', 'Being safe online'] },
      { grades: [4, 5], name: 'Digital skills', topics: ['Word processing', 'Files and folders', 'Internet and email basics', 'Block coding (Scratch)', 'Presentations'] },
      { grades: [6, 8], name: 'Computing', topics: ['Hardware and software', 'Spreadsheets and charts', 'Algorithms and flowcharts', 'Introduction to Python or Scratch', 'Networks and the web', 'Digital citizenship and privacy'] },
    ],
  },
  {
    id: 'art-craft',
    name: 'Art and Craft',
    area: 'arts',
    description: 'Drawing, colour, craft and creative expression.',
    boards: [...ALL],
    grades: [1, 8],
    units: [
      { grades: [1, 5], name: 'Creative basics', topics: ['Drawing and colouring', 'Shapes and patterns', 'Paper craft and models', 'Festivals and culture in art'] },
      { grades: [6, 8], name: 'Design and expression', topics: ['Sketching and shading', 'Colour theory', 'Calligraphy', 'Poster and logo design', 'Truck art and folk traditions'] },
    ],
  },

  // ------------------------------------------------------------ Secondary core
  {
    id: 'physics',
    name: 'Physics',
    urduName: 'طبیعیات',
    area: 'science',
    description: 'How the universe works: motion, forces, energy, waves, electricity and modern physics. Core for engineering and medicine.',
    boards: [...ALL],
    grades: [9, 12],
    units: [
      { grades: [9, 9], name: 'Grade 9 Physics', topics: ['Physical quantities and measurement', 'Kinematics', 'Dynamics', 'Turning effect of forces', 'Gravitation', 'Work and energy', 'Properties of matter', 'Thermal properties of matter', 'Transfer of heat'] },
      { grades: [10, 10], name: 'Grade 10 Physics', topics: ['Simple harmonic motion and waves', 'Sound', 'Geometrical optics', 'Electrostatics', 'Current electricity', 'Electromagnetism', 'Basic electronics', 'Information and communication technology', 'Atomic and nuclear physics'] },
      { grades: [11, 11], name: 'Grade 11 Physics', topics: ['Measurements', 'Vectors and equilibrium', 'Motion and force', 'Work and energy', 'Circular motion', 'Fluid dynamics', 'Oscillations', 'Waves', 'Physical optics', 'Optical instruments', 'Heat and thermodynamics'] },
      { grades: [12, 12], name: 'Grade 12 Physics', topics: ['Electrostatics', 'Current electricity', 'Electromagnetism', 'Electromagnetic induction', 'Alternating current', 'Physics of solids', 'Electronics', 'Dawn of modern physics', 'Atomic spectra', 'Nuclear physics'] },
    ],
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    urduName: 'کیمیا',
    area: 'science',
    description: 'Matter, atoms, reactions and the chemistry of life. Required for both Pre-Medical and Pre-Engineering.',
    boards: [...ALL],
    grades: [9, 12],
    units: [
      { grades: [9, 9], name: 'Grade 9 Chemistry', topics: ['Fundamentals of chemistry', 'Structure of atoms', 'Periodic table and periodicity', 'Structure of molecules', 'Physical states of matter', 'Solutions', 'Electrochemistry', 'Chemical reactivity'] },
      { grades: [10, 10], name: 'Grade 10 Chemistry', topics: ['Chemical equilibrium', 'Acids, bases and salts', 'Organic chemistry', 'Hydrocarbons', 'Biochemistry', 'Environmental chemistry (atmosphere and water)', 'Chemical industries'] },
      { grades: [11, 11], name: 'Grade 11 Chemistry', topics: ['Basic concepts and stoichiometry', 'Experimental techniques', 'Gases', 'Liquids and solids', 'Atomic structure', 'Chemical bonding', 'Thermochemistry', 'Chemical equilibrium', 'Solutions', 'Electrochemistry', 'Reaction kinetics'] },
      { grades: [12, 12], name: 'Grade 12 Chemistry', topics: ['Periodic classification', 's-block and p-block elements', 'd and f-block elements', 'Fundamental principles of organic chemistry', 'Aliphatic hydrocarbons', 'Aromatic hydrocarbons', 'Alkyl halides', 'Alcohols, phenols and ethers', 'Aldehydes and ketones', 'Carboxylic acids', 'Macromolecules', 'Common chemical industries', 'Environmental chemistry'] },
    ],
  },
  {
    id: 'biology',
    name: 'Biology',
    urduName: 'حیاتیات',
    area: 'science',
    description: 'The science of living things. Essential for medicine, dentistry, pharmacy and life sciences.',
    boards: [...ALL],
    grades: [9, 12],
    units: [
      { grades: [9, 9], name: 'Grade 9 Biology', topics: ['Introduction to biology', 'Solving a biological problem', 'Biodiversity', 'Cells and tissues', 'Cell cycle', 'Enzymes', 'Bioenergetics', 'Nutrition', 'Transport'] },
      { grades: [10, 10], name: 'Grade 10 Biology', topics: ['Gaseous exchange', 'Homeostasis', 'Coordination and control', 'Support and movement', 'Reproduction', 'Inheritance', 'Man and his environment', 'Biotechnology', 'Pharmacology'] },
      { grades: [11, 11], name: 'Grade 11 Biology', topics: ['Cell structure and function', 'Biological molecules', 'Enzymes', 'Bioenergetics', 'Acellular life (viruses)', 'Prokaryotes and protists', 'Fungi', 'Kingdom Plantae', 'Kingdom Animalia', 'Digestion and nutrition', 'Gaseous exchange', 'Transport'] },
      { grades: [12, 12], name: 'Grade 12 Biology', topics: ['Homeostasis', 'Support and movement', 'Nervous coordination', 'Reproduction', 'Growth and development', 'Chromosomes and DNA', 'Cell cycle', 'Variation and genetics', 'Biotechnology', 'Evolution', 'Ecosystems', 'Man and environment'] },
    ],
  },
  {
    id: 'computer-science',
    name: 'Computer Science',
    area: 'computing',
    description: 'Programming, problem solving, data and how computers work. The route into software, AI and data careers.',
    boards: [...ALL],
    grades: [9, 12],
    units: [
      { grades: [9, 9], name: 'Grade 9 Computer Science', topics: ['Problem solving and algorithms', 'Flowcharts and pseudocode', 'Binary systems and number conversion', 'Networks and the internet', 'Data and privacy', 'Software and hardware'] },
      { grades: [10, 10], name: 'Grade 10 Computer Science', topics: ['Introduction to programming (C/Python)', 'Variables, data types and operators', 'Control structures', 'Functions', 'Arrays and strings', 'Web basics (HTML)'] },
      { grades: [11, 11], name: 'Grade 11 Computer Science', topics: ['Basics of information technology', 'Information networks', 'Data communication', 'Applications of computers', 'Computer architecture', 'Security, copyright and law', 'Windows and word processing', 'Spreadsheets and databases'] },
      { grades: [12, 12], name: 'Grade 12 Computer Science', topics: ['Data basics and database design', 'Normalisation and SQL', 'Microsoft Access', 'C language: fundamentals', 'Input/output and operators', 'Decision and loop structures', 'Functions in C', 'File handling'] },
    ],
  },
  {
    id: 'statistics',
    name: 'Statistics',
    area: 'maths',
    description: 'Collecting, describing and interpreting data. Pairs well with economics, computing and research.',
    boards: [...NAT_AKU],
    grades: [11, 12],
    units: [
      { grades: [11, 12], name: 'HSSC Statistics', topics: ['Presentation of data', 'Measures of central tendency and dispersion', 'Index numbers', 'Probability', 'Random variables and distributions', 'Binomial and normal distributions', 'Sampling and estimation', 'Hypothesis testing', 'Regression and correlation', 'Time series'] },
    ],
  },
  {
    id: 'economics',
    name: 'Economics',
    urduName: 'معاشیات',
    area: 'business',
    description: 'How people, businesses and governments make choices about scarce resources.',
    boards: [...ALL],
    grades: [9, 12],
    units: [
      { grades: [9, 10], name: 'SSC Economics', topics: ['Basic economic problems', 'Demand and supply', 'Production and factors of production', 'Money and banking basics', 'Economy of Pakistan: agriculture and industry', 'Trade and budget'] },
      { grades: [11, 12], name: 'HSSC Economics', topics: ['Consumer behaviour and utility', 'Elasticity', 'Theory of production and cost', 'Market structures', 'National income', 'Money, inflation and banking', 'Public finance', 'International trade', 'Economic development of Pakistan', 'Islamic economics'] },
    ],
  },
  {
    id: 'accounting',
    name: 'Principles of Accounting',
    area: 'business',
    description: 'Recording and reporting business transactions. The foundation for CA, ACCA and finance careers.',
    boards: [...ALL],
    grades: [9, 12],
    units: [
      { grades: [11, 12], name: 'HSSC Accounting', topics: ['Accounting concepts and equation', 'Journal and ledger', 'Cash book and bank reconciliation', 'Trial balance', 'Final accounts with adjustments', 'Depreciation', 'Partnership accounts', 'Company accounts', 'Non-profit organisations', 'Single entry and incomplete records'] },
    ],
  },
  {
    id: 'business-maths',
    name: 'Business Mathematics',
    area: 'maths',
    description: 'Mathematics applied to business: interest, annuities, percentages and basic statistics.',
    boards: [...NAT_AKU],
    grades: [11, 12],
    units: [
      { grades: [11, 12], name: 'HSSC Business Mathematics', topics: ['Percentages, ratios and discount', 'Simple and compound interest', 'Annuities and loans', 'Matrices and linear equations', 'Basic statistics and index numbers', 'Probability basics'] },
    ],
  },
  {
    id: 'commerce',
    name: 'Principles of Commerce',
    area: 'business',
    description: 'How trade and business organisations work.',
    boards: [...NAT_AKU],
    grades: [11, 12],
    units: [
      { grades: [11, 12], name: 'HSSC Commerce', topics: ['Introduction to commerce', 'Forms of business organisation', 'Trade: home and foreign', 'Banking and insurance', 'Transport and warehousing', 'Advertising and marketing', 'Business communication'] },
    ],
  },
  {
    id: 'banking',
    name: 'Banking',
    area: 'business',
    description: 'How banks work, credit, and the financial system of Pakistan.',
    boards: [...NAT_AKU],
    grades: [11, 12],
    units: [
      { grades: [11, 12], name: 'HSSC Banking', topics: ['Evolution and types of banks', 'Functions of commercial banks', 'Central banking and the State Bank', 'Negotiable instruments', 'Credit and loans', 'Islamic banking'] },
    ],
  },
  {
    id: 'civics',
    name: 'Civics',
    area: 'social',
    description: 'Citizenship, government, rights and responsibilities.',
    boards: [...NAT_AKU],
    grades: [9, 12],
    units: [
      { grades: [9, 12], name: 'Civics', topics: ['State, government and citizenship', 'Constitution of Pakistan', 'Rights and duties', 'Political institutions', 'Local government', 'International organisations'] },
    ],
  },
  {
    id: 'education',
    name: 'Education',
    area: 'social',
    description: 'Theory and practice of teaching and learning.',
    boards: [...NAT_AKU],
    grades: [9, 12],
    units: [
      { grades: [9, 12], name: 'Education', topics: ['Aims of education', 'Educational psychology basics', 'Curriculum and methods', 'Education system of Pakistan', 'Guidance and counselling'] },
    ],
  },
  {
    id: 'psychology',
    name: 'Psychology',
    area: 'social',
    description: 'The science of mind and behaviour.',
    boards: [...ALL],
    grades: [11, 12],
    units: [
      { grades: [11, 12], name: 'HSSC Psychology', topics: ['Introduction and methods', 'Biological basis of behaviour', 'Sensation and perception', 'Learning and memory', 'Motivation and emotion', 'Personality', 'Intelligence', 'Social behaviour', 'Abnormal psychology basics'] },
    ],
  },
  {
    id: 'sociology',
    name: 'Sociology',
    area: 'social',
    description: 'How societies, families and institutions work.',
    boards: [...ALL],
    grades: [9, 12],
    units: [
      { grades: [9, 12], name: 'Sociology', topics: ['Culture and society', 'Socialisation', 'Social institutions: family, religion, education', 'Social stratification', 'Social change', 'Pakistani society', 'Research methods'] },
    ],
  },
  {
    id: 'geography',
    name: 'Geography',
    area: 'social',
    description: 'Physical and human geography, maps and the environment.',
    boards: [...ALL],
    grades: [9, 12],
    units: [
      { grades: [9, 12], name: 'Geography', topics: ['Map skills', 'Earth structure and landforms', 'Weather and climate', 'Population and settlement', 'Agriculture and industry', 'Geography of Pakistan', 'Environmental hazards'] },
    ],
  },
  {
    id: 'history',
    name: 'History',
    area: 'social',
    description: 'Islamic history, history of the subcontinent and Pakistan.',
    boards: [...ALL],
    grades: [9, 12],
    units: [
      { grades: [9, 12], name: 'History', topics: ['Early Islamic history', 'Muslim dynasties in the subcontinent', 'Mughal era', 'British rule and reform movements', 'Pakistan Movement', 'Post-independence history'] },
    ],
  },
  {
    id: 'fine-arts',
    name: 'Fine Arts',
    area: 'arts',
    description: 'Drawing, painting, design and art history.',
    boards: [...ALL],
    grades: [9, 12],
    units: [
      { grades: [9, 12], name: 'Fine Arts', topics: ['Drawing from observation', 'Painting techniques', 'Composition and perspective', 'History of art in the subcontinent', 'Graphic design basics', 'Portfolio building'] },
    ],
  },
  {
    id: 'home-economics',
    name: 'Home Economics',
    area: 'science',
    description: 'Food and nutrition, textiles, family resource management.',
    boards: [...NAT_AKU],
    grades: [9, 12],
    units: [
      { grades: [9, 12], name: 'Home Economics', topics: ['Food and nutrition', 'Clothing and textiles', 'Child development', 'Home management', 'Consumer education'] },
    ],
  },
  {
    id: 'islamiat-elective',
    name: 'Islamiat (Elective)',
    area: 'religious',
    description: 'Advanced Islamic studies for the Arts group.',
    boards: [...NAT_AKU],
    grades: [9, 12],
    units: [
      { grades: [9, 12], name: 'Islamiat Elective', topics: ['Quranic studies and tafseer', 'Hadith sciences', 'Fiqh basics', 'Islamic history', 'Comparative religion'] },
    ],
  },

  // ------------------------------------------------------------ Cambridge only
  {
    id: 'global-perspectives',
    name: 'Global Perspectives',
    area: 'social',
    description: 'Research, reasoning and collaboration on global issues (Cambridge Primary and Lower Secondary).',
    boards: [...CAM],
    grades: [3, 8],
    units: [
      { grades: [3, 8], name: 'Global Perspectives', topics: ['Research skills', 'Analysing evidence', 'Evaluating arguments', 'Collaboration projects', 'Reflection on learning'] },
    ],
  },
  {
    id: 'add-maths',
    name: 'Additional Mathematics',
    area: 'maths',
    description: 'O Level Additional Mathematics (4037): a head start for A Level Maths and engineering.',
    boards: [...CAM],
    grades: [9, 11],
    units: [
      { grades: [9, 11], name: 'O Level Add Maths', topics: ['Functions and quadratics', 'Indices, surds and logarithms', 'Polynomials and remainder theorem', 'Binomial expansion', 'Trigonometry', 'Vectors', 'Differentiation', 'Integration', 'Kinematics'] },
    ],
  },
  {
    id: 'business-studies',
    name: 'Business Studies',
    area: 'business',
    description: 'O/A Level Business: how businesses are organised, marketed, financed and managed.',
    boards: [...CAM],
    grades: [9, 13],
    units: [
      { grades: [9, 11], name: 'O Level Business Studies', topics: ['Business activity and objectives', 'People in business', 'Marketing', 'Operations', 'Finance and accounts', 'External influences'] },
      { grades: [12, 13], name: 'A Level Business', topics: ['Business and its environment', 'Human resource management', 'Marketing strategy', 'Operations management', 'Finance and accounting', 'Strategic management'] },
    ],
  },
  {
    id: 'literature',
    name: 'English Literature',
    area: 'language',
    description: 'Poetry, prose and drama analysed closely.',
    boards: [...CAM],
    grades: [9, 13],
    units: [
      { grades: [9, 11], name: 'O Level Literature', topics: ['Set poetry', 'Set prose text', 'Drama text', 'Unseen poetry and prose'] },
      { grades: [12, 13], name: 'A Level Literature', topics: ['Poetry and prose', 'Drama', 'Shakespeare', 'Critical essay writing'] },
    ],
  },
  {
    id: 'environmental-management',
    name: 'Environmental Management',
    area: 'science',
    description: 'Earth systems, resources and sustainability.',
    boards: [...CAM],
    grades: [9, 11],
    units: [
      { grades: [9, 11], name: 'O Level Environmental Management', topics: ['Rocks, minerals and soil', 'Water and atmosphere', 'Energy resources', 'Ecosystems and biodiversity', 'Population and development'] },
    ],
  },
  {
    id: 'law',
    name: 'Law',
    area: 'social',
    description: 'A Level Law: legal systems, contract, tort and criminal law.',
    boards: [...CAM],
    grades: [12, 13],
    units: [
      { grades: [12, 13], name: 'A Level Law', topics: ['English legal system', 'Sources of law', 'Criminal law', 'Contract law', 'Tort', 'Legal reasoning'] },
    ],
  },
  {
    id: 'further-maths',
    name: 'Further Mathematics',
    area: 'maths',
    description: 'A Level Further Maths for strong mathematicians heading to top engineering, physics or maths degrees.',
    boards: [...CAM],
    grades: [12, 13],
    units: [
      { grades: [12, 13], name: 'A Level Further Mathematics', topics: ['Further pure: matrices, complex numbers, proof', 'Further mechanics', 'Further statistics', 'Differential equations'] },
    ],
  },
  {
    id: 'general-paper',
    name: 'General Paper',
    area: 'language',
    description: 'AS General Paper: essay writing and critical reading on current issues.',
    boards: [...CAM],
    grades: [12, 13],
    units: [
      { grades: [12, 13], name: 'General Paper', topics: ['Essay writing', 'Comprehension and argument', 'Current affairs and ethics'] },
    ],
  },
]

export function getSubject(id: string): Subject | undefined {
  return SUBJECTS.find((s) => s.id === id)
}

export function subjectName(id: string): string {
  return getSubject(id)?.name ?? id
}

/** Units of a subject that apply to a specific grade. */
export function unitsForGrade(subject: Subject, grade: number) {
  return subject.units.filter((u) => grade >= u.grades[0] && grade <= u.grades[1])
}

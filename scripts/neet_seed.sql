-- Seed NEET Exam
INSERT INTO exams (id, name, description, is_active)
VALUES 
  ('neet123456-7890-1234-5678-901234567890', 'NEET', 'National Eligibility cum Entrance Test - Medical entrance exam for MBBS, BDS, AYUSH, Veterinary and other medical courses in India.', true);

-- Seed Subjects for NEET
INSERT INTO subjects (id, name, description, exam_id)
VALUES 
  ('chem123456-7890-1234-5678-901234567890', 'Chemistry', 'Study of matter, its properties, structure, and the changes it undergoes', 'neet123456-7890-1234-5678-901234567890'),
  ('phys123456-7890-1234-5678-901234567890', 'Physics', 'Study of matter, energy, and the interaction between them', 'neet123456-7890-1234-5678-901234567890'),
  ('biol123456-7890-1234-5678-901234567890', 'Biology', 'Study of living organisms and their interactions with each other and the environment', 'neet123456-7890-1234-5678-901234567890');

-- Seed Topics for Chemistry
INSERT INTO topics (id, subject_id, title, content, order_index)
VALUES 
  ('chemorg1234-7890-1234-5678-901234567890', 'chem123456-7890-1234-5678-901234567890', 'Organic Chemistry', 'Study of carbon compounds including hydrocarbons and their derivatives', 0),
  ('cheminorg1-7890-1234-5678-901234567890', 'chem123456-7890-1234-5678-901234567890', 'Inorganic Chemistry', 'Study of all compounds not containing carbon-hydrogen bonds', 1),
  ('chemphys123-7890-1234-5678-901234567890', 'chem123456-7890-1234-5678-901234567890', 'Physical Chemistry', 'Study of macroscopic, atomic, subatomic, and particulate phenomena in chemical systems', 2);

-- Seed Topics for Physics
INSERT INTO topics (id, subject_id, title, content, order_index)
VALUES 
  ('physmech12-7890-1234-5678-901234567890', 'phys123456-7890-1234-5678-901234567890', 'Mechanics', 'Study of motion and forces acting on objects', 0),
  ('physelec12-7890-1234-5678-901234567890', 'phys123456-7890-1234-5678-901234567890', 'Electricity & Magnetism', 'Study of electrical charges, fields, currents and magnetic phenomena', 1),
  ('physoptics-7890-1234-5678-901234567890', 'phys123456-7890-1234-5678-901234567890', 'Optics', 'Study of light and its properties', 2),
  ('physmodern-7890-1234-5678-901234567890', 'phys123456-7890-1234-5678-901234567890', 'Modern Physics', 'Study of quantum mechanics, relativity and nuclear physics', 3);

-- Seed Topics for Biology
INSERT INTO topics (id, subject_id, title, content, order_index)
VALUES 
  ('biolcell12-7890-1234-5678-901234567890', 'biol123456-7890-1234-5678-901234567890', 'Cell Biology', 'Study of the structure and function of cells', 0),
  ('biolhuman1-7890-1234-5678-901234567890', 'biol123456-7890-1234-5678-901234567890', 'Human Physiology', 'Study of the mechanical, physical, and biochemical functions of humans', 1),
  ('biolgen123-7890-1234-5678-901234567890', 'biol123456-7890-1234-5678-901234567890', 'Genetics', 'Study of genes, heredity, and genetic variations', 2),
  ('biolevol12-7890-1234-5678-901234567890', 'biol123456-7890-1234-5678-901234567890', 'Evolution', 'Study of the process by which organisms change over time', 3);

-- Seed Questions for Chemistry
INSERT INTO questions (question, options, correct_answer, explanation, difficulty, subject_id, topic_id)
VALUES 
  (
    'Which of the following is an organic compound?',
    '{"options": ["NaCl", "CH₄", "MgO", "Fe₂O₃"]}',
    'CH₄',
    'CH₄ (methane) is an organic compound as it contains carbon-hydrogen bonds.',
    'easy',
    'chem123456-7890-1234-5678-901234567890',
    'chemorg1234-7890-1234-5678-901234567890'
  ),
  (
    'What is the IUPAC name of CH₃-CH₂-CH₂-CH₃?',
    '{"options": ["Methane", "Ethane", "Propane", "Butane"]}',
    'Butane',
    'CH₃-CH₂-CH₂-CH₃ contains four carbon atoms, so it is named butane according to IUPAC nomenclature.',
    'medium',
    'chem123456-7890-1234-5678-901234567890',
    'chemorg1234-7890-1234-5678-901234567890'
  ),
  (
    'Which of the following is the strongest acid?',
    '{"options": ["HCl", "H₂SO₄", "HF", "CH₃COOH"]}',
    'H₂SO₄',
    'H₂SO₄ (sulfuric acid) is the strongest acid among the given options due to its high dissociation constant.',
    'medium',
    'chem123456-7890-1234-5678-901234567890',
    'cheminorg1-7890-1234-5678-901234567890'
  );

-- Seed Questions for Physics
INSERT INTO questions (question, options, correct_answer, explanation, difficulty, subject_id, topic_id)
VALUES 
  (
    'What is the SI unit of force?',
    '{"options": ["Watt", "Joule", "Newton", "Pascal"]}',
    'Newton',
    'The SI unit of force is the Newton (N), which is equal to kg·m/s².',
    'easy',
    'phys123456-7890-1234-5678-901234567890',
    'physmech12-7890-1234-5678-901234567890'
  ),
  (
    'Which law states that the acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass?',
    '{"options": ["Newton\'s First Law", "Newton\'s Second Law", "Newton\'s Third Law", "Law of Conservation of Energy"]}',
    'Newton\'s Second Law',
    'Newton\'s Second Law is expressed as F = ma, where F is the net force, m is the mass, and a is the acceleration.',
    'medium',
    'phys123456-7890-1234-5678-901234567890',
    'physmech12-7890-1234-5678-901234567890'
  ),
  (
    'What is the formula for the lens equation?',
    '{"options": ["1/f = 1/u + 1/v", "1/f = 1/u - 1/v", "f = u + v", "f = u × v"]}',
    '1/f = 1/u + 1/v',
    'The lens equation is 1/f = 1/u + 1/v, where f is the focal length, u is the object distance, and v is the image distance.',
    'hard',
    'phys123456-7890-1234-5678-901234567890',
    'physoptics-7890-1234-5678-901234567890'
  );

-- Seed Questions for Biology
INSERT INTO questions (question, options, correct_answer, explanation, difficulty, subject_id, topic_id)
VALUES 
  (
    'Which organelle is responsible for protein synthesis in cells?',
    '{"options": ["Mitochondria", "Golgi apparatus", "Ribosomes", "Lysosomes"]}',
    'Ribosomes',
    'Ribosomes are the cell organelles responsible for protein synthesis through the process of translation.',
    'easy',
    'biol123456-7890-1234-5678-901234567890',
    'biolcell12-7890-1234-5678-901234567890'
  ),
  (
    'Which of the following is NOT a function of the liver?',
    '{"options": ["Detoxification", "Protein synthesis", "Bile production", "Insulin production"]}',
    'Insulin production',
    'The liver performs detoxification, protein synthesis, and bile production, but insulin is produced by the beta cells of the pancreas.',
    'medium',
    'biol123456-7890-1234-5678-901234567890',
    'biolhuman1-7890-1234-5678-901234567890'
  ),
  (
    'Which of the following is an autosomal recessive genetic disorder?',
    '{"options": ["Huntington\'s disease", "Cystic fibrosis", "Marfan syndrome", "Polydactyly"]}',
    'Cystic fibrosis',
    'Cystic fibrosis is an autosomal recessive genetic disorder caused by mutations in the CFTR gene.',
    'hard',
    'biol123456-7890-1234-5678-901234567890',
    'biolgen123-7890-1234-5678-901234567890'
  );

-- Seed Flashcards for Chemistry
INSERT INTO flashcards (front, back, subject_id, topic_id)
VALUES 
  (
    'What is the pH scale range?',
    'The pH scale typically ranges from 0 to 14, with 7 being neutral, below 7 acidic, and above 7 alkaline.',
    'chem123456-7890-1234-5678-901234567890',
    'chemphys123-7890-1234-5678-901234567890'
  ),
  (
    'Define electronegativity.',
    'Electronegativity is the tendency of an atom to attract a shared pair of electrons in a covalent bond.',
    'chem123456-7890-1234-5678-901234567890',
    'cheminorg1-7890-1234-5678-901234567890'
  ),
  (
    'What is a homologous series in organic chemistry?',
    'A homologous series is a group of organic compounds with the same functional group but differing by a CH₂ group in their molecular formulas.',
    'chem123456-7890-1234-5678-901234567890',
    'chemorg1234-7890-1234-5678-901234567890'
  );

-- Seed Flashcards for Physics
INSERT INTO flashcards (front, back, subject_id, topic_id)
VALUES 
  (
    'State Ohm\'s Law.',
    'Ohm\'s Law states that the current flowing through a conductor is directly proportional to the potential difference applied across its ends, provided the temperature and other physical conditions remain constant. Mathematically, V = IR.',
    'phys123456-7890-1234-5678-901234567890',
    'physelec12-7890-1234-5678-901234567890'
  ),
  (
    'What is the principle of conservation of energy?',
    'The principle of conservation of energy states that energy cannot be created or destroyed, only transformed from one form to another. The total energy of an isolated system remains constant over time.',
    'phys123456-7890-1234-5678-901234567890',
    'physmech12-7890-1234-5678-901234567890'
  ),
  (
    'Define the photoelectric effect.',
    'The photoelectric effect is the emission of electrons from a material (typically metal) when exposed to electromagnetic radiation (such as light) of sufficient frequency.',
    'phys123456-7890-1234-5678-901234567890',
    'physmodern-7890-1234-5678-901234567890'
  );

-- Seed Flashcards for Biology
INSERT INTO flashcards (front, back, subject_id, topic_id)
VALUES 
  (
    'What are the stages of mitosis?',
    'The stages of mitosis are: Prophase, Metaphase, Anaphase, and Telophase, followed by Cytokinesis.',
    'biol123456-7890-1234-5678-901234567890',
    'biolcell12-7890-1234-5678-901234567890'
  ),
  (
    'Define natural selection.',
    'Natural selection is the process by which organisms with traits that better enable them to adapt to their environment survive and reproduce more successfully than those with less adaptive traits.',
    'biol123456-7890-1234-5678-901234567890',
    'biolevol12-7890-1234-5678-901234567890'
  ),
  (
    'What is the central dogma of molecular biology?',
    'The central dogma of molecular biology describes the flow of genetic information within a biological system: DNA → RNA → Protein.',
    'biol123456-7890-1234-5678-901234567890',
    'biolgen123-7890-1234-5678-901234567890'
  );

-- Sample user for demo purposes
INSERT INTO users (id, email, display_name, created_at, last_login)
VALUES 
  ('300bdd3c-12c9-4795-94f1-a619ad73bfc2', 'rahul@example.com', 'Rahul', now(), now());

-- Seed user exams (connecting user to NEET exam)
INSERT INTO user_exams (user_id, exam_id, selected_at)
VALUES
  ('300bdd3c-12c9-4795-94f1-a619ad73bfc2', 'neet123456-7890-1234-5678-901234567890', now());

-- Seed user streaks
INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_activity_date)
VALUES 
  ('300bdd3c-12c9-4795-94f1-a619ad73bfc2', 7, 10, CURRENT_DATE);

-- Seed user points
INSERT INTO user_points (user_id, total_points)
VALUES 
  ('300bdd3c-12c9-4795-94f1-a619ad73bfc2', 1250);

-- Add mock progress data for the demo user
INSERT INTO user_progress (user_id, subject_id, completion_percentage, last_studied, time_spent)
VALUES
  ('300bdd3c-12c9-4795-94f1-a619ad73bfc2', 'chem123456-7890-1234-5678-901234567890', 65, now(), 5400),
  ('300bdd3c-12c9-4795-94f1-a619ad73bfc2', 'phys123456-7890-1234-5678-901234567890', 45, now(), 3600),
  ('300bdd3c-12c9-4795-94f1-a619ad73bfc2', 'biol123456-7890-1234-5678-901234567890', 72, now(), 6000);

-- Add practice sessions for the demo user
INSERT INTO user_practice_sessions (
  user_id, 
  subject_id, 
  topic_id, 
  questions_attempted, 
  questions_correct, 
  duration_seconds, 
  created_at, 
  completed_at
)
VALUES
  (
    '300bdd3c-12c9-4795-94f1-a619ad73bfc2',
    'chem123456-7890-1234-5678-901234567890',
    'chemorg1234-7890-1234-5678-901234567890',
    10,
    7,
    1200,
    now() - interval '3 days',
    now() - interval '3 days' + interval '20 minutes'
  ),
  (
    '300bdd3c-12c9-4795-94f1-a619ad73bfc2',
    'phys123456-7890-1234-5678-901234567890',
    'physmech12-7890-1234-5678-901234567890',
    12,
    9,
    1500,
    now() - interval '2 days',
    now() - interval '2 days' + interval '25 minutes'
  ),
  (
    '300bdd3c-12c9-4795-94f1-a619ad73bfc2',
    'biol123456-7890-1234-5678-901234567890',
    'biolcell12-7890-1234-5678-901234567890',
    8,
    6,
    960,
    now() - interval '1 day',
    now() - interval '1 day' + interval '16 minutes'
  ); 
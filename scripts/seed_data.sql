-- Seed Exams
INSERT INTO exams (id, name, description, is_active)
VALUES 
  ('e1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 'GMAT', 'Graduate Management Admission Test - Business school entrance exam testing analytical, writing, quantitative, verbal, and reading skills.', true),
  ('e2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'GRE', 'Graduate Record Examination - Standardized test measuring verbal reasoning, quantitative reasoning, analytical writing, and critical thinking skills.', true),
  ('e3c4d5e6-f7a8-b9c0-d1e2-f3a4b5c6d7e8', 'MCAT', 'Medical College Admission Test - Standardized test for prospective medical students, covering biology, chemistry, physics, and critical reasoning.', true),
  ('e4d5e6f7-a8b9-c0d1-e2f3-a4b5c6d7e8f9', 'LSAT', 'Law School Admission Test - Standardized test for law school admissions measuring reading comprehension, analytical reasoning, and logical reasoning.', true),
  ('e5e6f7a8-b9c0-d1e2-f3a4-b5c6d7e8f9a0', 'CS Interviews', 'Computer Science Technical Interview Preparation - Preparation for technical interviews covering data structures, algorithms, system design, and problem-solving.', true);

-- Seed Subjects for GMAT
INSERT INTO subjects (id, name, description, exam_id)
VALUES 
  ('fde12a3b-4c56-7d89-0e1f-2a3b4c5d6e7f', 'Quantitative Reasoning', 'Mathematical and quantitative problem-solving skills', 'e1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6'),
  ('a1b2c3d4-e5f6-7890-1a2b-3c4d5e6f7a8b', 'Verbal Reasoning', 'Reading comprehension, critical reasoning, and sentence correction', 'e1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6'),
  ('b2c3d4e5-f6a7-8901-2b3c-4d5e6f7a8b9c', 'Integrated Reasoning', 'Interpretation of graphics, tables, and multiple sources of information', 'e1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6'),
  ('c3d4e5f6-a7b8-9012-3c4d-5e6f7a8b9c0d', 'Analytical Writing', 'Analysis of an argument and articulation of ideas', 'e1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6');

-- Seed Subjects for GRE
INSERT INTO subjects (id, name, description, exam_id)
VALUES
  ('d4e5f6a7-b8c9-0123-4d5e-6f7a8b9c0d1e', 'Verbal Reasoning GRE', 'Reading comprehension, text completion, and sentence equivalence', 'e2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7'),
  ('e5f6a7b8-c9d0-1234-5e6f-7a8b9c0d1e2f', 'Quantitative Reasoning GRE', 'Arithmetic, algebra, geometry, and data analysis', 'e2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7'),
  ('f6a7b8c9-d0e1-2345-6f7a-8b9c0d1e2f3a', 'Analytical Writing GRE', 'Analysis of issues and arguments', 'e2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7');

-- Seed Subjects for MCAT
INSERT INTO subjects (id, name, description, exam_id)
VALUES
  ('a7b8c9d0-e1f2-3456-7a8b-9c0d1e2f3a4b', 'Biological Sciences', 'Biology, biochemistry, and organic chemistry', 'e3c4d5e6-f7a8-b9c0-d1e2-f3a4b5c6d7e8'),
  ('b8c9d0e1-f2a3-4567-8b9c-0d1e2f3a4b5c', 'Physical Sciences', 'Physics and general chemistry', 'e3c4d5e6-f7a8-b9c0-d1e2-f3a4b5c6d7e8'),
  ('c9d0e1f2-a3b4-5678-9c0d-1e2f3a4b5c6d', 'CARS', 'Critical Analysis and Reasoning Skills', 'e3c4d5e6-f7a8-b9c0-d1e2-f3a4b5c6d7e8'),
  ('d0e1f2a3-b4c5-6789-0d1e-2f3a4b5c6d7e', 'Psychological Sciences', 'Psychology and sociology concepts', 'e3c4d5e6-f7a8-b9c0-d1e2-f3a4b5c6d7e8');

-- Seed Subjects for LSAT
INSERT INTO subjects (id, name, description, exam_id)
VALUES
  ('e1f2a3b4-c5d6-789a-1e2f-3a4b5c6d7e8f', 'Logical Reasoning', 'Evaluation and analysis of arguments', 'e4d5e6f7-a8b9-c0d1-e2f3-a4b5c6d7e8f9'),
  ('f2a3b4c5-d6e7-89ab-2f3a-4b5c6d7e8f9a', 'Analytical Reasoning', 'Logic games and deductive reasoning', 'e4d5e6f7-a8b9-c0d1-e2f3-a4b5c6d7e8f9'),
  ('a3b4c5d6-e7f8-9abc-3a4b-5c6d7e8f9a0b', 'Reading Comprehension LSAT', 'Understanding and analysis of complex texts', 'e4d5e6f7-a8b9-c0d1-e2f3-a4b5c6d7e8f9');

-- Seed Subjects for CS Technical Interviews
INSERT INTO subjects (id, name, description, exam_id)
VALUES
  ('b4c5d6e7-f8a9-abcd-4b5c-6d7e8f9a0b1c', 'Data Structures', 'Arrays, linked lists, trees, graphs, and hash tables', 'e5e6f7a8-b9c0-d1e2-f3a4-b5c6d7e8f9a0'),
  ('c5d6e7f8-a9b0-bcde-5c6d-7e8f9a0b1c2d', 'Algorithms', 'Sorting, searching, and algorithm complexity analysis', 'e5e6f7a8-b9c0-d1e2-f3a4-b5c6d7e8f9a0'),
  ('d6e7f8a9-b0c1-cdef-6d7e-8f9a0b1c2d3e', 'System Design', 'Architecture, scalability, and database design', 'e5e6f7a8-b9c0-d1e2-f3a4-b5c6d7e8f9a0'),
  ('e7f8a9b0-c1d2-defa-7e8f-9a0b1c2d3e4f', 'Programming Languages', 'Language proficiency, syntax, and paradigms', 'e5e6f7a8-b9c0-d1e2-f3a4-b5c6d7e8f9a0');

-- Seed Topics for GMAT Quantitative Reasoning
INSERT INTO topics (subject_id, title, content, order_index)
VALUES 
  ('fde12a3b-4c56-7d89-0e1f-2a3b4c5d6e7f', 'Algebra Basics', 'Fundamental algebraic operations, equations, and inequalities.', 0),
  ('fde12a3b-4c56-7d89-0e1f-2a3b4c5d6e7f', 'Number Properties', 'Properties of integers, fractions, factors, multiples, and number theory.', 1),
  ('fde12a3b-4c56-7d89-0e1f-2a3b4c5d6e7f', 'Word Problems', 'Translating real-world scenarios into mathematical equations.', 2),
  ('fde12a3b-4c56-7d89-0e1f-2a3b4c5d6e7f', 'Geometry', 'Shapes, area, volume, coordinates, and spatial reasoning.', 3);

-- Seed Topics for GMAT Verbal Reasoning
INSERT INTO topics (subject_id, title, content, order_index)
VALUES 
  ('a1b2c3d4-e5f6-7890-1a2b-3c4d5e6f7a8b', 'Critical Reasoning', 'Evaluating arguments, identifying assumptions, and drawing conclusions.', 0),
  ('a1b2c3d4-e5f6-7890-1a2b-3c4d5e6f7a8b', 'Reading Comprehension', 'Understanding and analyzing complex passages and texts.', 1),
  ('a1b2c3d4-e5f6-7890-1a2b-3c4d5e6f7a8b', 'Sentence Correction', 'Grammar, syntax, and effective expression of ideas.', 2);

-- Seed Topics for Data Structures (CS Interviews)
INSERT INTO topics (subject_id, title, content, order_index)
VALUES 
  ('b4c5d6e7-f8a9-abcd-4b5c-6d7e8f9a0b1c', 'Arrays and Strings', 'Working with linear data structures including arrays and string manipulation techniques.', 0),
  ('b4c5d6e7-f8a9-abcd-4b5c-6d7e8f9a0b1c', 'Linked Lists', 'Understanding singly and doubly linked lists, operations, and implementation.', 1),
  ('b4c5d6e7-f8a9-abcd-4b5c-6d7e8f9a0b1c', 'Trees and Graphs', 'Tree traversals, binary search trees, heaps, and graph algorithms.', 2),
  ('b4c5d6e7-f8a9-abcd-4b5c-6d7e8f9a0b1c', 'Hash Tables', 'Hash functions, collision resolution, and applications.', 3);

-- Seed Topics for Algorithms (CS Interviews)
INSERT INTO topics (subject_id, title, content, order_index)
VALUES 
  ('c5d6e7f8-a9b0-bcde-5c6d-7e8f9a0b1c2d', 'Sorting Algorithms', 'Comparison-based and non-comparison sorting algorithms and their complexity.', 0),
  ('c5d6e7f8-a9b0-bcde-5c6d-7e8f9a0b1c2d', 'Searching Algorithms', 'Linear search, binary search, and search in specialized data structures.', 1),
  ('c5d6e7f8-a9b0-bcde-5c6d-7e8f9a0b1c2d', 'Dynamic Programming', 'Breaking down problems into simpler subproblems and building up solutions.', 2),
  ('c5d6e7f8-a9b0-bcde-5c6d-7e8f9a0b1c2d', 'Greedy Algorithms', 'Making locally optimal choices to find global optimum.', 3);

-- Seed Questions for GMAT
INSERT INTO questions (question, options, correct_answer, explanation, difficulty, subject_id, topic_id)
VALUES 
  (
    'If x² + 5x + 6 = 0, what are the values of x?',
    '{"options": ["x = -2, -3", "x = 2, 3", "x = -2, 3", "x = 2, -3"]}',
    'x = -2, -3',
    'Factoring the equation: x² + 5x + 6 = 0 gives (x + 2)(x + 3) = 0, so x = -2 or x = -3',
    'medium',
    'fde12a3b-4c56-7d89-0e1f-2a3b4c5d6e7f',
    (SELECT id FROM topics WHERE subject_id = 'fde12a3b-4c56-7d89-0e1f-2a3b4c5d6e7f' AND title = 'Algebra Basics')
  ),
  (
    'A rectangular garden has a length of 12 meters and a width of 8 meters. What is the area of the garden?',
    '{"options": ["20 m²", "96 m²", "40 m²", "64 m²"]}',
    '96 m²',
    'The area of a rectangle is length × width = 12 × 8 = 96 m²',
    'easy',
    'fde12a3b-4c56-7d89-0e1f-2a3b4c5d6e7f',
    (SELECT id FROM topics WHERE subject_id = 'fde12a3b-4c56-7d89-0e1f-2a3b4c5d6e7f' AND title = 'Geometry')
  );

-- Seed Questions for CS Interviews
INSERT INTO questions (question, options, correct_answer, explanation, difficulty, subject_id, topic_id)
VALUES 
  (
    'What is the time complexity of searching for an element in a balanced binary search tree with n nodes?',
    '{"options": ["O(1)", "O(log n)", "O(n)", "O(n log n)"]}',
    'O(log n)',
    'In a balanced binary search tree, each comparison eliminates roughly half of the remaining nodes, resulting in logarithmic time complexity.',
    'medium',
    'c5d6e7f8-a9b0-bcde-5c6d-7e8f9a0b1c2d',
    (SELECT id FROM topics WHERE subject_id = 'c5d6e7f8-a9b0-bcde-5c6d-7e8f9a0b1c2d' AND title = 'Searching Algorithms')
  ),
  (
    'Which data structure would be most efficient for implementing a priority queue?',
    '{"options": ["Array", "Linked List", "Hash Table", "Heap"]}',
    'Heap',
    'A heap provides O(log n) insertion and O(1) access to the minimum/maximum element, making it ideal for priority queue operations.',
    'medium',
    'b4c5d6e7-f8a9-abcd-4b5c-6d7e8f9a0b1c',
    (SELECT id FROM topics WHERE subject_id = 'b4c5d6e7-f8a9-abcd-4b5c-6d7e8f9a0b1c' AND title = 'Trees and Graphs')
  );

-- Seed Flashcards for GMAT
INSERT INTO flashcards (front, back, subject_id, topic_id)
VALUES 
  (
    'What is the quadratic formula?',
    'x = (-b ± √(b² - 4ac)) / 2a for a quadratic equation in the form ax² + bx + c = 0',
    'fde12a3b-4c56-7d89-0e1f-2a3b4c5d6e7f',
    (SELECT id FROM topics WHERE subject_id = 'fde12a3b-4c56-7d89-0e1f-2a3b4c5d6e7f' AND title = 'Algebra Basics')
  ),
  (
    'What is a syllogism in critical reasoning?',
    'A form of deductive reasoning consisting of a major premise, a minor premise, and a conclusion.',
    'a1b2c3d4-e5f6-7890-1a2b-3c4d5e6f7a8b',
    (SELECT id FROM topics WHERE subject_id = 'a1b2c3d4-e5f6-7890-1a2b-3c4d5e6f7a8b' AND title = 'Critical Reasoning')
  );

-- Seed Flashcards for CS Interviews
INSERT INTO flashcards (front, back, subject_id, topic_id)
VALUES 
  (
    'What is the difference between a stack and a queue?',
    'A stack is LIFO (Last In, First Out) while a queue is FIFO (First In, First Out).',
    'b4c5d6e7-f8a9-abcd-4b5c-6d7e8f9a0b1c',
    (SELECT id FROM topics WHERE subject_id = 'b4c5d6e7-f8a9-abcd-4b5c-6d7e8f9a0b1c' AND title = 'Arrays and Strings')
  ),
  (
    'What is the time complexity of quicksort in the average case?',
    'O(n log n), where n is the number of elements being sorted.',
    'c5d6e7f8-a9b0-bcde-5c6d-7e8f9a0b1c2d',
    (SELECT id FROM topics WHERE subject_id = 'c5d6e7f8-a9b0-bcde-5c6d-7e8f9a0b1c2d' AND title = 'Sorting Algorithms')
  );

-- Update the Achievements
INSERT INTO achievements (title, description, criteria, icon)
VALUES 
  (
    'GMAT Master',
    'Completed all GMAT modules with 90%+ accuracy',
    '{"examId": "e1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6", "correctResponses": 50}',
    'award'
  ),
  (
    'Coding Guru',
    'Solved 25 CS interview problems correctly',
    '{"examId": "e5e6f7a8-b9c0-d1e2-f3a4-b5c6d7e8f9a0", "correctResponses": 25}',
    'code'
  ),
  (
    'Quick Thinker',
    'Answered 20 questions with an average time under 30 seconds',
    '{"averageTime": 30, "totalResponses": 20}',
    'clock'
  ),
  (
    'Dedicated Learner',
    'Spent over 10 hours studying',
    '{"totalStudyTime": 36000}',
    'book'
  );

-- Seed user streaks and points for demo purposes
-- Note: This assumes demo users are already added elsewhere in the seed data
-- Replace the user ids with actual user ids when in a real environment

-- Sample user for demo purposes
INSERT INTO users (id, email, display_name, created_at, last_login)
VALUES 
  ('300bdd3c-12c9-4795-94f1-a619ad73bfc2', 'rahul@example.com', 'Rahul', now(), now());

-- Seed user streaks
INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_activity_date)
VALUES 
  ('300bdd3c-12c9-4795-94f1-a619ad73bfc2', 7, 10, CURRENT_DATE);

-- Seed user points
INSERT INTO user_points (user_id, total_points)
VALUES 
  ('300bdd3c-12c9-4795-94f1-a619ad73bfc2', 1250);

-- Seed user achievements for the demo user
INSERT INTO user_achievements (user_id, achievement_id, unlocked_at)
VALUES 
  ('300bdd3c-12c9-4795-94f1-a619ad73bfc2', (SELECT id FROM achievements WHERE title = 'Quick Thinker'), now()),
  ('300bdd3c-12c9-4795-94f1-a619ad73bfc2', (SELECT id FROM achievements WHERE title = 'Dedicated Learner'), now()),
  ('300bdd3c-12c9-4795-94f1-a619ad73bfc2', (SELECT id FROM achievements WHERE title = 'GMAT Master'), now());

-- Add mock progress data for the demo user for the dashboard
INSERT INTO user_progress (user_id, subject_id, completion_percentage, last_studied, time_spent)
VALUES
  ('300bdd3c-12c9-4795-94f1-a619ad73bfc2', 'fde12a3b-4c56-7d89-0e1f-2a3b4c5d6e7f', 75, now(), 7200),
  ('300bdd3c-12c9-4795-94f1-a619ad73bfc2', 'a1b2c3d4-e5f6-7890-1a2b-3c4d5e6f7a8b', 62, now(), 5400),
  ('300bdd3c-12c9-4795-94f1-a619ad73bfc2', 'b2c3d4e5-f6a7-8901-2b3c-4d5e6f7a8b9c', 48, now(), 3600),
  ('300bdd3c-12c9-4795-94f1-a619ad73bfc2', 'c3d4e5f6-a7b8-9012-3c4d-5e6f7a8b9c0d', 85, now(), 9000);

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
    'fde12a3b-4c56-7d89-0e1f-2a3b4c5d6e7f',
    (SELECT id FROM topics WHERE subject_id = 'fde12a3b-4c56-7d89-0e1f-2a3b4c5d6e7f' AND title = 'Algebra Basics'),
    10,
    8,
    1200,
    now() - interval '5 days',
    now() - interval '5 days' + interval '20 minutes'
  ),
  (
    '300bdd3c-12c9-4795-94f1-a619ad73bfc2',
    'a1b2c3d4-e5f6-7890-1a2b-3c4d5e6f7a8b',
    (SELECT id FROM topics WHERE subject_id = 'a1b2c3d4-e5f6-7890-1a2b-3c4d5e6f7a8b' AND title = 'Critical Reasoning'),
    15,
    12,
    1800,
    now() - interval '3 days',
    now() - interval '3 days' + interval '30 minutes'
  ),
  (
    '300bdd3c-12c9-4795-94f1-a619ad73bfc2',
    'c5d6e7f8-a9b0-bcde-5c6d-7e8f9a0b1c2d',
    (SELECT id FROM topics WHERE subject_id = 'c5d6e7f8-a9b0-bcde-5c6d-7e8f9a0b1c2d' AND title = 'Sorting Algorithms'),
    8,
    6,
    900,
    now() - interval '1 day',
    now() - interval '1 day' + interval '15 minutes'
  );

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
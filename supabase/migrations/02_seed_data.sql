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
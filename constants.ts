import { SQLModule, LessonContent } from './types';

export const SQL_CURRICULUM: SQLModule[] = [
  {
    id: 'basic-querying',
    title: '1. The Blueprint (Basic Querying)',
    topics: ['SELECT', 'FROM', 'WHERE', 'ORDER BY']
  },
  {
    id: 'aggregates',
    title: '2. Crunching Numbers (Aggregates)',
    topics: ['COUNT', 'SUM', 'AVG', 'MAX', 'MIN']
  },
  {
    id: 'joins',
    title: '3. Connecting Worlds (JOINS)',
    topics: ['INNER JOIN', 'ON']
  },
  {
    id: 'string-functions',
    title: '4. Text Alchemy (String Funcs)',
    topics: ['UPPER', 'LOWER', 'CONCAT', 'LENGTH']
  },
  {
    id: 'date-time',
    title: '5. Mastering Time (Dates)',
    topics: ['YEAR', 'MONTH', 'DATE Filters']
  },
  {
    id: 'conditional',
    title: '6. The Logic Gate (CASE)',
    topics: ['CASE WHEN', 'ELSE', 'END']
  },
  {
    id: 'subqueries',
    title: '7. Inception (Subqueries)',
    topics: ['Nested SELECT', 'Filtering by Aggregates']
  },
  {
    id: 'window-functions',
    title: '8. Leaderboards (Window Funcs)',
    topics: ['RANK()', 'OVER()']
  }
];

export const STATIC_LESSONS: Record<string, LessonContent> = {
  'basic-querying': {
    title: '1. The Blueprint of Queries',
    analogy: 'Think of it like ordering pizza online. You select toppings (Columns), pick the restaurant (Table), and filter out the ones with pineapple (Where condition).',
    explanation: `**SELECT**: This is your "What". Which columns do you want to see?
**FROM**: This is your "Where". Which table has the data?
**WHERE**: This is your filter. "Only show me students with score > 80".
**ORDER BY**: This sorts the results. "Show highest scores first".`,
    exampleQuery: "SELECT name, score, favorite_subject FROM students WHERE score > 80 ORDER BY score DESC",
    exampleExplanation: 'This command fetches the Name, Score, and Subject for every student who scored more than 80, and puts the winners at the top!',
    challengePrompt: 'Get the name and grade of students in grade 8.'
  },
  'aggregates': {
    title: '2. The Power of Summary',
    analogy: 'Instead of reading every single receipt, a store manager looks at the "Total Sales" for the day. That is Aggregation.',
    explanation: `**COUNT**: Counts how many rows exist. "How many students are there?"
**SUM**: Adds up a column. "Total points scored by everyone."
**AVG**: Calculates the average. "What is the class average?"
**MAX / MIN**: Finds the highest or lowest value.`,
    exampleQuery: "SELECT COUNT(*) as total_students, AVG(score) as average_score, MAX(score) as best_score FROM students",
    exampleExplanation: 'This report doesn\'t show names. It shows one row with the Total number of students, the Class Average, and the Top Score.',
    challengePrompt: 'Find the minimum (lowest) score in the assignments table.'
  },
  'joins': {
    title: '3. Bridging Worlds (JOIN)',
    analogy: 'Imagine your "Friends List" is on one page, and their "High Scores" are on another. You need to glue these pages together using their Names to see who scored what.',
    explanation: `Data is often split into multiple tables to keep it organized (Normalization).
**INNER JOIN**: Combines rows from two tables ONLY when there is a match in both.
**ON**: Tells SQL how to match them (usually ID = ID).`,
    exampleQuery: "SELECT students.name, assignments.title, assignments.score FROM students JOIN assignments ON students.id = assignments.student_id",
    exampleExplanation: 'This merges the "Students" list with the "Assignments" list. It shows the Student Name next to every Assignment they submitted.',
    challengePrompt: 'Join students and assignments to see who submitted what.'
  },
  'string-functions': {
    title: '4. Text Alchemy',
    analogy: 'Like formatting text in a document—changing lowercase to UPPERCASE, or combining "First Name" and "Last Name".',
    explanation: `**UPPER()**: Converts text to CAPITAL LETTERS.
**LOWER()**: Converts text to lowercase.
**CONCAT()**: Joins two pieces of text together.
**LENGTH()**: Counts the characters in a word.`,
    exampleQuery: "SELECT UPPER(name) as BIG_NAME, favorite_subject FROM students",
    exampleExplanation: 'This takes every student name and shouts it in UPPERCASE letters.',
    challengePrompt: 'Select the name and the length of the name for all students.'
  },
  'date-time': {
    title: '5. Mastering Time',
    analogy: 'Like filtering your photo gallery by "Last Month" or "2023".',
    explanation: `Databases rely heavily on dates to track when things happened.
**YEAR()**: Extracts the year (e.g., 2023).
**MONTH()**: Extracts the month number.
**NOW()**: Gets the current exact time.`,
    exampleQuery: "SELECT title, submitted_date FROM assignments WHERE submitted_date > '2023-02-01'",
    exampleExplanation: 'This acts as a time machine, showing only assignments submitted AFTER February 1st, 2023.',
    challengePrompt: 'Find assignments submitted in January (Month 01).'
  },
  'conditional': {
    title: '6. The Decision Maker (CASE)',
    analogy: 'If the traffic light is Red, Stop. If Green, Go. If Yellow, Slow Down.',
    explanation: `**CASE WHEN** allows you to create your own logic inside a query.
You can categorize data on the fly without changing the actual table.
Structure: CASE WHEN [condition] THEN [result] ELSE [fallback] END`,
    exampleQuery: "SELECT name, score, CASE WHEN score >= 90 THEN 'A-Grade' WHEN score >= 70 THEN 'B-Grade' ELSE 'C-Grade' END as report_card FROM students",
    exampleExplanation: 'This creates a NEW temporary column called "report_card" that labels each student based on their score.',
    challengePrompt: 'Create a report that labels scores > 50 as "Pass" and others as "Fail".'
  },
  'subqueries': {
    title: '7. Inception (Subqueries)',
    analogy: 'Asking: "Who is taller than the AVERAGE height?" You first need to find the average height, then compare everyone to it.',
    explanation: `A **Subquery** is a query inside another query.
It usually runs first to find a value (like an Average), which the outer query uses to filter.
It is always enclosed in parentheses: (SELECT ...).`,
    exampleQuery: "SELECT name, score FROM students WHERE score > (SELECT AVG(score) FROM students)",
    exampleExplanation: 'First, it calculates the class average (approx 82). Then, it lists students who scored HIGHER than 82.',
    challengePrompt: 'Find assignments with a score lower than the average assignment score.'
  },
  'window-functions': {
    title: '8. Smart Leaderboards',
    analogy: 'In a race, you want to see your Rank (1st, 2nd, 3rd) next to your time, without hiding the other runners.',
    explanation: `**RANK() OVER (ORDER BY ...)**: Assigns a rank to each row based on a value.
Unlike Aggregates (which collapse rows), Window functions keep the rows but add calculation data to them.`,
    exampleQuery: "SELECT name, score, RANK() OVER (ORDER BY score DESC) as class_rank FROM students",
    exampleExplanation: 'This lists every student and assigns them a Rank number based on their score (Highest score = Rank 1).',
    challengePrompt: 'Rank the assignments by score.'
  }
};

export const MOCK_DB = {
  students: [
    { id: 1, name: 'Vaishak', grade: 8, favorite_subject: 'Math', score: 95 },
    { id: 2, name: 'Alex', grade: 8, favorite_subject: 'History', score: 72 },
    { id: 3, name: 'Sam', grade: 7, favorite_subject: 'Science', score: 88 },
    { id: 4, name: 'Jordan', grade: 9, favorite_subject: 'Math', score: 65 },
    { id: 5, name: 'Casey', grade: 8, favorite_subject: 'Art', score: 92 },
  ],
  assignments: [
    { id: 101, student_id: 1, title: 'Algebra Quiz', score: 95, submitted_date: '2023-01-15' },
    { id: 102, student_id: 2, title: 'World War Essay', score: 70, submitted_date: '2023-01-20' },
    { id: 103, student_id: 1, title: 'Geometry Test', score: 98, submitted_date: '2023-02-10' },
    { id: 104, student_id: 3, title: 'Volcano Project', score: 88, submitted_date: '2023-01-25' },
    { id: 105, student_id: 5, title: 'Painting', score: 92, submitted_date: '2023-03-05' },
    { id: 106, student_id: 4, title: 'Trig Homework', score: 60, submitted_date: '2023-02-15' },
  ]
};
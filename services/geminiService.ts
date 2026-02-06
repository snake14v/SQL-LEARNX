// This service now provides static content and mock SQL execution
// Renaming strictly isn't necessary for the build to work, but logically this is "sqlService"
import { LessonContent, QueryResult } from "../types";
import { STATIC_LESSONS, MOCK_DB } from "../constants";

// Helper to simulate a delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateLesson = async (
  moduleTitle: string,
  topics: string[],
  theme: any 
): Promise<LessonContent> => {
  await delay(600); // Fake loading for realism
  
  let lessonKey = 'basic-querying';
  if (moduleTitle.includes('Aggregate')) lessonKey = 'aggregates';
  if (moduleTitle.includes('Join')) lessonKey = 'joins';
  if (moduleTitle.includes('String')) lessonKey = 'string-functions';
  if (moduleTitle.includes('Date')) lessonKey = 'date-time';
  if (moduleTitle.includes('Conditional')) lessonKey = 'conditional';
  if (moduleTitle.includes('Subqueries')) lessonKey = 'subqueries';
  if (moduleTitle.includes('Window')) lessonKey = 'window-functions';

  return STATIC_LESSONS[lessonKey] || STATIC_LESSONS['basic-querying'];
};

export const executeVirtualSQL = async (
  query: string,
  theme: any
): Promise<QueryResult> => {
  await delay(600); // Simulate processing

  let cleanQuery = query.trim().toLowerCase();

  // Very basic mock parser
  try {
    if (!cleanQuery.startsWith('select')) {
      throw new Error("Query must start with SELECT");
    }

    // --- Subquery Mocking ---
    // Detect basic subquery: (select avg(score) from students)
    // We calculate the value and inject it into the string to make the parser below work
    if (cleanQuery.includes('(select avg(score) from students)')) {
      const avg = MOCK_DB.students.reduce((a, b) => a + b.score, 0) / MOCK_DB.students.length;
      cleanQuery = cleanQuery.replace('(select avg(score) from students)', avg.toString());
    }

    // Determine table
    let table = 'students';
    let data: any[] = [...MOCK_DB.students]; // Copy array

    if (cleanQuery.includes('from assignments')) {
      table = 'assignments';
      data = [...MOCK_DB.assignments];
    }

    // --- Handle JOIN --- 
    // (Simulate: just return a merged result if JOIN word is present)
    if (cleanQuery.includes('join')) {
      data = MOCK_DB.students.flatMap(s => 
        MOCK_DB.assignments
          .filter(a => a.student_id === s.id)
          .map(a => ({
            student_name: s.name,
            assignment_title: a.title,
            score: a.score
          }))
      );
    }

    // --- Handle WHERE ---
    if (cleanQuery.includes('where')) {
      // 1. Score > X
      const scoreMatch = cleanQuery.match(/score\s*>\s*(\d+(\.\d+)?)/);
      if (scoreMatch) {
        const threshold = parseFloat(scoreMatch[1]);
        data = data.filter(row => row.score > threshold);
      }
      // 2. Score < X
      const scoreLessMatch = cleanQuery.match(/score\s*<\s*(\d+(\.\d+)?)/);
      if (scoreLessMatch) {
        const threshold = parseFloat(scoreLessMatch[1]);
        data = data.filter(row => row.score < threshold);
      }
      // 3. String matches
      if (cleanQuery.includes("favorite_subject = 'math'") || cleanQuery.includes('math"')) {
        data = data.filter(row => row.favorite_subject === 'Math');
      }
      // 4. Date filtering (Mock)
      if (cleanQuery.includes('submitted_date >')) {
         // Assume the example query 2023-02-01
         data = data.filter(row => row.submitted_date && row.submitted_date > '2023-02-01');
      }
    }
    
    // --- Handle Aggregates ---
    // Note: If aggregate exists, we return early with the summary result
    if (cleanQuery.includes('count(*)')) {
       // Support multiple aggregates if separated by comma
       // This is a naive implementation for the specific demo query
       const avg = data.reduce((acc, curr) => acc + curr.score, 0) / data.length;
       const max = Math.max(...data.map(d => d.score));
       
       return {
         columns: ['total_students', 'average_score', 'best_score'],
         rows: [[data.length, avg.toFixed(1), max]]
       };
    }
    
    // --- Handle Window Functions (RANK) ---
    // If rank() is present, we calculate rank based on score
    if (cleanQuery.includes('rank()')) {
       // Sort desc first
       data.sort((a, b) => b.score - a.score);
       // Add rank property
       data = data.map((row, index) => ({
         ...row,
         class_rank: index + 1
       }));
    }

    // --- Handle CASE WHEN ---
    // Specific mock for the grading example
    if (cleanQuery.includes('case when')) {
      data = data.map(row => {
        let report_card = 'C-Grade';
        if (row.score >= 90) report_card = 'A-Grade';
        else if (row.score >= 70) report_card = 'B-Grade';
        
        return { ...row, report_card };
      });
    }

    // --- Handle String Functions ---
    // UPPER(name)
    if (cleanQuery.includes('upper(name)')) {
       data = data.map(row => ({ 
         ...row, 
         BIG_NAME: row.name?.toUpperCase() || row.student_name?.toUpperCase() 
       }));
    }

    // --- Handle ORDER BY ---
    if (cleanQuery.includes('order by')) {
      const parts = cleanQuery.split('order by');
      const orderByClause = parts[1].trim();
      
      if (orderByClause.includes('score desc')) {
        data.sort((a, b) => b.score - a.score);
      } else if (orderByClause.includes('score asc') || orderByClause.includes('score')) {
        data.sort((a, b) => a.score - b.score);
      }
    }

    // --- Final Selection & Column Filtering ---
    // Filter columns based on SELECT clause, or show all if *
    // This is a visual simplification.
    
    // Identify available keys from first row
    if (data.length === 0) return { columns: [], rows: [] };
    
    let displayKeys = Object.keys(data[0]);

    // If query specifies columns (not *), try to filter the display keys
    // Naive parsing: extract between SELECT and FROM
    const selectPart = cleanQuery.substring(6, cleanQuery.indexOf('from')).trim();
    if (selectPart !== '*' && !cleanQuery.includes('count(*)')) {
       // If we added computed columns like BIG_NAME or report_card or class_rank, keep them
       // plus any requested keys
       const requested = selectPart.split(',').map(s => s.trim().split(' ')[0]); // remove aliases
       // This is tricky in a mock. Let's just prefer the computed keys + standard keys
       
       // If we have 'report_card', show name, score, report_card
       if (data[0].report_card) displayKeys = ['name', 'score', 'report_card'];
       // If we have 'BIG_NAME', show it
       else if (data[0].BIG_NAME) displayKeys = ['BIG_NAME', 'favorite_subject'];
       // If we have 'class_rank', show name, score, rank
       else if (data[0].class_rank) displayKeys = ['name', 'score', 'class_rank'];
       // Join example
       else if (data[0].assignment_title) displayKeys = ['student_name', 'assignment_title', 'score'];
       // Standard fallback
       else {
         // Try to match requested cols to data keys
         const matchedKeys = displayKeys.filter(k => selectPart.includes(k));
         if (matchedKeys.length > 0) displayKeys = matchedKeys;
       }
    }

    const rows = data.map(obj => displayKeys.map(k => obj[k]));

    return {
      columns: displayKeys,
      rows: rows
    };

  } catch (e: any) {
    console.error(e);
    return {
      columns: [],
      rows: [],
      error: "Syntax Error or Unsupported Mock Command"
    };
  }
};
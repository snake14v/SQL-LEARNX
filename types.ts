export interface SQLModule {
  id: string;
  title: string;
  topics: string[];
}

export interface LessonContent {
  title: string;
  analogy: string;
  explanation: string;
  exampleQuery: string;
  exampleExplanation: string;
  challengePrompt: string;
}

export interface QueryResult {
  columns: string[];
  rows: (string | number | null)[][];
  error?: string;
}

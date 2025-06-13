export type TableData = {
  headers: string[];
  rows: string[][];
};

export type Chapters = {
  chapter_no: number;
  name: string;
  questions: QuestionGroup[];
};

export type QuestionGroup = {
  question_group: string;
  questions: Question[];
};

export type Question = {
  id: number;
  question: string;
  answer: string;
  content_type: "text" | "table" | "equation" | "programming" | "math_problem";
  table_data?: TableData;
  equation?: string;
  language?: string;
  code?: string;
  problem?: string;
};

export type GradeData = {
  id: number;
  name: string;
};

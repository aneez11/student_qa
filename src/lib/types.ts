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
  content_type: "text" | "table" | "equation";
  table_data?: TableData;
  equation?: string;
};

export type GradeData = {
  id: number;
  name: string;
};

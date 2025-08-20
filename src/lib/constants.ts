// Application constants
export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
export const SCROLL_THRESHOLD = 300; // pixels
export const RETRY_ATTEMPTS = 3;
export const RETRY_DELAY = 1000; // milliseconds

// Content types for questions
export const CONTENT_TYPES = {
  TEXT: "text",
  TABLE: "table",
  EQUATION: "equation",
  MATH_PROBLEM: "math_problem",
  PROGRAMMING: "programming",
} as const;

// Filter options
export const FILTER_OPTIONS = {
  ALL: "all",
} as const;

// Grade data - this could be fetched from an API in the future
export const GRADE_DATA = {
  9: {
    name: "Grade 9",
    subjects: ["Computer Science"],
  },
  10: {
    name: "Grade 10",
    subjects: ["Computer Science"],
  },
} as const;

// Available grades for home page
export const AVAILABLE_GRADES = [
  { id: 9, name: "Grade 9", subjects: 8, questions: 400, color: "bg-cyan-500" },
  {
    id: 10,
    name: "Grade 10",
    subjects: 8,
    questions: 450,
    color: "bg-amber-500",
  },
] as const;

// API endpoints
export const API_ENDPOINTS = {
  CHAPTER_INDEX: (gradeId: string) => `/data/${gradeId}/index.json`,
  CHAPTER_DATA: (gradeId: string, chapterId: string) =>
    `/data/${gradeId}/${chapterId}.json`,
  GRADE_INDEX: "/data/grade_index.json",
} as const;

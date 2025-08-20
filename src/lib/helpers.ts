import type { Question, QuestionGroup, Chapters } from "./types";

/**
 * Calculate total questions in a chapter
 */
export function getTotalQuestions(chapter: Chapters): number {
  return chapter.questions.reduce(
    (total, group) => total + group.questions.length,
    0
  );
}

/**
 * Filter questions based on search criteria
 */
export function filterQuestions(
  questions: QuestionGroup[],
  searchQuery: string,
  contentFilter: string,
  groupFilter: string
): QuestionGroup[] {
  return questions
    .filter((group) => {
      const matchesGroup =
        groupFilter === "all" || group.question_group === groupFilter;
      return matchesGroup;
    })
    .map((group) => ({
      ...group,
      questions: group.questions.filter((q) => {
        const matchesContentType =
          contentFilter === "all" || q.content_type === contentFilter;
        const matchesSearch =
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesContentType && matchesSearch;
      }),
    }))
    .filter((group) => group.questions.length > 0);
}

/**
 * Format text with line breaks for HTML display
 */
export function formatTextWithBreaks(text: string): { __html: string } {
  return {
    __html: text
      ?.split("\n")
      .map((line, index) =>
        line ? `<span key=${index}>${line}<br /></span>` : "<br />"
      )
      .join(""),
  };
}

/**
 * Render math text with LaTeX support
 */
export function parseMathText(
  text: string
): Array<{ type: "text" | "inline" | "block"; content: string }> {
  const parts = text.split(/(\$\$.*?\$\$|\$.*?\$)/g);

  return parts.map((part) => {
    if (part.startsWith("$$") && part.endsWith("$$")) {
      return { type: "block", content: part.slice(2, -2) };
    } else if (part.startsWith("$") && part.endsWith("$")) {
      return { type: "inline", content: part.slice(1, -1) };
    } else {
      return { type: "text", content: part };
    }
  });
}

/**
 * Get unique content types from questions
 */
export function getUniqueContentTypes(questions: QuestionGroup[]): string[] {
  const types = new Set<string>();
  questions.forEach((group) => {
    group.questions.forEach((q) => {
      types.add(q.content_type);
    });
  });
  return Array.from(types);
}

/**
 * Get unique question groups
 */
export function getUniqueQuestionGroups(questions: QuestionGroup[]): string[] {
  return questions.map((group) => group.question_group);
}

/**
 * Validate question data structure
 */
export function validateQuestion(question: Question): boolean {
  return !!(
    question.id &&
    question.question &&
    question.answer &&
    question.content_type
  );
}

/**
 * Safe scroll to top function
 */
export function scrollToTop(behavior: ScrollBehavior = "smooth"): void {
  if (typeof window !== "undefined") {
    window.scrollTo({
      top: 0,
      behavior,
    });
  }
}

/**
 * Generate a unique key for question items
 */
export function generateQuestionKey(
  groupName: string,
  questionId: number
): string {
  return `${groupName}-${questionId}`;
}

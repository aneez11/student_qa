import { useState, useEffect, useCallback } from "react";
import type { Question } from "@/lib/types";

export interface BookmarkedQuestion {
  gradeId: string;
  chapterId: string;
  chapterName: string;
  groupName: string;
  question: Question;
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkedQuestion[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("learnquest_bookmarks");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse bookmarks:", e);
        }
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("learnquest_bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = useCallback(
    (
      gradeId: string,
      chapterId: string,
      chapterName: string,
      groupName: string,
      question: Question
    ) => {
      setBookmarks((prev) => {
        // Prevent duplicate bookmarking
        const exists = prev.some(
          (b) =>
            b.gradeId === gradeId &&
            b.chapterId === chapterId &&
            b.question.id === question.id &&
            b.groupName === groupName
        );
        if (exists) return prev;

        return [
          ...prev,
          {
            gradeId,
            chapterId,
            chapterName,
            groupName,
            question,
          },
        ];
      });
    },
    []
  );

  const removeBookmark = useCallback(
    (gradeId: string, chapterId: string, questionId: number, groupName: string) => {
      setBookmarks((prev) =>
        prev.filter(
          (b) =>
            !(
              b.gradeId === gradeId &&
              b.chapterId === chapterId &&
              b.question.id === questionId &&
              b.groupName === groupName
            )
        )
      );
    },
    []
  );

  const isBookmarked = useCallback(
    (gradeId: string, chapterId: string, questionId: number, groupName: string) => {
      return bookmarks.some(
        (b) =>
          b.gradeId === gradeId &&
          b.chapterId === chapterId &&
          b.question.id === questionId &&
          b.groupName === groupName
      );
    },
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    (
      gradeId: string,
      chapterId: string,
      chapterName: string,
      groupName: string,
      question: Question
    ) => {
      if (isBookmarked(gradeId, chapterId, question.id, groupName)) {
        removeBookmark(gradeId, chapterId, question.id, groupName);
      } else {
        addBookmark(gradeId, chapterId, chapterName, groupName, question);
      }
    },
    [isBookmarked, addBookmark, removeBookmark]
  );

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    toggleBookmark,
  };
}

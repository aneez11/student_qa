import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { Question } from "@/lib/types";

interface QuestionCardProps {
  question: Question;
  groupName: string;
  renderContent: (q: Question) => React.ReactNode;
}

const QuestionCard = memo(
  ({ question, groupName, renderContent }: QuestionCardProps) => {
    return (
      <Card
        key={`${groupName}-${question.id}`}
        className="hover:shadow-lg transition-shadow"
      >
        <CardContent>
          <div className="mb-4">{renderContent(question)}</div>
        </CardContent>
      </Card>
    );
  }
);

QuestionCard.displayName = "QuestionCard";

export default QuestionCard;

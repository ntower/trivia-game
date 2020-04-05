import React, { FC } from "react";
// import { useSpring, animated } from "react-spring";
// import "./styles.css";
import { Question } from "../gameTypes";

export interface QuestionCardProps {
  question: Question;
  onClick: (e: React.MouseEvent) => void;
}

const QuestionCard: FC<QuestionCardProps> = ({ question, onClick }) => {
  const colors = question.faceUp
    ? "has-background-info has-text-white"
    : "has-background-light";
  return (
    <div
      className={`box ${colors} is-paddingless is-marginless`}
      style={{
        height: "5em"
      }}
      onClick={onClick}
    >
      {question.faceUp ? `$${question.score}` : ""}
    </div>
  );
};

export default QuestionCard;

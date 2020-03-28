import React, { FC } from "react";
import { useSpring, animated } from "react-spring";
import "./styles.css";
import { Question } from "../gameTypes";

export interface QuestionCardProps {
  question: Question;
  onClick: (e: React.MouseEvent) => void;
}

const QuestionCard: FC<QuestionCardProps> = ({ question, onClick }) => {
  const { transform, opacity } = useSpring({
    opacity: question.faceUp ? 1 : 0,
    transform: `perspective(600px) rotateX(${question.faceUp ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 }
  });
  return (
    <div
      style={{
        width: "5em",
        height: "5em",
        // maxWidth: "500px",
        // maxHeight: "500px",
        // width: "50ch",
        // height: "50ch",
        margin: "1em"
      }}
      onClick={onClick}
    >
      <animated.div
        className="c back"
        style={{
          opacity: opacity.interpolate(o => 1 - Number(o)),
          transform
        }}
      >
        {question.backText}
      </animated.div>
      <animated.div
        className="c front"
        style={{
          opacity,
          transform: transform.interpolate(t => `${t} rotateX(180deg)`)
        }}
      >
        {question.frontText}
      </animated.div>
    </div>
  );
};

export default QuestionCard;

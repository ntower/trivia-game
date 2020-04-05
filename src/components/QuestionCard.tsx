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
        height: "5em",
      }}
      // style={{
      //   width: "2em",
      //   height: "6em",
      //   // maxWidth: "500px",
      //   // maxHeight: "500px",
      //   // width: "50ch",
      //   // height: "50ch",
      //   margin: "5px",
      //   marginBottom: "20px"
      // }}
      onClick={onClick}
    >
      {question.faceUp ? `$${question.score}` : ""}
      {/* <animated.div
        className="c back"
        style={{
          width: "175px",
          height: "110px",
          border: "solid black",
          opacity: opacity.interpolate((o) => 1 - Number(o)),
          transform,
        }}
      >
        {question.text}
      </animated.div>
      <animated.div
        className="c front"
        style={{
          width: "175px",
          height: "110px",
          border: "solid blue",
          borderStyle: "double",
          boxShadow: "inset 0 0 5px",
          opacity,
          transform: transform.interpolate((t) => `${t} rotateX(180deg)`),
        }}
      >
        {"$" + question.score}
      </animated.div> */}
    </div>
  );
};

export default QuestionCard;

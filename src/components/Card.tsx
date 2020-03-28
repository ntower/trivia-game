import React, { FC } from "react";
import { useSpring, animated } from "react-spring";
import "./styles.css";
import { Card as CardType } from "../gameTypes";

export interface CardProps {
  card: CardType;
  onClick: (e: React.MouseEvent) => void;
}

const Card: FC<CardProps> = ({ card, onClick }) => {
  const { transform, opacity } = useSpring({
    opacity: card.faceUp ? 1 : 0,
    transform: `perspective(600px) rotateX(${card.faceUp ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 }
  });
  return (
    <div
      style={{
        maxWidth: "500px",
        maxHeight: "500px",
        width: "50ch",
        height: "50ch",
        margin: "1em"
      }}
      onClick={onClick}
    >
      <animated.div
        className="c back"
        style={{ opacity: opacity.interpolate(o => 1 - Number(o)), transform }}
      />
      <animated.div
        className="c front"
        style={{
          opacity,
          transform: transform.interpolate(t => `${t} rotateX(180deg)`)
        }}
      />
    </div>
  );
};

export default Card;

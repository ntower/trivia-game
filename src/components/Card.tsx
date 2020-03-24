import React, { FC } from "react";
import { useSpring, animated } from "react-spring";
import "./styles.css";

export interface CardProps {
  flipped: boolean;
  onClick: (e: React.MouseEvent) => void;
}

const Card: FC<CardProps> = ({ flipped, onClick }) => {
  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateX(${flipped ? 180 : 0}deg)`,
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

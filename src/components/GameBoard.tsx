import React, { FC, useState } from "react";
import Card from "./Card";

export interface GameBoardProps {}

const GameBoard: FC<GameBoardProps> = props => {
  const [cards, setCards] = useState(new Array(15).fill({ flipped: "false" }));

  return (
    <div
      style={{
        width: "80%",
        margin: "0 auto",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between"
      }}
    >
      {cards.map((card, i) => (
        <Card
          key={i}
          flipped={card.flipped}
          onClick={() => {
            setCards(prev => {
              const newCards = [...prev];
              newCards[i] = {
                ...prev[i],
                flipped: !prev[i].flipped
              };
              return newCards;
            });
          }}
        />
      ))}
    </div>
  );
};

export default GameBoard;

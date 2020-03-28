import React, { FC } from "react";
import Card from "./Card";
import { Game } from "../gameTypes";
import { firestore } from "firebase";

export interface GameBoardProps {
  game: Game;
}

const GameBoard: FC<GameBoardProps> = ({ game }) => {
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
      {Object.values(game.board.cards).map(card => (
        <Card
          key={card.cardId}
          card={card}
          onClick={() => {
            const updatePayload: firestore.UpdateData = {
              [`board.cards.${card.cardId}.faceUp`]: !card.faceUp
            };

            firestore()
              .collection("games")
              .doc(game.gameId)
              .update(updatePayload);
          }}
        />
      ))}
    </div>
  );
};

export default GameBoard;

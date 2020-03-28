import React, { FC, useState, useEffect } from "react";
import Card from "./Card";
import { Game } from "../gameTypes";
import { firestore } from "firebase";
import { useRouteMatch } from "react-router-dom";

export interface GameBoardProps {}

const GameBoard: FC<GameBoardProps> = () => {
  const match = useRouteMatch<{ gameId: string }>();
  const [game, setGame] = useState<"loading" | null | Game>("loading");
  useEffect(() => {
    const gameId = match.params.gameId;
    if (gameId) {
      setGame("loading");
      const unsubscribe = firestore()
        .collection("games")
        .doc(gameId)
        .onSnapshot(
          snapshot => {
            const data = snapshot.data();
            if (data) {
              setGame(data as Game);
            } else {
              setGame(null);
            }
          },
          err => {
            setGame(null);
          }
        );
      return unsubscribe;
    } else {
      setGame(null);
    }
  }, [match]);

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
      {game === null && <div>Game not found</div>}
      {game &&
        game !== "loading" &&
        Object.values(game.board.cards).map(card => (
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

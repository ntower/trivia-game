import React, { FC, useState, useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import { Game } from "../gameTypes";
import { firestore } from "firebase";
import GameBoard from "./GameBoard";

export interface GamePageProps {}

const GamePage: FC<GamePageProps> = (props) => {
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
          (snapshot) => {
            const data = snapshot.data();
            if (data) {
              setGame(data as Game);
            } else {
              setGame(null);
            }
          },
          (err) => {
            setGame(null);
          }
        );
      return unsubscribe;
    } else {
      setGame(null);
    }
  }, [match]);

  return (
    <div className="hero is-fullheight">
      <div className="hero-body">
        <div className="container has-text-centered">
          {game === null ? (
            "Game not found"
          ) : game === "loading" ? (
            "...loading"
          ) : (
            <GameBoard game={game} />
          )}
        </div>
      </div>
    </div>
  );
};

export default GamePage;

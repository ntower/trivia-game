import React, { FC, useState, useEffect } from "react";
import QuestionCard from "./QuestionCard";
import { Game } from "../gameTypes";
import { firestore } from "firebase";
import { useRouteMatch } from "react-router-dom";

export interface GameBoardProps {}

const byOrdinal = (a: { ordinal: number }, b: { ordinal: number }) =>
  a.ordinal - b.ordinal;

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
      {game && game !== "loading" && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          {Object.values(game.categories)
            .sort(byOrdinal)
            .map(category => (
              <div key={category.categoryId} style={{ width: `${100 / 6}%` }}>
                <div style={{ width: "5em", height: "3em", margin: "1em" }}>
                  {category.title}
                </div>
                {Object.values(category.questions)
                  .sort(byOrdinal)
                  .map(question => (
                    <QuestionCard
                      key={question.questionId}
                      question={question}
                      onClick={() => {
                        const updatePayload: firestore.UpdateData = {
                          [`categories.${category.categoryId}.questions.${question.questionId}.faceUp`]: !question.faceUp
                        };

                        firestore()
                          .collection("games")
                          .doc(game.gameId)
                          .update(updatePayload);
                      }}
                    />
                  ))}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default GameBoard;

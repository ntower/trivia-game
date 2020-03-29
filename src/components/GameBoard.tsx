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
        width: "100%",
        margin: "0 auto",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        background: "#B4E1F1" ,
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
              <div key={category.categoryId} style={{ width: `${100 / 6}%`, fontSize:"17px", border:"solid blue 3px", justifyContent:"center", margin:"3px"}}>
                <div style={{ width: "6em", height: "2em", margin: "2em",borderBottom:"solid blue 3px", padding:"10px", fontWeight: "bold"}}>
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
          <div
     style={{
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "right",
      background: "white",
      border: "solid black",
      width: "200px"

    }}>
     
      </div>
    </div>
  );
};

export default GameBoard;

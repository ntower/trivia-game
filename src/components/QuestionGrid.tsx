import React, { FC } from "react";
import { Game } from "../gameTypes";
import QuestionCard from "./QuestionCard";
import { firestore } from "firebase";
import { usePlayerId } from "./playerId";

export interface QuestionGridProps {
  game: Game;
}

const byOrdinal = (a: { ordinal: number }, b: { ordinal: number }) =>
  a.ordinal - b.ordinal;

const QuestionGrid: FC<QuestionGridProps> = ({ game }) => {
  const playerId = usePlayerId();
  return (
    <div
      className="columns is-gapless"
      style={
        game.state === "pregame"
          ? { filter: "blur(5px)", opacity: 0.4 }
          : undefined
      }
    >
      {Object.values(game.categories)
        .sort(byOrdinal)
        .map(category => (
          <div
            key={category.categoryId}
            className="column is-2 has-text-centered"
          >
            <div
              className="box has-background-light"
              style={{
                height: "6em"
              }}
            >
              <div className="title is-6">{category.title}</div>
            </div>
            {Object.values(category.questions)
              .sort(byOrdinal)
              .map(question => (
                <QuestionCard
                  key={question.questionId}
                  question={question}
                  onClick={() => {
                    if (
                      !question.faceUp ||
                      game.state !== "selectingQuestion" ||
                      playerId !== game.hostId
                    ) {
                      return;
                    }

                    const updatePayload: firestore.UpdateData = {
                      state: "displayingQuestion",
                      activePlayer: null,
                      activeQuestion: question,
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
  );
};

export default QuestionGrid;

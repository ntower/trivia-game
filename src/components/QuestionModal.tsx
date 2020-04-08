import React, { FC } from "react";
import { Game } from "../gameTypes";
import { firestore } from "firebase";
import { usePlayerId } from "./playerId";
import { getRole } from "./GameBoard";
import { getActivePlayerName } from "./StatusBar";

export interface QuestionModalProps {
  game: Game;
}

const QuestionModal: FC<QuestionModalProps> = ({ game }) => {
  const playerId = usePlayerId();
  const role = getRole(game, playerId);

  const buzzIn = () => {
    // Guard against synchronoization errors. We only want to update the db
    //   if someone else hasn't buzzed in already
    const gameRef = firestore().collection("games").doc(game.gameId);
    firestore().runTransaction(async t => {
      const doc = await t.get(gameRef);
      const state = (doc.data() as Game).state;
      if (state === "displayingQuestion") {
        const updatePayload: firestore.UpdateData = {
          state: "awaitingAnswer",
          activePlayer: playerId
        };
        t.update(gameRef, updatePayload);
      }
    });
  };

  const judgeCorrect = () => {
    if (!game.activePlayer || !game.activeQuestion) {
      return;
    }

    const { currentRound } = game;
    if (currentRound === "final") {
      console.warn("judging final jeopardy not yet implemented");
      return;
    }
    const categories = game.currentRound === 1 ? game.round1 : game.round1;
    let hasMoreQuestions = Object.values(categories).some(category =>
      Object.values(category.questions).some(question => question.faceUp)
    );

    let updatePayload: firestore.UpdateData = {
      [`players.${game.activePlayer}.score`]:
        game.players[game.activePlayer].score + game.activeQuestion.score,
      lastPlayerToSuccessfullyAnswer: game.activePlayer,
      barredFromBuzzingIn: {}
    };
    if (hasMoreQuestions) {
      updatePayload = {
        state: "selectingQuestion"
      };
    } else if (currentRound === 1) {
      updatePayload = {
        state: "selectingQuestion",
        currentRound: 2
      };
    } else {
      // currentRound === 2
      updatePayload = {
        state: "displayingFinal",
        currentRound: "final"
      };
    }

    firestore().collection("games").doc(game.gameId).update(updatePayload);
  };

  const judgeIncorrect = () => {
    if (!game.activePlayer || !game.activeQuestion) {
      return;
    }

    const updatePayload: firestore.UpdateData = {
      [`players.${game.activePlayer}.score`]:
        game.players[game.activePlayer].score - game.activeQuestion.score,
      state: "displayingQuestion",
      [`barredFromBuzzingIn.${game.activePlayer}`]: true
    };
    firestore().collection("games").doc(game.gameId).update(updatePayload);
  };

  const abandonQuestion = () => {
    const { currentRound } = game;
    if (currentRound === "final") {
      console.warn("judging final jeopardy not yet implemented");
      return;
    }
    const categories = game.currentRound === 1 ? game.round1 : game.round1;
    let hasMoreQuestions = Object.values(categories).some(category =>
      Object.values(category.questions).some(question => question.faceUp)
    );

    let updatePayload: firestore.UpdateData = {
      activePlayer: game.lastPlayerToSuccessfullyAnswer,
      barredFromBuzzingIn: {}
    };
    if (hasMoreQuestions) {
      updatePayload = {
        state: "selectingQuestion"
      };
    } else if (currentRound === 1) {
      updatePayload = {
        state: "selectingQuestion",
        currentRound: 2
      };
    } else {
      // currentRound === 2
      updatePayload = {
        state: "displayingFinal",
        currentRound: "final"
      };
    }

    firestore().collection("games").doc(game.gameId).update(updatePayload);
  };

  return (
    <div className={"modal is-active"}>
      <div className="modal-background"></div>
      <div className="modal-content">
        <div className="box">
          <h2 className="title">Foo</h2>
          <p>{game.activeQuestion?.text ?? "Huh... the question is missing"}</p>
          <br />
          {game.state === "displayingQuestion" && role !== "host" && (
            <button
              onClick={buzzIn}
              className="button is-info is-large"
              disabled={game.barredFromBuzzingIn[playerId]}
            >
              BUZZ IN!
            </button>
          )}
          {game.state === "displayingQuestion" && role === "host" && (
            <button
              onClick={abandonQuestion}
              className="button is-info is-large"
            >
              No one answered
            </button>
          )}
          {game.state === "awaitingAnswer" && (
            <>
              <h3 className="subtitle">
                {getActivePlayerName(game, playerId, true)} buzzed in first
              </h3>
              {role === "host" ? (
                <>
                  <button
                    onClick={judgeCorrect}
                    className="button is-info is-large"
                  >
                    Correct
                  </button>
                  <button
                    onClick={judgeIncorrect}
                    className="button is-warning is-large"
                  >
                    Incorrect
                  </button>
                </>
              ) : (
                <h3 className="subtitle">
                  Waiting for host to judge the answer
                </h3>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;

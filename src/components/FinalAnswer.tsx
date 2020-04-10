import React, { FC, useState } from "react";
import { Game } from "../gameTypes";
import { usePlayerId } from "./playerId";
import { getRole } from "./GameBoard";
import { firestore } from "firebase";

export interface AnswerProps {
  game: Game;
}

const Answer: FC<AnswerProps> = ({ game }) => {
  const playerId = usePlayerId();
  const role = getRole(game, playerId);
  const [answer, setAnswer] = useState<string | undefined>(
    game.players[playerId]?.finalSolution
  );

  const hasAnswered = game.players[playerId]?.finalSolution !== undefined;

  const submitAnswer = () => {
    if (answer === undefined) {
      return;
    }

    // A transaction is used to make sure someone moves the game to
    // the next state, and only when appropriate
    const gameRef = firestore().collection("games").doc(game.gameId);
    firestore().runTransaction(async t => {
      const doc = await t.get(gameRef);
      const latestGame = doc.data() as Game;
      const updatePayload: firestore.UpdateData = {
        [`players.${playerId}.finalSolution`]: answer
      };
      const everyoneHasAnswered = Object.values(latestGame.players).every(
        player =>
          player.playerId === playerId || player.finalSolution !== undefined
      );
      if (everyoneHasAnswered) {
        updatePayload.state = "finalJudging";
        updatePayload.activePlayer = Object.values(game.players)[0].playerId;
      }
      t.update(gameRef, updatePayload);
    });
  };

  return (
    <>
      <p>{game.finalQuestion.text}</p>
      <br />
      {role === "player" ? (
        <>
          <div className="field">
            <label className="label">Solution</label>
            <div className="control">
              <input
                className="input is-medium"
                type="text"
                defaultValue={answer}
                onChange={e => setAnswer(e.target.value)}
                disabled={hasAnswered}
              />
            </div>
          </div>
          <button
            onClick={submitAnswer}
            className="button is-info is-large"
            disabled={hasAnswered}
          >
            Submit Solution
          </button>
        </>
      ) : (
        <p>Players are entering their solutions</p>
      )}
    </>
  );
};

export default Answer;

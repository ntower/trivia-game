import React, { FC } from "react";
import { Game } from "../gameTypes";
import { usePlayerId } from "./playerId";
import { getRole } from "./GameBoard";
import { firestore } from "firebase";
import { getPlayerName as getActivePlayerName } from "./StatusBar";

export interface AnswerProps {
  game: Game;
}

const Judging: FC<AnswerProps> = ({ game }) => {
  const playerId = usePlayerId();
  const role = getRole(game, playerId);
  const activePlayer = game.activePlayer;

  const renderJudgment = (correct: boolean) => {
    if (!game.activePlayer || !game.activeQuestion) {
      return;
    }

    let change = game.players[game.activePlayer].finalWager || 0;
    if (!correct) {
      change *= -1;
    }

    let updatePayload: firestore.UpdateData = {
      [`players.${game.activePlayer}.score`]:
        game.players[game.activePlayer].score + change,
      [`players.${game.activePlayer}.finalJudgmentReceived`]: true
    };

    let nextPlayer = Object.values(game.players).find(
      player =>
        player.playerId !== game.activePlayer && !player.finalJudgmentReceived
    );
    if (nextPlayer) {
      updatePayload.activePlayer = nextPlayer.playerId;
    } else {
      updatePayload.state = "endgame";
    }

    firestore().collection("games").doc(game.gameId).update(updatePayload);
  };

  if (!activePlayer) {
    // shouldn't happen
    return null;
  }

  return (
    <>
      <h2 className="subtitle">The correct solution is:</h2>
      <p>{game.finalQuestion.solution}</p>
      <br />
      <h2 className="subtitle">
        {getActivePlayerName(game, playerId, true)} answered:
      </h2>
      <p>
        {game.players[activePlayer].finalSolution ??
          "Hmm... there doesn't seem to be anything here"}
      </p>
      <br />
      <h2 className="subtitle">... and wagered:</h2>
      <p>{game.players[activePlayer].finalWager}</p>
      <br />
      {role === "host" ? (
        <>
          <button
            onClick={() => renderJudgment(true)}
            className="button is-info is-large"
          >
            Correct
          </button>
          <button
            onClick={() => renderJudgment(false)}
            className="button is-warning is-large"
          >
            Incorrect
          </button>
        </>
      ) : (
        <p>Waiting for host to judge the answer</p>
      )}
    </>
  );
};

export default Judging;

import React, { FC, useState } from "react";
import { Game, Player } from "../gameTypes";
import QuestionGrid from "./QuestionGrid";
import StatusBar, { getActivePlayerName } from "./StatusBar";
import ScoreBoard from "./ScoreBoard";
import { usePlayerId } from "./playerId";
import { useHistory } from "react-router-dom";
import { firestore } from "firebase";
import RoleBar from "./RoleBar";

export interface GameBoardProps {
  game: Game;
}

export type Role = "player" | "host" | "spectator" | "none";
export const getRole = (game: Game, playerId: string) => {
  if (game.hostId === playerId) {
    return "host";
  }
  if (game.players[playerId]) {
    return "player";
  }
  if (game.state !== "pregame") {
    return "spectator";
  }
  return "none";
};

const GameBoard: FC<GameBoardProps> = ({ game }) => {
  const history = useHistory();
  const playerId = usePlayerId();
  const [name, setName] = useState("");
  const role = getRole(game, playerId);

  const join = () => {
    const player: Player = {
      playerId,
      name,
      score: 0
    };
    const updatePayload: firestore.UpdateData = {
      [`players.${playerId}`]: player
    };

    firestore().collection("games").doc(game.gameId).update(updatePayload);
  };

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

    const updatePayload: firestore.UpdateData = {
      [`players.${game.activePlayer}.score`]:
        game.players[game.activePlayer].score + game.activeQuestion.score,
      state: "selectingQuestion",
      lastPlayerToSuccessfullyAnswer: game.activePlayer,
      barredFromBuzzingIn: {}
    };
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
    const updatePayload: firestore.UpdateData = {
      state: "selectingQuestion",
      activePlayer: game.lastPlayerToSuccessfullyAnswer,
      barredFromBuzzingIn: {}
    };
    firestore().collection("games").doc(game.gameId).update(updatePayload);
  };

  return (
    <>
      <div className="columns">
        <div className="column is-four-fifths">
          <QuestionGrid game={game} />
          <StatusBar game={game} />
          <RoleBar game={game} />
        </div>
        <div className="column">
          <ScoreBoard game={game} />
        </div>
      </div>

      <div
        className={
          game.state === "displayingQuestion" || game.state === "awaitingAnswer"
            ? "modal is-active"
            : "modal"
        }
      >
        <div className="modal-background"></div>
        <div className="modal-content">
          <div className="box">
            <h2 className="title">Foo</h2>
            <p>
              {game.activeQuestion?.text ?? "Huh... the question is missing"}
            </p>
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

      <div className={role === "none" ? "modal is-active" : "modal"}>
        <div className="modal-background"></div>
        <div className="modal-content">
          <div className="box">
            <div className="field is-grouped">
              <p className="control is-expanded">
                <input
                  className="input"
                  type="text"
                  value={name}
                  onChange={e => {
                    setName(e.target.value);
                  }}
                  placeholder="Enter your name"
                />
              </p>
              <p className="control">
                <button
                  onClick={join}
                  className="button is-info"
                  disabled={!name}
                >
                  Join Game
                </button>
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => history.goBack()}
          className="modal-close is-large"
          aria-label="close"
        ></button>
      </div>
    </>
  );
};

export default GameBoard;

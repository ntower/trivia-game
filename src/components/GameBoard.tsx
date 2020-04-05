import React, { FC, useState } from "react";
import { Game, Player } from "../gameTypes";
import QuestionGrid from "./QuestionGrid";
import StatusBar from "./StatusBar";
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
      score: 0,
    };
    const updatePayload: firestore.UpdateData = {
      [`players.${playerId}`]: player,
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
                  onChange={(e) => {
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

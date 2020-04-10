import React, { FC, useState } from "react";
import { Game, Player } from "../gameTypes";
import { usePlayerId } from "./playerId";
import { useHistory } from "react-router-dom";
import { firestore } from "firebase";

export interface JoinGameModalProps {
  game: Game;
}

const JoinGameModal: FC<JoinGameModalProps> = ({ game }) => {
  const history = useHistory();

  const playerId = usePlayerId();
  const [name, setName] = useState("");
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

  return (
    <div className="modal is-active">
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
  );
};

export default JoinGameModal;

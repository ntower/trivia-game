import React, { FC } from "react";
import { getRole } from "./GameBoard";
import { Game } from "../gameTypes";
import { usePlayerId } from "./playerId";
import { firestore } from "firebase";

export interface RoleBarProps {
  game: Game;
}

const RoleBar: FC<RoleBarProps> = ({ game }) => {
  const playerId = usePlayerId();
  const role = getRole(game, playerId);

  const startGame = () => {
    const updatePayload: firestore.UpdateData = {
      state: "selectingQuestion",
      activePlayer: Object.keys(game.players)[0],
    };

    firestore().collection("games").doc(game.gameId).update(updatePayload);
  };

  return (
    <div className="has-text-centered">
      <h1 className="subtitle">
        {role === "spectator" ? (
          <>
            <span className="icon has-text-warning">
              <i className="fas fa-exclamation-triangle"></i>
            </span>
            This game is in progress. You are spectating.
          </>
        ) : (
          role === "host" && "You are hosting this game"
        )}
      </h1>
      {role === "host" && game.state === "pregame" && (
        <button
          disabled={Object.keys(game.players).length < 2}
          className="button is-info"
          onClick={startGame}
        >
          Start Game
        </button>
      )}
    </div>
  );
};

export default RoleBar;

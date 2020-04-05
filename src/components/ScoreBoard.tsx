import React, { FC } from "react";
import { Game } from "../gameTypes";
import { usePlayerId } from "./playerId";

export interface ScoreBoardProps {
  game: Game;
}

const ScoreBoard: FC<ScoreBoardProps> = ({ game }) => {
  const playerId = usePlayerId();
  return (
    <section className="section">
      {Object.values(game.players).map((player) => (
        <div
          className={
            game.activePlayer === player.playerId
              ? "card has-background-info"
              : "card"
          }
          key={player.playerId}
        >
          <header className="card-header-title">
            {player.name} {player.playerId === playerId ? "(you)" : ""}
          </header>
          <div className="card-content">${player.score}</div>
        </div>
      ))}
    </section>
  );
};

export default ScoreBoard;

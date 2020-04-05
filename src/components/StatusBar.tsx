import React, { FC } from "react";
import { Game, GameState } from "../gameTypes";

export interface StatusBarProps {
  game: Game;
}

const messages: Record<GameState, (activePlayer: string) => string> = {
  pregame: () => "Waiting for players to join",
  selectingQuestion: (activePlayer) =>
    `Waiting for ${activePlayer} to pick a question`,
  displayingQuestion: () => `Waiting for someone to buzz in`,
  awaitingAnswer: (activePlayer) =>
    `Waiting for ${activePlayer} to answer the question`,
};

const StatusBar: FC<StatusBarProps> = ({ game }) => {
  const activePlayerName =
    (game.activePlayer && game.players[game.activePlayer]?.name) ?? "";
  return (
    <div className="has-text-centered">
      <h1 className="subtitle">{messages[game.state]?.(activePlayerName)}</h1>
    </div>
  );
};

export default StatusBar;

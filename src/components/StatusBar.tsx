import React, { FC } from "react";
import { Game, GameState } from "../gameTypes";
import { usePlayerId } from "./playerId";

export interface StatusBarProps {
  game: Game;
}

const messages: Record<GameState, (activePlayer: string) => string> = {
  pregame: () => "Waiting for players to join",
  selectingQuestion: activePlayer =>
    `Waiting for ${activePlayer} to pick a question`,
  displayingQuestion: () => `Waiting for the host to stop speakin`,
  awaitingBuzzIn: activePlayer =>
    `Waiting for ${activePlayer} to answer the question`,
  judgingAnswer: activePlayer =>
    `Waiting for ${activePlayer} to answer and be judged`,
  finalWager: () => "",
  finalAnswer: () => "",
  finalJudging: () => "",
  endgame: () => "You're still here? It's over. Go home. Go!"
};

export const getPlayerName = (
  game: Game,
  playerId: string,
  titleCase?: boolean
) => {
  if (game.activePlayer === playerId) {
    return titleCase ? "You" : "you";
  } else {
    return (game.activePlayer && game.players[game.activePlayer]?.name) ?? "";
  }
};

const StatusBar: FC<StatusBarProps> = ({ game }) => {
  const playerId = usePlayerId();

  const activePlayerName = getPlayerName(game, playerId);

  return (
    <div className="has-text-centered">
      <h1 className="subtitle">
        {game.activePlayer === playerId && (
          <span className="icon has-text-warning">
            <i className="fas fa-exclamation-triangle"></i>
          </span>
        )}
        {messages[game.state]?.(activePlayerName)}
      </h1>
    </div>
  );
};

export default StatusBar;

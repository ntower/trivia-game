import React, { FC } from "react";
import { Game } from "../gameTypes";
import QuestionGrid from "./QuestionGrid";
import StatusBar from "./StatusBar";
import ScoreBoard from "./ScoreBoard";
import { usePlayerId } from "./playerId";
import RoleBar from "./RoleBar";
import QuestionModal from "./QuestionModal";
import JoinGameModal from "./JoinGameModal";
import FinalModal from "./FinalModal";

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
  const playerId = usePlayerId();
  const role = getRole(game, playerId);

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

      {role === "none" ? (
        <JoinGameModal game={game} />
      ) : game.state === "displayingQuestion" ||
        game.state === "awaitingBuzzIn" ||
        game.state === "judgingAnswer" ? (
        <QuestionModal game={game} />
      ) : ["finalWager", "finalAnswer", "finalJudging"].includes(game.state) ? (
        <FinalModal game={game} />
      ) : null}
    </>
  );
};

export default GameBoard;

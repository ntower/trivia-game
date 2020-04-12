import React, { FC } from "react";
import { Game } from "../gameTypes";
import Wager from "./FinalWager";
import Answer from "./FinalAnswer";
import Judging from "./FinalJudging";

export interface FinalModalProps {
  game: Game;
}

const FinalModal: FC<FinalModalProps> = ({ game }) => {
  return (
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div className="modal-content">
        <div className="box">
          <h2 className="title">Final question</h2>
          {game.state === "finalWager" ? (
            <Wager game={game} />
          ) : game.state === "finalAnswer" ? (
            <Answer game={game} />
          ) : game.state === "finalJudging" ? (
            <Judging game={game} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default FinalModal;

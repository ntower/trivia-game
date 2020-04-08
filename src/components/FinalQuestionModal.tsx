import React, { FC } from "react";
import { Game } from "../gameTypes";
import { usePlayerId } from "./playerId";
import { getRole } from "./GameBoard";
import { getActivePlayerName } from "./StatusBar";

export interface FinalQuestionModalProps {
  game: Game;
}

const FinalQuestionModal: FC<FinalQuestionModalProps> = ({ game }) => {
  const playerId = usePlayerId();
  const role = getRole(game, playerId);

  return (
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div className="modal-content">
        <div className="box">
          <h2 className="title">Final question</h2>
          {game.state === "finalWager" ? (
            <>
              <p>Category: {game.finalQuestion.category}</p>
              <br />
              {role === "player" ? (
                <>
                  <div className="field">
                    <label className="label">Wager</label>
                    <div className="control">
                      <input
                        className="input is-medium"
                        type="number"
                        placeholder={`You have $${game.players[playerId].score}`}
                      />
                    </div>
                  </div>

                  <button
                    // onClick={submitWager}
                    className="button is-info is-large"
                    disabled={game.barredFromBuzzingIn[playerId]}
                  >
                    Submit Wager
                  </button>
                </>
              ) : (
                <p>Players are entering their wagers</p>
              )}
            </>
          ) : (
            game.state === "finalAnswer" && (
              <>
                <p>{game.finalQuestion.text}</p>
                <br />
                {role === "player" ? (
                  <>
                    <div className="field">
                      <label className="label">Solution</label>
                      <div className="control">
                        <input className="input is-medium" type="number" />
                      </div>
                    </div>
                    <button
                      // onClick={submitSOlution}
                      className="button is-info is-large"
                      disabled={game.barredFromBuzzingIn[playerId]}
                    >
                      Submit Solution
                    </button>
                  </>
                ) : (
                  <p>Players are entering their solutions</p>
                )}
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default FinalQuestionModal;

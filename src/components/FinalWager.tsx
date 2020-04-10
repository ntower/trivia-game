import React, { FC, useState } from "react";
import { Game } from "../gameTypes";
import { usePlayerId } from "./playerId";
import { getRole } from "./GameBoard";
import { firestore } from "firebase";

export interface WagerProps {
  game: Game;
}

const Wager: FC<WagerProps> = ({ game }) => {
  const playerId = usePlayerId();
  const role = getRole(game, playerId);
  const [wager, setWager] = useState<number | undefined>(
    game.players[playerId]?.finalWager
  );

  const hasPlacedWager = game.players[playerId]?.finalWager !== undefined;

  const submitWager = () => {
    if (wager === undefined) {
      return;
    }

    // A transaction is used to make sure someone moves the game to
    // the next state, and only when appropriate
    const gameRef = firestore().collection("games").doc(game.gameId);
    firestore().runTransaction(async t => {
      const doc = await t.get(gameRef);
      const latestGame = doc.data() as Game;
      const updatePayload: firestore.UpdateData = {
        [`players.${playerId}.finalWager`]: wager
      };
      const everyoneHasWagered = Object.values(latestGame.players).every(
        player =>
          player.playerId === playerId || player.finalWager !== undefined
      );
      if (everyoneHasWagered) {
        updatePayload.state = "finalAnswer";
      }
      t.update(gameRef, updatePayload);
    });
  };

  return (
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
                defaultValue={wager}
                onChange={e => setWager(+e.target.value)}
                disabled={hasPlacedWager}
                placeholder={`You have $${game.players[playerId].score}`}
              />
            </div>
          </div>
          <button
            onClick={submitWager}
            className="button is-info is-large"
            disabled={
              hasPlacedWager ||
              wager === undefined ||
              wager < 0 ||
              wager > Math.max(0, game.players[playerId].score)
            }
          >
            Submit Wager
          </button>
          {hasPlacedWager && (
            <h2 className="subtitle">Waiting for other players to wager</h2>
          )}
        </>
      ) : (
        <p>Players are entering their wagers</p>
      )}
    </>
  );
};

export default Wager;

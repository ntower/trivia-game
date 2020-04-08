import React, { FC, useState, useEffect } from "react";
import { firestore } from "firebase";
import { Game } from "../gameTypes";
import { Link, useHistory } from "react-router-dom";
import { usePlayerId } from "./playerId";

export interface HomeProps {}

const numCategories = 6;
const questionsPerCategory = 5;

const placeholderValues = [200, 400, 600, 800, 1000];
const placeholderNames = [
  "Dinosaurs",
  "Star Trek",
  "Ancient Rome",
  "Harry Potter",
  "Disney",
  "AWS"
];

const Home: FC<HomeProps> = props => {
  const history = useHistory();
  const [name, setName] = useState("");
  const playerId = usePlayerId();

  const [gameList, setGameList] = useState<Game[]>([]);
  useEffect(() => {
    firestore()
      .collection("games")
      .onSnapshot(
        snapshot => {
          setGameList(snapshot.docs.map(doc => doc.data() as Game));
        },
        err => setGameList([])
      );
  }, []);

  const createNewGame = async () => {
    const ref = firestore().collection("games").doc();
    const game: Game = {
      gameId: ref.id,
      name,
      state: "pregame",
      activePlayer: null,
      activeQuestion: null,
      lastPlayerToSuccessfullyAnswer: null,
      hostId: playerId,
      barredFromBuzzingIn: {},
      players: {},
      currentRound: 1,
      round1: {},
      round2: {},
      finalQuestion: {
        category: "category",
        text: "final question text",
        solution: "final question solution"
      }
    };
    for (let i = 0; i < numCategories; i++) {
      game.round1[i] = {
        categoryId: "" + i,
        ordinal: i,
        title: placeholderNames[i] ?? `Category ${i + 1}`,
        questions: {}
      };
      game.round2[i] = {
        categoryId: "" + i,
        ordinal: i,
        title: placeholderNames[i] ?? `Category ${i + 1}`,
        questions: {}
      };
      for (let j = 0; j < questionsPerCategory; j++) {
        game.round1[i].questions[j] = {
          questionId: "" + j,
          ordinal: j,
          score: placeholderValues[j] || 42,
          text: `Back ${j + 1}`,
          solution: "",
          faceUp: i === 0 && j === 0
        };
        game.round2[i].questions[j] = {
          questionId: "" + j,
          ordinal: j,
          score: placeholderValues[j] * 2 || 42,
          text: `Back ${j + 1}`,
          solution: "",
          faceUp: true
        };
      }
    }
    await ref.set(game);
    history.push(`/game/${ref.id}`);
  };

  return (
    <div className="hero-body">
      <div className="container has-text-centered">
        <div className="column is-6 is-offset-3">
          <h1 className="title">Start a game</h1>
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
                  placeholder="Name your game"
                />
              </p>
              <p className="control">
                <button
                  disabled={!name}
                  onClick={createNewGame}
                  className="button is-info"
                >
                  Go!
                </button>
              </p>
            </div>
          </div>
          {gameList.length > 0 && (
            <>
              <h2 className="title is-4">Or choose an existing game</h2>
              {gameList.map(game => (
                <React.Fragment key={game.gameId}>
                  <Link key={game.gameId} to={`/game/${game.gameId}`}>
                    {game.name || game.gameId}
                  </Link>
                  <br />
                </React.Fragment>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

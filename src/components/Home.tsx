import React, { FC, useState, useEffect } from "react";
import { firestore } from "firebase";
import { Game } from "../gameTypes";
import { Link, useHistory } from "react-router-dom";

export interface HomeProps {}

const numCategories = 6;
const questionsPerCategory = 5;

const Home: FC<HomeProps> = props => {
  const history = useHistory();

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
    const ref = firestore()
      .collection("games")
      .doc();
    const game: Game = {
      gameId: ref.id,
      categories: {}
    };
    for (let i = 0; i < numCategories; i++) {
      game.categories[i] = {
        categoryId: "" + i,
        ordinal: i,
        title: `Category ${i + 1}`,
        questions: {}
      };
      for (let j = 0; j < questionsPerCategory; j++) {
        game.categories[i].questions[j] = {
          questionId: "" + j,
          ordinal: j,
          frontText: `Front ${j + 1}`,
          backText: `Back ${j + 1}`,
          faceUp: true
        };
      }
    }
    await ref.set(game);
    history.push(`/game/${ref.id}`);
  };

  return (
    <div>
      <button onClick={createNewGame}>Create new game</button>
      <h1>Or choose existing game</h1>
      {gameList.map(game => (
        <React.Fragment key={game.gameId}>
          <Link key={game.gameId} to={`/game/${game.gameId}`}>
            {game.gameId}
          </Link>
          <br />
        </React.Fragment>
      ))}
    </div>
  );
};

export default Home;

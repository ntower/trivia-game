import React, { FC, useState, useEffect } from "react";
import { firestore } from "firebase";
import { Game } from "../gameTypes";
import { Link } from "react-router-dom";

export interface HomeProps {}

const Home: FC<HomeProps> = props => {
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
  return (
    <div>
      <h1>Choose game</h1>
      {gameList.map(game => (
        <Link key={game.gameId} to={`/game/${game.gameId}`}>
          {game.gameId}
        </Link>
      ))}
    </div>
  );
};

export default Home;

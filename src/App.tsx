import React, { FC, useEffect, useState } from "react";
import "./App.css";
import GameBoard from "./components/GameBoard";
import * as firebase from "firebase/app";
import "firebase/firestore";
import { Game } from "./gameTypes";

const firebaseConfig = {
  apiKey: "AIzaSyDpKlHRPvOCSYJYqtszJkG_RojmpmxqRes",
  authDomain: "trivia-game-b73b4.firebaseapp.com",
  databaseURL: "https://trivia-game-b73b4.firebaseio.com",
  projectId: "trivia-game-b73b4",
  storageBucket: "trivia-game-b73b4.appspot.com",
  messagingSenderId: "533514635817",
  appId: "1:533514635817:web:de8dc78e5582b831e8ea38",
  measurementId: "G-RSH51D4KYC"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const App: FC = () => {
  const [game, setGame] = useState<null | Game>(null);
  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("games")
      .doc("uZxitGIhgaDeg8qBXCmH")
      .onSnapshot(snapshot => {
        const data = snapshot.data();
        if (data) {
          setGame(data as Game);
        } else {
          setGame(null);
        }
      });
    return unsubscribe;
  }, []);
  return <div className="App">{game && <GameBoard game={game} />}</div>;
};

export default App;

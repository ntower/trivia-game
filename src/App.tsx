import React, { FC, useState, useEffect } from "react";
import "./App.css";
import * as firebase from "firebase/app";
import "firebase/firestore";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import GamePage from "./components/GamePage";
import { PlayerIdContext } from "./components/playerId";
import { v4 } from "uuid";

const firebaseConfig = {
  apiKey: "AIzaSyDpKlHRPvOCSYJYqtszJkG_RojmpmxqRes",
  authDomain: "trivia-game-b73b4.firebaseapp.com",
  databaseURL: "https://trivia-game-b73b4.firebaseio.com",
  projectId: "trivia-game-b73b4",
  storageBucket: "trivia-game-b73b4.appspot.com",
  messagingSenderId: "533514635817",
  appId: "1:533514635817:web:de8dc78e5582b831e8ea38",
  measurementId: "G-RSH51D4KYC",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const App: FC = () => {
  const [playerId] = useState(() => {
    const fromStorage = sessionStorage.getItem("playerId");
    return fromStorage || v4();
  });

  useEffect(() => {
    sessionStorage.setItem("playerId", playerId);
  });

  return (
    <BrowserRouter>
      <PlayerIdContext.Provider value={playerId}>
        <div>
          <Switch>
            <Route path="/game/:gameId" component={GamePage} />
            <Route path="/" component={Home} />
          </Switch>
        </div>
      </PlayerIdContext.Provider>
    </BrowserRouter>
  );
};

export default App;

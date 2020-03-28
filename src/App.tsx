import React, { FC } from "react";
import "./App.css";
import GameBoard from "./components/GameBoard";
import * as firebase from "firebase/app";
import "firebase/firestore";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./components/Home";

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
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route path="/game/:gameId" component={GameBoard} />
          <Route path="/" component={Home} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default App;

export type GameState =
  | "pregame"
  | "selectingQuestion"
  | "displayingQuestion"
  | "awaitingAnswer"
  | "displayingFinal"
  | "judgingFinal";

export interface Game {
  gameId: string;
  name: string;
  state: GameState;
  /**
   * The id of the player who needs to make the next action
   */
  activePlayer: string | null;
  lastPlayerToSuccessfullyAnswer: string | null;
  activeQuestion: Question | null;
  hostId: string;
  /**
   * Players who have buzzed in and given a wrong answer
   */
  barredFromBuzzingIn: {
    [playerId: string]: true;
  };
  players: {
    [playerId: string]: Player;
  };
  currentRound: 1 | 2 | "final";
  round1: CategoryCollection;
  round2: CategoryCollection;
  finalJeopardy: FinalQuestion;
}

export interface CategoryCollection {
  [categoryId: string]: Category;
}

export interface Player {
  playerId: string;
  name: string;
  score: number;
}

export interface Category {
  categoryId: string;
  ordinal: number;
  title: string;
  questions: {
    [key: string]: Question;
  };
}

export interface Question {
  questionId: string;
  ordinal: number;
  score: number;
  text: string;
  solution: string;
  faceUp: boolean;
}

export interface FinalQuestion {
  text: string;
  solution: string;
}

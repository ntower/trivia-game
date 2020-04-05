export type GameState =
  | "pregame"
  | "selectingQuestion"
  | "displayingQuestion"
  | "awaitingAnswer";

export interface Game {
  gameId: string;
  name: string;
  state: GameState;
  activePlayer: string | null;
  activeQuestion: Question | null;
  hostId: string;
  players: {
    [key: string]: Player;
  };
  categories: {
    [key: string]: Category;
  };
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
  faceUp: boolean;
}

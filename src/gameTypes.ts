export interface Game {
  gameId: string;
  board: {
    cards: {
      [key: string]: Card;
    };
  };
}

export interface Card {
  cardId: string;
  faceUp: boolean;
  text: string;
}

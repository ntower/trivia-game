export interface Game {
  gameId: string;
  categories: {
    [key: string]: Category;
  };
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
  frontText: string;
  backText: string;
  faceUp: boolean;
}

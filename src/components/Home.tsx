import React, { FC, useState, useEffect } from "react";
import { firestore } from "firebase";
import { Game, GameTemplate } from "../gameTypes";
import { Link, useHistory } from "react-router-dom";
import { usePlayerId } from "./playerId";

export interface HomeProps {}

// const numCategories = 6;
// const questionsPerCategory = 5;

// const placeholderValues = [200, 400, 600, 800, 1000];
// const placeholderNames = [
//   "Dinosaurs",
//   "Star Trek",
//   "Ancient Rome",
//   "Harry Potter",
//   "Disney",
//   "AWS"
// ];

interface FrontPageData {
  header?: string;
  subheader?: string;
}

const Home: FC<HomeProps> = (props) => {
  const history = useHistory();
  // const [name, setName] = useState("");
  const playerId = usePlayerId();

  const [frontPage, setFrontPage] = useState<FrontPageData | null>(null);
  useEffect(() => {
    return firestore()
      .collection("general")
      .doc("frontpage")
      .onSnapshot(
        (snapshot) => {
          setFrontPage(snapshot.data() as FrontPageData);
        },
        (err) => setGameList([])
      );
  });

  const [gameList, setGameList] = useState<Game[]>([]);
  useEffect(() => {
    return firestore()
      .collection("games")
      .onSnapshot(
        (snapshot) => {
          setGameList(snapshot.docs.map((doc) => doc.data() as Game));
        },
        (err) => setGameList([])
      );
  }, []);

  const [templateList, setTemplateList] = useState<GameTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const selectedTemplate = templateList.find(
    (template) => template.templateId === selectedTemplateId
  );
  useEffect(() => {
    return firestore()
      .collection("templates")
      .onSnapshot(
        (snapshot) => {
          const templates = snapshot.docs
            .map((doc) => doc.data() as GameTemplate)
            .filter((template) => !template.hidden);
          setTemplateList(templates);
          if (!selectedTemplateId) {
            setSelectedTemplateId(templates[0]?.templateId ?? "");
          }
        },
        (err) => setTemplateList([])
      );
  }, [selectedTemplateId]);

  const createNewGame = async () => {
    if (!selectedTemplate) {
      return;
    }

    const ref = firestore().collection("games").doc();
    const game: Game = {
      ...selectedTemplate,
      gameId: ref.id,
      name: "",
      state: "pregame",
      activePlayer: null,
      activeQuestion: null,
      lastPlayerToSuccessfullyAnswer: null,
      hostId: playerId,
      barredFromBuzzingIn: {},
      players: {},
      currentRound: 1,
    };
    await ref.set(game);
    history.push(`/game/${ref.id}`);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const createTemplate = async () => {
    const ref = firestore().collection("templates").doc();
    const template: GameTemplate = {
      templateId: ref.id,
      name: "Ana's 2nd game",
      round1: {},
      round2: {},
      finalQuestion: {
        category: "Marvel Cinematic Universe",
        text:
          "In Guardians of the Galaxy, what is the name of the dog in the Collector Taneleer Tivan's museum?",
        solution: "Cosmo the Spacedog",
      },
    };
    template.round1 = {
      "0": {
        categoryId: "0",
        ordinal: 0,
        title: "4 Seasons",
        questions: {
          "0": {
            questionId: "0",
            ordinal: 0,
            score: 200,
            text:
              "The time when the sun reaches its highest or lowest point at noon, resulting in the shortest and longest days of the year.",
            faceUp: true,
            solution: "Solstice",
          },
          "1": {
            questionId: "1",
            ordinal: 1,
            score: 400,
            text: "What is the first summer month in South America?",
            faceUp: true,
            solution: "December",
          },
          "2": {
            questionId: "2",
            ordinal: 2,
            score: 600,
            text:
              "The holiday which celebrates the Anniversary of the Battle of Puebla",
            faceUp: true,
            solution: "Cinco de Mayo",
          },
          "3": {
            questionId: "3",
            ordinal: 3,
            score: 800,
            text:
              "Several deciduous plants in your garden have just gone through the process of abscission. What season is it?",
            faceUp: true,
            solution: "Autumn",
          },
          "4": {
            questionId: "4",
            ordinal: 4,
            score: 1000,
            text:
              "Each spring and fall, ducks and geese migrate from one feeding ground to another along certain routes. These migration routes are called ___",
            faceUp: true,
            solution: "Flyways",
          },
        },
      },
      "1": {
        categoryId: "1",
        ordinal: 1,
        title: "Lets go to the Zoo",
        questions: {
          "0": {
            questionId: "0",
            ordinal: 0,
            score: 200,
            text: "A group of lions is called ___",
            faceUp: true,
            solution: "A pride",
          },
          "1": {
            questionId: "1",
            ordinal: 1,
            score: 400,
            text: "How many heart chambers does a cockroach have?",
            faceUp: true,
            solution: "12",
          },
          "2": {
            questionId: "2",
            ordinal: 2,
            score: 600,
            text: "Which bird is a universal symbol of peace?",
            faceUp: true,
            solution: "Dove",
          },
          "3": {
            questionId: "3",
            ordinal: 3,
            score: 800,
            text: "What type of creature is a mandrill?",
            faceUp: true,
            solution: "Monkey",
          },
          "4": {
            questionId: "4",
            ordinal: 4,
            score: 1000,
            text: "Where is the heart of the shrimp situated?",
            faceUp: true,
            solution: "In the Head",
          },
        },
      },
      "2": {
        categoryId: "2",
        ordinal: 2,
        title: "Sport",
        questions: {
          "0": {
            questionId: "0",
            ordinal: 0,
            score: 200,
            text:
              "Which boxer was known as “The Greatest” and “The People’s Champion”",
            faceUp: true,
            solution: "Muhammad Ali",
          },
          "1": {
            questionId: "1",
            ordinal: 1,
            score: 400,
            text: "Which Williams sister has won more Grand Slam titles?",
            faceUp: true,
            solution: "Serena",
          },
          "2": {
            questionId: "2",
            ordinal: 2,
            score: 600,
            text:
              "How many soccer players should each team have on the field at the start of each match?",
            faceUp: true,
            solution: "11",
          },
          "3": {
            questionId: "3",
            ordinal: 3,
            score: 800,
            text:
              "When Michael Jordan played for the Chicago Bulls, how many NBA Championships did he win?",
            faceUp: true,
            solution: "6",
          },
          "4": {
            questionId: "4",
            ordinal: 4,
            score: 1000,
            text:
              "In what year was the first ever Wimbledon Championship held?",
            faceUp: true,
            solution: "1877",
          },
        },
      },
      "3": {
        categoryId: "3",
        ordinal: 3,
        title: "Auto",
        questions: {
          "0": {
            questionId: "0",
            ordinal: 0,
            score: 200,
            text: "Which animal can be seen on the Porsche logo?",
            faceUp: true,
            solution: "Horse",
          },
          "1": {
            questionId: "1",
            ordinal: 1,
            score: 400,
            text: "Which companies are part of the Big Three?",
            faceUp: true,
            solution:
              "General Motors, Fiat Chrysler Automobiles and Ford Motor Company",
          },
          "2": {
            questionId: "2",
            ordinal: 2,
            score: 600,
            text: "Which auto brand was the first to offer seat belts?",
            faceUp: true,
            solution: "Nash Motors",
          },
          "3": {
            questionId: "3",
            ordinal: 3,
            score: 800,
            text: "What does BMW stand for (in English)?",
            faceUp: true,
            solution: "Bavarian Motor Works",
          },
          "4": {
            questionId: "4",
            ordinal: 4,
            score: 1000,
            text:
              "Which company owns Bugatti, Lamborghini. Audi, Porsche and Ducati?",
            faceUp: true,
            solution: "Volkswagen",
          },
        },
      },
      "4": {
        categoryId: "4",
        ordinal: 4,
        title: "Movies",
        questions: {
          "0": {
            questionId: "0",
            ordinal: 0,
            score: 200,
            text:
              "What are the dying words of Charles Foster Kane in Citizen Kane?",
            faceUp: true,
            solution: "Rosebud",
          },
          "1": {
            questionId: "1",
            ordinal: 1,
            score: 400,
            text:
              "For what movie did Tom Hanks score his first Academy Award nomination?",
            faceUp: true,
            solution: "Big",
          },
          "2": {
            questionId: "2",
            ordinal: 2,
            score: 600,
            text: "What’s the name of the skyscraper in Die Hard?",
            faceUp: true,
            solution: "Nakatomi Plaza",
          },
          "3": {
            questionId: "3",
            ordinal: 3,
            score: 800,
            text:
              "The head of what kind of animal is front-and-center in an infamous scene from The Godfather?",
            faceUp: true,
            solution: "A horse",
          },
          "4": {
            questionId: "4",
            ordinal: 4,
            score: 1000,
            text:
              "In what 1976 thriller does Robert De Niro famously say “You talkin’ to me?”",
            faceUp: true,
            solution: "Taxi Driver",
          },
        },
      },
      "5": {
        categoryId: "5",
        ordinal: 5,
        title: "Music to my ears",
        questions: {
          "0": {
            questionId: "0",
            ordinal: 0,
            score: 200,
            text:
              "What was the name of the group Justin Timberlake used to be part of?",
            faceUp: true,
            solution: "N’ SYNC",
          },
          "1": {
            questionId: "1",
            ordinal: 1,
            score: 400,
            text: "Which British girl group had a member by the name of Mel B?",
            faceUp: true,
            solution: "Spice Girls",
          },
          "2": {
            questionId: "2",
            ordinal: 2,
            score: 600,
            text: "Which country did AC/DC originate in?",
            faceUp: true,
            solution: "Australia",
          },
          "3": {
            questionId: "3",
            ordinal: 3,
            score: 800,
            text:
              "Which song by Luis Fonsi and Daddy Yankee has the most views (of all time) on YouTube?",
            faceUp: true,
            solution: "Despacito",
          },
          "4": {
            questionId: "4",
            ordinal: 4,
            score: 1000,
            text: "Which musical legend is Jay-Z married to?",
            faceUp: true,
            solution: "Beyonce",
          },
        },
      },
    };
    template.round2 = {
      "0": {
        categoryId: "0",
        ordinal: 0,
        title: "Art",
        questions: {
          "0": {
            questionId: "0",
            ordinal: 0,
            score: 400,
            text:
              "Girl with a Pearl Earring is an oil painting by which Dutch Golden Age painter?",
            faceUp: true,
            solution: "Johannes Vermeer",
          },
          "1": {
            questionId: "1",
            ordinal: 1,
            score: 800,
            text:
              "What Italian sculptor and architect is credited with creating the Baroque style of sculpture?",
            faceUp: true,
            solution: "Gian Lorenzo Bernini",
          },
          "2": {
            questionId: "2",
            ordinal: 2,
            score: 1200,
            text:
              "Militia Company of District II under the Command of Captain Frans Banninck Cocq, a painting by Rembrandt, is better known by what name?",
            faceUp: true,
            solution: "The Night Watch",
          },
          "3": {
            questionId: "3",
            ordinal: 3,
            score: 1600,
            text:
              "Leonardo Davinci’s 15th-century mural, The Last Supper, is located in what city?",
            faceUp: true,
            solution: "Milan, Italy",
          },
          "4": {
            questionId: "4",
            ordinal: 4,
            score: 2000,
            text:
              "Jim Davis was the cartoonist behind which widely syndicated comic strip?",
            faceUp: true,
            solution: "Garfield",
          },
        },
      },
      "1": {
        categoryId: "1",
        ordinal: 1,
        title: "Entertainment",
        questions: {
          "0": {
            questionId: "0",
            ordinal: 0,
            score: 400,
            text: "Who played George Costanza on the TV show 'Seinfeld'?",
            faceUp: true,
            solution: "Jason Alexander",
          },
          "1": {
            questionId: "1",
            ordinal: 1,
            score: 800,
            text: `How many roles did Cheech Marin play in the 1996 movie "From Dusk Till Dawn"?`,
            faceUp: true,
            solution: "3",
          },
          "2": {
            questionId: "2",
            ordinal: 2,
            score: 1200,
            text:
              "On what TV series did Katie Holmes first achieve stardom from 1998 to 2003?",
            faceUp: true,
            solution: "Dawson's Creek",
          },
          "3": {
            questionId: "3",
            ordinal: 3,
            score: 1600,
            text: `Who directed the 1968 "Planet of the Apes" movie?`,
            faceUp: true,
            solution: "Franklin J. Schaffner",
          },
          "4": {
            questionId: "4",
            ordinal: 4,
            score: 2000,
            text: `Who narrated the 2007 movie "Enchanted"?`,
            faceUp: true,
            solution: "Julie Andrews",
          },
        },
      },
      "2": {
        categoryId: "2",
        ordinal: 2,
        title: "Food at the Table",
        questions: {
          "0": {
            questionId: "0",
            ordinal: 0,
            score: 400,
            text: "Which food is the leading source of salmonella poisoning?",
            faceUp: true,
            solution: "Chicken",
          },
          "1": {
            questionId: "1",
            ordinal: 1,
            score: 800,
            text: "What name does deer meat go by?",
            faceUp: true,
            solution: "Venison",
          },
          "2": {
            questionId: "2",
            ordinal: 2,
            score: 1200,
            text: "What’s the primary ingredient in hummus?",
            faceUp: true,
            solution: "Chickpeas",
          },
          "3": {
            questionId: "3",
            ordinal: 3,
            score: 1600,
            text: "Which country produces the most coffee in the world?",
            faceUp: true,
            solution: "Brazil",
          },
          "4": {
            questionId: "4",
            ordinal: 4,
            score: 2000,
            text: "Which kind of alcohol is Russia notoriously known for?",
            faceUp: true,
            solution: "Vodka",
          },
        },
      },
      "3": {
        categoryId: "3",
        ordinal: 3,
        title: "US History",
        questions: {
          "0": {
            questionId: "0",
            ordinal: 0,
            score: 400,
            text:
              "What US first lady helped draft the Universal Declaration of Human Rights?",
            faceUp: true,
            solution: "Eleanor Roosevelt",
          },
          "1": {
            questionId: "1",
            ordinal: 1,
            score: 800,
            text: "What nickname was given to President Andrew Jackson?",
            faceUp: true,
            solution: "Old Hickory",
          },
          "2": {
            questionId: "2",
            ordinal: 2,
            score: 1200,
            text:
              "What bird did Benjamin Franklin favor for America's national emblem?",
            faceUp: true,
            solution: "The turkey",
          },
          "3": {
            questionId: "3",
            ordinal: 3,
            score: 1600,
            text: "Which former US president was a Peanut Farmer?",
            faceUp: true,
            solution: "Jimmy Carter",
          },
          "4": {
            questionId: "4",
            ordinal: 4,
            score: 2000,
            text:
              "Who was the oldest signer of the US Declaration of Independence?",
            faceUp: true,
            solution: "Benjamin Franklin",
          },
        },
      },
      "4": {
        categoryId: "4",
        ordinal: 4,
        title: "Around the World",
        questions: {
          "0": {
            questionId: "0",
            ordinal: 0,
            score: 400,
            text: "What country administers Greenland?",
            faceUp: true,
            solution: "Denmark",
          },
          "1": {
            questionId: "1",
            ordinal: 1,
            score: 800,
            text: "What interstate highway connects Boston and Seattle?",
            faceUp: true,
            solution: "I-90",
          },
          "2": {
            questionId: "2",
            ordinal: 2,
            score: 1200,
            text: "What Pacific Ocean trench is the deepest in the world?",
            faceUp: true,
            solution: "Mariana Trench",
          },
          "3": {
            questionId: "3",
            ordinal: 3,
            score: 1600,
            text:
              "The Caribbean island of Aruba is part of what European kingdom?",
            faceUp: true,
            solution: "The Netherlands",
          },
          "4": {
            questionId: "4",
            ordinal: 4,
            score: 2000,
            text: "What is the Japanese name for Japan?",
            faceUp: true,
            solution: "Nippon",
          },
        },
      },
      "5": {
        categoryId: "5",
        ordinal: 5,
        title: "Web Developers",
        questions: {
          "0": {
            questionId: "0",
            ordinal: 0,
            score: 400,
            text: "What tags do you use to create a numbered list?",
            faceUp: true,
            solution: "<ol>",
          },
          "1": {
            questionId: "1",
            ordinal: 1,
            score: 800,
            text: "What does HTML stand for?",
            faceUp: true,
            solution: "Hyper-Text Markup Language",
          },
          "2": {
            questionId: "2",
            ordinal: 2,
            score: 1200,
            text: "How many sections does a spider's body have?",
            faceUp: true,
            solution: "2",
          },
          "3": {
            questionId: "3",
            ordinal: 3,
            score: 1600,
            text: "Where are the respiratory systems of spider found?",
            faceUp: true,
            solution: "The abdomen",
          },
          "4": {
            questionId: "4",
            ordinal: 4,
            score: 2000,
            text:
              "Who is the current Spider-Man in the Marvel Cinematic Universe?",
            faceUp: true,
            solution: "Tom Holland",
          },
        },
      },
    };

    // for (let i = 0; i < numCategories; i++) {
    //   game.round1[i] = {
    //     categoryId: "" + i,
    //     ordinal: i,
    //     title: placeholderNames[i] ?? `Category ${i + 1}`,
    //     questions: {}
    //   };
    //   game.round2[i] = {
    //     categoryId: "" + i,
    //     ordinal: i,
    //     title: placeholderNames[i] ?? `Category ${i + 1}`,
    //     questions: {}
    //   };
    //   for (let j = 0; j < questionsPerCategory; j++) {
    //     game.round1[i].questions[j] = {
    //       questionId: "" + j,
    //       ordinal: j,
    //       score: placeholderValues[j] || 42,
    //       text: `Back ${j + 1}`,
    //       solution: "",
    //       faceUp: i === 0 && j === 0
    //     };
    //     game.round2[i].questions[j] = {
    //       questionId: "" + j,
    //       ordinal: j,
    //       score: placeholderValues[j] * 2 || 42,
    //       text: `Back ${j + 1}`,
    //       solution: "",
    //       faceUp: i === 0 && j === 0
    //     };
    //   }
    // }
    await ref.set(template);
  };

  return (
    <div className="hero-body">
      <div className="container has-text-centered">
        <div className="column is-6 is-offset-3">
          {frontPage && (
            <div className="box">
              <h1 className="title">{frontPage.header}</h1>
              <h2 className="title is-4">{frontPage.subheader}</h2>
            </div>
          )}
          <h1 className="title">Start a game</h1>
          <div className="box">
            <div className="field is-grouped">
              <p className="select" style={{ width: "100%" }}>
                <select
                  style={{ width: "100%" }}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                >
                  {templateList.map((template) => (
                    <option
                      key={template.templateId}
                      value={template.templateId}
                    >
                      {template.name}
                    </option>
                  ))}
                </select>
              </p>
              <p className="control">
                <button
                  disabled={!selectedTemplate}
                  onClick={createNewGame}
                  className="button is-info"
                >
                  Load template
                </button>
              </p>
            </div>
          </div>
          {gameList.length > 0 && (
            <>
              <h2 className="title is-4">Or join an existing game</h2>
              {gameList.map((game) => (
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

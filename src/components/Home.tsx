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

const Home: FC<HomeProps> = props => {
  const history = useHistory();
  // const [name, setName] = useState("");
  const playerId = usePlayerId();

  const [gameList, setGameList] = useState<Game[]>([]);
  useEffect(() => {
    return firestore()
      .collection("games")
      .onSnapshot(
        snapshot => {
          setGameList(snapshot.docs.map(doc => doc.data() as Game));
        },
        err => setGameList([])
      );
  }, []);

  const [templateList, setTemplateList] = useState<GameTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const selectedTemplate = templateList.find(
    template => template.templateId === selectedTemplateId
  );
  useEffect(() => {
    return firestore()
      .collection("templates")
      .onSnapshot(
        snapshot => {
          const templates = snapshot.docs.map(
            doc => doc.data() as GameTemplate
          );
          setTemplateList(templates);
          if (!selectedTemplateId) {
            setSelectedTemplateId(templates[0]?.templateId ?? "");
          }
        },
        err => setTemplateList([])
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
      currentRound: 1
    };
    await ref.set(game);
    history.push(`/game/${ref.id}`);
  };

  // const createNewGame = async () => {
  //   const ref = firestore().collection("templates").doc();
  //   const game: GameTemplate = {
  //     name,
  //     round1: {},
  //     round2: {},
  //     finalQuestion: {
  //       category: "category",
  //       text: "final question text",
  //       solution: "final question solution"
  //     }
  //   };
  //   game.round1 = {
  //     "0": {
  //       categoryId: "0",
  //       ordinal: 0,
  //       title: "Dinos",
  //       questions: {
  //         "0": {
  //           questionId: "0",
  //           ordinal: 0,
  //           score: 200,
  //           text: "What dinosaur means?",
  //           faceUp: true,
  //           solution: "fearfully large lizard"
  //         },
  //         "1": {
  //           questionId: "1",
  //           ordinal: 1,
  //           score: 400,
  //           text: 'What dinosaur name means "fast thief”?',
  //           faceUp: true,
  //           solution: "Velociraptor"
  //         },
  //         "2": {
  //           questionId: "2",
  //           ordinal: 2,
  //           score: 600,
  //           text: "Which dinosaur had fifteen horns?",
  //           faceUp: true,
  //           solution: "Kosmoceratops"
  //         },
  //         "3": {
  //           questionId: "3",
  //           ordinal: 3,
  //           score: 800,
  //           text: "What would a sauropod use gastroliths for?",
  //           faceUp: true,
  //           solution:
  //             "To grind food in animals lacking suitable grinding teeth. Polished pebbles occasionally found within skeletons of giant herbivorous sauropod dinosaurs are very likely to be gastroliths."
  //         },
  //         "4": {
  //           questionId: "4",
  //           ordinal: 4,
  //           score: 1000,
  //           text:
  //             "How are the two groups of dinosaurs (Ornithischia and Saurischia) differentiated?",
  //           faceUp: true,
  //           solution: "hip bones"
  //         }
  //       }
  //     },
  //     "1": {
  //       categoryId: "1",
  //       ordinal: 1,
  //       title: "Superheroes",
  //       questions: {
  //         "0": {
  //           questionId: "0",
  //           ordinal: 0,
  //           score: 200,
  //           text: "What superteam includes a sentient tree-like creature?",
  //           faceUp: true,
  //           solution: "The Guardians of the Galaxy"
  //         },
  //         "1": {
  //           questionId: "1",
  //           ordinal: 1,
  //           score: 400,
  //           text:
  //             "T'Challa, the king of Wakanda, is also known as what superhero? ",
  //           faceUp: true,
  //           solution: "Black Panther."
  //         },
  //         "2": {
  //           questionId: "2",
  //           ordinal: 2,
  //           score: 600,
  //           text: "Who is the Scarlet Witch's twin brother?",
  //           faceUp: true,
  //           solution: "Quicksilver"
  //         },
  //         "3": {
  //           questionId: "3",
  //           ordinal: 3,
  //           score: 800,
  //           text: "Who played the Joker in the 1960s Batman television series?",
  //           faceUp: true,
  //           solution: "Cesar Romero. "
  //         },
  //         "4": {
  //           questionId: "4",
  //           ordinal: 4,
  //           score: 1000,
  //           text: "Edwin Jarvis serves as butler to what super team?",
  //           faceUp: true,
  //           solution: "The Avengers"
  //         }
  //       }
  //     },
  //     "2": {
  //       categoryId: "2",
  //       ordinal: 2,
  //       title: "Disney",
  //       questions: {
  //         "0": {
  //           questionId: "0",
  //           ordinal: 0,
  //           score: 200,
  //           text:
  //             "What Disney movie was the first full-length animated feature to be produced in the United States?",
  //           faceUp: true,
  //           solution: "Snow White and the Seven Dwarfs (1937) "
  //         },
  //         "1": {
  //           questionId: "1",
  //           ordinal: 1,
  //           score: 400,
  //           text:
  //             "What is the only Disney animated feature film that has a title character who doesn't speak?",
  //           faceUp: true,
  //           solution: "Dumbo "
  //         },
  //         "2": {
  //           questionId: "2",
  //           ordinal: 2,
  //           score: 600,
  //           text:
  //             "What does the little mermaid call the fork in her collection of human objects?",
  //           faceUp: true,
  //           solution: "dinglehopper "
  //         },
  //         "3": {
  //           questionId: "3",
  //           ordinal: 3,
  //           score: 800,
  //           text:
  //             "The soundtrack of which Disney animated feature includes seven Elvis Presley songs?",
  //           faceUp: true,
  //           solution: "Lilo & Stitch "
  //         },
  //         "4": {
  //           questionId: "4",
  //           ordinal: 4,
  //           score: 1000,
  //           text:
  //             "In Alice in Wonderland, what is the name of Alice's pet kitten?",
  //           faceUp: true,
  //           solution: "Dinah "
  //         }
  //       }
  //     },
  //     "3": {
  //       categoryId: "3",
  //       ordinal: 3,
  //       title: "Star Trek",
  //       questions: {
  //         "0": {
  //           questionId: "0",
  //           ordinal: 0,
  //           score: 200,
  //           text:
  //             "Who was the first Vulcan science officer aboard the starship Enterprise?",
  //           faceUp: true,
  //           solution: "T'Pol  "
  //         },
  //         "1": {
  //           questionId: "1",
  //           ordinal: 1,
  //           score: 400,
  //           text: "Which species was the first to discover warp drive?",
  //           faceUp: true,
  //           solution: "Vulcans "
  //         },
  //         "2": {
  //           questionId: "2",
  //           ordinal: 2,
  //           score: 600,
  //           text:
  //             "Which character serves as the head of security for the space station Deep Space Nine?",
  //           faceUp: true,
  //           solution: "Odo "
  //         },
  //         "3": {
  //           questionId: "3",
  //           ordinal: 3,
  //           score: 800,
  //           text: "What type of weapons technology does a phaser use?",
  //           faceUp: true,
  //           solution: "particle-beam "
  //         },
  //         "4": {
  //           questionId: "4",
  //           ordinal: 4,
  //           score: 1000,
  //           text:
  //             "Who was the first real astronaut to appear in any Star Trek episode?",
  //           faceUp: true,
  //           solution: "Mae C. Jemison "
  //         }
  //       }
  //     },
  //     "4": {
  //       categoryId: "4",
  //       ordinal: 4,
  //       title: "Ancient History",
  //       questions: {
  //         "0": {
  //           questionId: "0",
  //           ordinal: 0,
  //           score: 200,
  //           text: "What was the first capital of ancient Egypt?",
  //           faceUp: true,
  //           solution: "Memphis"
  //         },
  //         "1": {
  //           questionId: "1",
  //           ordinal: 1,
  //           score: 400,
  //           text: "How many years did the Peloponnesian War last?",
  //           faceUp: true,
  //           solution: "27 years. "
  //         },
  //         "2": {
  //           questionId: "2",
  //           ordinal: 2,
  //           score: 600,
  //           text: "On what island did ancient Greek civilization originate?",
  //           faceUp: true,
  //           solution: "Crete."
  //         },
  //         "3": {
  //           questionId: "3",
  //           ordinal: 3,
  //           score: 800,
  //           text:
  //             "How many of the Seven Wonders of the Ancient World still exist?",
  //           faceUp: true,
  //           solution: "The Great Pyramid of Giza. "
  //         },
  //         "4": {
  //           questionId: "4",
  //           ordinal: 4,
  //           score: 1000,
  //           text:
  //             "What was the name of the military commander from Africa who marched an army with elephants into Italy over the alps in 218 BC?",
  //           faceUp: true,
  //           solution: "Hannibal"
  //         }
  //       }
  //     },
  //     "5": {
  //       categoryId: "5",
  //       ordinal: 5,
  //       title: "Harry Potter",
  //       questions: {
  //         "0": {
  //           questionId: "0",
  //           ordinal: 0,
  //           score: 200,
  //           text: "What position does Harry play on his Quidditch team?",
  //           faceUp: true,
  //           solution: "Seeker  "
  //         },
  //         "1": {
  //           questionId: "1",
  //           ordinal: 1,
  //           score: 400,
  //           text:
  //             "What is the name of enormous three-headed dog that guards the passageway to the Sorcerer's Stone?",
  //           faceUp: true,
  //           solution: "Fluffy "
  //         },
  //         "2": {
  //           questionId: "2",
  //           ordinal: 2,
  //           score: 600,
  //           text: "What magical talent does Harry share with Voldemort?",
  //           faceUp: true,
  //           solution: "Parselmouth"
  //         },
  //         "3": {
  //           questionId: "3",
  //           ordinal: 3,
  //           score: 800,
  //           text:
  //             "What type of dragon did Harry face in his first Tri-Wizard Tournament task?",
  //           faceUp: true,
  //           solution: "A Hungarian Horntail Dragon."
  //         },
  //         "4": {
  //           questionId: "4",
  //           ordinal: 4,
  //           score: 1000,
  //           text: "What makes a person feel better after seeing a Dementor?",
  //           faceUp: true,
  //           solution: "Chocolate "
  //         }
  //       }
  //     }
  //   };
  //   game.round2 = {
  //     "0": {
  //       categoryId: "0",
  //       ordinal: 0,
  //       title: "Chemistry",
  //       questions: {
  //         "0": {
  //           questionId: "0",
  //           ordinal: 0,
  //           score: 400,
  //           text:
  //             "What is the smallest unit of a substance that retains the properties of that substance?",
  //           faceUp: true,
  //           solution: "A molecule "
  //         },
  //         "1": {
  //           questionId: "1",
  //           ordinal: 1,
  //           score: 800,
  //           text:
  //             "Which type of matter has a definite volume but no definite shape?",
  //           faceUp: true,
  //           solution: "Liquids "
  //         },
  //         "2": {
  //           questionId: "2",
  //           ordinal: 2,
  //           score: 1200,
  //           text:
  //             "What are substances that control the rates of chemical reactions?",
  //           faceUp: true,
  //           solution: "Catalysts "
  //         },
  //         "3": {
  //           questionId: "3",
  //           ordinal: 3,
  //           score: 1600,
  //           text: "What English chemist and physicist discovered hydrogen?",
  //           faceUp: true,
  //           solution: "Henry Cavendish "
  //         },
  //         "4": {
  //           questionId: "4",
  //           ordinal: 4,
  //           score: 2000,
  //           text: "The temperature at which a gas becomes a liquid is its",
  //           faceUp: true,
  //           solution: "condensation point."
  //         }
  //       }
  //     },
  //     "1": {
  //       categoryId: "1",
  //       ordinal: 1,
  //       title: "Biology",
  //       questions: {
  //         "0": {
  //           questionId: "0",
  //           ordinal: 0,
  //           score: 400,
  //           text:
  //             "What is the scientific term for the production of light by living organisms?",
  //           faceUp: true,
  //           solution: "bioluminescence."
  //         },
  //         "1": {
  //           questionId: "1",
  //           ordinal: 1,
  //           score: 800,
  //           text: "What human organ cleans fifty gallons of blood every day?",
  //           faceUp: true,
  //           solution: "Kidneys "
  //         },
  //         "2": {
  //           questionId: "2",
  //           ordinal: 2,
  //           score: 1200,
  //           text: "What is the most common element in the human body?",
  //           faceUp: true,
  //           solution: "Oxygen"
  //         },
  //         "3": {
  //           questionId: "3",
  //           ordinal: 3,
  //           score: 1600,
  //           text: "What was the first genetically engineered organism?",
  //           faceUp: true,
  //           solution: "tobacco plant "
  //         },
  //         "4": {
  //           questionId: "4",
  //           ordinal: 4,
  //           score: 2000,
  //           text: "Unlike most other fish, sharks have no",
  //           faceUp: true,
  //           solution: "bones"
  //         }
  //       }
  //     },
  //     "2": {
  //       categoryId: "2",
  //       ordinal: 2,
  //       title: "Horror Movies",
  //       questions: {
  //         "0": {
  //           questionId: "0",
  //           ordinal: 0,
  //           score: 400,
  //           text:
  //             'In which horror movie does the protagonist write a book that contains only the line "All work and no play makes Jack a dull boy" repeated over and over and over?',
  //           faceUp: true,
  //           solution: "The Shining "
  //         },
  //         "1": {
  //           questionId: "1",
  //           ordinal: 1,
  //           score: 800,
  //           text:
  //             "What horror film caused some theatres to suggest that patrons prone to motion sickness sit in the aisle seats?",
  //           faceUp: true,
  //           solution: "The Blair Witch Project"
  //         },
  //         "2": {
  //           questionId: "2",
  //           ordinal: 2,
  //           score: 1200,
  //           text:
  //             "Which room does Dick Hallorann tell Danny to stay away from in The Shining?",
  //           faceUp: true,
  //           solution: "room 237 "
  //         },
  //         "3": {
  //           questionId: "3",
  //           ordinal: 3,
  //           score: 1600,
  //           text:
  //             'In this2006 movie, there is a scene in which the male flight attendant throws a snake into the microwave. The button he pushes to cook actually reads "Snake".',
  //           faceUp: true,
  //           solution: "Snakes on a Plane"
  //         },
  //         "4": {
  //           questionId: "4",
  //           ordinal: 4,
  //           score: 2000,
  //           text:
  //             "How many people does Jason kill in the first Friday the 13th film?",
  //           faceUp: true,
  //           solution:
  //             "In the first movie, Jason's mother Pamela does the killing."
  //         }
  //       }
  //     },
  //     "3": {
  //       categoryId: "3",
  //       ordinal: 3,
  //       title: "Measure me that",
  //       questions: {
  //         "0": {
  //           questionId: "0",
  //           ordinal: 0,
  //           score: 400,
  //           text:
  //             "What is the base unit for measuring distance in the metric system?",
  //           faceUp: true,
  //           solution: "Meter"
  //         },
  //         "1": {
  //           questionId: "1",
  //           ordinal: 1,
  //           score: 800,
  //           text: "What is the metric prefix for tenth?",
  //           faceUp: true,
  //           solution: "Deci"
  //         },
  //         "2": {
  //           questionId: "2",
  //           ordinal: 2,
  //           score: 1200,
  //           text: "1 pound = __ kg",
  //           faceUp: true,
  //           solution: "0.454"
  //         },
  //         "3": {
  //           questionId: "3",
  //           ordinal: 3,
  //           score: 1600,
  //           text: "The distance of separation between two points in space",
  //           faceUp: true,
  //           solution: "Length"
  //         },
  //         "4": {
  //           questionId: "4",
  //           ordinal: 4,
  //           score: 2000,
  //           text:
  //             "A unit used to express the intensity of a sound wave. It is measured on a logarithmic scale",
  //           faceUp: true,
  //           solution: "A Decibel"
  //         }
  //       }
  //     },
  //     "4": {
  //       categoryId: "4",
  //       ordinal: 4,
  //       title: "3rd Rock from the Sun",
  //       questions: {
  //         "0": {
  //           questionId: "0",
  //           ordinal: 0,
  //           score: 400,
  //           text:
  //             "What was the giant land mass called that existed some 200 million years ago?",
  //           faceUp: true,
  //           solution: "Pangaea"
  //         },
  //         "1": {
  //           questionId: "1",
  //           ordinal: 1,
  //           score: 800,
  //           text: "The highest mountain on the Earth",
  //           faceUp: true,
  //           solution: "Everest"
  //         },
  //         "2": {
  //           questionId: "2",
  //           ordinal: 2,
  //           score: 1200,
  //           text: "Who formulated the heliocentric theory?",
  //           faceUp: true,
  //           solution: "Copernicus"
  //         },
  //         "3": {
  //           questionId: "3",
  //           ordinal: 3,
  //           score: 1600,
  //           text: "What are the two main metals in the earth’s core?",
  //           faceUp: true,
  //           solution: "Iron and nickel"
  //         },
  //         "4": {
  //           questionId: "4",
  //           ordinal: 4,
  //           score: 2000,
  //           text:
  //             "Cascade', 'horsetail', 'plunge' and 'tiered' are types of what?",
  //           faceUp: true,
  //           solution: "Waterfall"
  //         }
  //       }
  //     },
  //     "5": {
  //       categoryId: "5",
  //       ordinal: 5,
  //       title: "Charter Acronyms",
  //       questions: {
  //         "0": {
  //           questionId: "0",
  //           ordinal: 0,
  //           score: 400,
  //           text: "What does EXPSI stand for?",
  //           faceUp: true,
  //           solution: "Experience Support and Investigations"
  //         },
  //         "1": {
  //           questionId: "1",
  //           ordinal: 1,
  //           score: 800,
  //           text: "What is DAI",
  //           faceUp: true,
  //           solution: "Dynamic Ad Insertion"
  //         },
  //         "2": {
  //           questionId: "2",
  //           ordinal: 2,
  //           score: 1200,
  //           text: "What is MPEG",
  //           faceUp: true,
  //           solution: "Moving Picture Experts Group"
  //         },
  //         "3": {
  //           questionId: "3",
  //           ordinal: 3,
  //           score: 1600,
  //           text: "What is UAT",
  //           faceUp: true,
  //           solution: "User Acceptance Testing"
  //         },
  //         "4": {
  //           questionId: "4",
  //           ordinal: 4,
  //           score: 2000,
  //           text: "What is TDCS",
  //           faceUp: true,
  //           solution: "Targetted Delivery Client Services"
  //         }
  //       }
  //     }
  //   };

  //   // for (let i = 0; i < numCategories; i++) {
  //   //   game.round1[i] = {
  //   //     categoryId: "" + i,
  //   //     ordinal: i,
  //   //     title: placeholderNames[i] ?? `Category ${i + 1}`,
  //   //     questions: {}
  //   //   };
  //   //   game.round2[i] = {
  //   //     categoryId: "" + i,
  //   //     ordinal: i,
  //   //     title: placeholderNames[i] ?? `Category ${i + 1}`,
  //   //     questions: {}
  //   //   };
  //   //   for (let j = 0; j < questionsPerCategory; j++) {
  //   //     game.round1[i].questions[j] = {
  //   //       questionId: "" + j,
  //   //       ordinal: j,
  //   //       score: placeholderValues[j] || 42,
  //   //       text: `Back ${j + 1}`,
  //   //       solution: "",
  //   //       faceUp: i === 0 && j === 0
  //   //     };
  //   //     game.round2[i].questions[j] = {
  //   //       questionId: "" + j,
  //   //       ordinal: j,
  //   //       score: placeholderValues[j] * 2 || 42,
  //   //       text: `Back ${j + 1}`,
  //   //       solution: "",
  //   //       faceUp: i === 0 && j === 0
  //   //     };
  //   //   }
  //   // }
  //   await ref.set(game);
  //   history.push(`/game/${ref.id}`);
  // };

  return (
    <div className="hero-body">
      <div className="container has-text-centered">
        <div className="column is-6 is-offset-3">
          <h1 className="title">Start a game</h1>
          <div className="box">
            <div className="field is-grouped">
              <p className="select" style={{ width: "100%" }}>
                <select
                  style={{ width: "100%" }}
                  onChange={e => setSelectedTemplateId(e.target.value)}
                >
                  {templateList.map(template => (
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
              {gameList.map(game => (
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

import React from "react";
import { cn } from "./lib/utils";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

function App() {
  const loc = useLocation();
  const nav = useNavigate();

  // IF REFRESHED AT THE END PAGE
  React.useEffect(() => {
    if (loc.pathname === "/done" && !!localStorage.getItem("answers")) {
      localStorage.removeItem("answers");
      nav("/");
    }
  }, []);

  return (
    <div className="min-h-screen w-full flex justify-center items-center overflow-hidden bg-slate-100 font-poppins">
      <main className="relative bg-gradient-to-b from-purple-200 to-fuchsia-300 rounded-xl my-2 aspect-[9/16] h-[calc(100vh-16px)]">
        <Routes>
          <Route index path="/" element={<Landing />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/done" element={<Landing done={true} />} />
          <Route path="*" element={null} />
        </Routes>
      </main>
    </div>
  );
}

function Landing({ done = false }) {
  const nav = useNavigate();

  return (
    <>
      <div className="mt-12 grid justify-center">
        <p className="text-4xl text-center">Survey App</p>
        {done && !!localStorage.getItem("answers") ? (
          <p className="my-4 text-xl text-center text-purple-700">
            Thank you for the response!
          </p>
        ) : done && !localStorage.getItem("answers") ? (
          <p className="my-4 text-xl text-center text-purple-700">
            We didn't receive any of your response. Please try again!
          </p>
        ) : null}
      </div>
      <div className="flex justify-center items-center w-full absolute bottom-5">
        <button
          type="button"
          className="rounded-full shadow-xl bg-purple-700 active:bg-purple-800 text-white w-full mx-6 py-2"
          onClick={() => {
            nav("/questions");
            localStorage.setItem("timeout", "9");
            localStorage.removeItem("answers");
          }}
        >
          {done ? "Restart" : "Start"}
        </button>
      </div>
    </>
  );
}

type Quest = {
  quest: string;
  answer: string[];
};

function Questions() {
  const [allAnswers, setAllAnswers] = React.useState<string[] | null>(null);
  // GET ALL ANSWERS WHEN REFRESHED
  React.useEffect(() => {
    if (!localStorage.getItem("answers")) return;
    const localAnswers = localStorage.getItem("answers")!.split(",");
    setAllAnswers(localAnswers);
    setIndex(localAnswers.length);
  }, []);

  // SET ALL ANSWERS TO THE LOCALSTORAGE
  React.useEffect(() => {
    if (!allAnswers) return;
    localStorage.setItem("answers", String(allAnswers));
  }, [allAnswers]);

  // QUESTIONS LIST
  const [questionsList] = React.useState<Quest[]>([
    {
      quest: "Rajiman's Kitchen is accessibly located",
      answer: ["Agree", "Neutral", "Disagree"],
    },
    {
      quest: "Store hours are convenient for my dining needs",
      answer: ["Agree", "Neutral", "Disagree"],
    },
    {
      quest: "Advertised dish was in stock",
      answer: ["Agree", "Neutral", "Disagree"],
    },
    {
      quest: "A good selection of dishes was present",
      answer: ["Agree", "Neutral", "Disagree"],
    },
    {
      quest: "The meals sold are a good value for the money",
      answer: ["Agree", "Neutral", "Disagree"],
    },
    {
      quest: "Store has the lowest prices in the area",
      answer: ["Agree", "Neutral", "Disagree"],
    },
    {
      quest: "Meals sold are of the highest quality",
      answer: ["Agree", "Neutral", "Disagree"],
    },
    {
      quest: "Store atmosphere and decor are appealing",
      answer: ["Agree", "Neutral", "Disagree"],
    },
    {
      quest: "Store has a large parking area",
      answer: ["Agree", "Neutral", "Disagree"],
    },
    {
      quest: "Store is wheelchair accessible",
      answer: ["Agree", "Neutral", "Disagree"],
    },
  ]);
  const [index, setIndex] = React.useState(0);

  return (
    <>
      <div className="grid grid-cols-10 h-1 gap-1 mt-6 px-2">
        {[...Array(10)].map((_, i) => (
          <div
            className={cn(
              "rounded bg-gray-300 opacity-75",
              i < index && "bg-purple-800",
              i === index && "bg-purple-500"
            )}
            key={i}
          ></div>
        ))}
      </div>
      <Quiz
        data={{ ...questionsList[index], index: index + 1 }}
        setIndex={setIndex}
        setAllAnswers={setAllAnswers}
      />
    </>
  );
}

type QuizProps = {
  data: { index: number } & Quest;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  setAllAnswers: React.Dispatch<React.SetStateAction<string[] | null>>;
};

function Quiz({ data, setIndex, setAllAnswers }: QuizProps) {
  const nav = useNavigate();

  // CURRENT ANSWER STATE
  const [answer, setAnswer] = React.useState<string | null>(null);

  // GET THE TIMEOUT EVEN WHEN REFRESHED
  const [minutes, setMinutes] = React.useState(
    parseInt(localStorage.getItem("timeout") as string) || 9
  );
  const [seconds, setSeconds] = React.useState(59);
  // COUNTDOWN
  React.useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval);
          nav("/done");
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
          // DECREASING THE TIMEOUT MINUTE IN LOCALSTORAGE
          localStorage.setItem("timeout", String(minutes - 1));
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  const IS_LAST = data.index === 10;

  return (
    <>
      <div className="resolute rounded-lg mx-6 my-6 py-5 px-3 min-h-[50%] bg-white shadow-xl">
        <div className="flex justify-between">
          <p className="text-slate-400 text-4xl font-bold mb-2">
            Q{data.index}
          </p>
          <p className="font-semibold text-purple-500">
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </p>
        </div>
        <p className="text-purple-700 text-xl font-bold">{data.quest}</p>
        <div className="grid gap-3 my-4 text-purple-700 font-medium">
          {data.answer.map((val, answerId) => (
            <div className="flex items-center gap-1.5" key={answerId}>
              <input
                type="radio"
                name={"q" + data.index}
                className={cn("accent-purple-700 w-8 h-8")}
                value={val}
                checked={answer === val}
                onChange={(e) => setAnswer(e.target.value)}
                id={"a" + (answerId + 1)}
              />
              <label htmlFor={"a" + (answerId + 1)}>{val}</label>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center items-center w-full absolute bottom-5">
        <button
          type="button"
          className={cn(
            "rounded-full shadow-xl bg-purple-700 active:bg-purple-800 text-white w-full mx-6 py-2",
            !answer && "hidden"
          )}
          onClick={() => {
            // IF LAST QUESTIONS
            if (IS_LAST) {
              return nav("/done");
            }
            setIndex(data.index);
            setAnswer("");
            // IF FIRST QUESTION
            if (data.index === 1) {
              return setAllAnswers([answer!]);
            }
            setAllAnswers((prev) => [...prev!, answer!]);
          }}
        >
          {IS_LAST ? "Submit" : "Next"}
        </button>
      </div>
    </>
  );
}

export default App;

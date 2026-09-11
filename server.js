import express from "express";

//sætter app, port og message array
const app = express();
const port = 3300;
const messages = [];

// ===============Array med keywords og svar==========//
const answers = [
  {
    keywords: ["navn", "hedder", "hvem er du"],
    answers: ["Jeg hedder Riisager, a.ka Riiskager, Riisklump, Riis a' la mandem. Hva' så der mayn?",
        "Bare kald mig Riisager"
    ]
  },
  {
    keywords: ["bor", "by", "fra"],
    answers: ["Jeg bor i Aarhus.",
        "8210, son!"
    ]
  },
  {
    keywords: ["fritid", "hobby", "kan lide"],
    answers: ["I min fritid kan jeg godt lide at Spille og lave musik.",
      "Jeg laver damer, G"
    ]
  }
];


// Funktion til at fjerne uønskede tegn fra spørgsmålet
//bruger regex syntax til at fjerne
function sanitizeQuestion(input) {
  return input.replace(/[\u0000-\u001F\u007F]/g, "");
}

function countMatches(keywords, normalizedQuestion) {
  const matches = keywords.filter((keyword) =>
    normalizedQuestion.includes(keyword)
  );

  return matches.length;
}
console.log(
  countMatches(["navn", "hedder", "hvem er du"], "hvad hedder du?")
); // 1

console.log(
  countMatches(
    ["navn", "hedder", "hvem er du"],
    "hvad hedder du, og hvad er dit navn?"
  )
); // 2

console.log(
  countMatches(["navn", "hedder", "hvem er du"], "kan du bage?")
); // 0

//Funktion der ignorerer store bogstaver og tjekker om spørgsmålet matcher keywords i answers arrayet.
function findAnswer(question) {
  const normalizedQuestion = question.toLowerCase();
  
  for (const answerGroup of answers) {
    const hasMatch = answerGroup.keywords.some((keyword) => normalizedQuestion.includes(keyword));

    if (hasMatch) {
      const randomIndex = Math.floor(Math.random() * answerGroup.answers.length);
      return answerGroup.answers[randomIndex];
    }
  }

  return "Det kender jeg ikke svaret på endnu.";
}

function findBestAnswer(question) {
  const normalizedQuestion = question.toLowerCase();
  let bestScore = 0;
  let bestAnswer = "Eyo, det står skudta ikke i manus!";

  for (const answerGroup of answers) {
    // 1. Beregn denne regels score.
    const score = countMatches(answerGroup.keywords, normalizedQuestion)
    // 2. Sammenlign med bestScore.
    if (score > bestScore){
      // 3. Gem score og svar, hvis reglen er bedre.
      bestScore = score;
      bestAnswer = answerGroup.answers
    }
    
  }

  return bestAnswer;
}

//=====================Middleware======================//

// Middleware til at håndtere statiske filer og form data
app.use(express.static("public"));
// Sætter EJS som view engine
app.set("view engine", "ejs");
// Middleware til at parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// ==========================Ruter=====================//
app.get("/", (request, response) => {
  response.render("index", { messages, error: "" }); //sender messages arrayet og error stringen til index.ejs
});

// Route til at håndtere spørgsmål sendt via POST
app.post("/ask", (request, response) => {
    const rawQuestion = request.body.question;
    const question = sanitizeQuestion(rawQuestion).trim();
 
  let error = "";
  //hvis der ikke er et spørgsmål, eller hvis det er for langt
  if (!question) {
    error = "Skriv et spørgsmål, før du sender.";
    } else if (question.length > 280) {
  error = "Spørgsmålet må højst være 280 tegn.";
  } else { //ellers skub skub svar i messages arrayet
    messages.push({ type: "question", text: question, createdAt: new Date() });;
    const answer = findAnswer(question); //kalder findAnswer funktionen med spørgsmålet som argument
    messages.push({ type: "answer", text: answer, createdAt: new Date() }); //skubber svaret ind i messages arrayet
  }
  

  response.render("index", { messages, error }); //sender messages arrayet og error stringen til index.ejs
});
//route der tømmer arrayet og redirecter til index.ejs
app.post("/clear-messages", (request, response) => {
  messages.length = 0;
  response.redirect("/");
});



app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


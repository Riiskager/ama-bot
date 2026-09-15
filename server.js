import express from "express";
import {answers} from "./data/answers.js";
//sætter app, port og message array
const app = express();
const port = 3300;
const messages = [];

// ===============Array med keywords og svar==========//



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
  let bestCategory = "";

  for (const answerGroup of answers) {
    // 1. Beregn denne regels score.
    const score = countMatches(answerGroup.keywords, normalizedQuestion)
    // 2. Sammenlign med bestScore.
    if (score > bestScore){
      // 3. Gem score og svar, hvis reglen er bedre.
      bestScore = score;
      const randomAnswer = Math.floor(Math.random() * answerGroup.answers.length);
      bestCategory = answerGroup.category;
      bestAnswer = answerGroup.answers[randomAnswer];
    };
    
  };
  

  return{ 
    category: bestCategory, 
    answer: bestAnswer };
}
//let istedet for const, så den kan cleares nemmere
let topicStats = {
  navn: 0,
  bosted: 0,
  fritid: 0
};

//=====================Middleware======================//

// Middleware til at håndtere statiske filer og form data
app.use(express.static("public"));
// Sætter EJS som view engine
app.set("view engine", "ejs");
// Middleware til at parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// ==========================Ruter=====================//
app.get("/", (request, response) => {
  response.render("index", { messages, error: "", topicStats }); //sender messages arrayet og error stringen til index.ejs
});

// Route til at håndtere spørgsmål sendt via POST
app.post("/ask", (request, response) => {
    const rawQuestion = request.body.question;
    const question = sanitizeQuestion(rawQuestion).trim();
 
  let error = "";
  //hvis der ikke er et spørgsmål, eller hvis det er for langt
  if (!question) {
    error = "Tag dig dog sammen og skriv noget";
    } else if (question.length > 280) {
  error = "Eyo, stram det lige ind makker, gider ikke læse en roman.";
  } else { //ellers skub skub svar i messages arrayet
    messages.push({ type: "question", text: question, createdAt: new Date() });;
    const result = findBestAnswer(question); //kalder findBestAnswer funktionen med spørgsmålet som argument
    messages.push({ type: "answer", text: result.answer, createdAt: new Date() }); //skubber svaret ind i messages arrayet
    if (result.category) {
    topicStats[result.category]++; //opdaterer topicStats objektet med den kategori der blev matchet
  }
  }

  
  console.log("Topic stats:", topicStats); //logger topicStats objektet i konsollen
  response.render("index", { messages, error, topicStats }); //sender messages arrayet og error stringen til index.ejs
});
//route der tømmer arrayet og redirecter til index.ejs
app.post("/clear-messages", (request, response) => {
  messages.length = 0;
  topicStats = { navn: 0, bosted: 0, fritid: 0 };
  response.redirect("/");
});



app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


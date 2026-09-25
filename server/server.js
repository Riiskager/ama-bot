import express from "express";
import fs from "node:fs/promises";
import { saveMessages } from "./data/messages.js";
import { loadMessages } from "./data/messages.js";
import { loadAnswers } from "./data/answers.js";
import { saveAnswers } from "./data/answers.js";
import { findBestAnswer} from "./data/messages.js";
import svar from "./data/answers.json" with {type: "json"};

//sætter app, port 
const app = express();
const port = 3300;




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
// function findAnswer(question) {
//   const normalizedQuestion = question.toLowerCase();
  
//   for (const answerGroup of answers) {
//     const hasMatch = answerGroup.keywords.some((keyword) => normalizedQuestion.includes(keyword));

//     if (hasMatch) {
//       const randomIndex = Math.floor(Math.random() * answerGroup.answers.length);
//       return answerGroup.answers[randomIndex];
//     }
//   }

//   return "Det kender jeg ikke svaret på endnu.";
// }





//let istedet for const, så den kan cleares nemmere
let topicStats = {
  navn: 0,
  bosted: 0,
  fritid: 0
};

//=====================Middleware======================//
app.use(express.json());



// ==========================Ruter=====================//
app.get("/messages", async (request, response) => {
  const messages = await loadMessages();

  response.json(messages);
});

app.post("/messages", async (request, response) => {
  const messages = await loadMessages();
  const question = request.body.question.trim();

  // TODO: Hvis question er tom, send fejlen som JSON i stedet for at rendere index igen,
  if (!question){
    response.json({error: "yo, skriv noget forhelvede"});
    return;
  }
 // TODO: Opret en spørgsmål-besked, { type: "question", text: question, createdAt: new Date().toISOString() }, og tilføj den til messages.
 const message = {
    type: "question",
    text: question,
    createdAt: new Date().toISOString()
 }
messages.push(message);

const answers = await loadAnswers();
  const result = findBestAnswer(question, answers);
  const answerMessage = { type: "answer", text: result.answer, createdAt: new Date().toISOString() };
  messages.push(answerMessage);



await saveMessages(messages)

  
 response.json({question: message, answer: answerMessage})
});

app.delete("/messages", async (request, response) => {
  await saveMessages([]);

  response.send();
});

app.get("/answers", async (request, response) => {
  const answers = await loadAnswers();

  response.json(answers);
});

app.get("/answers/:category", async (request, response) => {
  const answers = await loadAnswers();

  // TODO: Find reglen i answers, hvor category matcher request.params.category.
  // Denne gang skal du IKKE bruge Number() — begge sider er allerede strings.
 const answerRule = answers.find(a => a.category === request.params.category)

  // TODO: Send den fundne regel som JSON.
  response.json(answerRule)
});

app.post("/answers", async (request, response) => {
  const answers = await loadAnswers();

  // TODO: Opret et nyt regel-objekt ud fra request.body.category, request.body.keywords og request.body.answer.
const newRule = {
  "category": request.body.category,
  "keywords": request.body.keywords,
  "answers": request.body.answers
}
  // TODO: Tilføj den til answers med push(), og gem den opdaterede liste med saveAnswers(answers).
  answers.push(newRule)
  await saveAnswers(answers)
  // TODO: Send den nye regel som JSON.
  response.json(newRule)
});

app.put("/answers/:category", async (request, response) => {
  const answers = await loadAnswers();
  const answerRule = answers.find((a) => a.category === request.params.category);

  // TODO: Opdater answerRule.keywords og answerRule.answer med værdierne fra request.body.
      answerRule.keywords = request.body.keywords
      answerRule.answers = request.body.answers
  // TODO: Gem den opdaterede liste med saveAnswers(answers), og send answerRule som JSON.
  await saveAnswers(answers)
  response.json(answerRule);
});

app.delete("/answers/:category", async (request, response) => {
  const answers = await loadAnswers();

  // TODO: Fjern reglen fra answers, hvor category matcher request.params.category, med filter().
  const updatedAnswers = answers.filter(a => a.category !== request.params.category)


  // TODO: Gem den opdaterede liste med saveAnswers().
  await saveAnswers(updatedAnswers)
  response.send();
});



app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


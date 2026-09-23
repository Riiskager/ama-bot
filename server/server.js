import express from "express";
import {answers} from "./data/answers.json";
import fs from "node:fs/promises";
import { json } from "node:stream/consumers";
//sætter app, port 
const app = express();
const port = 3300;
// const messages = []; - Tidligere opgave

//funktion til at loade beskeder fra json
async function loadMessages() {
  // TODO: Læs data/messages.json med fs.readFile() ("utf8").
  const data = await fs.readFile("./data/messages.json", "utf8");
  // TODO: Parse JSON-teksten til et array, og returnér det.
  return JSON.parse(data);
} 
//Funktion til at gemme beskeder til JSON
async function saveMessages(messages) {
  // TODO: Omdan messages til formateret JSON-tekst med JSON.stringify().
  const json = JSON.stringify(messages, null, 2)
  // TODO: Skriv teksten til data/messages.json med fs.writeFile().
  await fs.writeFile("./data/messages.json", json)
}
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
    createedAt: new Date().toISOString()
 }
messages.push(message);

  const result = findBestAnswer(question);
  const answerMessage = { type: "answer", text: result.answer, createdAt: new Date().toISOString() };
  messages.push(answerMessage);



await saveMessages(messages)

  
 response.json({question: message, answer: answerMessage})
});

app.delete("/messages", async (request, response) => {
  await saveMessages([]);

  response.send();
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


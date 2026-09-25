import express from "express"
import { loadMessages, saveMessages } from "../server/data/messages.js";
import { loadAnswers } from "../server/data/answers.js";
import { findBestAnswer} from "../server/data/messages.js";

const router = express.Router();

router.get("/", async (request, response) => {
  const messages = await loadMessages();

  response.json(messages);
});

router.post("/", async (request, response) => {
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

router.delete("/", async (request, response) => {
  await saveMessages([]);

  response.send();
});

export default router;
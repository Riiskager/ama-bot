import express from "express"
import { loadAnswers, saveAnswers } from "../data/answers.js";


const router = express.Router();



router.get("/", async (request, response) => {
  const answers = await loadAnswers();

  response.json(answers);
});

router.get("/:category", async (request, response) => {
  const answers = await loadAnswers();

  // TODO: Find reglen i answers, hvor category matcher request.params.category.
  // Denne gang skal du IKKE bruge Number() — begge sider er allerede strings.
 const answerRule = answers.find(a => a.category === request.params.category)

  // TODO: Send den fundne regel som JSON.
  response.json(answerRule)
});

router.post("/", async (request, response) => {
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

router.put("/:category", async (request, response) => {
  const answers = await loadAnswers();
  const answerRule = answers.find((a) => a.category === request.params.category);

  // TODO: Opdater answerRule.keywords og answerRule.answer med værdierne fra request.body.
      answerRule.keywords = request.body.keywords
      answerRule.answers = request.body.answers
  // TODO: Gem den opdaterede liste med saveAnswers(answers), og send answerRule som JSON.
  await saveAnswers(answers)
  response.json(answerRule);
});

router.delete("/:category", async (request, response) => {
  const answers = await loadAnswers();

  // TODO: Fjern reglen fra answers, hvor category matcher request.params.category, med filter().
  const updatedAnswers = answers.filter(a => a.category !== request.params.category)


  // TODO: Gem den opdaterede liste med saveAnswers().
  await saveAnswers(updatedAnswers)
  response.send();
});

export default router;
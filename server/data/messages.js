
import fs from "node:fs/promises";

export async function loadMessages() {
  // TODO: Læs data/messages.json med fs.readFile() ("utf8").
  const data = await fs.readFile("./data/messages.json", "utf8");
  // TODO: Parse JSON-teksten til et array, og returnér det.
  return JSON.parse(data);
} 
//Funktion til at gemme beskeder til JSON
export async function saveMessages(messages) {
  // TODO: Omdan messages til formateret JSON-tekst med JSON.stringify().
  const json = JSON.stringify(messages, null, 2)
  // TODO: Skriv teksten til data/messages.json med fs.writeFile().
  await fs.writeFile("./data/messages.json", json)
}

//Behøves ikke eksporteres, da den kun bruges herinde
function countMatches(keywords, normalizedQuestion) {
  const matches = keywords.filter((keyword) =>
    normalizedQuestion.includes(keyword)
  );

  return matches.length;
}



export function findBestAnswer(question, answers) {

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
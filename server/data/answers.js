
import fs from "node:fs/promises";

export async function loadAnswers() {
  // TODO: Læs data/answers.json med fs.readFile() ("utf8").
  const data = await fs.readFile("./data/answers.json", "utf8");
  // TODO: Parse JSON-teksten til et array, og returnér det.
  return JSON.parse(data)
}


export async function saveAnswers(answers) {
  // TODO: Omdan answers til formateret JSON-tekst med JSON.stringify().
  const json = JSON.stringify(answers, null, 2)
  // TODO: Skriv teksten til data/answers.json med fs.writeFile().
  await fs.writeFile("./data/answers.json", json)
}


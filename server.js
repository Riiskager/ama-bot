import express from "express";

const app = express();
const port = 3300;
const messages = [];

const answers = [
  {
    keywords: ["navn", "hedder", "hvem er du"],
    answer: "Jeg hedder Riisager, a.ka Riiskager, Riisklump, Riis a' la mandem. Hva' så der mayn?"
  },
  {
    keywords: ["bor", "by", "fra"],
    answer: "Jeg bor i Aarhus."
  },
  {
    keywords: ["fritid", "hobby", "kan lide"],
    answer: "I min fritid kan jeg godt lide at Spille og lave musik."
  }
];
function findAnswer(question) {
  const normalizedQuestion = question.toLowerCase();

  for (const answerGroup of answers) {
    const hasMatch = answerGroup.keywords.some((keyword) => normalizedQuestion.includes(keyword));

    if (hasMatch) {
      return answerGroup.answer;
    }
  }

  return "Det kender jeg ikke svaret på endnu.";
}


app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.get("/", (request, response) => {
  response.render("index", { messages });
});

app.post("/ask", (request, response) => {
  const question = request.body.question;

    const answer = findAnswer(question);
    messages.push({ type: "answer", text: answer });

  response.render("index", { messages });
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


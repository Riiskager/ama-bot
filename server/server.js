import express from "express";


import messageRouter from "./controllers/messagesController.js"
import answerRouter from "./controllers/answersController.js"
import cors from "cors";




//sætter app, port 
const app = express();
const port = 3300;




// ===============Array med keywords og svar==========//



// Funktion til at fjerne uønskede tegn fra spørgsmålet
//bruger regex syntax til at fjerne
function sanitizeQuestion(input) {
  return input.replace(/[\u0000-\u001F\u007F]/g, "");
}





//let istedet for const, så den kan cleares nemmere
let topicStats = {
  navn: 0,
  bosted: 0,
  fritid: 0
};

//=====================Middleware======================//
app.use(express.json());
app.use(cors());
app.use("/messages", messageRouter)
app.use("/aswers", answerRouter)

// ==========================Ruter=====================//




app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


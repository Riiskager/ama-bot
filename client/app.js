console.log("app.js er forbundet");

const API_URL = "http://localhost:3300";

const messagesContainer = document.querySelector("#messages");
const questionForm = document.querySelector("#form");
const questionInput = document.querySelector("#question");
const clearMessagesButton = document.querySelector("#clear");

console.log(messagesContainer, questionForm, questionInput, clearMessagesButton)

async function getMessages() {
  // TODO: Hent `${API_URL}/messages` med fetch(), og await response.json() for at få messages-arrayet.
  const response = await fetch(`${API_URL}/messages`)
  const message = await response.json(message)
  // TODO: Log messages til konsollen med console.log(messages) — se, hvordan dataen faktisk ser ud, før du render'er den.
  console.log(message)
}

getMessages();

function displayMessage(message) {
   
          // TODO: Byg en HTML-streng med et template literal: et <article> 
          // med sin class sat til message.type ("question" eller "answer") 
          // — det er den samme klasse, din CSS fra øvelse 3 allerede styler 
          // — og et <p> inde i det, med message.text.
    const html = `<article class="${message.type}"><p>${message.text}</p></article>`
   
    
// TODO: Indsæt HTML-strengen sidst i messagesContainer 
// med messagesContainer.insertAdjacentHTML("beforeend", html). Fjern console.log igen.
messagesContainer.insertAdjacentHTML("beforeend", html)

}
displayMessage({ type: "question", text: "Test" })
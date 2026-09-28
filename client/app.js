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
  const messages = await response.json();

  // TODO: Kør igennem messages med en for...of, 
  // og kald displayMessage(message) for hver. Fjern console.log igen.
  for (const message of messages){
    displayMessage(message)
  }

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

questionForm.addEventListener("submit", async (event) =>{
  console.log("SUBMIT EVENT");
  event.preventDefault();

   console.log("AFTER PREVENT DEFAULT");
  const question = questionInput.value.trim();
  
  console.log("BEFORE FETCH");

  // TODO: Send et POST-kald til `${API_URL}/messages` med fetch(). Husk:
  //   - method: "POST"
  //   - headers: { "Content-Type": "application/json" }
  //   - body: JSON.stringify({ question })
  const response = await fetch (`${API_URL}/messages`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ question })
})

console.log("AFTER FETCH");
  // TODO: await response.json() for at få { question, answer } tilbage, og log det med console.log(data).
const data = await response.json()
console.log(data)


  displayMessage(data.question);
  displayMessage(data.answer);
console.log("HANDLER ER HELT FÆRDIG");

questionInput.value="";
});



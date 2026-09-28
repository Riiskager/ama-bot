console.log("app.js er forbundet");

const API_URL = "http://localhost:3300";

const messagesContainer = document.querySelector("#messages");
const questionForm = document.querySelector("#form");
const questionInput = document.querySelector("#question");
const clearMessagesButton = document.querySelector("#clear");

console.log(messagesContainer, questionForm, questionInput, clearMessagesButton)


//==============Typewriter dims======================//


 var i = 0;


function typeWriter(text) {
  if (i < text.length) {

    document.getElementsByClassName("svar")[0].style.display = "block";
    document.getElementById("demo").innerHTML += text.charAt(i);
    i++;
    setTimeout(() => typeWriter(text), 50);
   
    document.getElementById("image").src='./img/answer1.PNG';

 
}else if(i === text.length){
    document.getElementById("image").src='./img/answerdone.png';

    setTimeout(reset, 2000);  
 function reset() {
    if (i >= text.length) {
      document.getElementById("image").src='./img/ask.png';
      document.getElementById("demo").innerHTML = "Stil mig et nyt spørgsmål!";
      i = 0;
      setTimeout(fuck, 1000)
    } 
    function fuck(){
      document.getElementById("demo").innerHTML = "";
      document.getElementsByClassName("svar")[0].style.display = "none";
    }
  }
}
}


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
messagesContainer.scrollTop = messagesContainer.scrollHeight

}


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
console.log(data)

  displayMessage(data.question);
  displayMessage(data.answer);
console.log("HANDLER ER HELT FÆRDIG");
  typeWriter(data.answer.text);
questionInput.value="";
});


clearMessagesButton.addEventListener("click", async (event) => { 
   const response = await fetch (`${API_URL}/messages`, {
  method: "DELETE",
})
messagesContainer.innerHTML="";

console.log(response)
});



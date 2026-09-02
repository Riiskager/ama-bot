import express from "express";

const server = express();
const port = 3333;


server.get("/", (request, response) => {
  response.send(`
    <html>
      <head>
        <title>My Express App</title>
      </head>
      <body>
        <h1>Hello, World!</h1>
        <section class="me">
          <img src="./img/ask.PNG" alt="My Image" />
        </section>
      </body>
    </html>
  `);
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
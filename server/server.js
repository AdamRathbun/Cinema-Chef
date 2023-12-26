// server.js

const express = require('express');
const app = express();
const port = 5000;

// Define a sample route
app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

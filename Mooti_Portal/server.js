const http = require("http");
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

const app = express();
const port = process.env.PORT || 8080;
const DIST_DIR = path.join(__dirname, 'prod');

dotenv.config();

app.use(express.json());
app.use(express.static(DIST_DIR));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(DIST_DIR, "index.html"));
});

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

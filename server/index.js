const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const { Parser } = require("json2csv");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post("/save-answers", (req, res) => {
  const answers = req.body;

  const csvFolder = path.join(__dirname, "csv-files");
  if (!fs.existsSync(csvFolder)) {
    fs.mkdirSync(csvFolder);
  }

  const timestamp = Date.now();
  const filePath = path.join(csvFolder, `answers-${timestamp}.csv`);

  const fields = ["S.No.", "Statements", "Score"];
  const opts = { fields };
  const parser = new Parser(opts);
  const csv = parser.parse(answers);

  fs.writeFileSync(filePath, csv);

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

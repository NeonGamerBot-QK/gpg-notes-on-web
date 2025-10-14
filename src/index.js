require("dotenv/config");
const express = require("express");
const openpgp = require("openpgp");
const app = express();
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/api/genkey", (req, res) => {
  const email = req.query.email;
  const name =
    req.query.name ||
    Math.random().toFixed(20).toString().split(".")[1].slice(0, 7);
  openpgp
    .generateKey({
      userIDs: [{ name, email }],
      curve: "ed25519",
      passphrase: req.query.passphrase,
    })
    .then((d) => {
      res.json(d);
    });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started on port " + (process.env.PORT || 3000));
});

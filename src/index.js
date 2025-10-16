require("dotenv/config");
const express = require("express");
const openpgp = require("openpgp");
const { PrismaClient } = require("@prisma/client");
const { createSchema } = require("./schema");
const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/note/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(404).end();
  }
  const data = await prisma.file.findFirst({
    where: {
      id,
    },
  });
  res.render(`file`, { data });
});

app.post("/api/create", async (req, res) => {
  const body = req.body;
  let properData;
  try {
    properData = createSchema.parse(body);
  } catch (e) {
    return res.status(422).json({ error: e.message });
  }
  try {
    const birth = await prisma.file.create({
      data: {
        encContent: properData.content,
        pubUserId: properData.pubKey,
        title: properData.title,
      },
    });
    res.status(201).json({
      message: "OK CREATED",
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

app.get("/create", (req, res) => {
  res.render("create");
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

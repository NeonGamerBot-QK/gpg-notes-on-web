require("dotenv/config");
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { envSchema } = require("./schema");
const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
require("./api")(app, prisma);
app.use(express.json())
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/note/:id", async (req, res) => {
  const id = req.params.id;
  if (!id || isNaN(id)) {
    return res.status(404).end();
  }
  const data = await prisma.file.findFirst({
    where: {
      id: parseInt(id),
    },
  });
  res.render(`file`, { data });
});

app.get("/create", (req, res) => {
  res.render("create");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started on port " + (process.env.PORT || 3000));
});

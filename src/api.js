const { createSchema } = require("./schema");
const openpgp = require("openpgp");

module.exports = (app, prisma) => {
  // handle api routes here cuz clutter
  app.post("/api/create", async (req, res) => {
    const body = req.body;
    let properData;
    try {
      console.log(body)
      properData = createSchema.parse(body);
    } catch (e) {
      console.error(e)
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
      console.log(birth)
      res.status(201).json({
        message: "OK CREATED",
        id: birth.id
      });
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  });

  app.get("/api/genkey", async (req, res) => {
    const email = req.query.email;
    const name =
      req.query.name ||
      Math.random().toFixed(20).toString().split(".")[1].slice(0, 7);
    try {
      await openpgp
        .generateKey({
          userIDs: [{ name, email }],
          curve: "ed25519",
          passphrase: req.query.passphrase,
        })
        .then((d) => {
          res.json(d);
        });
    } catch (e) {
      await openpgp
        .generateKey({
          userIDs: [{ name: "error: umade a bad key or smt" }],
          curve: "ed25519",
          passphrase: req.query.passphrase,
        })
        .then((d) => {
          res.json(d);
        });
    }
  });
};

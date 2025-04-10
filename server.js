const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

const adminUser = { username: "eksadmin", password: "eks12345" };

app.use(express.json());
app.use(express.static("."));

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === adminUser.username && password === adminUser.password) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.get("/bonuslar", (req, res) => {
  fs.readFile("bonuslar.json", "utf-8", (err, data) => {
    if (err) return res.status(500).send("Dosya okunamadı.");
    res.send(data);
  });
});

app.post("/ekle", (req, res) => {
  const yeniBonus = req.body;
  fs.readFile("bonuslar.json", "utf-8", (err, data) => {
    let bonuslar = [];
    try { bonuslar = JSON.parse(data); } catch {}
    bonuslar.push(yeniBonus);
    fs.writeFile("bonuslar.json", JSON.stringify(bonuslar, null, 2), () => res.sendStatus(200));
  });
});

app.post("/guncelle/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const guncel = req.body;
  fs.readFile("bonuslar.json", "utf-8", (err, data) => {
    let bonuslar = JSON.parse(data);
    bonuslar[id] = guncel;
    fs.writeFile("bonuslar.json", JSON.stringify(bonuslar, null, 2), () => res.sendStatus(200));
  });
});

app.delete("/sil/:id", (req, res) => {
  const id = parseInt(req.params.id);
  fs.readFile("bonuslar.json", "utf-8", (err, data) => {
    let bonuslar = JSON.parse(data);
    bonuslar.splice(id, 1);
    fs.writeFile("bonuslar.json", JSON.stringify(bonuslar, null, 2), () => res.sendStatus(200));
  });
});

app.listen(PORT, () => {
  console.log(`✅ Gelişmiş admin panel: http://localhost:${PORT}/admin.html`);
});

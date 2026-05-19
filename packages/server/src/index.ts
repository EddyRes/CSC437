import { connect } from "./services/mongo.js";
import express, { Request, Response } from "express";
import Songs from "./services/song-svc.js";
import auth, { authenticateUser } from "./routes/auth.js";

import fs from "node:fs/promises";
import path from "path";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

connect("moogle");

app.use(express.static(staticDir));
app.use(express.json());

app.use("/auth", auth);
app.use("/api/songs", authenticateUser);


app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello, World");
});

app.get("/api/songs", (req: Request, res: Response) => {
  Songs.index()
    .then((list) => {
      res.send({
        count: list.length,
        songs: list
      });
    })
    .catch((err) => res.status(500).send(err));
});

app.get("/api/songs/:id", (req: Request, res: Response) => {
  const id = req.params.id as string;

  Songs.get(id)
    .then((song) => {
      if (!song) res.status(404).send();
      else res.send(song);
    })
    .catch((err) => res.status(500).send(err));
});

app.post("/api/songs", (req: Request, res: Response) => {
  const newSong = req.body;

  Songs.create(newSong)
    .then((song) => res.status(201).json(song))
    .catch((err) => res.status(500).send(err));
});

app.put("/api/songs/:id", (req: Request, res: Response) => {
  const id = req.params.id as string;
  const updatedSong = req.body;

  Songs.update(id, updatedSong)
    .then((song) => {
      if (!song) res.status(404).send();
      else res.json(song);
    })
    .catch((err) => res.status(404).send(err));
});

app.delete("/api/songs/:id", (req: Request, res: Response) => {
  const id = req.params.id as string;

  Songs.remove(id)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).send(err));
});

app.use("/app", (req: Request, res: Response) => {
  const indexHtml = path.resolve(staticDir, "index.html");

  fs.readFile(indexHtml, { encoding: "utf8" }).then((html) =>
    res.send(html)
  );
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

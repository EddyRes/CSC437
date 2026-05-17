import { connect } from "./services/mongo.js";
import express, { Request, Response } from "express";
import Songs from "./services/song-svc.js";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

connect("moogle");

app.use(express.static(staticDir));


app.use(express.json());


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

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

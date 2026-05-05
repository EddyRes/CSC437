import express, { Request, Response } from "express";
import Songs from "./services/song-svc.js";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";


app.use(express.static(staticDir));


app.use(express.json());


app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello, World");
});

app.get("/api/songs", (req: Request, res: Response) => {
  const data = Songs.getAll();

  res.send({
    songs: data
  });
});

app.get("/api/songs/:id", (req: Request, res: Response) => {
  const id = req.params.id as string;
  const data = Songs.get(id);

  if (data) {
    res.send(data);
  } else {
    res.status(404).send();
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
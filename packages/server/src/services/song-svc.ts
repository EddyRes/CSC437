import { Schema, model } from "mongoose";
import { Song } from "../models/index.js";

const songSchema = new Schema<Song>(
  {
    title: String,
    artistName: String,
    artistHref: String,
    albumName: String,
    albumHref: String,
    genreName: String,
    genreHref: String,
    duration: String,
    year: String,
  },
  { collection: "songs" }
);

const SongModel = model<Song>("Song", songSchema);

function index(): Promise<Song[]> {
  return SongModel.find();
}

function get(id: string): Promise<Song | undefined> {
  return SongModel.findById(id).then((song) => song || undefined);
}

export default { index, get };

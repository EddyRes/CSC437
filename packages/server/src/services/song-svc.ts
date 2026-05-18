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

function create(json: Song): Promise<Song> {
  const song = new SongModel(json);
  return song.save();
}

function update(id: string, song: Song): Promise<Song | undefined> {
  return SongModel.findByIdAndUpdate(id, song, { new: true }).then(
    (updated) => updated || undefined
  );
}

function remove(id: string): Promise<void> {
  return SongModel.findByIdAndDelete(id).then((deleted) => {
    if (!deleted) throw `${id} not deleted`;
  });
}

export default { index, get, create, update, remove };

import { Song } from "server/models";

export type Msg =
  | ["songs/request", {}]
  | ["songs/load", { songs: Song[] }]
  | ["song/edit", { song: Song }]
  | ["song/cancel", {}]
  | ["song/save", { id: string; song: Song }]
  | ["song/saved", { song: Song }]
  | ["song/error", { message: string }];
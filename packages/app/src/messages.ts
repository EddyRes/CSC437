import { Song } from "server/models";

export type Msg =
  | ["songs/request", {}]
  | ["songs/load", { songs: Song[] }];

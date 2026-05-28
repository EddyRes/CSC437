import { Song } from "server/models";

export interface Model {
  songs?: Song[];
  selectedSong?: Song;
  editingSong?: Song;
  error?: string;
}

export const init: Model = {};

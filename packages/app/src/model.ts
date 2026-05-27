import { Song } from "server/models";

export interface Model {
  songs?: Song[];
}

export const init: Model = {};

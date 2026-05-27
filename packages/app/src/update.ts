import { Auth } from "@unbndl/auth";
import { Model } from "./model.ts";
import { Msg } from "./messages.ts";

import { Song } from "server/models";

export type Cmd =
  | ["songs/load", { songs: Song[] }];

export function update(
  model: Readonly<Model>,
  message: Msg | Cmd,
  user: Auth.Model
): Model | [Model, Promise<Msg>] {
  const [type] = message;

  switch (type) {
    case "songs/request":
      return [
        model,
        requestSongs(user)
      ];

    case "songs/load": {
      const [, payload] = message;

      return {
        ...model,
        songs: payload.songs
      };
    }

    default:
      return model;
  }
}

function requestSongs(user: Auth.Model): Promise<Msg> {

  return fetch("/api/songs", {
  headers: {
    ...Auth.headers(user)
  }
})
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }

      throw "No response from server";
    })
    .then((json: unknown) => {
      const data = json as { songs: Song[] };

      return [
        "songs/load",
        { songs: data.songs }
      ];
    });
}

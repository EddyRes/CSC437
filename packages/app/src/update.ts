import { Auth } from "@unbndl/auth";
import { Model } from "./model.ts";
import { Msg } from "./messages.ts";

import { Song } from "server/models";

export type Cmd =
  | ["songs/load", { songs: Song[] }]
  | ["song/saved", { song: Song }]
  | ["song/error", { message: string }];

export function update(
  model: Readonly<Model>,
  message: Msg | Cmd,
  user: Auth.Model
): Model | [Model, Promise<Cmd>] {
  const [type, payload] = message;

  switch (type) {

    case "song/error":
      return {
        ...model,
        error: payload.message
      };

    case "songs/request":
      return [model, requestSongs(user)];

    case "songs/load":
      return {
        ...model,
        songs: payload.songs
      };

    case "song/edit":
      return {
        ...model,
        editingSong: payload.song
      };

    case "song/cancel":
      return {
      ...model,
      editingSong: undefined
      };

    case "song/save":
      return [
    {
      ...model,
      error: undefined
    },
    saveSong(payload, user)
    ];

    case "song/saved": {
      const updatedSong = payload.song;

      return {
        ...model,

        editingSong: undefined,

        selectedSong: updatedSong,

        songs: model.songs?.map((song) =>
          song._id === updatedSong._id ? updatedSong : song
        )
      };
    }

    default:
      return model;
  }
}

function requestSongs(user: Auth.Model): Promise<Cmd> {
  const token = String(user.token || "");

  return fetch("/api/songs", {
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : {}
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }

      throw new Error("No response from server");
    })
    .then((json: unknown) => {
      const data = json as { songs: Song[] };

      return [
        "songs/load",
        { songs: data.songs }
      ];
    });
}

function saveSong(
  payload: { id: string; song: Song },
  user: Auth.Model
): Promise<Cmd> {
  const token = String(user.token || "");

  return fetch(`/api/songs/${payload.id}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },

    body: JSON.stringify(payload.song)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }

      throw new Error(`Could not save song: ${response.status}`);
    })
        .then((json: unknown) => {
      return [
        "song/saved",
        { song: json as Song }
      ];
    })
    .catch((error) => {
      return [
        "song/error",
        { message: error.message || "Could not save song." }
      ];
    });
}
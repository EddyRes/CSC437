import { Song } from "../models/index.js";

const songs: Record<string, Song> = {
  blindingLights: {
    title: "Blinding Lights",
    artistName: "The Weeknd",
    artistHref: "artists/the-weeknd.html",
    albumName: "After Hours",
    albumHref: "albums/after-hours.html",
    genreName: "Synth-pop",
    genreHref: "genres/synth-pop.html",
    duration: "3:20",
    year: "2019",
  },

  badGuy: {
    title: "Bad Guy",
    artistName: "Billie Eilish",
    artistHref: "artists/billie-eilish.html",
    albumName: "When We All Fall Asleep, Where Do We Go?",
    albumHref: "albums/when-we-all-fall-asleep.html",
    genreName: "Electropop",
    genreHref: "genres/electropop.html",
    duration: "3:14",
    year: "2019",
  },

  yellow: {
    title: "Yellow",
    artistName: "Coldplay",
    artistHref: "artists/coldplay.html",
    albumName: "Parachutes",
    albumHref: "albums/parachutes.html",
    genreName: "Alternative Rock",
    genreHref: "genres/alternative-rock.html",
    duration: "4:29",
    year: "2000",
  },
};

function get(id: string) {
  return songs[id];
}

function getAll() {
  return Object.values(songs);
}

export default { get, getAll };

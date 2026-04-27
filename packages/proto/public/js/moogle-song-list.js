import { html, css, shadow } from "https://unpkg.com/@unbndl/html?module";
import { MoogleSongElement } from "/js/moogle-song.js";
import reset from "/js/styles/reset.css.js";

export class MoogleSongListElement extends HTMLElement {
  constructor() {
  super();
  shadow(this).styles(...MoogleSongListElement.styles);
}

  static observedAttributes = ["src"];

  attributeChangedCallback(name, _, newValue) {
    if (name === "src") {
      this.hydrate(newValue).then((data) => {
        const view = MoogleSongListElement.render(data);
        shadow(this).replace(view);
      });
    }
  }

  hydrate(src) {
    return fetch(src)
      .then((response) => {
        if (response.status !== 200) throw `HTTP Status ${response.status}`;
        return response.json();
      })
      .catch((error) => {
        console.log(`Could not fetch ${src}:`, error);
      });
  }

  static render(data) {
    const songs = data?.songs || [];

    return html`
      <div class="song-list">
        ${songs.map((song) => {
          return html`
            <moogle-song>
              <span slot="title">${song.title}</span>
              <a slot="artist" href=${song.artistHref}>
                ${song.artistName}
              </a>
              <a slot="album" href=${song.albumHref}>
                ${song.albumName}
              </a>
              <a slot="genre" href=${song.genreHref}>
                ${song.genreName}
              </a>
              <span slot="duration">${song.duration}</span>
              <span slot="year">${song.year}</span>
            </moogle-song>
          `;
        })}
      </div>
    `;
  }

  static styles = [
    reset.styles,
    css`
      :host {
        display: block;
      }

      .song-list {
        display: grid;
        gap: 16px;
      }
    `
  ];
}
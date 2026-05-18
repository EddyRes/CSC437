import { html, css, shadow } from "@unbndl/html";
import { createViewModel, fromAttributes } from "@unbndl/view";
import { fromAuth } from "@unbndl/auth";

import { MoogleSongElement } from "/js/moogle-song.js";
import reset from "/js/styles/reset.css.js";

export class MoogleSongListElement extends HTMLElement {
  viewModel = createViewModel({
    src: "",
    authenticated: false,
    token: "",
    songs: []
  })
    .with(fromAttributes(this), "src")
    .with(fromAuth(this), "authenticated", "token");

  constructor() {
    super();

    shadow(this)
      .styles(...MoogleSongListElement.styles)
      .replace(this.viewModel.render(MoogleSongListElement.view));

    this.viewModel.createEffect(($) => {
      if ($.authenticated && $.src) {
        this.hydrate($.src).then((data) => {
          this.viewModel.set("songs", data.songs || []);
        });
      }
    });
  }

  get authorization() {
    const $ = this.viewModel.toObject();

    if ($.authenticated && $.token) {
      return { Authorization: `Bearer ${$.token}` };
    }

    return {};
  }

  hydrate(src) {
    return fetch(src, {
      headers: this.authorization
    })
      .then((response) => {
        if (response.status !== 200) {
          throw `HTTP Status ${response.status}`;
        }

        return response.json();
      })
      .catch((error) => {
        console.log(`Could not fetch ${src}:`, error);
        return { songs: [] };
      });
  }

  static view = html`
  ${($) =>
    $.authenticated
      ? html`
          <div class="song-list">
            ${$.songs.map((song) => {
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
        `
      : html`
          <div class="login-message">
            <p>
              Log in to view songs and access your music library.
            </p>

            <a href="/login.html">Go to Login</a>
          </div>
        `}
`;

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

      .login-message {
        text-align: center;
        padding: 32px 16px;
        color: var(--color-text);
      }

      .login-message p {
        margin-bottom: 16px;
        font-size: 1rem;
      }

      .login-message a {
        color: var(--color-link);
        font-weight: bold;
      text-decoration: none;
      }
    `
  ];
}
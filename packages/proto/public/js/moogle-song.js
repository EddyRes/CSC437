import { html, css, shadow } from "https://unpkg.com/@unbndl/html?module";
import reset from "/js/styles/reset.css.js";

export class MoogleSongElement extends HTMLElement {
  static template = html`
    <template>
      <article class="song-card">
        <h3 class="song-title">
          <slot name="title">Untitled Song</slot>
        </h3>

        <p>
          <strong>Artist:</strong>
          <slot name="artist">Unknown Artist</slot>
        </p>

        <p>
          <strong>Album:</strong>
          <slot name="album">Unknown Album</slot>
        </p>

        <p>
          <strong>Genre:</strong>
          <slot name="genre">Unknown Genre</slot>
        </p>

        <p>
          <strong>Duration:</strong>
          <slot name="duration">0:00</slot>
        </p>

        <p>
          <strong>Release Year:</strong>
          <slot name="year">0000</slot>
        </p>
      </article>
    </template>
  `;

  constructor() {
    super();
    shadow(this)
      .template(MoogleSongElement.template)
      .styles(MoogleSongElement.styles);
  }

  static styles = [
  reset.styles,
  css`
    :host {
      display: block;
      margin-bottom: 16px;
    }

    .song-card {
      background-color: rgb(248 251 255);
      border: 15px solid var(--color-border);
      border-radius: 10px;
      padding: 16px;
      box-shadow: 0 2px 6px rgb(0 0 0 / 0.1);
    }

    .song-title {
      color: var(--color-accent);
      font-family: "Playfair Display", serif;
      font-size: 1.2rem;
      margin-bottom: 12px;
    }

    p {
      margin: 0 0 8px 0;
      line-height: 1.5;
    }

    p:last-child {
      margin-bottom: 0;
    }

    a {
      color: var(--color-link);
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }
  `
];
}
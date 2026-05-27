import { css, html, shadow } from "@unbndl/html";
import { createViewModel } from "@unbndl/view";
import { fromStore } from "@unbndl/store";

import { Song } from "server/models";
import { Model } from "../model.ts";

interface SongsViewModel {
  songs?: Song[];
}

export class SongsViewElement extends HTMLElement {
  viewModel = createViewModel<SongsViewModel>({})
    .with(fromStore<Model>(this), "songs");

  constructor() {
    super();

    shadow(this)
      .styles(SongsViewElement.styles)
      .replace(this.viewModel.render(SongsViewElement.view));

    setTimeout(() => {
  this.dispatchEvent(
    new CustomEvent("store:message", {
      bubbles: true,
      composed: true,
      detail: ["songs/request", {}]
    })
  );
});
  }

  static view = html<SongsViewModel>`
    <main class="page-layout">
      <section class="page-card">
        <h2>Songs View</h2>

        ${($) =>
          $.songs && $.songs.length
            ? html`
                <div class="song-list">
                  ${$.songs.map(
                    (song) => html`
                      <article class="song-card">
                        <h3>${song.title}</h3>
                        <p><strong>Artist:</strong> ${song.artistName}</p>
                        <p><strong>Album:</strong> ${song.albumName}</p>
                        <p><strong>Genre:</strong> ${song.genreName}</p>
                        <p><strong>Duration:</strong> ${song.duration}</p>
                        <p><strong>Release Year:</strong> ${song.year}</p>
                      </article>
                    `
                  )}
                </div>
              `
            : html`
                <p>Loading songs...</p>
              `}

        <p class="back-link">
          <a href="/app">Back to Home</a>
        </p>
      </section>
    </main>
  `;

  static styles = css`
    .page-layout {
      max-width: 900px;
      margin: 24px auto;
      padding: 0 24px 24px;
    }

    .page-card,
    .song-card {
      background-color: rgb(255 255 255);
      border: 1px solid var(--color-border);
      border-radius: 12px;
      padding: 20px;
    }

    h2,
    h3 {
      color: var(--color-accent);
      font-family: "Playfair Display", serif;
    }

    h2 {
      border-bottom: 2px solid var(--color-border);
      padding-bottom: 6px;
      margin-top: 0;
    }

    .song-list {
      display: grid;
      gap: 16px;
      margin-top: 16px;
    }

    p {
      color: var(--color-text);
      line-height: 1.6;
    }

    a {
      color: var(--color-link);
      font-weight: bold;
      text-decoration: none;
    }

    .back-link {
      margin-top: 20px;
    }
  `;
}
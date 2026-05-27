import { css, html, shadow } from "@unbndl/html";
import { createViewModel } from "@unbndl/view";
import { fromStore } from "@unbndl/store";

import { Model } from "../model.ts";

interface HomeViewModel {
  songs?: Model["songs"];
}

export class HomeViewElement extends HTMLElement {
  viewModel = createViewModel<HomeViewModel>({})
    .with(fromStore<Model>(this), "songs");

  constructor() {
    super();

    shadow(this)
      .styles(HomeViewElement.styles)
      .replace(this.viewModel.render(HomeViewElement.view));
  }

  static view = html<HomeViewModel>`
    <main class="home-grid">
      <section class="intro-card">
        <h2>Welcome</h2>
        <p>
          Welcome to Moogle. Explore songs, artists, albums, genres, playlists, and listeners.
        </p>

        <p>
          Songs loaded in store:
          <strong>${($) => $.songs?.length ?? 0}</strong>
        </p>
      </section>

      <section class="songs-card">
        <h2>
          Songs
          <svg class="icon" aria-hidden="true">
            <use href="/icons/music.svg#icon-song"></use>
          </svg>
        </h2>

        <p>
          View the full songs list on the Songs page.
        </p>

        <p>
          <a href="/app/songs">Go to Songs</a>
        </p>
      </section>

      <section class="explore-card">
        <h2>Explore More</h2>

        <ul class="item-list">
          <li><a href="/app">Home</a></li>
          <li><a href="/app/songs">Songs View</a></li>
        </ul>
      </section>
    </main>
  `;

  static styles = css`
    .home-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
      max-width: 1100px;
      margin: 24px auto;
      padding: 0 24px 24px;
    }

    .intro-card,
    .songs-card,
    .explore-card {
      background-color: rgb(255 255 255);
      border: 2px solid var(--color-border);
      border-radius: 12px;
      padding: 20px;
    }

    .intro-card {
      grid-column: 1 / -1;
    }

    h2 {
      color: var(--color-accent);
      border-bottom: 2px solid var(--color-border);
      padding-bottom: 6px;
      margin-top: 0;
      font-family: "Playfair Display", serif;
      font-size: 1.5rem;
    }

    p {
      color: var(--color-text);
      line-height: 1.6;
      margin-bottom: 12px;
    }

    .item-list {
      list-style: none;
      padding-left: 0;
      display: grid;
      gap: 12px;
    }

    .item-list li {
      background-color: rgb(248 251 255);
      border: 1px solid var(--color-border);
      border-radius: 10px;
      padding: 12px 14px;
    }

    a {
      color: var(--color-link);
      font-weight: 500;
      text-decoration: none;
    }

    svg.icon {
      display: inline-block;
      height: 0.75em;
      width: 0.75em;
      vertical-align: -0.1em;
      fill: currentColor;
      margin-left: 6px;
    }

    @media (max-width: 900px) {
      .home-grid {
        grid-template-columns: 1fr;
      }

      .intro-card {
        grid-column: auto;
      }
    }
  `;
}
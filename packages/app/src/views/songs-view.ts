import { css, html, shadow } from "@unbndl/html";
import { createViewModel } from "@unbndl/view";
import { fromAuth } from "@unbndl/auth";

interface Song {
  _id: string;
  title: string;
  artistName: string;
  albumName: string;
  genreName: string;
  duration: string;
  year: string;
}

interface SongsViewModel {
  authenticated: boolean;
  token: string;
  songs: Song[];
}

export class SongsViewElement extends HTMLElement {
  viewModel = createViewModel<SongsViewModel>({
    authenticated: false,
    token: "",
    songs: []
  }).with(fromAuth(this), "authenticated", "token");

  constructor() {
    super();

    console.log("SongsViewElement loaded");

    shadow(this)
      .styles(SongsViewElement.styles)
      .replace(this.viewModel.render(SongsViewElement.view));

    this.viewModel.createEffect(($) => {
      if ($.authenticated) {
        this.hydrate();
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

  hydrate() {
    return fetch("/api/songs", {
      headers: this.authorization
    })
      .then((response) => {
        if (response.status !== 200) {
          throw `HTTP Status ${response.status}`;
        }

        return response.json();
      })
      .then((json) => {
        this.viewModel.set("songs", json.songs || []);
      })
      .catch((error) => {
        console.log("Could not fetch songs:", error);
      });
  }

  static view = html<SongsViewModel>`
    <main class="page-layout">
      <section class="page-card">
        <h2>Songs View</h2>

        ${($) =>
          $.authenticated
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
                <p>You must log in to view songs.</p>
                <p><a href="/login.html">Go to Login</a></p>
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
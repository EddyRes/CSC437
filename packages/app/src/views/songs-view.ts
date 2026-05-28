import { css, html, shadow } from "@unbndl/html";
import { createViewModel } from "@unbndl/view";
import { fromStore } from "@unbndl/store";

import { Song } from "server/models";
import { Model } from "../model.ts";

interface SongsViewModel {
  songs?: Song[];
  editingSong?: Song;
  error?: string;
}

export class SongsViewElement extends HTMLElement {
  viewModel = createViewModel<SongsViewModel>({})
    .with(fromStore<Model>(this), "songs", "editingSong", "error");

  constructor() {
    super();

    shadow(this)
      .styles(SongsViewElement.styles)
      .replace(this.viewModel.render(SongsViewElement.view));

    setTimeout(() => {
      this.dispatch(["songs/request", {}]);
    });

    this.shadowRoot?.addEventListener("click", (event) =>
      this.handleClick(event)
    );

    this.shadowRoot?.addEventListener("submit", (event) =>
      this.submitForm(event)
    );
  }

  dispatch(message: unknown[]) {
    this.dispatchEvent(
      new CustomEvent("store:message", {
        bubbles: true,
        composed: true,
        detail: message
      })
    );
  }

  handleClick(event: Event) {
    const target = event.target;

    if (!(target instanceof HTMLElement)) return;

    const cancelButton = target.closest("button[data-action='cancel']");
    if (cancelButton) {
    this.dispatch(["song/cancel", {}]);
    return;
    }

    const button = target.closest("button[data-action='edit']");
    if (!(button instanceof HTMLButtonElement)) return;

    const id = button.dataset.id;
    const song = this.viewModel.$.songs?.find((item) => item._id === id);

    if (song) {
      this.dispatch(["song/edit", { song }]);
    }
  }

  submitForm(event: Event) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const json = this.formDataToJSON(form) as Song;
    const id = form.dataset.id;

    if (id) {
      this.dispatch(["song/save", { id, song: json }]);
    }
  }

  formDataToJSON(form: HTMLFormElement): object {
    const inputs = Array.from(form.elements).filter(
      (el) => "name" in el
    ) as Array<HTMLInputElement>;

    const entries = inputs.map((el) => [el.name, el.value]);

    return Object.fromEntries(entries);
  }

  static view = html<SongsViewModel>`
    <main class="page-layout">
      <section class="page-card">
        <h2>Songs View</h2>

        ${($) =>
  $.error
    ? html`
        <p class="error-message">
          ${$.error}
        </p>
      `
    : ""}

        ${($) =>
          $.editingSong
            ? html`
                <form class="song-form" data-id=${$.editingSong._id}>
                  <h3>Edit Song</h3>

                  <label>
                    <span>Title</span>
                    <input name="title" value=${$.editingSong.title} />
                  </label>

                  <label>
                    <span>Artist</span>
                    <input name="artistName" value=${$.editingSong.artistName} />
                  </label>

                  <label>
                    <span>Album</span>
                    <input name="albumName" value=${$.editingSong.albumName} />
                  </label>

                  <label>
                    <span>Genre</span>
                    <input name="genreName" value=${$.editingSong.genreName} />
                  </label>

                  <label>
                    <span>Duration</span>
                    <input name="duration" value=${$.editingSong.duration} />
                  </label>

                  <label>
                    <span>Release Year</span>
                    <input name="year" value=${$.editingSong.year} />
                  </label>

                  <input
                    type="hidden"
                    name="_id"
                    value=${$.editingSong._id}
                  />

                  <input
                    type="hidden"
                    name="artistHref"
                    value=${$.editingSong.artistHref}
                  />

                  <input
                    type="hidden"
                    name="albumHref"
                    value=${$.editingSong.albumHref}
                  />

                  <input
                    type="hidden"
                    name="genreHref"
                    value=${$.editingSong.genreHref}
                  />

                  <button type="submit">Save Song</button>

                  <button type="button" data-action="cancel">
                    Cancel
                  </button>
                </form>
              `
            : ""}

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

                        <button
                          type="button"
                          data-action="edit"
                          data-id=${song._id}
                        >
                          Edit
                        </button>
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
    .song-card,
    .song-form {
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

    .song-form {
      display: grid;
      gap: 14px;
      margin-bottom: 20px;
      background-color: rgb(248 251 255);
    }

    label {
      display: grid;
      gap: 6px;
      font-weight: bold;
      color: var(--color-text);
    }

    input {
      font: inherit;
      padding: 10px 12px;
      border: 1px solid var(--color-border);
      border-radius: 8px;
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

    button {
      background-color: var(--color-accent);
      color: var(--color-text-inverted);
      border: none;
      border-radius: 8px;
      padding: 10px 14px;
      font: inherit;
      font-weight: bold;
      cursor: pointer;
      width: fit-content;
    }

    .back-link {
      margin-top: 20px;
    }

    .error-message {
  background-color: rgb(255 235 235);
  border: 1px solid rgb(180 60 60);
  color: rgb(120 30 30);
  border-radius: 8px;
  padding: 12px;
  font-weight: bold;
}
  `;
}
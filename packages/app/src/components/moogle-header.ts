import { css, html, shadow } from "@unbndl/html";
import { createViewModel } from "@unbndl/view";
import { fromAuth } from "@unbndl/auth";

export class MoogleHeaderElement extends HTMLElement {
  viewModel = createViewModel({
    authenticated: false,
    username: ""
  }).with(fromAuth(this), "authenticated", "username");

  view = html`
    <header class="site-header">
      <div class="site-brand">
        <h1>
          Moogle
          <svg class="icon" aria-hidden="true">
            <use href="/icons/music.svg#icon-song"></use>
          </svg>
        </h1>
        <p class="page-tagline">Get In Tune</p>
      </div>

      <nav class="site-nav">
        <a href="/app">Home</a>
        <a href="/app/songs">Songs</a>
      </nav>

      <div class="header-actions">
        ${($) =>
          $.authenticated
            ? html`
                <button class="auth-button" type="button" data-action="signout">
                  Sign Out
                </button>
              `
            : html`
                <button class="auth-button" type="button" data-action="login">
 		  Login
		</button>
                  
                
              `}
      </div>
    </header>

    <section class="welcome-user">
      <p>
        Hello,
        <strong>${($) => $.username || "anonymous"}</strong>
      </p>
    </section>
  `;

  constructor() {
  super();

  shadow(this)
    .styles(MoogleHeaderElement.styles)
    .replace(this.viewModel.render(this.view));

  this.shadowRoot?.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof HTMLElement)) return;

    if (target.closest("[data-action='login']")) {
      window.location.href = "/login.html";
      return;
    }

    if (target.closest("[data-action='signout']")) {
      this.signout();
      return;
    }
  });
}

  signout() {
    localStorage.removeItem("auth:token");
    sessionStorage.removeItem("auth:token");

    const customEvent = new CustomEvent("auth:message", {
      bubbles: true,
      composed: true,
      detail: ["auth/signout"]
    });

    this.dispatchEvent(customEvent);

    window.location.href = "/app";
  }

  static styles = css`
    .site-header {
      background-color: var(--color-background-header);
      color: var(--color-text-inverted);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 24px;
      padding: 20px 24px;
    }

    .site-brand h1 {
      color: var(--color-text-inverted);
      margin: 0;
      font-family: "Playfair Display", serif;
      font-size: 2.2rem;
    }

    .page-tagline {
      color: var(--color-text-inverted);
      margin-top: 4px;
      font-size: 0.95rem;
    }

    .site-nav {
      display: flex;
      gap: 18px;
      align-items: center;
    }

    .site-nav a {
      color: var(--color-text-inverted);
      text-decoration: none;
      font-weight: bold;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .auth-button,
    .auth-link {
      background-color: transparent;
      border: 1px solid var(--color-text-inverted);
      color: var(--color-text-inverted);
      border-radius: 8px;
      padding: 8px 12px;
      font: inherit;
      font-weight: bold;
      text-decoration: none;
      cursor: pointer;
    }

    .welcome-user {
      text-align: center;
      padding: 12px 0 0;
      font-size: 1rem;
      font-weight: 500;
      color: var(--color-text);
    }

    svg.icon {
      display: inline-block;
      height: 0.75em;
      width: 0.75em;
      vertical-align: -0.1em;
      fill: currentColor;
      margin-left: 6px;
    }
  `;
}

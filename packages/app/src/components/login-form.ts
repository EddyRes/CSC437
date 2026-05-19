import { css, html, shadow } from "@unbndl/html";
import { createViewModel, fromInputs } from "@unbndl/view";

export class LoginFormElement extends HTMLElement {
  viewModel = createViewModel({
    username: "",
    password: ""
  }).with(fromInputs(this), "username", "password");

  view = html`
    <form>
      <slot></slot>

      <button type="submit">
        <slot name="submit-label">Login</slot>
      </button>
    </form>
  `;

  constructor() {
    super();

    shadow(this)
      .styles(LoginFormElement.styles)
      .replace(this.viewModel.render(this.view));

    this.shadowRoot?.addEventListener("submit", (ev) =>
      this.submitLogin(ev, this.getAttribute("api") || "#")
    );
  }

  submitLogin(event: Event, endpoint: string) {
    event.preventDefault();

    const data = this.viewModel.toObject();

    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw `Form submission failed: Status ${res.status}`;
        }

        return res.json();
      })
      .then((json) => {
        const { token } = json;

        const customEvent = new CustomEvent("auth:message", {
          bubbles: true,
          composed: true,
          detail: ["auth/signin", { token, redirect: "/app" }]
        });

        this.dispatchEvent(customEvent);
      });
  }

  static styles = css`
    form {
      display: grid;
      gap: 16px;
      margin-top: 16px;
    }

    label {
      display: grid;
      gap: 6px;
      font-weight: bold;
    }

    input {
      font: inherit;
      padding: 10px 12px;
      border: 1px solid var(--color-border);
      border-radius: 8px;
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
    }
  `;
}

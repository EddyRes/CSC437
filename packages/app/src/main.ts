import { define, html } from "@unbndl/html";
import { Auth } from "@unbndl/auth";
import { BrowserHistory, Switch } from "@unbndl/switch";

import { MoogleHeaderElement } from "./components/moogle-header.ts";
import { HomeViewElement } from "./views/home-view.ts";
import { SongsViewElement } from "./views/songs-view.ts";

const routes = [
  {
  path: "/app/songs",
  view: html`
    <songs-view></songs-view>
  `
},

  {
    path: "/app",
    view: html`
      <home-view></home-view>
    `
  }
];

define({
  "auth-provider": Auth.Provider,
  "history-provider": BrowserHistory.Provider,

  "router-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes);
    }
  },

  "moogle-header": MoogleHeaderElement,
  "home-view": HomeViewElement,
  "songs-view": SongsViewElement
});
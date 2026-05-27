import { define, html } from "@unbndl/html";
import { Auth } from "@unbndl/auth";
import { BrowserHistory, Switch } from "@unbndl/switch";

import { MoogleHeaderElement } from "./components/moogle-header.ts";
import { HomeViewElement } from "./views/home-view.ts";
import { SongsViewElement } from "./views/songs-view.ts";

import { Store } from "@unbndl/store";
import { Msg } from "./messages.ts";
import { Model, init } from "./model.ts";
import { update, Cmd } from "./update.ts";

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

  "store-provider": class AppStore extends Store.Provider<Model, Msg, Cmd> {
    constructor() {
      super(update, init);
    }
  },

  "router-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes);
    }
  },

  "moogle-header": MoogleHeaderElement,
  "home-view": HomeViewElement,
  "songs-view": SongsViewElement
});

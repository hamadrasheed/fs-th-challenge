import { isDebug } from "../vars/mode";
import create from "zustand";
import { devtools, persist } from "zustand/middleware";

class ZustandHelper {
  setup = () => {};
  devOpts = {};
  middleware = {
    name: null,
    getStorage: () => localStorage,
  };

  constructor(params) {
    const {
      setup,
      name = (Math.random() + 1).toString(36).substring(7),
      enabled = true,
      middleware,
    } = params;
    const { middlewareName, getStorage } = middleware ?? {};

    this.setup = setup;

    this.devOpts = {
      name,
      enabled,
      anonymousActionType: name,
    };
    if (middlewareName)
      this.middleware = { ...this.middleware, name: middlewareName };
  }

  get() {
    if (isDebug())
      return this.middleware.name
        ? create(
            persist(devtools(this.setup, this.devOpts), {
              name: this.middleware.name,
              getStorage: this.middleware.getStorage,
              // serialize: (state) => btoa(JSON.stringify(state)),
              // deserialize: (str) => JSON.parse(atob(str)),
            })
          )
        : create(devtools(this.setup, this.devOpts));

    return create(
      this.middleware.name
        ? persist(this.setup, {
            name: this.middleware.name,
            getStorage: this.middleware.getStorage,
            serialize: (state) => btoa(JSON.stringify(state)),
            deserialize: (str) => JSON.parse(atob(str)),
          })
        : this.setup
    );
  }
}

export default ZustandHelper;

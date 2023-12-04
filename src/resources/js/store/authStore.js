import ZustandHelper from "../helpers/ZustandHelper";
import { TOKEN_KEY } from "../vars/localStorage";

const init = {
  token: null,
  name: null,
  photo: null,
  roles: [],
  abilities: [],
  modalLogout: false,
};

const setup = (set, get) => ({
  ...init,
  setAuthData: (data) => set({ ...get(), ...data }),
  resetAuthData: () => set({ ...init }),
  setModalLogout: (cond) => set({ modalLogout: cond }),
});

const useZustand = new ZustandHelper({
  name: "auth",
  setup,
  middleware: {
    middlewareName: TOKEN_KEY,
  },
});

const authStore = useZustand.get();

export default authStore;

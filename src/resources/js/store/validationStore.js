import ZustandHelper from "../helpers/ZustandHelper";
import { VALIDATION_KEY } from "../vars/localStorage";
import { isDebug } from "../vars/mode";

const setup = (set, get) => ({
  validation: {},

  setValidation: (data) =>
    set({
      validation: { ...get().validation, ...data },
    }),

  resetValidation: () => set({ validation: {} }),
});

let middleware = {};

if (isDebug())
  middleware = {
    middlewareName: VALIDATION_KEY,
  };

const useZustand = new ZustandHelper({
  name: "validation",
  setup,
  middleware,
});

const validationStore = useZustand.get();

export default validationStore;

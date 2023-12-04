import ZustandHelper from "../helpers/ZustandHelper";
import { MULTI_KEY } from "../vars/localStorage";

const setup = (set, get) => ({
  selected: [],

  addSelected: (data = []) => {
    let res = get().selected;

    if (typeof data == "string") res = [...res, data];
    else res = [...res, ...data];
    set({ selected: res });
  },
  removeSelected: (choose) => {
    set({ selected: get().selected.filter((e) => e != choose) });
  },

  resetSelected: () => set({ selected: [] }),
});

const useZustand = new ZustandHelper({
  name: "multiSelect",
  setup,
  middleware: {
    middlewareName: MULTI_KEY,
  },
});

const multiSelectStore = useZustand.get();

export default multiSelectStore;

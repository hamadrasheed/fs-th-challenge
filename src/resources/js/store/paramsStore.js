import ZustandHelper from "../helpers/ZustandHelper";

const init = {
  params: {},
};

const setup = (set, get) => ({
  ...init,
  setParams: (params) => set({ params }),
  resetParams: () => set({ ...init }),
});

const useZustand = new ZustandHelper({
  name: "params",
  setup,
});

const paramsStore = useZustand.get();

export default paramsStore;

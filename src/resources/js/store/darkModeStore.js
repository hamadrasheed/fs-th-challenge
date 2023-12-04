import ZustandHelper from "../helpers/ZustandHelper";

const data = {
  show: null,
};

const setup = (set) => ({
  ...data,

  setDarkMode: (show) =>
    set({
      show,
    }),

  resetDarkMode: () => set(data),
});

const useZustand = new ZustandHelper({
  name: "darkMode",
  setup,
});

const darkModeStore = useZustand.get();

export default darkModeStore;

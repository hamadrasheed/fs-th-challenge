import ZustandHelper from "../helpers/ZustandHelper";

const data = {
  loading: {},
  modal: {
    show: false,
    message: null,
  },
};

const setup = (set, get) => ({
  ...data,

  setLoading: (data) =>
    set({
      loading: { ...get().loading, ...data },
    }),

  setModal: (modal) =>
    set({
      modal,
    }),

  deleteLoading: (data) => {
    let res = get().loading ?? {};
    data.forEach((e) => {
      if (res[e]) delete res[e];
    });

    set({
      loading: res,
    });
  },

  resetLoading: () => set(data),
});

const useZustand = new ZustandHelper({
  name: "loading",
  setup,
});

const loadingStore = useZustand.get();

export default loadingStore;

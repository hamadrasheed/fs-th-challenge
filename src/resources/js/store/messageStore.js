import ZustandHelper from "../helpers/ZustandHelper";

const defaultValue = {
  showModal: false,
  data: {
    title: null,
    subtitle: null,
    status: "error",
  },
  duration: 2500,
  redirect: null,
  force: false,
  cannotClose: false,
  buttonText: "Redirect me there!",
  previewImage: {
    showModal: false,
    url: null,
  },
};

const setup = (set) => ({
  ...defaultValue,
  setMessage: (data) => set({ ...defaultValue, ...data }),
  closeMessage: () => set({ showModal: false }),
  setPreviewImage: (previewImage) => set({ previewImage }),
});

const useZustand = new ZustandHelper({
  name: "message",
  setup,
});

const messageStore = useZustand.get();

export default messageStore;

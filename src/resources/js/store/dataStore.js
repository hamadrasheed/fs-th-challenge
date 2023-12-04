import { objChanger } from "../helpers/ObjHelper";
import ZustandHelper from "../helpers/ZustandHelper";

const init = {
  lock: null,
  menuData: [],
  data: [],
  heroData: [],
  feedsData: [],
  currentPage: 1,
  lastPage: 1,
  from: null,
  to: null,
  total: 0,
  links: [],
  details: {},
  deleteId: null,
  accessable: {},
  isNotFound: false,
  requestDataToggle: false,
};

const setup = (set, get) => ({
  ...init,
  setRequestDataToggle: (requestDataToggle) => set({ requestDataToggle }),
  // trigger view not found
  setIsNotFound: (isNotFound) => set({ isNotFound }),
  // set spesific key form data
  setDetail: (details) => {
    set({ details: { ...get().details, ...details } });
  },
  // delete spesific detail by key
  deleteDetail: (key) =>
    set({ details: objChanger(get().details, { except: [key] }) }),
  // handdle lock page
  setLock: (lock) => set({ lock }),
  // save id for delete data & trigger open modal
  setDeleteId: (deleteId) => set({ deleteId }),
  // dispatch open modal delete data
  resetdeleteId: () => set({ deleteId: null }),
  // set menu data
  setMenuData: (e) => {
    set({
      menuData: e,
    });
  },
  // set hero data
  setHeroData: (e) => {
    set({
      heroData: e,
    });
  },
  // set feeds data
  setFeedsData: (e) => {
    set({
      feedsData: e,
    });
  },
  // set data without paginate
  setNoPaginate: (e) => {
    set({
      data: e,
    });
  },
  // set data table
  setPaginate: (e) => {
    set({
      data: e.data,
      currentPage: parseInt(e.current_page),
      lastPage: parseInt(e.last_page),
      from: parseInt(e.from),
      to: parseInt(e.to),
      total: parseInt(e.total),
      links: e.links,
    });
  },
  // reset paginate
  resetPaginate: () =>
    set({
      ...Object.keys(init)
        .filter((e) =>
          [
            "data",
            "currentPage",
            "lastPage",
            "from",
            "to",
            "total",
            "links",
          ].includes(e)
        )
        .reduce((prev, next) => ({ ...prev, [next]: init[next] }), {}),
    }),
  setAccessable: (accessable = {}) => set({ accessable }),
});

const useZustand = new ZustandHelper({
  name: "data",
  setup,
});

const dataStore = useZustand.get();

export default dataStore;

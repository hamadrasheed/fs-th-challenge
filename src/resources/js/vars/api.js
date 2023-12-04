export const OTHER_URL_API = () =>
  import.meta.env.DEV
    ? import.meta.env.VITE_URL_API_TEST
    : import.meta.env.VITE_URL_API;
export const DEFAULT_URL_API = () => OTHER_URL_API();

// auth
const auth = "/v1/auth";
export const A_SIGNIN = `${auth}/login`;
export const A_SIGNUP = `${auth}/register`;
export const A_FORGOT = `${auth}/forgot-password`;
export const A_RESET = `${auth}/reset-password`;
export const A_SIGNOUT = `${auth}/logout`;
export const A_CHECK = `${auth}/check`;
export const A_CHANGE_PASSWORD = `${auth}/change-password`;
export const A_EDIT_PROFILE = `${auth}/edit-profile`;
export const A_UPDATE_PROFILE = `${auth}/update-profile`;

// news
const news = "/v1/news";
export const A_NEWS_HERO = `${news}/hero`;
export const A_NEWS_FEEDS = `${news}/feeds`;
export const A_NEWS_DETAIL = `${news}/detail`;
export const A_NEWS_PREFERED_CATEGORY = `${news}/prefered-category`;
export const A_NEWS_PREFERED_FEEDS = `${news}/prefered-feeds`;
export const A_NEWS_LIST = `${news}/list`;
export const A_NEWS_SYNC = `${news}/sync`;

// utils
const utils = "/utils";
export const A_U_CATEGORY = `${utils}/news/category`;
export const A_U_LANGUAGE = `${utils}/news/language`;
export const A_U_COUNTRY = `${utils}/news/country`;
export const A_U_AUTHOR = `${utils}/news/author`;
export const A_U_SOURCE = `${utils}/news/source`;
export const A_U_GENDER = `${utils}/gender`;

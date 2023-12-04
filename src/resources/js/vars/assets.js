const URL = () =>
    import.meta.env.DEV
        ? import.meta.env.VITE_URL_ASSETS_TEST
        : import.meta.env.VITE_URL_ASSETS;

export const AUTH_IMG = () => URL() + "/images/auth-image.jpg";
export const AUTH2_IMG = () => URL() + "/images/auth-image2.jpg";
export const AUTH3_IMG = () => URL() + "/images/auth-image3.jpg";
export const AUTH4_IMG = () => URL() + "/images/auth-image4.jpg";
export const AUTH5_IMG = () => URL() + "/images/auth-image5.jpg";
export const AUTH6_IMG = () => URL() + "/images/auth-image6.jpg";
export const PAPERPLANE = () => URL() + "/images/paperplane.png";
export const ERROR_404_IMG = () => URL() + "/images/404-illustration.svg";
export const ICON_IMG = () => URL() + "/images/icon.png";
export const ICON_WHITE_IMG = () => URL() + "/images/icon-white.png";
export const LOGO_IMG = () => URL() + "/images/logotype.png";
export const LOGO_WHITE_IMG = () => URL() + "/images/logotype-white.png";
export const AVA_IMG = () => URL() + "/images/mock/1.png";
export const LOADING_IMG = () => URL() + "/images/loading.svg";

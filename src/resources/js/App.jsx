import React, { useEffect, Fragment } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import Spa from "./routes/Spa";
import authStore from "./store/authStore";
import AuthAction from "./action/AuthAction";
import ModalLoading from "./components/modal/ModalLoading";
import ModalMessage from "./components/modal/ModalMessage";
import ModalPreview from "./components/modal/ModalPreview";
// import darkModeStore from "./store/darkModeStore";
// import { DARK_MODE } from "./vars/localStorage";

function App() {
  const { token } = authStore((state) => state);

  const { checkAPI } = AuthAction();

  //   const { show: useDarkMode, setDarkMode } = darkModeStore((state) => state);

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]); // triggered on route change

  // check token
  useEffect(() => {
    if (token) checkAPI();
  }, [token]);

  //   darkMode
  //   useEffect(() => {
  //     let currentDarkMode = localStorage.getItem(DARK_MODE);
  //     currentDarkMode =
  //       typeof currentDarkMode == "string"
  //         ? currentDarkMode.toLocaleLowerCase() == "true"
  //         : currentDarkMode;

  //     const res = useDarkMode === null ? currentDarkMode : useDarkMode;

  //     if (useDarkMode === null) setDarkMode(res);

  //     const el = document.querySelector("html");
  //     const hasDarkMode = el?.classList.contains("dark");
  //     const darkClass = "dark";

  //     //   //   new value
  //     if (useDarkMode !== null) localStorage.setItem(DARK_MODE, res);

  //     if (res && !hasDarkMode) el?.classList?.add(darkClass);
  //     if (!res && hasDarkMode) el?.classList?.remove(darkClass);
  //   }, [useDarkMode]);

  return (
    <>
      <Router>
        <Fragment>
          <Spa />
        </Fragment>
      </Router>
      <ModalMessage />
      <ModalLoading />
      <ModalPreview />
    </>
  );
}
export default App;

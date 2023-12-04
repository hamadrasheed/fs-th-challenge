import React from "react";
import darkModeStore from "../../store/darkModeStore";
import { LOGO_IMG, LOGO_WHITE_IMG } from "../../vars/assets";

function Preloader() {
  const { show: darkMode } = darkModeStore((state) => state);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-white dark:bg-navy-900">
      <img
        className="animate-pulse w-1/3 md:w-[15%]"
        src={!darkMode ? LOGO_IMG() : LOGO_WHITE_IMG()}
        alt="logo"
      />
    </div>
  );
}

export default Preloader;

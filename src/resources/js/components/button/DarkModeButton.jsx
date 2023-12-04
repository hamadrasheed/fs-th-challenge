import { nanoid } from "nanoid";
import React from "react";
import { MdDarkMode } from "react-icons/md";
import { BsFillBrightnessLowFill } from "react-icons/bs";
import darkModeStore from "../../store/darkModeStore";
import Transition from "../../utils/Transition";
import { useState } from "react";
import { useEffect } from "react";

function DarkModeButton() {
  const { setDarkMode, show } = darkModeStore((state) => state);

  const [init, setInit] = useState(true);

  return (
    <button
      type="button"
      className="group w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-navy-300/20 dark:hover:bg-navy-300/30 hover:bg-slate-200 transition duration-150 rounded-full ml-3"
      onClick={() => {
        setInit(false);
        setDarkMode(!show);
      }}
    >
      <span className="sr-only">darkmode</span>

      {init &&
        (show ? (
          <MdDarkMode className="w-5 h-5 text-slate-500 group-hover:text-yellow-400" />
        ) : (
          <BsFillBrightnessLowFill className="w-5 h-5 text-slate-500 group-hover:text-amber-500" />
        ))}
      <Transition
        id={nanoid()}
        role="dialog"
        aria-modal="true"
        show={show}
        enter="transition ease-in-out duration-200"
        enterStart="opacity-0 translate-y-4"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-in-out duration-200"
        leaveStart="opacity-100 translate-y-0"
        leaveEnd="opacity-0 translate-y-4"
      >
        <MdDarkMode className="w-5 h-5 text-slate-500 group-hover:text-yellow-400" />
      </Transition>
      <Transition
        id={nanoid()}
        role="dialog"
        aria-modal="true"
        show={!show}
        enter="transition ease-in-out duration-200"
        enterStart="opacity-0 translate-y-4"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-in-out duration-200"
        leaveStart="opacity-100 translate-y-0"
        leaveEnd="opacity-0 translate-y-4"
      >
        <BsFillBrightnessLowFill className="w-5 h-5 text-slate-500 group-hover:text-amber-500" />
      </Transition>
    </button>
  );
}

export default DarkModeButton;

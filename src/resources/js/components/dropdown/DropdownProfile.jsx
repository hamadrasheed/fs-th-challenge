import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Transition from "../../utils/Transition";

import classNames from "classnames";

import authStore from "../../store/authStore";
import { W_S_ACCOUNT } from "../../vars/web";

function DropdownProfile({
  align,
  noticeSignout,
  setNoticeSignout,
  isMenuWhite,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const trigger = useRef(null);
  const dropdown = useRef(null);

  const { name, photo } = authStore((state) => state);

  //   load roles from zuustand
  const { roles } = authStore((state) => state);

  const location = useLocation();
  const { pathname } = location;

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [dropdownOpen]);

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [dropdownOpen]);

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className={classNames(
          "min-w-36 w-fit inline-flex justify-center items-center group uppercase py-2 px-4 text-sm text-center rounded-full hover-box-shadow font-medium transition-all duration-300 hover:scale-x-105 text-white",
          {
            "bg-primary-400 hover:bg-primary-400/70": isMenuWhite,
            "bg-primary-200 hover:bg-primary-200/70": !isMenuWhite,
          }
        )}
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <img
          className="w-8 h-8 rounded-full"
          src={photo}
          width="32"
          height="32"
          alt="User"
        />
        <div className="flex items-center truncate">
          <span className="uppercase truncate ml-2 text-sm font-medium">
            {name}
          </span>
          <svg
            className="w-3 h-3 shrink-0 ml-1 fill-current text-white"
            viewBox="0 0 12 12"
          >
            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
          </svg>
        </div>
      </button>

      <Transition
        className={classNames(
          "origin-top-right z-10 absolute top-full min-w-44 bg-white dark:bg-navy-700 border border-slate-200 dark:border-navy-500 py-1.5 rounded shadow-lg overflow-hidden mt-1",
          {
            "right-0": align === "right",
            "left-0": align !== "right",
          }
        )}
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          <div className="pt-0.5 pb-2 px-3 mb-1 border-b border-slate-200 dark:border-navy-500 capitalize">
            <div className="font-medium text-slate-400">{name}</div>
            <div className="text-xs text-slate-500 italic">
              {roles.map((e) => e.role_name).join(", ")}
            </div>
          </div>
          <ul>
            <li>
              <Link
                className={classNames(
                  "font-medium text-sm hover:text-primary-100 flex items-center py-1 px-3",
                  {
                    "text-slate-400": !pathname.includes(W_S_ACCOUNT),
                    "text-primary-100": pathname.includes(W_S_ACCOUNT),
                  }
                )}
                to={W_S_ACCOUNT}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Account Settings
              </Link>
            </li>
            <li>
              <div
                className="cursor-pointer font-medium text-sm text-slate-400 hover:text-primary-100 flex items-center py-1 px-3"
                onClick={() => {
                  setNoticeSignout(true);
                  setDropdownOpen(!dropdownOpen);
                }}
              >
                Sign Out
              </div>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  );
}

export default DropdownProfile;

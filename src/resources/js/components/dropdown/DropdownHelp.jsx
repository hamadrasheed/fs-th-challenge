import classNames from "classnames";
import React, { useState, useRef, useEffect } from "react";
import Transition from "../../utils/Transition";
import { W_SUPPORT_LINK, W_S_DOCUMENTATION, W_WA_LINK } from "../../vars/web";
import { RiCustomerService2Fill } from "react-icons/ri";
import { GiBookmark } from "react-icons/gi";
import { FaGlobe } from "react-icons/fa";
import { Link } from "react-router-dom";
import { OPEN_INTRUCTION } from "../../vars/localStorage";

function DropdownHelp({ align }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const trigger = useRef(null);
  const dropdown = useRef(null);

  const [intructionOpened, setIntructionOpened] = useState(
    localStorage.getItem(OPEN_INTRUCTION)
  );

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

  //   hidden pulse when already opened
  useEffect(() => {
    if (!dropdownOpen || intructionOpened) return;

    localStorage.setItem(OPEN_INTRUCTION, true);
    setIntructionOpened(true);
  }, [dropdownOpen]);

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className={classNames(
          "group w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-navy-300/20 dark:hover:bg-navy-300/30 transition duration-150 rounded-full",
          {
            "bg-slate-200": dropdownOpen,
          }
        )}
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <span className="sr-only">Need help?</span>
        <svg
          className="w-4 h-4"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="fill-current text-slate-500 dark:group-hover:text-navy-100 transition duration-150"
            d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z"
          />
        </svg>
        {!intructionOpened && (
          <div className="absolute top-0 right-0">
            <span className="relative flex h-3 w-3 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-50 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2  bg-primary-50"></span>
            </span>
          </div>
        )}
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
          <div className="text-xs font-semibold text-slate-400 uppercase pt-1.5 pb-2 px-4">
            Need help?
          </div>
          <ul>
            <li>
              <Link
                to={W_S_DOCUMENTATION}
                className="group font-medium text-sm text-primary-50 hover:text-primary-200 flex gap-x-1.5 items-center py-1 px-3"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <GiBookmark className="flex-none w-4 h-4 fill-current text-primary-50 group-hover:text-primary-200 shrink-0" />
                <span>Documentation</span>
              </Link>
            </li>
            <li>
              <a
                className="group font-medium text-sm text-primary-50 hover:text-primary-200 flex gap-x-1.5 items-center py-1 px-3"
                href={W_SUPPORT_LINK}
                target="_blank"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <FaGlobe className="flex-none w-4 h-4 fill-current text-primary-50 group-hover:text-primary-200 shrink-0" />
                <span>Support Site</span>
              </a>
            </li>
            <li>
              <a
                className="group font-medium text-sm text-primary-50 hover:text-primary-200 flex gap-x-1.5 items-center py-1 px-3"
                href={W_WA_LINK}
                target="_blank"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <RiCustomerService2Fill className="flex-none w-4 h-4 fill-current text-primary-50 group-hover:text-primary-200 shrink-0" />
                <span>Contact Us</span>
              </a>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  );
}

export default DropdownHelp;

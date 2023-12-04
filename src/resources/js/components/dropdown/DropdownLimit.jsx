import React, { useState, useRef, useEffect } from "react";
import Transition from "../../utils/Transition";
import { FaAngleDown } from "react-icons/fa";

function DropdownLimit({
  options = [],
  onChange = (e) => {},
  defaultValue = null,
  classMinWidth = "min-w-36",
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selected, setSelected] = useState(10);

  const trigger = useRef(null);
  const dropdown = useRef(null);

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
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  // deliver change event
  useEffect(() => {
    onChange(selected);
  }, [selected]);

  useEffect(() => {
    if (
      ["integer", "number", "string", "boolean"].includes(typeof defaultValue)
    ) {
      setSelected(defaultValue);
    }
  }, [defaultValue]);

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className={`flex items-center py-2 px-3 font-medium justify-between ${classMinWidth} bg-white dark:bg-navy-700 border-slate-200 dark:border-navy-500 dark:hover:border-navy-600 hover:border-slate-300 dark:text-navy-100 dark:hover:text-navy-200 text-slate-500 hover:text-slate-600 border border-transparent rounded leading-5 shadow-sm transition duration-150 ease-in-out`}
        aria-label="Select date range"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        {options.find((e) => e.value == selected)?.label ?? "selected one"}
        <FaAngleDown className="w-4 h-4 flex-none opacity-70" />
      </button>
      <Transition
        show={dropdownOpen}
        tag="div"
        className="z-10 absolute top-full left-0 w-full bg-white dark:bg-navy-700 dark:border-navy-500 border border-slate-200 py-1.5 rounded shadow-lg overflow-hidden mt-1"
        enter="transition ease-out duration-100 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-100"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          ref={dropdown}
          className="font-medium text-sm text-slate-600 dark:text-navy-100"
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          {options.map((option) => {
            return (
              <button
                key={option.value}
                tabIndex="0"
                className={`flex items-center w-full hover:bg-slate-50 dark:hover:bg-navy-400 py-1 px-3 cursor-pointer ${
                  option.value === selected &&
                  "text-primary-100 dark:text-primary-100"
                }`}
                onClick={() => {
                  setSelected(option.value);
                  setDropdownOpen(false);
                }}
              >
                <svg
                  className={`shrink-0 mr-2 fill-current text-primary-100 ${
                    option.value !== selected && "invisible"
                  }`}
                  width="12"
                  height="9"
                  viewBox="0 0 12 9"
                >
                  <path d="M10.28.28L3.989 6.575 1.695 4.28A1 1 0 00.28 5.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28.28z" />
                </svg>
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      </Transition>
    </div>
  );
}

export default DropdownLimit;

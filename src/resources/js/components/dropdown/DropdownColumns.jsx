import classNames from "classnames";
import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import Transition from "../../utils/Transition";
import Tooltip from "../Tooltip";

function DropdownColumns({
  align,
  data,
  selected,
  update = (e) => {},
  reset = () => {},
  loading,
}) {
  const { register, handleSubmit, setValue } = useForm();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const trigger = useRef(null);
  const dropdown = useRef(null);

  const onSubmit = (e) => {
    if (!loading) update(e);
  };

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

  useEffect(() => {
    if (dropdownOpen) reconForm();
  }, [dropdownOpen]);

  const reconForm = () => {
    data.forEach((e) => {
      if (
        ["integer", "number", "string", "boolean"].includes(
          typeof selected[e.name]
        )
      ) {
        setValue(e.name, selected[e.name]);
        document.querySelector(
          `[name="${e.name}"][value="${selected[e.name]}"]`
        ).checked = true;
      } else
        document
          .querySelectorAll(`[name="${e.name}"]`)
          .forEach((c) => (c.checked = false));
    });
  };

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className={classNames(
          "btn group bg-white dark:bg-navy-700 dark:border-navy-500 border-slate-200 hover:border-primary-50 dark:hover:border-primary-50 text-slate-500 dark:text-navy-100 hover:text-primary-50 dark:hover:text-primary-50",
          { "border-primary-50 text-primary-50": dropdownOpen }
        )}
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <span className="sr-only">Sort by</span>
        <wbr />
        <Tooltip content="Filter Data">
          <svg className="w-4 h-4 fill-current " viewBox="0 0 16 16">
            <path d="M9 15H7a1 1 0 010-2h2a1 1 0 010 2zM11 11H5a1 1 0 010-2h6a1 1 0 010 2zM13 7H3a1 1 0 010-2h10a1 1 0 010 2zM15 3H1a1 1 0 010-2h14a1 1 0 010 2z" />
          </svg>
        </Tooltip>
      </button>
      <Transition
        show={dropdownOpen}
        tag="div"
        className={classNames(
          "origin-top-right z-10 absolute top-full min-w-56 bg-white border border-slate-200 dark:bg-navy-700 dark:border-navy-500 pt-1.5 rounded shadow-lg overflow-hidden mt-1",
          {
            "right-0": align === "right",
            "left-0": align !== "right",
          }
        )}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          ref={dropdown}
          className="relative overflow-y-auto max-h-56 md:max-h-72"
        >
          {data.map((p) => (
            <div key={p.name}>
              <div className="sticky top-0 bg-white dark:bg-navy-700 text-xs font-semibold text-slate-400 uppercase pt-1.5 pb-2 px-4">
                {p.label}
              </div>
              <ul className="mb-4">
                {p.opts.map((e, i) => (
                  <li className="py-1 px-3" key={e.value}>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type={p.type}
                        className="form-radio"
                        value={e.value}
                        {...register(p.name)}
                      />
                      <span className="text-sm font-medium ml-2 dark:text-navy-100">
                        {e.name}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="sticky bottom-0 py-2 px-3 border-t border-slate-200 bg-slate-50 dark:bg-navy-750 dark:border-navy-500">
            <ul className="flex items-center justify-between">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setDropdownOpen(false);
                  }}
                  className="btn-xs uppercase bg-white dark:bg-navy-600 dark:border-navy-500 dark:text-navy-100 border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-600"
                >
                  Clear
                </button>
              </li>
              <li>
                <button
                  type="submit"
                  className="btn-xs uppercase bg-primary-200 hover:bg-primary-400 text-white"
                  onClick={() => setDropdownOpen(false)}
                  onBlur={() => setDropdownOpen(false)}
                >
                  Apply
                </button>
              </li>
            </ul>
          </div>
        </form>
      </Transition>
    </div>
  );
}

export default DropdownColumns;

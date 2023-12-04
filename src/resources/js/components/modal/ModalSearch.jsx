import classNames from "classnames";
import React, { useRef, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { objIncludes } from "../../helpers/ObjHelper";
import authStore from "../../store/authStore";
import Transition from "../../utils/Transition";
import menuData from "../../vars/menuData";

function ModalSearch({ id, searchId, modalOpen, setModalOpen }) {
  const modalContent = useRef(null);
  const searchInput = useRef(null);

  const [value, setValue] = useState("");
  const [finalValue, setFinalValue] = useState("");
  const [getMenu] = useState(menuData);

  // agent
  const [agent] = useState(
    navigator?.userAgent ? navigator.userAgent?.toLowerCase() : false
  );
  const [isPhone] = useState(
    agent
      ? agent?.includes("android") ||
          agent?.includes("iphone") ||
          agent?.includes("windows phone")
      : false
  );
  const [isMac] = useState(
    !isPhone && agent?.includes("macintosh") ? true : false
  );

  // load options
  const { abilities } = authStore((state) => state);
  const menu = useMemo(() => {
    let res = getMenu
      .filter(
        (e) => !e.can_access_by || objIncludes(abilities, e.can_access_by)
      )
      .map((e) =>
        e?.list?.length
          ? {
              ...e,
              list: e.list
                .map((p) => {
                  if (p?.list?.length)
                    return {
                      ...p,
                      list: p.list.filter((e) =>
                        e?.name
                          ? (p.name + " - " + e.name)
                              .toLowerCase()
                              .includes((finalValue ?? "").toLowerCase())
                          : false
                      ),
                    };

                  return p;
                })
                .filter((e) => {
                  if (typeof e.list == "object") return e.list.length > 0;

                  return e?.name
                    ? e.name
                        .toLowerCase()
                        .includes((finalValue ?? "").toLowerCase())
                    : false;
                }),
            }
          : e
      )
      .filter((e) => e?.list?.length > 0)
      .map((e) => ({
        ...e,
        list:
          e?.list?.reduce((prev, next) => {
            if (typeof next?.list != "object") return [...prev, next];

            return [
              ...prev,
              ...next.list.map((e) => ({
                ...e,
                name: next.name + " - " + e.name,
                icon: next?.icon,
              })),
            ];
          }, []) ?? e?.list,
      }));

    return res;
  }, [abilities, finalValue]);

  //   input process to search
  useEffect(() => {
    let timeout;

    setTimeout(() => setFinalValue(value), 500);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [value]);

  // shortcut command+k
  useEffect(() => {
    let keysPressed = {};

    const up = () => {
      keysPressed = {};
    };

    const down = (event) => {
      keysPressed[event?.key?.toLowerCase()] = true;

      if (
        keysPressed[isMac ? "meta" : "control"] &&
        event?.key?.toLowerCase() == "k"
      )
        setModalOpen(true);
    };

    if (!isPhone) {
      document.addEventListener("keydown", down);
      document.addEventListener("keyup", up);
    }

    return () => {
      if (!isPhone) {
        document.removeEventListener("keydown", down, false);
        document.removeEventListener("keyup", up, false);
      }
    };
  }, []);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!modalOpen || modalContent.current.contains(target)) return;
      setModalOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!modalOpen || keyCode !== 27) return;
      setModalOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    modalOpen && searchInput.current.focus();
    setValue("");
  }, [modalOpen]);

  const onSubmit = (e) => {
    e.preventDefault();
    setFinalValue(value);
  };

  return (
    <>
      {/* Modal backdrop */}
      <Transition
        className="fixed inset-0 bg-slate-900 bg-opacity-30 z-50 transition-opacity"
        show={modalOpen}
        enter="transition ease-out duration-200"
        enterStart="opacity-0"
        enterEnd="opacity-100"
        leave="transition ease-out duration-100"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
        aria-hidden="true"
      />
      {/* Modal dialog */}
      <Transition
        id={id}
        className="fixed inset-0 z-50 overflow-hidden flex items-start top-20 mb-4 justify-center transform px-4 sm:px-6"
        role="dialog"
        aria-modal="true"
        show={modalOpen}
        enter="transition ease-in-out duration-200"
        enterStart="opacity-0 translate-y-4"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-in-out duration-200"
        leaveStart="opacity-100 translate-y-0"
        leaveEnd="opacity-0 translate-y-4"
      >
        <div
          ref={modalContent}
          id="search-content"
          className="bg-white dark:bg-navy-700 overflow-auto max-w-2xl w-full rounded shadow-lg max-h-[24rem]"
        >
          {/* Search form */}
          <div className="border-b border-slate-300 dark:border-navy-500 sticky top-0">
            <form className="relative" onSubmit={onSubmit}>
              <label htmlFor={searchId} className="sr-only">
                Search
              </label>
              <input
                id={searchId}
                value={value}
                autoComplete="off"
                onChange={(e) => setValue(e.target.value)}
                onBlur={(e) => setValue(e.target.value)}
                onKeyUp={(e) => setValue(e.target.value)}
                className={classNames(
                  "w-full border-0 focus:ring-transparent placeholder-slate-400 appearance-none py-3 pl-10 dark:bg-navy-700 dark:text-navy-100",
                  {
                    "pr-16": !isPhone,
                    "pr-4": isPhone,
                  }
                )}
                type="search"
                placeholder="Search menu&hellip;"
                ref={searchInput}
              />
              {!isPhone && (
                <span className="absolute top-[14px] right-2 text-slate-400">
                  {isMac ? "⌘" : "Ctrl +"} K
                </span>
              )}
              <button
                className="absolute inset-0 right-auto group"
                type="submit"
                aria-label="Search"
              >
                <svg
                  className="w-4 h-4 shrink-0 fill-current text-slate-400 group-hover:text-slate-500 ml-4 mr-2"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
                  <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
                </svg>
              </button>
            </form>
          </div>
          <div className="py-4 px-2">
            {menu.map((e, i) => (
              <div key={i} className="mb-3 last:mb-0">
                <div className="text-xs font-semibold text-slate-400 uppercase px-2 mb-2">
                  {e.group}
                </div>
                <ul className="text-sm">
                  {e.list.map((e, i) => {
                    return (
                      <li key={i}>
                        <Link
                          className="flex items-center p-2 text-slate-800 hover:text-white hover:bg-primary-50 rounded group"
                          to={e.path}
                          onClick={() => setModalOpen(!modalOpen)}
                        >
                          <e.icon className="w-4 h-4 fill-current text-slate-400 group-hover:text-white group-hover:text-opacity-50 shrink-0 mr-3" />
                          <span className="capitalize dark:text-navy-100">{e.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Transition>
    </>
  );
}

export default ModalSearch;

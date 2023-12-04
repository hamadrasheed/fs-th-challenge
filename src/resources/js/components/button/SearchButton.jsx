import classNames from "classnames";
import React from "react";

function SearchButton({ searchModalOpen, setSearchModalOpen }) {
  return (
    <button
      className={classNames(
        "group w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200" +
          " dark:bg-navy-300/20 dark:hover:bg-navy-300/30 transition duration-150 rounded-full ml-3",
        { "bg-slate-200": searchModalOpen }
      )}
      onClick={(e) => {
        e.stopPropagation();
        setSearchModalOpen(true);
      }}
      aria-controls="search-modal"
    >
      <span className="sr-only">Search</span>
      <svg
        className="w-4 h-4"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="fill-current text-slate-500 dark:group-hover:text-navy-100 transition duration-150"
          d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z"
        />
        <path
          className="fill-current text-slate-400 dark:text-slate-500 dark:group-hover:text-navy-50  transition duration-150"
          d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z"
        />
      </svg>
    </button>
  );
}

export default SearchButton;

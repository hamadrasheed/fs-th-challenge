import classNames from "classnames";
import React from "react";
import { searchParamsToObj } from "../../helpers/UrlHelper";
import dataStore from "../../store/dataStore";

function Pagination({ updatePage = (page) => {}, loading = true }) {
  const {
    currentPage: current_page,
    lastPage: last_page,
    from,
    to,
    total,
    links,
  } = dataStore((state) => state);

  const changePage = (e) => {
    if (current_page !== e && !loading) updatePage(e);
  };
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <nav
        className="flex mb-4 sm:mb-0 sm:order-1"
        role="navigation"
        aria-label="Navigation"
      >
        <button
          onClick={() => {
            if (current_page != 1) changePage(current_page - 1);
          }}
          className="mr-2"
        >
          <span
            className={classNames({
              "cursor-not-allowed inline-flex items-center justify-center rounded leading-5 px-2.5 py-2 bg-white dark:bg-navy-700 border border-slate-200 dark:border-navy-500 text-slate-300 dark:text-navy-300":
                current_page == 1,
              "inline-flex items-center justify-center rounded leading-5 px-2.5 py-2 bg-white dark:bg-navy-700 hover:bg-primary-200 border border-slate-200 dark:border-navy-500 text-slate-600 dark:text-navy-100 hover:text-white dark:hover:text-navy-50 shadow-sm":
                current_page != 1,
            })}
          >
            <span className="sr-only">Previous</span>
            <wbr />
            <svg className="h-4 w-4 fill-current" viewBox="0 0 16 16">
              <path d="M9.4 13.4l1.4-1.4-4-4 4-4-1.4-1.4L4 8z" />
            </svg>
          </span>
        </button>
        <ul className="inline-flex text-sm font-medium -space-x-px shadow-sm">
          {links.map((e, i) => {
            if (i && i !== links.length - 1)
              return e.active ? (
                <li key={i + "_p"}>
                  <span className="cursor-not-allowed inline-flex items-center justify-center rounded-l leading-5 px-3.5 py-2 bg-white dark:bg-navy-700 border border-slate-200 dark:border-navy-500 text-primary-50">
                    {e.label}
                  </span>
                </li>
              ) : (
                <li key={i + "_p"}>
                  <button
                    onClick={() =>
                      changePage(
                        searchParamsToObj("?" + e.url.split("?")[1]).page
                      )
                    }
                    className="inline-flex items-center justify-center leading-5 px-3.5 py-2 bg-white dark:bg-navy-700 hover:bg-primary-200 border border-slate-200 dark:border-navy-500 text-slate-600 dark:text-navy-100 hover:text-white dark:hover:text-navy-50"
                    href="#0"
                  >
                    {e.label}
                  </button>
                </li>
              );
          })}
        </ul>
        <div className="ml-2">
          <button
            onClick={() => {
              if (current_page != last_page) changePage(current_page + 1);
            }}
            className={classNames({
              "cursor-not-allowed inline-flex items-center justify-center rounded leading-5 px-2.5 py-2 bg-white dark:bg-navy-700 border border-slate-200 dark:border-navy-500 text-slate-300 dark:text-navy-300":
                last_page == current_page,
              "inline-flex items-center justify-center rounded leading-5 px-2.5 py-2 bg-white dark:bg-navy-700 hover:bg-primary-200 border border-slate-200 dark:border-navy-500 text-slate-600 dark:text-navy-100 hover:text-white dark:hover:text-navy-50 shadow-sm":
                last_page != current_page,
            })}
          >
            <span className="sr-only">Next</span>
            <wbr />
            <svg className="h-4 w-4 fill-current" viewBox="0 0 16 16">
              <path d="M6.6 13.4L5.2 12l4-4-4-4 1.4-1.4L12 8z" />
            </svg>
          </button>
        </div>
      </nav>
      <div className="text-sm text-slate-500 text-center sm:text-left">
        Showing{" "}
        <span className="font-medium text-slate-600 dark:text-navy-200">
          {from > 0 ? from : 0}
        </span>{" "}
        to{" "}
        <span className="font-medium text-slate-600 dark:text-navy-200">
          {to > 0 ? to : 0}
        </span>{" "}
        of{" "}
        <span className="font-medium text-slate-600 dark:text-navy-200">
          {total ?? 0}
        </span>{" "}
        results
      </div>
    </div>
  );
}

export default Pagination;

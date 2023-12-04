import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import dataStore from "../../store/dataStore";
import multiSelectStore from "../../store/multiSelectStore";
import RowLoading from "./RowLoading";

function TableSort({
  colOpts = [],
  sortSelected = {},
  changeSelected = (e) => {},
  useHeader = false,
  contentLeftHeader = null,
  contentRightHeader = null,
  useCheckAll = false,
  useDetail = false,
  dataCheck = [],
  children,
  useAction = true,
  loading = true,
  textCenter = [],
}) {
  const {
    selected: ids,
    addSelected,
    resetSelected,
  } = multiSelectStore((state) => state);
  const [checkAll, setCheckAll] = useState(false);

  const [colLength, setColLength] = useState(0);
  const [dotRange, setDotRange] = useState(3);

  const { setRequestDataToggle } = dataStore((state) => state);

  // check all handler
  useEffect(() => {
    if (useCheckAll)
      setCheckAll(
        ids.length ==
          dataCheck.filter((e) =>
            e.can_restore
              ? e.can_restore
              : e.can_void
              ? e.can_void
              : e.can_delete
          ).length && ids.length > 0
      );
  }, [ids]);

  // set col length
  useEffect(() => {
    let res = colOpts.length;
    if (useCheckAll) res += 1;
    if (useAction) res += 1;
    setColLength(res);
  }, [useCheckAll, useAction, colOpts]);

  const handleSelectAll = () => {
    if (!checkAll)
      addSelected(
        dataCheck
          .filter((e) =>
            e.can_restore
              ? e.can_restore
              : e.can_void
              ? e.can_void
              : e.can_delete
          )
          .map((e) => e.id)
      );
    else resetSelected();
  };

  const handleSort = (sortName) => {
    if (!sortName) return;
    const { sortName: sortNameSelected, order } = sortSelected;

    if (sortName == sortNameSelected && order == "desc") {
      setRequestDataToggle(true);
      return changeSelected({});
    }

    changeSelected({
      sortName,
      order: sortName != sortNameSelected ? "asc" : "desc",
    });
  };

  useEffect(() => {
    let timeout = setTimeout(
      () => setDotRange(dotRange == 5 ? 0 : dotRange + 1),
      250
    );

    return () => clearTimeout(timeout);
  }, [dotRange]);

  return (
    <div className="bg-white dark:bg-navy-700 shadow-lg rounded-sm border border-slate-200 dark:border-navy-500 relative">
      {useHeader && (
        <header className="px-5 py-4">
          <div className="sm:flex sm:justify-between sm:items-center">
            {/* left side */}
            <h2
              className={classNames("font-semibold", {
                "animate-pulse text-slate-200 bg-slate-200 rounded-[.25rem] w-36 h-6":
                  loading,
                "text-gray-800": !loading,
              })}
            >
              {contentLeftHeader}
            </h2>

            {/* Right side */}
            <h2
              className={classNames("font-semibold", {
                "animate-pulse text-slate-200 bg-slate-200 rounded-[.25rem] w-36 h-6":
                  loading,
                "text-gray-800": !loading,
              })}
            >
              {contentRightHeader}
            </h2>
          </div>
        </header>
      )}
      <div className="overflow-x-auto">
        <table
          className={classNames("table-auto w-full", {
            "divide-y divide-slate-200 dark:divide-navy-500": useDetail,
          })}
        >
          {/* Table header */}
          <thead className="text-xs font-semibold uppercase text-slate-500 bg-slate-50 dark:bg-navy-800 border-b border-slate-200 dark:border-navy-500">
            <tr>
              {/* use check all */}
              {useCheckAll && (
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
                  <div className="flex items-center">
                    <label className="inline-flex">
                      <span className="sr-only">Select all</span>
                      <input
                        disabled={
                          !colOpts.filter((e) =>
                            e.can_restore
                              ? e.can_restore
                              : e.can_void
                              ? e.can_void
                              : e.can_delete
                          ).length == 0
                        }
                        className="form-checkbox"
                        type="checkbox"
                        checked={checkAll}
                        onChange={handleSelectAll}
                      />
                    </label>
                  </div>
                </th>
              )}
              {/* head col */}
              {colOpts.map((e, i) => (
                <th
                  key={i + "_head"}
                  className={classNames(
                    "px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap",
                    {
                      "text-primary-50":
                        e.sortName && sortSelected.sortName == e.sortName,
                    }
                  )}
                >
                  <div
                    onClick={() => handleSort(e.sortName)}
                    className={classNames("font-semibold relative", {
                      "flex items-center pr-3 cursor-pointer hover:text-primary-50":
                        e.sortName,
                      "text-center": !e.sortName,
                      "justify-center": textCenter.includes(i),
                    })}
                  >
                    {e.label}

                    {/* sort not selected */}
                    {sortSelected.sortName != e.sortName &&
                      e.sortName != null && (
                        <FaSort className="h-3 w-3 absolute right-0" />
                      )}

                    {/* sort asc */}
                    {sortSelected.sortName == e.sortName &&
                      sortSelected.order == "asc" && (
                        <FaSortDown className="h-3 w-3 absolute right-0" />
                      )}

                    {/* sort desc */}
                    {sortSelected.sortName == e.sortName &&
                      sortSelected.order == "desc" && (
                        <FaSortUp className="h-3 w-3 absolute right-0" />
                      )}
                  </div>
                </th>
              ))}

              {/* use action */}
              {useAction && (
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap text-center">
                  <div className="font-semibold text-center">Action</div>
                </th>
              )}
            </tr>
          </thead>
          {/* Table body */}
          {loading ? <RowLoading col={colLength} /> : children}
        </table>
      </div>
    </div>
  );
}

export default TableSort;

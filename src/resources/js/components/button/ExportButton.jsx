import classNames from "classnames";
import React from "react";
import { CgExport } from "react-icons/cg";
import { currentMonthStartEndDate } from "../../helpers/DateHelper";
import exportStore from "../../store/exportStore";
import paramsStore from "../../store/paramsStore";
import Tooltip from "../Tooltip";

function ExportButton({ isDisabled, getUrl, formUrl, dataName, otherParams }) {
  const { openExport, setExportDateBetween, setOtherParams } = exportStore(
    (state) => state
  );
  const { params } = paramsStore((state) => state);

  const exportNow = () => {
    const date = currentMonthStartEndDate(true);

    // set other params
    setOtherParams(otherParams);

    // set date same as params
    setExportDateBetween([
      params.start_date_range ?? date[0],
      params.end_date_range ?? date[1],
    ]);
    openExport({
      showModal: true,
      getUrl: getUrl,
      formUrl: formUrl,
      dataName: dataName,
    });
  };

  return (
    <button
      onClick={exportNow}
      disabled={isDisabled}
      className={classNames("btn group", {
        "bg-white/50 dark:bg-navy-700/50  border-slate-200/50 dark:border-navy-500/50 text-slate-500/50  dark:text-navy-100/50 cursor-not-allowed":
          isDisabled,
        "bg-white dark:bg-navy-700 border-slate-200 dark:border-navy-500 text-slate-500 dark:text-navy-100 hover:border-primary-50 hover:text-primary-50 dark:hover:border-primary-50 dark:hover:text-primary-50":
          !isDisabled,
      })}
    >
      <span className="sr-only">Export</span>
      <wbr />
      <Tooltip
        nowrap={!isDisabled}
        isDark={isDisabled}
        content={isDisabled ? "Export unavailable!" : "Export Data"}
      >
        <CgExport className="w-4 h-4 fill-current" />
      </Tooltip>
    </button>
  );
}

export default ExportButton;

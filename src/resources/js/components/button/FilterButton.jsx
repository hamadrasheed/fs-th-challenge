import React from "react";
import filterStore from "../../store/filterStore";
import Tooltip from "../Tooltip";

function FilterButton({ formUrl, dataName, otherParams }) {
  const { openFilter, setOtherParams } = filterStore((state) => state);

  const filterNow = () => {
    setOtherParams(otherParams);
    openFilter({
      showModal: true,
      formUrl: formUrl,
      dataName: dataName,
    });
  };

  return (
    <button
      onClick={filterNow}
      className="btn group bg-white dark:bg-navy-700 border-slate-200 dark:border-navy-500 text-slate-500 dark:text-navy-100 hover:border-primary-50 hover:text-primary-50 dark:hover:border-primary-50 dark:hover:text-primary-50"
    >
      <span className="sr-only">Filter</span>
      <wbr />
      <Tooltip nowrap={true} isDark={false} content="Filter Data">
        <svg className="w-4 h-4 fill-current " viewBox="0 0 16 16">
          <path d="M9 15H7a1 1 0 010-2h2a1 1 0 010 2zM11 11H5a1 1 0 010-2h6a1 1 0 010 2zM13 7H3a1 1 0 010-2h10a1 1 0 010 2zM15 3H1a1 1 0 010-2h14a1 1 0 010 2z" />
        </svg>
      </Tooltip>
    </button>
  );
}

export default FilterButton;

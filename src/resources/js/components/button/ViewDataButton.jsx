import React from "react";
import { FaTable } from "react-icons/fa";

function ViewDataButton({setGoingBack,textButton="View Data"}) {

  return (
    <button
      onClick={() => setGoingBack(true)}
      className="btn bg-white dark:bg-navy-700 dark:hover:bg-navy-600 border-slate-200 dark:border-navy-500 hover:border-primary-50 dark:hover:border-primary-50 text-slate-500 dark:text-navy-100 hover:text-primary-50 dark:hover:text-primary-50"
    >
      <FaTable className="w-4 h-4 fill-current shrink-0" />
      <span className="hidden xs:block ml-2 uppercase">{textButton}</span>
    </button>
  );
}

export default ViewDataButton;

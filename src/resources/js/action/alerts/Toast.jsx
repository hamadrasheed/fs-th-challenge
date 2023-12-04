import classNames from "classnames";
import React, { useEffect, useState } from "react";
import {
  AiFillCheckCircle,
  AiFillCloseCircle,
  AiFillExclamationCircle,
} from "react-icons/ai";

function Toast({ status = "warning", children }) {
  const [type, setType] = useState();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (status == "warning") setType("Attention!");
    if (status == "success") setType("Success!");
    if (status == "error") setType("Oops!");
  }, [status]);
  if (!open) return <></>;

  return (
    <div className="w-full relative justify-start mb-7">
      <div className="inline-flex w-full px-4 py-2 rounded-sm text-sm bg-white shadow-lg border border-slate-200 text-slate-600 dark:bg-navy-700 dark:border-navy-500 dark:text-navy-100">
        <div className="flex w-full justify-between items-center">
          <div className="flex gap-x-3 items-start">
            {status === "success" && (
              <AiFillCheckCircle className="w-16 h-16 mx-auto text-success" />
            )}
            {status === "warning" && (
              <AiFillExclamationCircle className="w-16 h-16 mx-auto text-amber-500 " />
            )}
            {status === "error" && (
              <AiFillCloseCircle className="w-16 h-16 mx-auto text-danger" />
            )}
            {/* content */}
            <div>
              <div className="text-2xl uppercase">{type}</div>
              <div>{children}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="opacity-70 hover:opacity-80 ml-3 mt-[3px]"
          >
            <div className="sr-only">Close</div>
            <svg className="w-4 h-4 fill-current">
              <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z"></path>
            </svg>
          </button>
        </div>
      </div>
      <div
        className={classNames("w-2 absolute  h-full top-0", {
          "bg-success": status === "success",
          "bg-amber-500": status === "warning",
          "bg-danger": status === "error",
        })}
      ></div>
    </div>
  );
}

export default Toast;

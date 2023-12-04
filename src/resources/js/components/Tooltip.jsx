import classNames from "classnames";
import React from "react";

function Tooltip({
  children,
  content,
  nowrap = true,
  isDark = false,
  marginBottom = "mb-6",
  placement = "top",
  width = "100%",
}) {
  return (
    <div className="relative flex flex-col items-center group w-auto">
      {children}
      <div
        className={classNames(
          "absolute flex-col items-center hidden group-hover:flex text-center",
          {
            [marginBottom]: true,
            "bottom-0": placement == "top",
            "bottom-[-2.5rem] right-8": placement == "left",
          }
        )}
      >
        <span
          style={{ width: width }}
          className={classNames(
            "rounded-md relative z-10 p-2 text-xs leading-none shadow-lg",
            {
              "whitespace-nowrap": nowrap,
              "whitespace-normal": !nowrap,
              "text-white bg-black": isDark,
              "bg-white dark:bg-navy-800 dark:text-navy-100 dark:border-navy-500 border border-slate-200 shadow-lg":
                !isDark,
            }
          )}
        >
          {content}
        </span>
        <div
          className={classNames("w-3 h-3 -mt-2 rotate-45 rounded-sm", {
            "bg-black": isDark,
          })}
        ></div>
      </div>
    </div>
  );
}

export default Tooltip;

import classNames from "classnames";
import React from "react";

function Col({
  children,
  col = 1,
  align = "left",
  className = null,
  nowrap = true,
  onClick = (e) => {},
}) {
  return (
    <td
      colSpan={col}
      className={classNames("px-2 first:pl-5 last:pr-5 py-3", {
        "text-center": align == "center",
        "text-right": align == "right",
        "whitespace-nowrap": nowrap,
        "whitespace-normal": !nowrap,
      })}
    >
      <div
        className={classNames("dark:text-navy-100", {
          [className]: className ? true : false,
        })}
        onClick={onClick}
      >
        {children}
      </div>
    </td>
  );
}

export default Col;

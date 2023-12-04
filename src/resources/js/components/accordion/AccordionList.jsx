import classNames from "classnames";
import React from "react";
import { FaAngleDown } from "react-icons/fa";

function AccordionList({
  Icon,
  title,
  children,
  tabIndex,
  focus,
  setFocus = () => {},
}) {
  return (
    <div className="outline-none accordion-section" tabIndex={tabIndex}>
      <div
        onClick={() => setFocus(tabIndex == focus ? null : tabIndex)}
        className={classNames(
          "flex justify-between px-4 py-3 items-center border-b dark:text-navy-100 dark:border-navy-500 hover:!border-b-primary-50 hover:!text-primary-50 transition ease duration-50 cursor-pointer relative",
          { "!border-b-primary-50": focus == tabIndex }
        )}
      >
        <div
          className={classNames(
            "flex items-center gap-x-1.5 md:gap-x-3 text-xs md:text-base uppercase font-medium transition ease duration-50",
            { "!text-primary-50": focus == tabIndex }
          )}
        >
          <Icon className="flex-none w-2.5 md:w-5 h-2.5 md:h-5" />
          {title}
        </div>
        <div
          className={classNames(
            "h-5 w-5 items-center inline-flex justify-center transform transition ease duration-500",
            { "text-primary-50 -rotate-180": focus == tabIndex }
          )}
        >
          <FaAngleDown className="flex-none w-3.5 md:w-full h-3.5 md:h-full" />
        </div>
      </div>
      <div
        className={classNames(
          "max-h-0 px-4 mb-2 overflow-hidden overflow-y-auto ease duration-500",
          { "max-h-screen": focus == tabIndex }
        )}
      >
        {children}
      </div>
    </div>
  );
}

export default AccordionList;

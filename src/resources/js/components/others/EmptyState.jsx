import classNames from "classnames";
import React from "react";

const EmptyState = ({
  message,
  classList,
  children,
  isCard = true,
  searchState = false,
  htmlFor = null,
  addClass = null,
  imgLG = false,
  imgXL = false,
  noBg = false,
}) => {
  return (
    <div className={"box-border " + classList}>
      <div
        className={classNames("rounded-xl p-3", {
          "hover-box-shadow": isCard,
          "bg-white dark:bg-navy-700": !noBg,
        })}
      >
        <div className="flex flex-col w-full h-full items-center justify-center">
          <img
            src={
              !searchState
                ? "/images/empty-states.gif"
                : "/images/empty-states.png"
            }
            className={classNames("mb-4", {
              "w-1/2 h-1/2": !searchState && !imgLG && !imgXL,
              "w-1/4 h-1/4": searchState,
              "w-3/4 h-3/4": !searchState && imgLG,
              "w-full h-full": !searchState && imgXL,
            })}
            alt="Empty State"
          />
          <label
            htmlFor={htmlFor}
            className={classNames({ "cursor-pointer": htmlFor })}
          >
            <h4
              className={classNames("md:text-xl mb-4 dark:text-navy-100", {
                [addClass]: addClass,
              })}
            >
              {message}
            </h4>
            {children}
          </label>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;

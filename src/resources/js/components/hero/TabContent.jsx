import React from "react";

const TabContent = ({ number, title, subtitle = null }) => {
  return (
    <div className="flex gap-4 w-full h-14 items-center px-6 text-white text-xs font-bold cursor-pointer group transition-all duration-300 hover:scale-x-105 ease-in-out">
      <span
        id="slide-number"
        className="relative flex flex-none items-center justify-center w-6 h-6 before:border-white before:border before:rounded-md before:content-[''] before:w-full before:h-full before:absolute  before:rotate-180 before:group-hover:rotate-45 before:transition-all before:duration-300  before:z-[-1]"
      >
        {number}
      </span>
      <div className="text-start">
        <h4
          className="group-hover:text-primary-50 transition-all duration-300"
          id="slide-title"
        >
          {title}
        </h4>
        {subtitle && <span className="font-normal">{subtitle} </span>}
      </div>
    </div>
  );
};

export default TabContent;

import classNames from "classnames";
import React from "react";

const Overlay = ({ src, children, flip = false }) => {
  return (
    <div className="relative w-full h-full">
      <div className="absolute w-full h-full after:content-[''] after:absolute after:inset-0 after:bg-secondary-400/70 after:w-full after:h-full">
        <img
          src={src}
          alt="hero"
          className={classNames("relative w-full h-full", {
            "scale-x-[-1]": flip,
          })}
        />
      </div>
      <div className="relative container mx-auto">{children}</div>
    </div>
  );
};

export default Overlay;

import React, { useEffect, useState } from "react";
import Header from "./partials/Header";
import Footer from "./partials/Footer";
import classNames from "classnames";

const Extend = ({ children, isSlate = false }) => {
  const [isMenuWhite, setIsMenuWhite] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const runScroll = (e) => {
    if (e.target.scrollTop != scrollTop) {
      setScrollTop(e.target.scrollTop);
    }
  };

  useEffect(() => {
    setIsMenuWhite(scrollTop > 38);
  }, [scrollTop]);

  return (
    <div
      id="wrapper"
      className={classNames(
        "w-full h-screen overflow-y-auto",
        isSlate ? "bg-slate-100" : "bg-white"
      )}
      onScroll={runScroll}
    >
      {/* header */}
      <Header isMenuWhite={isMenuWhite} />

      {/* content */}
      {children}

      {/* footer */}
      <Footer />
    </div>
  );
};

export default Extend;

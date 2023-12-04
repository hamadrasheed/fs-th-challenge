import React, { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function LoadingText() {
  const [dotRange, setDotRange] = useState(3);

  useEffect(() => {
    let timeout = setTimeout(
      () => setDotRange(dotRange == 5 ? 0 : dotRange + 1),
      250
    );

    return () => clearTimeout(timeout);
  }, [dotRange]);

  return (
    <div className="w-28 flex items-center">
      <AiOutlineLoading3Quarters className="w-4 h-4 animate-spin dark:text-navy-100" />
      <div className="pl-2 w-full dark:text-navy-100">
        Loading{[...Array(dotRange).keys()].map((e) => ".")}
      </div>
    </div>
  );
}

export default LoadingText;

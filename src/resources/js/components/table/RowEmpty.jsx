import React, { useEffect, useState } from "react";

function RowEmpty({ col = 1 }) {
  const [dotRange, setDotRange] = useState(3);

  useEffect(() => {
    let timeout = setTimeout(
      () => setDotRange(dotRange == 5 ? 0 : dotRange + 1),
      250
    );

    return () => clearTimeout(timeout);
  }, [dotRange]);
  return (
    <tr className="h-20" key={'emty-ful'}>
      <td colSpan={col} className="relative">
        <div className="w-full flex items-center justify-center gap-x-2">
          <svg
            className="w-4 h-4 shrink-0 fill-current text-slate-400"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
            <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
          </svg>
          <span className="dark:text-navy-100">No matching records found</span>
        </div>
      </td>
    </tr>
  );
}

export default RowEmpty;

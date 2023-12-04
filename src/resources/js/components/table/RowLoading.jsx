import React from "react";

import LoadingText from "../others/LoadingText";

function RowLoading({ col = 0 }) {
  return (
    col > 0 && (
      <tbody className="text-sm divide-y divide-slate-200">
        <tr className="h-20">
          <td colSpan={col} className="relative">
            <div className="w-full flex justify-center">
              <LoadingText />
            </div>
          </td>
        </tr>
      </tbody>
    )
  );
}

export default RowLoading;

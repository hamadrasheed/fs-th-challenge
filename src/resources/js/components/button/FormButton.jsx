import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BiLoaderAlt } from "react-icons/bi";
import loadingStore from "../../store/loadingStore";
import { L_POST } from "../../vars/loading";
import classNames from "classnames";
import paramsStore from "../../store/paramsStore";
import dataStore from "../../store/dataStore";

function FormButton({ onCancel, submitText = "Submit" }) {
  const location = useLocation();

  // VARS BACK TO TABLE
  const navigate = useNavigate();
  const [goingBack, setGoingBack] = useState(false);

  // VARS RESET PARAMS FROM ZUUSTAND
  const { resetParams } = paramsStore((state) => state);

  // BACK TO TABLE EVENT
  useEffect(() => {
    if (goingBack) {
      resetParams();
      navigate(location.pathname);
    }
  }, [goingBack]);

  const { accessable } = dataStore((state) => state);
  const { loading: getLoading } = loadingStore((state) => state);
  const loading = useMemo(() => getLoading[L_POST], [getLoading]);

  return (
    <div className="flex gap-x-2 justify-end mt-8">
      <button
        type="button"
        className="min-w-[6rem] md:min-w-[7rem] items-center justify-center w-fit uppercase py-2 px-2 md:px-4 text-xs md:text-sm text-center rounded-full hover-box-shadow font-medium transition-all duration-300 hover:scale-x-105 bg-slate-200 hover:bg-slate-200/70"
        onClick={() => (onCancel ? onCancel() : setGoingBack(true))}
      >
        cancel
      </button>

      <button
        disabled={accessable.can_update == false}
        className={classNames(
          "min-w-[6rem] md:min-w-[7rem] items-center justify-center w-fit flex gap-x-1 uppercase py-2 px-2 md:px-4 text-xs md:text-sm text-center rounded-full hover-box-shadow font-medium transition-all duration-300 hover:scale-x-105 text-white bg-primary-400 hover:bg-primary-400/70",
          {
            "opacity-75 cursor-not-allowed": accessable.can_update == false,
          }
        )}
        type="submit"
      >
        {submitText}
        {loading && (
          <BiLoaderAlt className="animate-spin fill-current opacity-50 flex-none h-4 w-4" />
        )}
      </button>
    </div>
  );
}

export default FormButton;

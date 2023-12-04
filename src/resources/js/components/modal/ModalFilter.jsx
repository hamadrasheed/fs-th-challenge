import React, { useRef, useEffect, useState } from "react";
import Transition from "../../utils/Transition";
import classNames from "classnames";
import filterStore from "../../store/filterStore";
import loadingStore from "../../store/loadingStore";
import { useMemo } from "react";
import { L_FILTER } from "../../vars/loading";
import { BiLoaderAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { W_R_DATA_SN } from "../../vars/web";
import { objToParams } from "../../helpers/UrlHelper";
import { objChanger } from "../../helpers/ObjHelper";
import paramsStore from "../../store/paramsStore";

function ModalFilter({ children, handleSubmit, onSubmit, exceptReset = [] }) {
  const navigate = useNavigate();

  const {
    modal: { showModal: modalOpen, formUrl, dataName },

    // event
    closeFilter,
  } = filterStore((state) => state);
  const { params } = paramsStore((state) => state);
  const { loading } = loadingStore((state) => state);

  const { infoLoading } = useMemo(
    () => ({
      infoLoading: loading[L_FILTER],
    }),

    [loading]
  );

  const modalContent = useRef(null);

  const [waitAnimate, setWaitAnimate] = useState(true);

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!modalOpen || keyCode !== 27 || waitAnimate) return;
      closeFilter();
    };

    if (modalOpen) {
      document.addEventListener("keydown", keyHandler);
    }
    return () => document.removeEventListener("keydown", keyHandler);
  });

  // handle issue cannot open modal
  useEffect(() => {
    let timeout;
    if (modalOpen) {
      setWaitAnimate(true);
      timeout = setTimeout(() => setWaitAnimate(false), 700);
    }

    return () => {
      clearTimeout(timeout);
      setWaitAnimate(true);
    };
  }, [modalOpen]);

  const onReset = () => {
    navigate(
      W_R_DATA_SN + objToParams(objChanger(params, { only: exceptReset }))
    );
    closeFilter();
  };

  return (
    <>
      {/* Modal backdrop */}
      <Transition
        className="fixed inset-0 bg-slate-900 bg-opacity-30 z-50 transition-opacity"
        show={modalOpen}
        enter="transition ease-out duration-200"
        enterStart="opacity-0"
        enterEnd="opacity-100"
        leave="transition ease-out duration-100"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      />
      {/* Modal dialog */}
      <Transition
        id="filter-options"
        className="fixed inset-0 z-50 overflow-hidden flex items-center my-4 justify-center transform px-4 sm:px-6"
        role="dialog"
        aria-modal="true"
        show={modalOpen}
        enter="transition ease-in-out duration-200"
        enterStart="opacity-0 translate-y-4 scale-75"
        enterEnd="opacity-100 translate-y-0 scale-100"
        leave="transition ease-in-out duration-200"
        leaveStart="opacity-100 translate-y-0 scale-100"
        leaveEnd="opacity-0 translate-y-4 scale-75"
      >
        <div
          ref={modalContent}
          className="bg-white dark:bg-navy-700 rounded-lg shadow-lg overflow-auto max-w-[40rem] w-full max-h-full py-8 relative"
        >
          {/* loading */}
          <div
            className={classNames(
              "flex gap-3 justify-center items-center px-8",
              { hidden: !infoLoading }
            )}
          >
            <img
              src="/images/loading.svg"
              alt="loading"
              className="w-12 h-12"
            />
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* content */}
            <div
              className={classNames("flex flex-col gap-y-3 px-6", {
                hidden: infoLoading,
              })}
            >
              <h1 className="text-2xl md:text-3xl text-slate-600 dark:text-navy-200 font-semibold text-center mb-1">
                Filter {dataName}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
                {children}
              </div>
            </div>

            {/* button action */}
            <div className="flex w-full justify-center mt-9">
              <div className="flex justify-end pr-2">
                <button
                  type="button"
                  onClick={onReset}
                  className="text-sm w-24 py-2 mx-auto rounded bg-slate-200 dark:bg-navy-600 dark:hover:bg-navy-500 shadow-lg transition-colors hover:bg-slate-400 text-slate-600 dark:text-navy-200 uppercase font-bold"
                >
                  RESET
                </button>
              </div>
              <div className="flex justify-start pl-2">
                <button
                  onClick={(e) => e}
                  className={classNames(
                    "text-sm w-24 py-2 mx-auto rounded shadow-lg bg-primary-200 transition-colors hover:bg-primary-500 text-white uppercase font-bold",
                    {
                      "cursor-not-allowed opacity-75": infoLoading,
                    }
                  )}
                >
                  APPLY{" "}
                  {infoLoading && (
                    <BiLoaderAlt className="absolute right-3 animate-spin fill-current opacity-50 flex-none h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </Transition>
    </>
  );
}

export default ModalFilter;

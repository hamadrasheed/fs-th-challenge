import React, { useRef, useEffect, useState } from "react";
import loadingStore from "../../store/loadingStore";

import Transition from "../../utils/Transition";
import { LOADING_IMG } from "../../vars/assets";

function ModalLoading() {
  const modalContent = useRef(null);

  const {
    modal: { show: modalOpen, message },
  } = loadingStore((state) => state);

  const [dotRange, setDotRange] = useState(0);

  useEffect(() => {
    let timeout;
    if (!modalOpen) setDotRange(0);

    if (modalOpen)
      timeout = setTimeout(
        () => setDotRange(dotRange == 5 ? 0 : dotRange + 1),
        250
      );

    return () => clearTimeout(timeout);
  }, [modalOpen, dotRange]);

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
        id="message-loading"
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
          className="bg-white text-slate-800 dark:bg-navy-700 rounded-lg shadow-lg overflow-auto max-w-[19rem] w-full max-h-full py-4 relative"
        >
          <div className="flex gap-3 justify-center items-center px-8">
            <img src={LOADING_IMG()} alt="loading" className="w-12 h-12" />
            <h4 className="text-xl font-normal w-full dark:text-navy-100">
              {message}
              {[...Array(dotRange).keys()].map(() => ".")}
            </h4>
          </div>
        </div>
      </Transition>
    </>
  );
}

export default ModalLoading;

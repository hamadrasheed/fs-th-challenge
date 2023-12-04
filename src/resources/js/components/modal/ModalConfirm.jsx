import React, { useRef, useEffect, useState } from "react";
import { nanoid } from "nanoid";

import Transition from "../../utils/Transition";

import { AiOutlineExclamationCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

function ModalConfirm({ modalOpen, message, action, closeModal = () => {} }) {
  const navigate = useNavigate();

  const modalContent = useRef(null);

  const [id, setId] = useState();

  const [waitAnimate, setWaitAnimate] = useState(true);

  useEffect(() => {
    setId(nanoid());
  }, []);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!modalOpen || modalContent.current.contains(target) || waitAnimate)
        return;
      closeModal();
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!modalOpen || keyCode !== 27 || waitAnimate) return;
      closeModal();
    };

    if (modalOpen) {
      document.addEventListener("keydown", keyHandler);
    }
    return () => document.removeEventListener("keydown", keyHandler);
  });

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

  const extConfirm = () => {
    //run func
    if (typeof action == "function") {
      let timeout;
      action();
      timeout = setTimeout(() => {
        closeModal();
        clearTimeout(timeout);
      }, 300);
    }
    //change route
    else navigate(action);
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
        id={`modal-${id}`}
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
          className="bg-white text-slate-800 dark:bg-navy-700 rounded-lg shadow-lg overflow-auto max-w-[26em] w-full max-h-full py-8 relative"
        >
          <AiOutlineExclamationCircle className="w-28 h-28 mx-auto text-warning animate-pulse" />

          <div className="mt-6 text-center px-6">
            <h4 className="text-xl font-normal dark:text-navy-100">
              {message}
            </h4>
          </div>

          <div className="flex w-full justify-center mt-9">
            <div className="flex justify-end pr-2">
              <button
                type="button"
                onClick={() => closeModal()}
                className="text-sm dark:text-navy-100 w-24 py-2 mx-auto rounded shadow-lg transition-colors bg-slate-200 dark:bg-navy-600 hover:bg-slate-300 dark:hover:bg-navy-500 text-slate-600 uppercase font-bold"
              >
                CANCEL
              </button>
            </div>
            <div className="flex justify-start pl-2">
              <button
                type="button"
                onClick={() => extConfirm()}
                className="text-sm w-24 py-2 mx-auto rounded shadow-lg bg-primary-200 transition-colors hover:bg-primary-500 text-white uppercase font-bold"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </>
  );
}

export default ModalConfirm;

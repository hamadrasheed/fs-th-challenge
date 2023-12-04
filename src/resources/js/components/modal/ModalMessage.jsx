import React, { useRef, useEffect, useState } from "react";
import Transition from "../../utils/Transition";

import {
  AiOutlineCloseCircle,
  AiOutlineCheckCircle,
  AiOutlineExclamationCircle,
} from "react-icons/ai";
import classNames from "classnames";
import messageStore from "../../store/messageStore";

function ModalMessage() {
  const {
    showModal: modalOpen,
    data: { title, subtitle, status },
    duration,
    redirect,
    force,
    cannotClose,
    buttonText = "Redirect me there!",
    closeMessage,
  } = messageStore((state) => state);

  const modalContent = useRef(null);
  const [timeLeft, setTimeLeft] = useState(0);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!modalOpen || modalContent.current.contains(target) || cannotClose)
        return;
      closeModal();
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!modalOpen || keyCode !== 27 || cannotClose) return;
      closeModal();
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  // auto close & timeleft
  useEffect(() => {
    let timeout;

    if (modalOpen) {
      timeout = setTimeout(() => closeModal(force ? true : false), duration);

      if (!timeLeft && duration > 1000) setTimeLeft(duration - 450);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [modalOpen]);

  // run timer
  useEffect(() => {
    let interval;
    let fps = 1000 / 60; //60fps
    if (timeLeft) interval = setTimeout(() => setTimeLeft(timeLeft - fps), fps);
    return () => {
      clearTimeout(interval);
    };
  }, [timeLeft]);

  const closeModal = (redirectNow = false, exceptCannotClose = false) => {
    if (redirect && redirectNow) return window.location.replace(redirect);

    if (!cannotClose || exceptCannotClose) {
      setTimeLeft(0);
      closeMessage();
    }
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
        id="message-center"
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
          {status === "success" && (
            <AiOutlineCheckCircle className="w-28 h-28 mx-auto text-success animate-pulse" />
          )}
          {status === "warning" && (
            <AiOutlineExclamationCircle className="w-28 h-28 mx-auto text-warning animate-pulse" />
          )}
          {status === "error" && (
            <AiOutlineCloseCircle className="w-28 h-28 mx-auto text-danger animate-pulse" />
          )}
          <div className="flex flex-col gap-3 justify-center items-center mt-6 px-6 text-center dark:text-navy-100">
            <h3 className="text-3xl font-semibold">{title}</h3>
            <h4 className="text-xl font-normal text-center">{subtitle}</h4>

            <button
              onClick={() => closeModal(redirect, true)}
              className={classNames(
                "mt-5 py-2 mx-auto rounded bg-primary-200 transition-colors hover:bg-primary-500 text-white uppercase font-bold",
                {
                  "btn-success": status === "success",
                  "btn-pastel": status === "warning",
                  "btn-danger": status === "error",
                  "w-28": !redirect,
                  "px-4": redirect,
                }
              )}
            >
              {redirect ? buttonText : "OK"}
            </button>
          </div>
          <div
            className="absolute bg-primary-200 hover:bg-primary-50 h-1 top-0"
            style={{
              width: `${(timeLeft / duration) * 100}%`,
            }}
          ></div>
        </div>
      </Transition>
    </>
  );
}

export default ModalMessage;

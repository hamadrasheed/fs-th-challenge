import React, { useRef, useEffect, useState } from "react";
import messageStore from "../../store/messageStore";
import Transition from "../../utils/Transition";

function ModalPreview() {
  const { setPreviewImage, previewImage } = messageStore((state) => state);

  const modalContent = useRef(null);

  const [waitAnimate, setWaitAnimate] = useState(true);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (
        !previewImage.showModal ||
        modalContent.current.contains(target) ||
        waitAnimate
      )
        return;
      setPreviewImage({ showModal: false, url: null });
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!previewImage.showModal || keyCode !== 27 || waitAnimate) return;
      setPreviewImage({ showModal: false, url: null });
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  // handle issue cannot open modal
  useEffect(() => {
    let timeout;
    if (previewImage.showModal) {
      setWaitAnimate(true);
      timeout = setTimeout(() => setWaitAnimate(false), 700);
    }

    return () => {
      clearTimeout(timeout);
      setWaitAnimate(true);
    };
  }, [previewImage.showModal]);

  return (
    <>
      {/* Modal backdrop */}
      <Transition
        className="fixed inset-0 bg-slate-900 bg-opacity-30 z-50 transition-opacity"
        show={previewImage.showModal}
        enter="transition ease-out duration-200"
        enterStart="opacity-0"
        enterEnd="opacity-100"
        leave="transition ease-out duration-100"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
        aria-hidden="true"
      />
      {/* Modal dialog */}
      <Transition
        id="preview-image"
        className="fixed inset-0 z-50 overflow-hidden flex items-center my-4 justify-center transform px-4 sm:px-6"
        role="dialog"
        aria-modal="true"
        show={previewImage.showModal}
        enter="transition ease-in-out duration-200"
        enterStart="opacity-0 translate-y-4"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-in-out duration-200"
        leaveStart="opacity-100 translate-y-0"
        leaveEnd="opacity-0 translate-y-4"
      >
        <div
          ref={modalContent}
          className="bg-white rounded shadow-lg overflow-auto max-w-lg w-full max-h-full"
        >
          <img
            className="object-cover w-full h-full"
            src={previewImage.url}
            alt="picture"
          />
        </div>
      </Transition>
    </>
  );
}

export default ModalPreview;

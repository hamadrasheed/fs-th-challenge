import classNames from "classnames";
import React, { useEffect } from "react";
import { FaBan, FaRegCheckCircle } from "react-icons/fa";
import { MdOutlinePublishedWithChanges, MdOutlineUnpublished } from "react-icons/md";
import multiSelectStore from "../../store/multiSelectStore";

function ConfirmButton({
    showApprove = true,
    approveEvent = () => {},

    showRefuse = true,
    refuseEvent = () => {},

    showRestore = false,
    restoreEvent = () => {},

    showVoid = false,
    voidEvent = () => {},
}) {
    const { selected: selectedItems } = multiSelectStore((state) => state);

    return (
        <div className={classNames({ hidden: selectedItems.length < 1 })}>
            <div className="flex items-center">
                <div className="hidden xl:block text-sm italic mr-2 whitespace-nowrap dark:text-navy-100">
                    <span>{selectedItems.length}</span> items selected
                </div>
                {/* approve */}
                {showApprove && (
                    <button
                        onClick={approveEvent}
                        className="btn dark:bg-navy-700 dark:border-navy-500 bg-white border-slate-200 hover:border-green-600 text-green-500"
                    >
                        <FaRegCheckCircle className="w-4 h-4 shrink-0" />
                        <span className="hidden xs:block ml-2 uppercase">
                            Approve data
                        </span>
                    </button>
                )}

                {/* refuse */}
                {showRefuse && (
                    <button
                        onClick={refuseEvent}
                        className="ml-2 btn dark:bg-navy-700 dark:border-navy-500 bg-white border-slate-200 hover:border-rose-600 text-rose-500"
                    >
                        <FaBan className="w-4 h-4 shrink-0" />
                        <span className="hidden xs:block ml-2 uppercase">
                            Refuse data
                        </span>
                    </button>
                )}

                {/* restore */}
                {showRestore && (
                    <button
                        onClick={restoreEvent}
                        className="btn dark:bg-navy-700 dark:border-navy-500 bg-white border-slate-200 hover:border-amber-600 text-amber-500"
                    >
                        <MdOutlinePublishedWithChanges className="w-4 h-4 shrink-0" />
                        <span className="hidden xs:block ml-2 uppercase">
                            Restore data
                        </span>
                    </button>
                )}

                {/* void */}
                {showVoid && (
                    <button
                        onClick={voidEvent}
                        className="ml-2 btn dark:bg-navy-700 dark:border-navy-500 bg-white border-slate-200 hover:border-rose-600 text-rose-500"
                    >
                        <MdOutlineUnpublished className="w-4 h-4 shrink-0" />
                        <span className="hidden xs:block ml-2 uppercase">
                            Void data
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
}

export default ConfirmButton;

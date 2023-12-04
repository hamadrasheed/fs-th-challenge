import classNames from "classnames";
import React from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import multiSelectStore from "../../store/multiSelectStore";

function DeleteButton({onClick=()=>{}}) {
    const { selected: selectedItems } = multiSelectStore((state) => state);

    return (
        <div className={classNames({ hidden: selectedItems.length < 1 })}>
            <div className="flex items-center">
                <div className="hidden xl:block text-sm italic mr-2 whitespace-nowrap dark:text-navy-100">
                    <span>{selectedItems.length}</span> items selected
                </div>
                <button onClick={onClick} className="btn bg-white dark:bg-navy-700 dark:border-navy-500 border-slate-200 hover:border-rose-500 text-rose-500">
                    <FaRegTrashAlt className="w-4 h-4 shrink-0" />
                    <span className="hidden xs:block ml-2 uppercase">
                        Delete data
                    </span>
                </button>
            </div>
        </div>
    );
}

export default DeleteButton;

import classNames from "classnames";
import { nanoid } from "nanoid";
import React, { useState, useEffect } from "react";
import { FaAsterisk, FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { DELETE_CONFIRM_MESSAGE } from "../../vars/string";

import ModalConfirm from "../modal/ModalConfirm";
import Tooltip from "../Tooltip";

function MultiInput({
  placeholder,
  label,
  name,
  type = "text",
  register,
  validation = {},
  errors = {},
  initialLength = 1,
  success,
  preventHoverBorder = false,
  isDisabled = false,
  setValue = (name, value) => {},
}) {
  const [required, setRequired] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [disabled, setDisabled] = useState(false);
  // error all
  const [showError, setShowError] = useState(null);
  // error some
  const [showErrors, setShowErrors] = useState([]);
  const [validationSelection, setValidationSelection] = useState({});

  const [inputKeys, setInputKeys] = useState([]);
  const [deletekeys, setdeleteKeys] = useState([]);

  // modal confirm
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    setInputKeys([...Array(initialLength).keys()].map(() => nanoid()));
  }, [initialLength]);

  useEffect(() => {
    if (Object.keys(validation).length) {
      let newValid = validation;

      setRequired(validation.required ? true : false);
      setReadOnly(validation.readOnly ? true : false);
      setDisabled(validation.disabled ? true : false);

      // when required
      if (Object.keys(validation).includes("required") && validation.required)
        newValid = {
          ...validation,
          required: {
            value: true,
            message: `The ${label} is required`,
          },
        };

      // email
      if (Object.keys(validation).includes("email"))
        newValid = {
          ...validation,
          required: {
            value: true,
            message: `The ${label} must be a valid email address.`,
          },
        };

      setValidationSelection(newValid);
    }
  }, [validation]);

  useEffect(() => {
    let tempErrors = [];
    // setShowError(
    //   errors[name]?.message ?? (errors[name] ? errors[name][0] : null)
    // );

    inputKeys.forEach((e, i) => {
      let key = name + "." + i;

      if (errors[key]) tempErrors = [...tempErrors, errors[key][0]];

      if (errors[name] && errors[name][i])
        tempErrors = [...tempErrors, errors[name][i].message ?? null];
    });

    setShowErrors(tempErrors);
  }, [errors]);

  const newInput = () => {
    setInputKeys([...inputKeys, nanoid()]);
  };

  const deleteInput = () => {
    const { key, index } = deleteId;

    // set value input to null by index
    setValue(`${name}[${index}]`, undefined);

    if (!deletekeys.includes(key)) setdeleteKeys([...deletekeys, key]);

    setShowModal(false);
  };

  const openModal = (e, i) => {
    setDeleteId({ key: e, index: i });
    setShowModal(true);
  };

  return (
    <>
      <label
        className="flex text-sm font-medium mb-1 dark:text-navy-100"
        htmlFor={inputKeys[inputKeys.length - 1]}
      >
        {label}{" "}
        {required && <FaAsterisk className="text-xs pl-1 text-red-600" />}
      </label>

      {/* notice error all */}
      {showError && (
        <div className="text-xs mt-1 text-rose-500">{showError}</div>
      )}
      {success && (
        <div className="text-xs mt-1 text-emerald-500">{success}</div>
      )}

      {/* TODO: success condition */}
      <div className="flex flex-col gap-2 w-full">
        {inputKeys.map(
          (e, i) =>
            !deletekeys.includes(e) && (
              <div key={e}>
                <div key={e} className="flex w-full gap-x-1">
                  {" "}
                  <input
                    {...register(`${name}[${i}]`, validationSelection)}
                    id={e}
                    type={type}
                    className={classNames("form-input w-full", {
                      // "border-emerald-300": success && !preventHoverBorder,
                      "border-rose-300 focus:border-rose-300":
                        showErrors[i] && !preventHoverBorder,
                      "focus:border-slate-400": !showErrors[i] && !success,
                      "disabled:border-slate-200 disabled:bg-slate-100 hover:disabled:bg-slate-200 hover:disabled:border-slate-300 disabled:text-slate-400 disabled:cursor-not-allowed":
                        disabled || isDisabled,
                      "border-slate-200 bg-slate-100 hover:bg-slate-200 hover:border-slate-300 text-slate-400 cursor-not-allowed":
                        readOnly,
                    })}
                    placeholder={placeholder}
                    disabled={disabled || isDisabled}
                    readOnly={readOnly}
                  />
                  {inputKeys.filter((e) => !deletekeys.includes(e)).length >
                    1 && (
                    <button
                      onClick={() => {
                        if (!disabled && !isDisabled) openModal(e, i);
                      }}
                      className={classNames(
                        "btn group bg-white border-slate-200 text-slate-500 dark:bg-navy-700 dark:border-navy-500 dark:text-navy-100 px-3 rounded-md relative h-[38px]",
                        {
                          "cursor-not-allowed bg-slate-200": disabled || isDisabled,
                          "hover:border-rose-500 hover:text-rose-500":
                            !disabled && !isDisabled,
                        }
                      )}
                      type="button"
                    >
                      <Tooltip
                        content={disabled || isDisabled ? "Delete Unavailable" : "Delete"}
                        isDark={disabled || isDisabled}
                        nowrap={!disabled && !isDisabled}
                      >
                        <FaRegTrashAlt className="w-4 h-4 fill-current" />
                      </Tooltip>
                    </button>
                  )}
                </div>
                {showErrors[i] && (
                  <div className="text-xs mt-1 text-rose-500">
                    {showErrors[i]}
                  </div>
                )}
                {/* success && (
                    <div className="text-xs mt-1 text-emerald-500">{success}</div>
                )*/}
              </div>
            )
        )}

        <div>
          <button
            type="button"
            onClick={() => newInput()}
            disabled={disabled || isDisabled}
            className={classNames(
              "flex items-center gap-x-2 btn bg-white dark:bg-navy-700 dark:hover:bg-navy-600 border-slate-200 dark:border-navy-500 hover:border-primary-50 dark:hover:border-primary-50 text-slate-500 dark:text-navy-100 hover:text-primary-50 dark:hover:text-primary-50",
              {
                "opacity-75 cursor-not-allowed": disabled || isDisabled,
              }
            )}
          >
            <FaPlus className="w-4 h-4 fill-current shrink-0" />
            <span className="uppercase">Add More</span>
          </button>
        </div>
      </div>

      <ModalConfirm
        modalOpen={showModal}
        message={DELETE_CONFIRM_MESSAGE}
        action={() => deleteInput()}
        closeModal={() => setShowModal(false)}
      />
    </>
  );
}

export default MultiInput;

import classNames from "classnames";
import React, { useState, useEffect } from "react";
import { FaAsterisk } from "react-icons/fa";

function TextArea({
  placeholder,
  label,
  name,
  register,
  validation = {},
  errors = {},
  success,
  preventHoverBorder = false,
  defaultValue,
  changeValue = (name, value) => {},
  onChange = (e) => {},
}) {
  const [required, setRequired] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [showError, setShowError] = useState(null);
  const [validationSelection, setValidationSelection] = useState({});

  useEffect(() => {
    if (["number", "boolean", "string"].includes(typeof defaultValue)) {
        changeValue(name, defaultValue);
        onChange({ target: { value: defaultValue } });
    }
  }, [defaultValue]);

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

      setValidationSelection(newValid);
    }
  }, [validation]);

  useEffect(() => {
    setShowError(
      errors[name]?.message ?? (errors[name] ? errors[name][0] : null)
    );
  }, [errors]);

  return (
    <>
      <label className="flex text-sm font-medium mb-1 dark:text-navy-100" htmlFor={name}>
        {label}{" "}
        {required && <FaAsterisk className="text-xs pl-1 text-red-600" />}
      </label>
      <textarea
        {...register(name, validationSelection)}
        id={name}
        className={classNames("form-input w-full py-2 px-4", {
          "border-emerald-300 focus:border-emerald-300":
            success && !preventHoverBorder,
          "border-rose-300 focus:border-rose-300":
            showError && !preventHoverBorder,
          "focus:border-slate-400": !showError && !success,
          "disabled:border-slate-200 disabled:bg-slate-100 hover:disabled:bg-slate-200 hover:disabled:border-slate-300 disabled:text-slate-400 disabled:cursor-not-allowed":
            disabled,
          "border-slate-200 bg-slate-100 hover:bg-slate-200 hover:border-slate-300 text-slate-400 cursor-not-allowed":
            readOnly,
        })}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
      />
      {showError && (
        <div className="text-xs mt-1 text-rose-500">{showError}</div>
      )}
      {success && (
        <div className="text-xs mt-1 text-emerald-500">{success}</div>
      )}
    </>
  );
}

export default TextArea;

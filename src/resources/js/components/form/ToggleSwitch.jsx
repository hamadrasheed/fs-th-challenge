import React, { useState, useEffect } from "react";
import { FaAsterisk } from "react-icons/fa";

function ToggleSwitch({
  label,
  name,
  register,
  validation = {},
  errors = {},
  success,
  valueDefault,
  onChange = (e) => {},
}) {
  const [required, setRequired] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [showError, setShowError] = useState(null);
  const [toggleActive, setToggleActive] = useState(true);
  const [validationSelection, setValidationSelection] = useState({});

  useEffect(() => {
    if (["number", "string", "boolean"].includes(typeof valueDefault))
      setToggleActive(valueDefault ? true : false);
  }, [valueDefault]);

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
      <label className="flex text-sm font-medium mb-1 dark:text-navy-100">
        {label}{" "}
        {required && <FaAsterisk className="text-xs pl-1 text-red-600" />}
      </label>
      <div className="flex items-center">
        <div className="form-switch">
          <input
            {...register(name, validationSelection)}
            id={name}
            type="checkbox"
            className="sr-only"
            checked={toggleActive}
            onChange={(e) => {
              setToggleActive(!toggleActive);
              onChange(e);
            }}
            disabled={disabled}
          />
          <label className="bg-slate-400 dark:bg-navy-700" htmlFor={name}>
            <span className="bg-white shadow-sm" aria-hidden="true"></span>
            <span className="sr-only">Active</span>
          </label>
        </div>
        <div className="text-sm text-slate-400 italic ml-2">
          {toggleActive ? "Yes" : "No"}
        </div>
      </div>
      {showError && (
        <div className="text-xs mt-1 text-rose-500">{showError}</div>
      )}
      {success && (
        <div className="text-xs mt-1 text-emerald-500">{success}</div>
      )}
    </>
  );
}

export default ToggleSwitch;

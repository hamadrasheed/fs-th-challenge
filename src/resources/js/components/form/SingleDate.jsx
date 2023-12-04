import { nanoid } from "nanoid";
import classNames from "classnames";
import React, { useState, useEffect } from "react";
import { FaAsterisk } from "react-icons/fa";
import Flatpickr from "react-flatpickr";
import { formatDate } from "../../helpers/DateHelper";

function SingleDate({
  placeholder,
  label,
  name,
  type = "text",
  register,
  validation = {},
  errors = {},
  success,
  preventHoverBorder = false,
  setNumberOnly = false,
  preventLabel = false,
  addClass = "",
  errorNested = [],
  onChange = (e) => {},
  setValue,
  defaultValue,
  changeValue = (name, value) => {},
}) {
  const [required, setRequired] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [showError, setShowError] = useState(null);
  const [validationSelection, setValidationSelection] = useState({});
  const [id, setId] = useState(null);

  useEffect(() => {
    setId(nanoid());
  }, []);

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
          ...newValid,
          required: {
            value: true,
            message: `The ${label} is required`,
          },
        };

      // when max
      if (Object.keys(validation).find((e) => "max" == e))
        newValid = {
          ...newValid,
          max: {
            value: validation["max"],
            message: `The ${label} must not be greater than ${validation["max"]}`,
          },
        };

      // when min
      if (Object.keys(validation).includes("min"))
        newValid = {
          ...newValid,
          min: {
            value: validation["min"],
            message: `The ${label} must be at least ${validation["min"]}`,
          },
        };

      // email
      if (Object.keys(validation).includes("email"))
        newValid = {
          ...newValid,
          email: {
            value: true,
            message: `The ${label} must be a valid email address.`,
          },
        };

      setValidationSelection(newValid);
    }
  }, [validation]);

  useEffect(() => {
    let getError = !errorNested.length
      ? errors[name]
      : errorNested.reduce((prev, curr) => {
          return prev ? prev[curr] : null;
        }, errors);

    setShowError(getError?.message ?? (getError ? getError[0] : null));
  }, [errors]);

  return (
    <>
      {!preventLabel && (
        <label className="flex text-sm font-medium mb-1 dark:text-navy-100" htmlFor={id}>
          {label}{" "}
          {required && type != "hidden" && (
            <FaAsterisk className="text-xs pl-1 text-red-600" />
          )}
        </label>
      )}

      <Flatpickr
        {...register(name, validationSelection)}
        id={id}
        type={type == "date" ? "text" : type}
        onChange={([e]) => {
          if (e) {
            onChange(e);
            changeValue(name, formatDate(e));
          }
        }}
        className={classNames("form-input w-full h-[38px]", {
          "border-emerald-300 focus:border-emerald-300":
            success && !preventHoverBorder,
          "border-rose-300 focus:border-rose-300":
            showError && !preventHoverBorder,
          "focus:border-slate-400": !showError && !success,
          "disabled:border-slate-200 disabled:bg-slate-100 hover:disabled:bg-slate-200 hover:disabled:border-slate-300 disabled:text-slate-400 disabled:cursor-not-allowed":
            disabled,
          "border-slate-200 bg-slate-100 hover:bg-slate-200 hover:border-slate-300 text-slate-400 cursor-not-allowed":
            readOnly,
          [addClass]: addClass,
        })}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        onKeyPress={(event) => {
          if (setNumberOnly && !/[0-9]/.test(event.key)) {
            event.preventDefault();
          }
        }}
        value={setValue}
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

export default SingleDate;

import classNames from "classnames";
import { nanoid } from "nanoid";
import React, { useState, useEffect } from "react";
import { BiHelpCircle } from "react-icons/bi";
import { FaAsterisk } from "react-icons/fa";
import NumberFormat from "react-number-format";
import Tooltip from "../Tooltip";

function InputCurrency({
  placeholder,
  onChange = (e) => {},
  label,
  name,
  type = "text",
  prefix = "",
  suffix = "",
  thousandSeparator,
  decimalSeparator,
  decimalScale,
  allowNegative = false,
  register,
  setValue,
  control,
  validation = {},
  errors = {},
  success,
  preventHoverBorder = false,
  preventLabel = false,
  addClass = "",
  errorNested = [],
  valueDefault,
  tooltipContent = null,
  tooltipPlacement = "top",
  tooltipWidth = "100%",
}) {
  const [id, setId] = useState();
  const [required, setRequired] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [showError, setShowError] = useState(null);
  const [validationSelection, setValidationSelection] = useState({});

  const [value, setValueIn] = useState("");

  useEffect(() => {
    setId(nanoid());
  }, []);

  useEffect(() => {
    setValueIn(valueDefault);
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
          {required && <FaAsterisk className="text-xs pl-1 text-red-600" />}
        </label>
      )}

      <div className="relative w-full flex items-center">
        <NumberFormat
          id={id}
          type={type}
          {...register(name, validationSelection)}
          className={classNames("form-input w-full", {
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
          prefix={prefix}
          suffix={suffix}
          thousandSeparator={thousandSeparator}
          decimalSeparator={decimalSeparator}
          decimalScale={decimalScale}
          allowNegative={allowNegative}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          value={value}
          onValueChange={(e) => {
            onChange({
              target: {
                value: Number(e.value),
              },
            });
            setValueIn(e.value);
            setValue(name, Number(e.value));
          }}
        />
        {tooltipContent && (
          <label
            htmlFor={id}
            className="cursor-pointer absolute right-3 text-slate-400 hover:text-primary-50"
          >
            <Tooltip
              content={tooltipContent}
              nowrap={false}
              placement={tooltipPlacement}
              width={tooltipWidth}
            >
              <BiHelpCircle className="w-5 h-5" />
            </Tooltip>
          </label>
        )}
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

export default InputCurrency;

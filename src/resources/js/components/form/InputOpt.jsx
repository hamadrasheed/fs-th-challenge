import { nanoid } from "@reduxjs/toolkit";
import classNames from "classnames";
import React, { useState, useEffect } from "react";
import { FaAsterisk } from "react-icons/fa";

function InputOpt({
  label,
  name,
  type = "text", // checkbox / radio
  register,
  validation = {},
  errors = {},
  success,
  options = [], // [{label,value}]
  valueDefault,
  onChange = (e) => {},
  setValue = (name, value) => {},
}) {
  const [required, setRequired] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [showError, setShowError] = useState(null);
  const [validationSelection, setValidationSelection] = useState({});
  const [opt, setOpt] = useState([]);

  // init value
  useEffect(() => {
    if (valueDefault) setValue(name, valueDefault);
  }, [valueDefault]);

  useEffect(() => {
    setOpt(options.map((e) => ({ ...e, id: nanoid(10) })));
  }, [options]);

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
    setShowError(
      errors[name]?.message ?? (errors[name] ? errors[name][0] : null)
    );
  }, [errors]);

  // set value
  useEffect(() => {
    if (valueDefault == undefined) return;

    // for radio
    if (typeof valueDefault == "string") {
      let ref = opt.find((e) => e.value == valueDefault);

      if (ref) {
        let tgt = document.getElementById(ref.id);

        if (tgt) tgt.checked = true;
      }
    }

    // for checkbox
    if (["object", "array"].includes(typeof valueDefault))
      opt
        .filter((e) => valueDefault.includes(e.value))
        .forEach((e) => {
          let tgt = document.querySelector(`#${e.id}`);

          if (tgt) tgt.checked = true;
        });
  }, [valueDefault, opt]);

  return (
    <>
      {opt[0]?.id && (
        <>
          <label className="flex text-sm font-medium mb-1 dark:text-navy-100" htmlFor={opt[0]?.id}>
            {label}{" "}
            {required && <FaAsterisk className="text-xs pl-1 text-red-600" />}
          </label>
          {/* input options */}
          <div className="flex flex-wrap gap-x-3">
            {opt.map((e) => {
              return (
                e.id && (
                  <div className="flex items-center cursor-pointer" key={e.id}>
                    <input
                      {...register(name, validationSelection)}
                      id={e.id}
                      type={type}
                      disabled={disabled}
                      className={
                        type == "radio" ? "form-radio" : "form-checkbox"
                      }
                      name={name}
                      value={e.value}
                      onChange={(e) => {
                        onChange(e);
                        setValue(name, e.target.value);
                      }}
                    />
                    <label
                      className="text-sm font-medium ml-1.5"
                      htmlFor={e.id}
                    >
                      {e.label}
                    </label>
                  </div>
                )
              );
            })}
          </div>
        </>
      )}

      {showError && (
        <div className="text-xs mt-1 text-rose-500">{showError}</div>
      )}
      {success && (
        <div className="text-xs mt-1 text-emerald-500">{success}</div>
      )}
    </>
  );
}

export default InputOpt;

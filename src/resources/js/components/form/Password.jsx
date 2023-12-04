import classNames from "classnames";
import React, { useState, useEffect } from "react";
import { FaAsterisk, FaEye, FaEyeSlash } from "react-icons/fa";

function Password({
  placeholder,
  label,
  name,
  register,
  validation = {},
  errors = {},
  success,
  preventHoverBorder = false,
}) {
  const [required, setRequired] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [showError, setShowError] = useState(null);
  const [validationSelection, setValidationSelection] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (Object.keys(validation).length) {
      setRequired(validation.required ? true : false);
      setReadOnly(validation.readOnly ? true : false);
      setDisabled(validation.disabled ? true : false);
      let newValid = validation;

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

  useEffect(() => {
    const btns = document.querySelectorAll("button[type='submit']");

    btns.forEach((e) => {
      e.closest("form").addEventListener("click", removeShowPassword);
    });

    return () => {
      btns.forEach((e) => {
        e.closest("form").removeEventListener(
          "click",
          removeShowPassword,
          true
        );
      });
    };
  }, []);

  const removeShowPassword = () => setShowPassword(false);

  return (
    <>
      <label className="flex text-sm font-medium mb-1 dark:text-navy-100" htmlFor={name}>
        {label}{" "}
        {required && <FaAsterisk className="text-xs pl-1 text-red-600" />}
      </label>
      <div className="relative w-full">
        <input
          {...register(name, validationSelection)}
          id={name}
          type={showPassword ? "text" : "password"}
          className={classNames("form-input w-full pr-8", {
            "border-emerald-300 focus:border-emerald-300":
              success || !preventHoverBorder,
            "border-rose-300 focus:border-rose-300":
              showError || !preventHoverBorder,
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
        {!showPassword && (
          <div
            className="absolute inset-0 left-auto flex items-center cursor-pointer"
            onClick={() => setShowPassword(true)}
          >
            <span className=" font-medium px-3 text-slate-300 hover:text-primary-50 transition-colors">
              <FaEye className="w-4 h-4 flex-none" />
            </span>
          </div>
        )}
        {showPassword && (
          <div
            className="absolute inset-0 left-auto flex items-center cursor-pointer"
            onClick={() => setShowPassword(false)}
          >
            <span className=" font-medium px-3 text-slate-300 hover:text-primary-50 transition-colors">
              <FaEyeSlash className="w-4 h-4 flex-none" />
            </span>
          </div>
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
export default Password;

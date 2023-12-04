import classNames from "classnames";
import React, { useState, useEffect, useRef } from "react";
import { FaAsterisk } from "react-icons/fa";
import { IoImage } from "react-icons/io5";
import Tooltip from "../Tooltip";

function InputFile({
  placeholder,
  label,
  name,
  register,
  validation = {},
  errors = {},
  success,
  accept,
  imageOnly = false,
  preventHoverBorder = false,
  imageDefault = null,
  setValue = (name, value) => {},
}) {
  const [required, setRequired] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [showError, setShowError] = useState(null);
  const [filename, setFilename] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [validationSelection, setValidationSelection] = useState({});

  const labelInput = useRef(null);
  const handleClick = () => {
    labelInput.current.click();
  };

  const imgChanges = (e) => {
    setImgPreview(URL.createObjectURL(e.target.files[0]));
    setFilename(e.target.files[0].name);
  };

  // set image default
  useEffect(() => {
    setImgPreview(imageDefault);
  }, [imageDefault]);

  useEffect(() => {
    if (Object.keys(validation).length) {
      let newValid = validation;

      setRequired(validation.required ? true : false);
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

  useEffect(() => {
    if (filename) setValue(name + "_name", filename);
  }, [filename]);

  return (
    <>
      <label
        className="flex text-sm font-medium mb-1 dark:text-navy-100"
        htmlFor={name}
        ref={labelInput}
      >
        {label}{" "}
        {required && <FaAsterisk className="text-xs pl-1 text-red-600" />}
      </label>
      <input
        {...register(name, validationSelection)}
        id={name}
        type="file"
        accept={accept}
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          imgChanges(e);
          register(name, validationSelection).onChange(e);
        }}
      />

      {!imageOnly && (
        <>
          <div className="flex group">
            <label
              className="btn cursor-pointer rounded-tr-none rounded-br-none border border-slate-200 bg-slate-100 hover:bg-slate-200 hover:border-slate-300 group-hover:bg-slate-200 group-hover:border-slate-300 text-slate-500 whitespace-nowrap"
              htmlFor={name}
            >
              Choose File
            </label>
            <input
              type="text"
              {...register(name + "_name", validationSelection)}
              className={classNames(
                "form-input w-full rounded-tl-none rounded-bl-none border-l-0 cursor-pointer",
                {
                  "border-emerald-300 focus:border-emerald-300":
                    success && !preventHoverBorder,
                  "border-rose-300 focus:border-rose-300":
                    showError && !preventHoverBorder,
                  "hover:border-slate-300 group-hover:border-slate-300 focus:border-slate-300":
                    !showError && !success,
                  "disabled:border-slate-200 disabled:bg-slate-100 hover:disabled:bg-slate-200 hover:disabled:border-slate-300 disabled:text-slate-400 disabled:cursor-not-allowed":
                    disabled,
                }
              )}
              placeholder={placeholder}
              onClick={() => handleClick()}
              readOnly
            />
          </div>

          <div className="text-xs mt-1 dark:text-navy-100">JPG, PNG, or WEBP (Max. 10 MB).</div>
          {showError && (
            <div className="text-xs mt-1 text-rose-500">{showError}</div>
          )}
          {success && (
            <div className="text-xs mt-1 text-emerald-500">{success}</div>
          )}
        </>
      )}

      <div
        className={classNames(
          "cursor-pointer p-1 border-2 border-dashed bg-slate-100 border-slate-200 hover:bg-slate-200 hover:border-slate-300 text-slate-500 rounded-md",
          {
            "w-1/3": imgPreview,
            "w-28 h-28 text-center": !imgPreview,
            "mt-3": !imageOnly,
            "border-rose-300": showError,
            "border-slate-200": !showError,
          }
        )}
        onClick={() => handleClick()}
      >
        <Tooltip
          content={
            filename
              ? filename
              : imgPreview
              ? imgPreview.replace(/^.*(\\|\/|\:)/, "")
              : placeholder
          }
        >
          {imgPreview ? (
            <img
              src={imgPreview}
              className="object-cover w-full h-full rounded-md"
            />
          ) : (
            <IoImage className="text-8xl w-full" />
          )}
        </Tooltip>
      </div>

      <div className="text-xs mt-1 dark:text-navy-100">JPG, PNG, or WEBP (Max. 10 MB).</div>
      {showError && (
        <div className="text-xs mt-1 text-rose-500">{showError}</div>
      )}
      {success && (
        <div className="text-xs mt-1 text-emerald-500">{success}</div>
      )}
    </>
  );
}

export default InputFile;

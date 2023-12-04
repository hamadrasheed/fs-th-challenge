import { nanoid } from "@reduxjs/toolkit";
import classNames from "classnames";
import React, { useState, useEffect } from "react";
import { FaAsterisk } from "react-icons/fa";
import Select from "react-select";

function MultiSelect({
  isLoading,
  placeholder,
  label,
  name,
  register,
  validation = {},
  errors = {},
  success,
  setClass,
  options = [],
  defaultValue = [], // ex: [{value:foo,label:bar}]
  isDisabled,
  setValue = (name, value) => {},
}) {
  const [required, setRequired] = useState(false);
  const [showError, setShowError] = useState(null);
  const [validationSelection, setValidationSelection] = useState({});
  const [id, setId] = useState(null);

  const [value, newValue] = useState(null);

  const customStyleMulti = {
    control: (provided, state) => ({
      ...provided,
      boxShadow: "none",
      minHeight: "38px",
      borderColor:
        state.isFocused || state.isHovered
          ? showError
            ? "#F43F5E"
            : "var(--secondary-scheme)"
          : "#e2e8f0",
      "&:hover": {
        borderColor:
          state.isFocused || state.isHovered
            ? showError
              ? "#F43F5E"
              : "var(--secondary-scheme)"
            : "#cbd5e1",
      },
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      textTransform: "capitalize",
      padding: "0 .75rem",
    }),
    multiValue: (provided, state) => ({
      ...provided,
      backgroundColor: "#e2e8f0",
      textTransform: "capitalize",
      "div[role='button']": {
        "&:hover": {
          backgroundColor: "#fda4af",
          color: "#e11d48",
        },
      },
    }),
    placeholder: (provided, state) => ({
      ...provided,
      color: "#94a3b8",
      fontSize: ".875rem",
    }),
    input: (provided, state) => ({
      ...provided,
      textTransform: "capitalize",
      color: "#1e293b",
      borderWidth: "0 !important",
      input: {
        color: "#1e293b",
        "&:focus": {
          boxShadow: "none",
        },
      },
    }),
    option: (provided, state) => ({
      ...provided,
      textTransform: "capitalize",
      color:
        state.isSelected || state.isFocused || state.isHovered
          ? "#fff"
          : "#1e293b",
      backgroundColor:
        state.isSelected || state.isFocused || state.isHovered
          ? "var(--main-scheme)"
          : "#fff",
      padding: "0 1rem",
      "&:active": {
        color: "#fff",
        backgroundColor: "var(--main-scheme)",
      },
    }),
  };

  useEffect(() => {
    setId(nanoid());
  }, []);

  // initial value
  useEffect(() => {
    setValue(
      name,
      defaultValue.map((e) => e.value)
    );
    newValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (Object.keys(validation).length) {
      let newValid = validation;

      setRequired(validation.required ? true : false);

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

  return (
    <>
      <label className="flex text-sm font-medium mb-1 dark:text-navy-100" htmlFor={id}>
        {label}{" "}
        {required && <FaAsterisk className="text-xs pl-1 text-red-600" />}
      </label>
      <Select
        isMulti
        isDisabled={isDisabled}
        isLoading={isLoading}
        value={value}
        styles={customStyleMulti}
        id={id}
        options={options}
        {...register(name, validationSelection)}
        onChange={(e) => {
          newValue(e);
          setValue(
            name,
            e.map((e) => e.value)
          );
        }}
        placeholder={
          isDisabled
            ? placeholder
            : "-- Select " + (placeholder ? placeholder : "") + " --"
        }
        className={setClass}
        classNamePrefix="select"
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

export default MultiSelect;

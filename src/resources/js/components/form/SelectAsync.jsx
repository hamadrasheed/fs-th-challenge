import React, { useState, useEffect } from "react";
import { FaAsterisk } from "react-icons/fa";
import AsyncSelect from "react-select/async";
import darkModeStore from "../../store/darkModeStore";

const SelectAsync = ({
  loading = false,
  placeholder,
  label,
  name,
  register,
  validation = {},
  errors = {},
  success,
  setClass,
  isDisabled,
  defaultOptions = true,
  isLoading = false,
  isClearable = false,
  loadAPI = (search, cb) => {},
  setValue = (value) => {},
  setValueMulti = (value) => {},
  onChange = (e) => {},
  preventLabel = false,
  errorNested = [],
  defaultValue,
  defaultValueMulti,
  isMulti = false,

  onFocus = () => {},
  onBlur = () => {},
}) => {
  const [required, setRequired] = useState(false);
  const [showError, setShowError] = useState(null);
  const [validationSelection, setValidationSelection] = useState({});

  const [customStyleMulti, setcustomStyleMulti] = useState();

  const { show: darkMode } = darkModeStore((state) => state);

  useEffect(() => {
    setcustomStyleMulti({
      control: (provided, state) => ({
        ...provided,
        boxShadow: "none",
        minHeight: "38px",
        backgroundColor: state.isDisabled
          ? darkMode
            ? "var(--bg-dark-inactive-scheme)"
            : "#f1f5f9"
          : darkMode
          ? "var(--bg-dark-scheme)"
          : "#fff",
        borderColor:
          state.isFocused || state.isHovered
            ? showError
              ? "#fda4af"
              : "var(--secondary-scheme)"
            : showError
            ? "#fda4af"
            : state.isDisabled
            ? darkMode
              ? "var(--border-dark-inactive-scheme)"
              : "#e2e8f0"
            : darkMode
            ? "var(--border-dark-scheme)"
            : "#e2e8f0",
        "&:hover": {
          borderColor:
            state.isFocused || state.isHovered
              ? state.isDisabled
                ? darkMode
                  ? "var(--border-dark-inactive-scheme)"
                  : "#cbd5e1"
                : showError
                ? "#F43F5E"
                : "var(--secondary-scheme)"
              : "#cbd5e1",
          backgroundColor:
            state.isDisabled && (state.isFocused || state.isHovered)
              ? darkMode
                ? "var(--bg-dark-inactive-scheme)"
                : "#e2e8f0"
              : darkMode
              ? "var(--bg-dark-scheme)"
              : "#fff",
        },
      }),
      valueContainer: (provided, state) => ({
        ...provided,
        textTransform: "capitalize",
        padding: "0 1rem",
        color: state.isDisabled ? "#94a3b8" : "black",
      }),
      singleValue: (provided, state) => ({
        ...provided,
        color: state.isDisabled
          ? "#94a3b8"
          : darkMode
          ? "var(--text-dark-scheme)"
          : "black",
      }),
      multiValue: (provided) => ({
        ...provided,
        color: darkMode ? "var(--text-dark-scheme)" : "#1e293b",
        backgroundColor: darkMode ? "var(--border-dark-scheme)" : "#e2e8f0",
        textTransform: "capitalize",
        "div[role='button']": {
          "&:hover": {
            darkMode: "#fda4af",
            color: "#e11d48",
          },
        },
      }),
      multiValueLabel: (provided) => ({
        ...provided,
        color: darkMode ? "var(--text-dark-scheme)" : "#1e293b",
      }),
      placeholder: (provided) => ({
        ...provided,
        color: "#94a3b8",
        fontSize: ".875rem",
      }),
      input: (provided) => ({
        ...provided,
        textTransform: "capitalize",
        color: darkMode ? "var(--text-dark-scheme)" : "#1e293b",
        borderWidth: "0 !important",
        input: {
          color: "#1e293b",
          "&:focus": {
            boxShadow: "none",
          },
        },
      }),
      menu: (provided) => ({
        ...provided,
        color: darkMode ? "var(--text-dark-scheme)" : "#1e293b",
        backgroundColor: darkMode ? "var(--bg-dark-scheme)" : "#fff",
      }),

      option: (provided, state) => ({
        ...provided,
        textTransform: "capitalize",
        color: state.isSelected ? "#fff" : "unset",
        backgroundColor: state.isSelected
          ? "var(--main-scheme)"
          : state.isFocused || state.isHovered
          ? "var(--white-dark-scheme)"
          : "#fff",
        padding: ".5rem 1rem",
        "&:active": {
          color: "#fff",
          backgroundColor: "var(--main-scheme)",
        },
      }),
    });
  }, [showError, darkMode]);

  const [searchDelay, setSearchDelay] = useState();

  const loadOptions = (search, callback = (e) => {}) => {
    clearTimeout(searchDelay);

    setSearchDelay(setTimeout(() => loadAPI(search, (e) => callback(e)), 500));
  };

  // remove settimeout when change page
  useEffect(() => () => clearTimeout(searchDelay), []);

  // init value
  useEffect(() => {
    if (isMulti) setValueMulti(defaultValueMulti?.map((e) => e.value) ?? []);
    else {
      setValue(defaultValue?.value ?? "");
    }
  }, [defaultValue, defaultValueMulti]);

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
    let getError = !errorNested.length
      ? errors[name]
      : typeof errorNested == "object"
      ? errorNested.reduce((prev, curr) => {
          return prev ? prev[curr] : null;
        }, errors)
      : {};

    setShowError(getError?.message ?? (getError ? getError[0] : null));
  }, [errors]);

  return (
    <>
      {!preventLabel && (
        <label
          className="flex text-sm font-medium mb-1 dark:text-navy-100"
          htmlFor={name}
        >
          {label}{" "}
          {required && <FaAsterisk className="text-xs pl-1 text-red-600" />}
        </label>
      )}

      {loading && (
        <div className="w-full h-9 rounded-sm bg-slate-200 animate-pulse"></div>
      )}

      {!loading &&
        (isMulti ? (
          <AsyncSelect
            id={name}
            isLoading={isLoading}
            isClearable={isClearable}
            styles={customStyleMulti}
            {...register(name, validationSelection)}
            onFocus={onFocus}
            onBlur={(e) => {
              onBlur();
              register(name, validationSelection).onBlur(e);
            }}
            isDisabled={isDisabled}
            cacheOptions
            defaultOptions={defaultOptions ?? []}
            value={defaultValueMulti ?? []}
            loadOptions={loadOptions}
            onChange={(e) => {
              onChange(e);
              setValueMulti(e ? e.map((e) => e.value) : []);
            }}
            isMulti={true}
            className={`form-input ${setClass}`}
            classNamePrefix="select"
            placeholder={placeholder}
            menuPosition="fixed"
          />
        ) : (
          <AsyncSelect
            id={name}
            isLoading={isLoading}
            isClearable={isClearable}
            styles={customStyleMulti}
            {...register(name, validationSelection)}
            onFocus={onFocus}
            onBlur={(e) => {
              onBlur();
              register(name, validationSelection).onBlur(e);
            }}
            isDisabled={isDisabled}
            cacheOptions
            defaultOptions={defaultOptions ?? []}
            value={defaultValue ?? null}
            loadOptions={loadOptions}
            onChange={(e) => {
              onChange(e);
              setValue(e?.value ?? "");
            }}
            className={setClass}
            classNamePrefix="select"
            placeholder={placeholder}
            menuPosition="fixed"
          />
        ))}

      {showError && (
        <div className="text-xs mt-1 text-rose-500">{showError}</div>
      )}
      {success && (
        <div className="text-xs mt-1 text-emerald-500">{success}</div>
      )}
    </>
  );
};

export default SelectAsync;

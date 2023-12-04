import classNames from "classnames";
import { nanoid } from "nanoid";
import React, { useState, useEffect } from "react";
import { FaAsterisk } from "react-icons/fa";
import { IoRefreshCircleOutline } from "react-icons/io5";
import Tooltip from "../Tooltip";

function InputGenerate({
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
    loadAPI = (setLoading) => {},
    setValue = (name, value) => {},

    defaultValue,
}) {
    const [required, setRequired] = useState(false);
    const [readOnly, setReadOnly] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [showError, setShowError] = useState(null);
    const [validationSelection, setValidationSelection] = useState({});
    const [id, setId] = useState(null);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setId(nanoid());
    }, []);

    useEffect(() => {
        setValue(name, defaultValue ?? "");
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

    const onClick = async () => {
        if (!loading && !disabled) {
            const code = await loadAPI(setLoading);

            setValue(name, code);
        }
    };

    return (
        <>
            <label className="flex text-sm font-medium mb-1 dark:text-navy-100" htmlFor={id}>
                {label}{" "}
                {required && (
                    <FaAsterisk className="text-xs pl-1 text-red-600" />
                )}
            </label>
            <div className="relative w-full flex items-center">
                <input
                    {...register(name, validationSelection)}
                    id={id}
                    type={type}
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
                    })}
                    placeholder={placeholder}
                    disabled={disabled}
                    readOnly={readOnly}
                    onKeyPress={(event) => {
                        if (setNumberOnly && !/[0-9]/.test(event.key)) {
                            event.preventDefault();
                        }
                    }}
                />
                <button
                    disabled={disabled}
                    type="button"
                    onClick={onClick}
                    className={classNames("absolute right-3", {
                        "text-slate-400 hover:text-primary-50": !disabled,
                        "text-slate-400/70 cursor-not-allowed": disabled,
                    })}
                >
                    <Tooltip content="Auto Generate" isDark={disabled}>
                        <IoRefreshCircleOutline
                            className={classNames(
                                "w-5 h-5 transition-transform stroke-2",
                                {
                                    "scale-125 animate-spin text-primary-50":
                                        loading,
                                }
                            )}
                        />
                    </Tooltip>
                </button>
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

export default InputGenerate;

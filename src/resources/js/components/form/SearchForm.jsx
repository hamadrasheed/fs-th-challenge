import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

function SearchForm({
  placeholder,
  defaultValue = null,
  onChange = (e) => {},
  autoComplete = true,
}) {
  const { register, handleSubmit, setValue } = useForm();

  const onSubmit = (e) => onChange(e.search);

  // init value
  useEffect(() => {
    setValue("search", defaultValue ?? "");
  }, [defaultValue]);

  return (
    <form
      className="relative"
      onSubmit={handleSubmit(onSubmit)}
      autoComplete={autoComplete ? "on" : "off"}
    >
      <label htmlFor="action-search" className="sr-only">
        Search
      </label>
      <input
        id="action-search"
        className="form-input min-w-[23.4rem] !pl-9 focus:border-slate-400"
        {...register("search", { minLength: 3 })}
        type="search"
        placeholder={placeholder}
        minLength="3"
        autoComplete={autoComplete ? "on" : "off"}
      />
      <button
        className="absolute inset-0 right-auto group"
        type="submit"
        aria-label="Search"
      >
        <svg
          className="w-4 h-4 shrink-0 fill-current text-slate-400 group-hover:text-primary-50 ml-3 mr-2"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
          <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
        </svg>
      </button>
    </form>
  );
}

SearchForm.defaultProps = {
  placeholder: "Search…",
};

export default SearchForm;

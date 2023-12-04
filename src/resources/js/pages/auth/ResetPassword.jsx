import classNames from "classnames";
import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { BiLoaderAlt } from "react-icons/bi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthAction from "../../action/AuthAction";

import Input from "../../components/form/Input";
import Password from "../../components/form/Password";

import loadingStore from "../../store/loadingStore";
import validationStore from "../../store/validationStore";
import { titleScroller } from "../../utils/Utils";
import {
  AUTH6_IMG,
  LOGO_IMG,
  LOGO_WHITE_IMG,
  PAPERPLANE,
} from "../../vars/assets";
import { L_RESET } from "../../vars/loading";
import { searchParamsToObj } from "../../helpers/UrlHelper";
import { W_SIGNIN } from "../../vars/web";
import darkModeStore from "../../store/darkModeStore";

function ResetPassword() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm();

  const navigate = useNavigate();
  const location = useLocation();

  const { resetPasswordAPI } = AuthAction();

  const { validation } = validationStore((state) => state);
  const { loading: getLoading } = loadingStore((state) => state);
  const loading = useMemo(() => getLoading[L_RESET], [getLoading]);
  const { show: darkMode } = darkModeStore((state) => state);

  const onSubmit = (e) => {
    if (!loading)
      resetPasswordAPI({
        ...e,
        email: params.email,
        token: params.token,
      });
  };

  const [params, setParams] = useState({});

  useEffect(() => {
    const { email, token } = location?.search
      ? searchParamsToObj(location.search)
      : {};

    if (!email || !token) navigate("/signin");

    setValue("email", email);

    setParams({ email, token });
  }, []);

  useEffect(() => titleScroller("Reset Password"), []);

  return (
    <main className="text-black bg-white dark:bg-navy-900">
      <div className="relative md:flex">
        {/* Content */}
        <div className="md:w-1/2">
          <div className="min-h-screen h-full flex flex-col after:flex-1">
            {/* Header */}
            <div className="flex-1">
              <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link className="block" to="/">
                  <img
                    src={darkMode ? LOGO_WHITE_IMG() : LOGO_IMG()}
                    alt="logo"
                    className="mt-20 md:mt-16 w-[40%] md:w-[30%]"
                  />
                </Link>
              </div>
            </div>

            <div className="max-w-lg mx-auto px-6 md:px-4 py-8">
              <h1 className="text-xl md:text-3xl text-slate-800 font-bold mb-6 dark:text-navy-100 dark:font-medium">
                Reset your password! Please enter your new account password
              </h1>
              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                  <div>
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      register={register}
                      placeholder="Enter your email address"
                      errors={{
                        ...errors,
                        ...validation,
                      }}
                      validation={{ disabled: true }}
                    />
                  </div>
                  <div>
                    <Password
                      label="Password"
                      name="password"
                      register={register}
                      preventHoverBorder={true}
                      placeholder="Enter your new password"
                      errors={{
                        ...errors,
                        ...validation,
                      }}
                      validation={{ required: true }}
                    />
                  </div>
                  <div>
                    <Password
                      label="Password Confirmation"
                      name="password_confirmation"
                      register={register}
                      preventHoverBorder={true}
                      placeholder="Retype your new password"
                      errors={{
                        ...errors,
                        ...validation,
                      }}
                      validation={{ required: true }}
                    />
                  </div>
                </div>
                <div className="flex gap-x-2 justify-end mt-6">
                  <Link
                    className="min-w-[7rem] items-center justify-center w-fit ml-3 flex gap-x-1 uppercase py-2 px-4 text-sm text-center rounded-full hover-box-shadow font-medium transition-all duration-300 hover:scale-x-105 bg-slate-200 hover:bg-slate-200/70"
                    to={W_SIGNIN}
                  >
                    cancel
                  </Link>
                  <button
                    className={classNames(
                      "min-w-[7rem] items-center justify-center w-fit ml-3 flex gap-x-1 uppercase py-2 px-4 text-sm text-center rounded-full hover-box-shadow font-medium transition-all duration-300 hover:scale-x-105 text-white bg-primary-400 hover:bg-primary-400/70",
                      {
                        "opacity-75 cursor-not-allowed": loading,
                      }
                    )}
                    type="submit"
                  >
                    submit
                    {loading && (
                      <BiLoaderAlt className="animate-spin fill-current opacity-50 flex-none h-4 w-4" />
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Image */}
        <div
          className="hidden md:block absolute top-0 bottom-0 right-0 md:w-1/2"
          aria-hidden="true"
        >
          <img
            className="object-cover object-center w-full h-full"
            src={AUTH6_IMG()}
            width="760"
            height="1024"
            alt="Authentication"
          />
          <img
            className="absolute top-1/4 left-0 transform -translate-x-1/2 ml-8 hidden lg:block"
            src={PAPERPLANE()}
            width="218"
            height="224"
            alt="Authentication decoration"
          />
        </div>
      </div>
    </main>
  );
}

export default ResetPassword;

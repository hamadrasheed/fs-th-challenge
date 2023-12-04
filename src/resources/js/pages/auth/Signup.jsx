import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import AuthAction from "../../action/AuthAction";
import loadingStore from "../../store/loadingStore";
import validationStore from "../../store/validationStore";
import { L_SIGNUP } from "../../vars/loading";
import { titleScroller } from "../../utils/Utils";
import { BiLoaderAlt } from "react-icons/bi";
import { Link } from "react-router-dom";
import {
  AUTH2_IMG,
  LOGO_IMG,
  LOGO_WHITE_IMG,
  PAPERPLANE,
} from "../../vars/assets";
import Input from "../../components/form/Input";
import Password from "../../components/form/Password";
import classNames from "classnames";
import { W_HOME, W_SIGNIN } from "../../vars/web";
import darkModeStore from "../../store/darkModeStore";
import { APP_NAME } from "../../vars/types";

function Signup() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const { loading: getLoading } = loadingStore((state) => state);
  const loading = useMemo(() => getLoading[L_SIGNUP], [getLoading]);

  const { validation } = validationStore((state) => state);

  const { signupAPI } = AuthAction();

  const { show: darkMode } = darkModeStore((state) => state);

  const onSubmit = (e) => {
    if (!loading) signupAPI(e);
  };

  useEffect(() => titleScroller("Sign In"), []);

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
                <Link className="block" to={W_HOME}>
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
                Create your {APP_NAME} Account! Please fill out properly
              </h1>
              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                  <div>
                    <Input
                      label="Full Name"
                      name="name"
                      register={register}
                      errors={{
                        ...errors,
                        ...validation,
                      }}
                      placeholder="Enter your full name"
                      validation={{ required: true }}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Input
                        label="Username"
                        name="username"
                        register={register}
                        errors={{
                          ...errors,
                          ...validation,
                        }}
                        placeholder="Enter your username"
                        validation={{ required: true }}
                      />
                    </div>
                    <div>
                      <Input
                        label="Email"
                        name="email"
                        type="email"
                        register={register}
                        errors={{
                          ...errors,
                          ...validation,
                        }}
                        placeholder="Enter your email"
                        validation={{ required: true, email: true }}
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="relative">
                      <Password
                        label="Password"
                        name="password"
                        register={register}
                        errors={{
                          ...errors,
                          ...validation,
                        }}
                        preventHoverBorder={true}
                        placeholder="Enter your password"
                        validation={{ required: true }}
                      />
                    </div>
                    <div className="relative">
                      <Password
                        label="Password Confirmation"
                        name="password_confirmation"
                        register={register}
                        errors={{
                          ...errors,
                          ...validation,
                        }}
                        preventHoverBorder={true}
                        placeholder="Retype your password"
                        validation={{ required: true }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <div className="mr-1">
                    Have an account?{" "}
                    <Link
                      className="font-medium text-primary-200 hover:text-primary-500"
                      to={W_SIGNIN}
                    >
                      Sign In
                    </Link>
                  </div>
                  <button
                    className={classNames(
                      "min-w-[7rem] items-center justify-center w-fit ml-3 flex gap-x-1 uppercase py-2 px-4 text-sm text-center rounded-full hover-box-shadow font-medium transition-all duration-300 hover:scale-x-105 text-white bg-primary-400 hover:bg-primary-400/70",
                      {
                        "opacity-75 cursor-not-allowed": loading,
                      }
                    )}
                    type="submit"
                  >
                    Sign Up
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
            src={AUTH2_IMG()}
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

export default Signup;

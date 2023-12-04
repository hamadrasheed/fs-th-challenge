import React, { useEffect, useMemo, useState } from "react";

import { titleScroller } from "../../utils/Utils";
import PageTitle from "../../components/layouts/partials/PageTitle";
import Input from "../../components/form/Input";
import AccordionList from "../../components/accordion/AccordionList";
import Password from "../../components/form/Password";
import { useForm } from "react-hook-form";
import validationStore from "../../store/validationStore";
import {
  FORM_CHANGE_PASSWORD,
  FORM_EDIT_PROFILE,
  FORM_PREFERENCES_CATEGORY,
  FORM_PREFERENCES_AUTHOR,
  FORM_PREFERENCES_SOURCE,
  FORM_UPDATE_PROFILE,
} from "../../vars/formName";
import loadingStore from "../../store/loadingStore";
import DefaultAction from "../../action/DefaultAction";
import dataStore from "../../store/dataStore";
import {
  L_DETAIL,
  L_S_AUTHOR,
  L_S_CATEGORY,
  L_S_GENDER,
  L_S_SOURCE,
} from "../../vars/loading";
import {
  A_CHANGE_PASSWORD,
  A_EDIT_PROFILE,
  A_UPDATE_PROFILE,
  A_U_AUTHOR,
  A_U_CATEGORY,
  A_U_GENDER,
  A_U_SOURCE,
} from "../../vars/api";
import LoadingForm from "../../components/LoadingForm";
import FormButton from "../../components/button/FormButton";
import classNames from "classnames";
import { FaUserEdit } from "react-icons/fa";
import authStore from "../../store/authStore";
import InputFile from "../../components/form/InputFile";
import SelectAsync from "../../components/form/SelectAsync";
import TextArea from "../../components/form/TextArea";
import { objSelectTo } from "../../helpers/ObjHelper";
import Extend from "../../components/layouts/Extend";
import { BsIncognito } from "react-icons/bs";
import { objSelectFrom } from "../../helpers/ObjHelper";

function AccountSettings() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    control,
  } = useForm();

  // API FUNC
  const { selectData, sendData, detailData } = DefaultAction();

  const [isProfile, setisProfile] = useState(true);

  // LOAD VALIDATION FROM ZUUSTAND
  const { validation } = validationStore((state) => state);

  const {
    details: getDetails,
    setDetail,
    menuData,
    setMenuData,
  } = dataStore((state) => state);
  const { setAuthData } = authStore((state) => state);

  // DATA EDIT FROM ZUUSTAND
  const details = useMemo(
    () => getDetails[FORM_EDIT_PROFILE] ?? {},
    [getDetails]
  );
  const prefCategory = useMemo(
    () => getDetails[FORM_PREFERENCES_CATEGORY] ?? [],
    [getDetails]
  );
  const prefSource = useMemo(
    () => getDetails[FORM_PREFERENCES_SOURCE] ?? [],
    [getDetails]
  );
  const prefAuthor = useMemo(
    () => getDetails[FORM_PREFERENCES_AUTHOR] ?? [],
    [getDetails]
  );
  const [preferred, setPreferred] = useState([]);

  // LOAD LOADING FROM ZUUSTAND
  const { loading: getLoading } = loadingStore((state) => state);
  const loading = useMemo(() => getLoading[L_DETAIL], [getLoading]);

  const { name, photo } = authStore((state) => state);

  // accordion toggle
  const [focus, setFocus] = useState(null);

  // INIT
  useEffect(() => {
    detailData({
      formName: FORM_EDIT_PROFILE,
      path: A_EDIT_PROFILE,
      id: "",
    });
  }, []);

  useEffect(() => titleScroller("Account Settings"), []);

  const onSubmit = (req) => {
    sendData({
      path: A_CHANGE_PASSWORD,
      id: "",
      withoutId: true,
      formName: FORM_CHANGE_PASSWORD,
      req,
    });
    resetForm();
  };

  const resetForm = () => {
    setValue("password", null);
    setValue("new_password", null);
    setValue("password_confirmation", null);
  };

  const updateValue = (name, value, isSelected = false) => {
    setValue(name, isSelected ? value?.value : value);
  };

  const onSubmitProfile = (req) => {
    sendData({
      path: A_UPDATE_PROFILE,
      id: "",
      withoutId: true,
      formName: FORM_UPDATE_PROFILE,
      req,
      imgData: ["photo"],
      onSuccess: (e) => {
        let res = { name: e.name };
        if (e.photo) {
          res.photo = e.photo;
        }
        setAuthData(res);
        setMenuData(e.category);
      },
    });
  };

  return (
    <Extend isSlate={true}>
      <PageTitle
        isSlate={true}
        title="Account Settings"
        links={[
          { name: "Home", url: "/" },
          { name: "Settings" },
          { name: "Account" },
        ]}
        imageUrl="/images/page-title/settings.jpg"
      />

      <div className="bg-slate-100 w-full">
        <div className="w-full container mx-auto rounded-xl relative px-12 ">
          <div className="bg-white mb-32 relative w-full flex items-center rounded-xl shadow-md">
            {/* label */}
            <div
              className={classNames(
                "z-[1] transition-all duration-500 absolute w-2/5 shadow-xl before:absolute before:content-[''] before:w-full before:bg-secondary-400/60 before:rounded-xl before:h-full bg-cover bg-center bg-no-repeat px-6 py-4 md:px-8 xl:px-12 md:py-6 text-white rounded-xl flex flex-col justify-center items-center",
                {
                  "ml-[60%]": isProfile,
                }
              )}
              style={{
                height: "calc(100% + 3rem)",
                backgroundImage: `url("${photo}")`,
              }}
            >
              <div className="text-center mb-8 relative">
                {isProfile ? (
                  <>
                    <h2 className="uppercase text-xl md:text-4xl font-['Helvetica'] font-bold pb-4">
                      Preferences
                    </h2>
                    <h4 className="w-fit mx-auto text-sm md:text-xl">
                      Here you can edit your profile and the news preference as
                      well or you can click the button below to change your
                      account password
                    </h4>
                  </>
                ) : (
                  <>
                    <h2 className="uppercase text-xl md:text-4xl font-['Helvetica'] font-bold pb-4">
                      Password
                    </h2>
                    <h4 className="w-fit mx-auto text-sm md:text-xl">
                      Here you can change your account password or click the
                      button below to edit your profile and the news preference
                      as well
                    </h4>
                  </>
                )}
              </div>

              <button
                type="button"
                className="relative text-sm md:text-lg uppercase py-2 px-4 md:px-6 rounded-full hover-box-shadow font-medium transition-all duration-300 hover:scale-x-105 text-white bg-primary-400 "
                onClick={() => {
                  setisProfile(!isProfile);
                  setFocus(0);
                }}
              >
                {isProfile ? "Change Password" : "Edit Profile"}
              </button>
            </div>

            {/* form */}
            <div
              className={classNames(
                "min-h-[18rem] relative transition-all text-slate-600 duration-500 py-4",
                !isProfile ? "w-full" : "w-3/5",
                { "pl-[40%]": !isProfile }
              )}
            >
              <div className="px-6 py-4 md:px-8 xl:px-12 md:py-6 w-full">
                <div>
                  <h1 className="uppercase text-xl md:text-4xl pt-4 pb-6 font-['Helvetica'] font-extrabold text-center">
                    {isProfile ? (
                      <>
                        Edit <span className="text-primary-200">Profile</span>
                      </>
                    ) : (
                      <>
                        Change{" "}
                        <span className="text-primary-200">Password</span>
                      </>
                    )}
                  </h1>
                </div>
                <div className="relative w-full flex flex-col gap-6">
                  {loading ? (
                    <LoadingForm />
                  ) : (
                    <form
                      onSubmit={handleSubmit(
                        isProfile ? onSubmitProfile : onSubmit
                      )}
                    >
                      {isProfile ? (
                        <>
                          {/* personal data */}
                          <AccordionList
                            Icon={FaUserEdit}
                            title="Personal Data"
                            tabIndex="1"
                            focus={focus}
                            setFocus={setFocus}
                          >
                            <div className="py-4 space-y-4">
                              <div>
                                <Input
                                  label="Full Name"
                                  name="name"
                                  register={register}
                                  errors={{ ...errors, ...validation }}
                                  placeholder="Enter your full name"
                                  validation={{ required: true }}
                                  defaultValue={details.name}
                                  changeValue={updateValue}
                                />
                              </div>
                              <div>
                                <InputFile
                                  imageDefault={details.photo}
                                  imageOnly={true}
                                  label="Photo"
                                  name="photo"
                                  accept="image/png, image/jpeg, image/webp"
                                  register={register}
                                  errors={{ ...errors, ...validation }}
                                  placeholder="No file chosen"
                                  setValue={(name, value) =>
                                    setValue(name, value)
                                  }
                                />
                              </div>
                              <div>
                                <Input
                                  label="Birthdate"
                                  name="birthdate"
                                  type="date"
                                  register={register}
                                  errors={{ ...errors, ...validation }}
                                  placeholder="Enter your birthdate"
                                  validation={{ required: true }}
                                  defaultValue={details.birthdate}
                                  changeValue={updateValue}
                                />
                              </div>
                              <div>
                                <SelectAsync
                                  defaultValue={objSelectTo(
                                    details,
                                    "gender",
                                    "gender"
                                  )}
                                  placeholder="Gender"
                                  label="Gender"
                                  name="gender"
                                  errors={{ ...errors, ...validation }}
                                  validation={{
                                    required: true,
                                  }}
                                  isLoading={getLoading[L_S_GENDER]}
                                  register={register}
                                  loadAPI={(search, cb) =>
                                    selectData({
                                      path: A_U_GENDER,
                                      search,
                                      loadingVar: L_S_GENDER,
                                      cb,
                                    })
                                  }
                                  setValue={(e) => setValue("gender", e)}
                                  onChange={(e) => {
                                    setDetail({
                                      [FORM_EDIT_PROFILE]: {
                                        ...(details[FORM_EDIT_PROFILE] ?? {}),
                                        gender: e.value,
                                      },
                                    });
                                    updateValue("gender", e, true);
                                  }}
                                />
                              </div>

                              <div>
                                <TextArea
                                  label="Address"
                                  name="address"
                                  register={register}
                                  errors={{ ...errors, ...validation }}
                                  placeholder="Enter your address"
                                  defaultValue={details.address}
                                  changeValue={updateValue}
                                />
                              </div>

                              <div>
                                <Input
                                  label="Phone"
                                  name="phone"
                                  register={register}
                                  errors={{ ...errors, ...validation }}
                                  placeholder="Enter your phone"
                                  validation={{ required: true }}
                                  setNumberOnly={true}
                                  defaultValue={details.phone}
                                  changeValue={updateValue}
                                />
                              </div>
                            </div>
                          </AccordionList>

                          {/* news preferences */}
                          <AccordionList
                            Icon={BsIncognito}
                            title="News Preferences"
                            tabIndex="2"
                            focus={focus}
                            setFocus={setFocus}
                          >
                            <div className="py-4 space-y-4">
                              {/* category */}
                              <div>
                                <SelectAsync
                                  setClass="no-padding"
                                  defaultValueMulti={(preferred.includes(
                                    FORM_PREFERENCES_CATEGORY
                                  ) || prefCategory.length
                                    ? prefCategory
                                    : details?.preferences?.category
                                    ? details?.preferences?.category
                                    : []
                                  ).map((e) =>
                                    preferred.includes(
                                      FORM_PREFERENCES_CATEGORY
                                    ) || prefCategory.length
                                      ? objSelectTo(e)
                                      : e
                                  )}
                                  placeholder="-- Select Categories --"
                                  name="category"
                                  isMulti={true}
                                  preventLabel={false}
                                  label="News Category"
                                  register={register}
                                  isLoading={getLoading[L_S_CATEGORY]}
                                  loadAPI={(search, cb) =>
                                    selectData({
                                      path: A_U_CATEGORY,
                                      search,
                                      loadingVar: L_S_CATEGORY,
                                      cb,
                                    })
                                  }
                                  setValueMulti={(e) => setValue("category", e)}
                                  onChange={(e) => {
                                    setDetail({
                                      [FORM_PREFERENCES_CATEGORY]: e.map((v) =>
                                        objSelectFrom(v)
                                      ),
                                    });
                                    setPreferred([
                                      ...preferred,
                                      FORM_PREFERENCES_CATEGORY,
                                    ]);
                                    updateValue("category", e, true);
                                  }}
                                />
                              </div>

                              {/* source */}
                              <div>
                                <SelectAsync
                                  setClass="no-padding"
                                  defaultValueMulti={(preferred.includes(
                                    FORM_PREFERENCES_SOURCE
                                  ) || prefSource.length
                                    ? prefSource
                                    : details?.preferences?.source
                                    ? details?.preferences?.source
                                    : []
                                  ).map((e) =>
                                    preferred.includes(
                                      FORM_PREFERENCES_SOURCE
                                    ) || prefSource.length
                                      ? objSelectTo(e)
                                      : e
                                  )}
                                  placeholder="-- Select Sources --"
                                  name="source"
                                  isMulti={true}
                                  preventLabel={false}
                                  label="News Source"
                                  register={register}
                                  isLoading={getLoading[L_S_SOURCE]}
                                  loadAPI={(search, cb) =>
                                    selectData({
                                      path: A_U_SOURCE,
                                      search,
                                      loadingVar: L_S_SOURCE,
                                      cb,
                                    })
                                  }
                                  setValueMulti={(e) => setValue("source", e)}
                                  onChange={(e) => {
                                    setDetail({
                                      [FORM_PREFERENCES_SOURCE]: e.map((v) =>
                                        objSelectFrom(v)
                                      ),
                                    });
                                    setPreferred([
                                      ...preferred,
                                      FORM_PREFERENCES_SOURCE,
                                    ]);
                                    updateValue("source", e, true);
                                  }}
                                />
                              </div>

                              {/* author */}
                              <div>
                                <SelectAsync
                                  setClass="no-padding"
                                  defaultValueMulti={(preferred.includes(
                                    FORM_PREFERENCES_AUTHOR
                                  ) || prefAuthor.length
                                    ? prefAuthor
                                    : details?.preferences?.author
                                    ? details?.preferences?.author
                                    : []
                                  ).map((e) =>
                                    preferred.includes(
                                      FORM_PREFERENCES_AUTHOR
                                    ) || prefAuthor.length
                                      ? objSelectTo(e)
                                      : e
                                  )}
                                  placeholder="-- Select Authors --"
                                  name="author"
                                  isMulti={true}
                                  preventLabel={false}
                                  label="News Author"
                                  register={register}
                                  isLoading={getLoading[L_S_AUTHOR]}
                                  loadAPI={(search, cb) =>
                                    selectData({
                                      path: A_U_AUTHOR,
                                      search,
                                      loadingVar: L_S_AUTHOR,
                                      cb,
                                    })
                                  }
                                  setValueMulti={(e) => setValue("author", e)}
                                  onChange={(e) => {
                                    setDetail({
                                      [FORM_PREFERENCES_AUTHOR]: e.map((v) =>
                                        objSelectFrom(v)
                                      ),
                                    });
                                    setPreferred([
                                      ...preferred,
                                      FORM_PREFERENCES_AUTHOR,
                                    ]);
                                    updateValue("author", e, true);
                                  }}
                                />
                              </div>
                            </div>
                          </AccordionList>
                        </>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <Input
                              label="Email"
                              name="email"
                              type="email"
                              register={register}
                              errors={{ ...errors, ...validation }}
                              placeholder="Enter your email"
                              validation={{ disabled: true }}
                              defaultValue={details.email}
                              changeValue={updateValue}
                            />
                          </div>
                          <div>
                            <Password
                              label="Current Password"
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
                              label="New Password"
                              name="new_password"
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
                      )}

                      <FormButton
                        onCancel={resetForm}
                        submitText="save changes"
                      />
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Extend>
  );
}

export default AccountSettings;

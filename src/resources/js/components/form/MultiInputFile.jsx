import { nanoid } from "@reduxjs/toolkit";
import classNames from "classnames";
import React, { useState, useEffect } from "react";
import { FaAsterisk, FaPlus, FaTimes } from "react-icons/fa";
import { IoImage } from "react-icons/io5";
import Tooltip from "../Tooltip";
import { objChanger } from "../../helper/ObjHelper";
import ModalConfirm from "../modal/ModalConfirm";
import { DELETE_CONFIRM_MESSAGE } from "../../vars/message";

function MultiInputFile({
  imageDefault = [],
  deleteName,
  label,
  name,
  register,
  validation = {},
  errors = {},
  success,
  accept,
  preventHoverBorder = false,
  setValue = (name, value) => {},
}) {
  const [required, setRequired] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [showError, setShowError] = useState(null);
  const [filename, setFilename] = useState(null);
  const [validationSelection, setValidationSelection] = useState({});

  const [inputKeys, setInputKeys] = useState([]);
  const [deletekeys, setdeleteKeys] = useState([]);
  const [imgPreview, setImgPreview] = useState({});

  // delete vars
  const [deleteIdAvail, setDeleteIdAvail] = useState([]);
  const [deleteIds, setDeleteIds] = useState([]);

  // modal confirm
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState({
    key: null,
    index: null,
  });

  // initial
  useEffect(() => {
    if (imageDefault.length && !deleteIdAvail.length) {
      const ids = imageDefault.map((e) => e.id);
      setInputKeys([...ids, nanoid()]);
      setDeleteIdAvail(ids);
      setImgPreview(
        imageDefault.reduce(
          (prev, curr) => ({ ...prev, [curr.id]: curr.picture }),
          {}
        )
      );
    } else setInputKeys([nanoid()]);
  }, [imageDefault]);

  // validation
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

  useEffect(() => {
    if (deleteIds.length) setValue(deleteName, deleteIds);
  }, [deleteIds]);

  // handle image length to zero
  useEffect(() => {
    if (!inputKeys.filter((e) => !deletekeys.includes(e)).length)
      setInputKeys([nanoid()]);
  }, [deletekeys]);

  const addToInputDelete = (id) => {
    if (
      deleteIdAvail.length &&
      deleteIdAvail.includes(id) &&
      !deleteIds.includes(id)
    )
      setDeleteIds([...deleteIds, id]);
  };

  const imgChanges = (e, key) => {
    addToInputDelete(key);
    if (!Object.keys(imgPreview).find((e) => e == key))
      setInputKeys([...inputKeys, nanoid()]);

    setImgPreview({
      ...imgPreview,
      [key]: URL.createObjectURL(e.target.files[0]),
    });
    // setFilename(e.target.files[0].name);
  };

  const deleteImage = () => {
    const { key, index } = deleteId;
    addToInputDelete(key);

    //set value to null
    setValue(`${name}[${index}]`, undefined);

    setdeleteKeys([...deletekeys, key]);
    setImgPreview(
      objChanger(imgPreview, {
        except: [key],
      })
    );
    setShowModal(false);
  };
  const openModal = (e, i) => {
    setDeleteId({ key: e, index: i });
    setShowModal(true);
  };

  return (
    <>
      <label
        className="flex text-sm font-medium mb-1 dark:text-navy-100"
        htmlFor={inputKeys[inputKeys.length - 1]}
      >
        {label}{" "}
        {required && <FaAsterisk className="text-xs pl-1 text-red-600" />}
      </label>
      <div className="text-xs mt-1 dark:text-navy-100">JPG, PNG, or WEBP (Max. 10 MB).</div>

      {/*showError && (
        <div className="text-xs mt-1 text-rose-500">{showError}</div>
      )}
      {success && (
        <div className="text-xs mt-1 text-emerald-500">{success}</div>
      ) */}

      {/* delete input */}
      {deleteIds.map((value, i) => (
        <input
          key={value + "_delete"}
          type="hidden"
          {...register(`${deleteName}[${i}]`)}
        />
      ))}

      <div className="flex flex-wrap gap-x-4">
        {inputKeys.map(
          (e, i) =>
            !deletekeys.includes(e) && (
              <div
                key={e}
                className={classNames(
                  "cursor-pointer relative mt-3 p-1 border-2 border-dashed bg-slate-100 border-slate-200 hover:bg-slate-200 hover:border-slate-300 text-slate-500 rounded-md h-28",
                  {
                    "w-28 text-center": !imgPreview[e],
                    "flex items-center":
                      Object.keys(imgPreview).length &&
                      !Object.keys(imgPreview).includes(e),
                  }
                )}
              >
                {/* NOTE : TOOLTIP  */}
                {imgPreview[e] ? (
                  <img
                    src={imgPreview[e]}
                    className="object-cover w-full h-full rounded-md"
                  />
                ) : Object.keys(imgPreview).length ? (
                  <FaPlus className="text-4xl w-full" />
                ) : (
                  <IoImage className="text-8xl w-full" />
                )}
                <input
                  {...register(
                    `${name}[${i}]`,
                    Object.keys(imgPreview).length ? {} : validationSelection
                  )}
                  id={e}
                  type="file"
                  accept={accept}
                  className="absolute inset-0 w-full-h-full opacity-0"
                  disabled={disabled}
                  onChange={(event) => {
                    imgChanges(event, e);
                    register(
                      `${name}[${i}]`,
                      Object.keys(imgPreview).length ? {} : validationSelection
                    ).onChange(event);
                  }}
                />
                {/* delete image */}
                {Object.keys(imgPreview).includes(e) && (
                  <button
                    onClick={() => openModal(e, i)}
                    type="button"
                    className="absolute -top-3 -right-3 rounded-full p-1 bg-rose-500 hover:bg-rose-600"
                  >
                    <FaTimes className="text-white" />
                  </button>
                )}
              </div>
            )
        )}
      </div>
      <ModalConfirm
        modalOpen={showModal}
        message={DELETE_CONFIRM_MESSAGE}
        action={() => deleteImage()}
        closeModal={() => setShowModal(false)}
      />
    </>
  );
}

export default MultiInputFile;

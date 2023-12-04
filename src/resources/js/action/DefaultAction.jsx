import React from "react";
import FetchHelper from "../helpers/FetchHelper";
import loadingStore from "../store/loadingStore";
import messageStore from "../store/messageStore";
import paramsStore from "../store/paramsStore";
import validationStore from "../store/validationStore";
import dataStore from "../store/dataStore";
import { objToParams } from "../helpers/UrlHelper";
import { L_DATA, L_DELETE, L_DETAIL, L_POST } from "../vars/loading";
import {
  multiPictureBooleanTrans,
  objBooleanTrans,
  objChanger,
  pictureBooleanTrans,
} from "../helpers/ObjHelper";
import { useLocation, useNavigate } from "react-router-dom";

function DefaultAction() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setValidation, resetValidation } = validationStore((state) => state);
  const { setLoading } = loadingStore((state) => state);
  const { setMessage } = messageStore((state) => state);
  const { resetParams } = paramsStore((state) => state);
  const { setMenuData, setHeroData, setFeedsData, setNoPaginate, setPaginate, deleteDetail, setAccessable, setDetail, setIsNotFound } =
    dataStore((state) => state);
  const { useFetch } = FetchHelper();

  const getData = async (
    path,
    params = {},
    otherOn = (data, status) => {},
    usePaginate = true
  ) => {
    await useFetch({
      url: path + objToParams(params),
      useToken: true,
      method: "GET",
      validationDataOn: (e) => setValidation(e),
      loadingOn: (e) => setLoading({ [L_DATA]: e }),
      succesOn: (e) => {
        usePaginate ? setPaginate(e) : setNoPaginate(e);
      },
    //   otherOn: (data, status) => otherOn(data, status),
      showMsgSuccess: false,
      messageOn: (e) =>
        setMessage({
          showModal: true,
          data: e,
        }),
    });
  };

  const getMenuData = async (
    path,
    params = {},
  ) => {
    await useFetch({
      url: path + objToParams(params),
      useToken: true,
      method: "GET",
      validationDataOn: (e) => setValidation(e),
      loadingOn: (e) => setLoading({ [L_DATA]: e }),
      succesOn: (e) => setMenuData(e),
      showMsgSuccess: false,
      messageOn: (e) =>
        setMessage({
          showModal: true,
          data: e,
        }),
    });
  };

  const getHeroData = async (
    path,
    params = {},
  ) => {
    await useFetch({
      url: path + objToParams(params),
      useToken: true,
      method: "GET",
      validationDataOn: (e) => setValidation(e),
      loadingOn: (e) => setLoading({ [L_DATA]: e }),
      succesOn: (e) => setHeroData(e),
      showMsgSuccess: false,
      messageOn: (e) =>
        setMessage({
          showModal: true,
          data: e,
        }),
    });
  };

  const getFeedsData = async (
    path,
    params = {},
  ) => {
    await useFetch({
      url: path + objToParams(params),
      useToken: true,
      method: "GET",
      validationDataOn: (e) => setValidation(e),
      loadingOn: (e) => setLoading({ [L_DATA]: e }),
      succesOn: (e) => setFeedsData(e),
      showMsgSuccess: false,
      messageOn: (e) =>
        setMessage({
          showModal: true,
          data: e,
        }),
    });
  };

  const deleteData = async (path, id) => {
    await useFetch({
      url: path + "/" + id,
      useToken: true,
      method: "DELETE",
      validationDataOn: (e) => setValidation(e),
      loadingOn: (e) => setLoading({ [L_DELETE]: e }),
      showMsgSuccess: true,
      messageOn: (e) =>
        setMessage({
          showModal: true,
          data: e,
        }),
    });
  };
  const deleteMultiData = async (path, params = {}) => {
    await useFetch({
      url: path + objToParams(params),
      useToken: true,
      method: "DELETE",

      validationDataOn: (e) => setValidation(e),
      loadingOn: (e) => setLoading({ [L_DELETE]: e }),
      showMsgSuccess: true,
      messageOn: (e) =>
        setMessage({
          showModal: true,
          data: e,
        }),
    });
  };

  const generateData = async (path, setLoading = (e) => {}) => {
    let res = "";
    await useFetch({
      url: path + "/generate",
      useToken: true,
      method: "GET",
      validationDataOn: (e) => setValidation(e),
      loadingOn: (e) => setLoading(e),
      succesOn: (e) => (res = e.code),
      showMsgSuccess: false,
      messageOn: (e) =>
        setMessage({
          showModal: true,
          data: e,
        }),
    });

    return res;
  };

  const detailData = async ({ path, id, formName, otherUrl = false }) => {
    await useFetch({
      url: path + "/" + id,
      useToken: true,
      method: "GET",
      accessableOn: (e) => setAccessable(e),
      validationDataOn: (e) => setValidation(e),
      loadingOn: (e) => setLoading({ [L_DETAIL]: e }),
      succesOn: (e) => setDetail({ [formName]: e }),
      otherUrl,
      notFoundOn: () => {
        setIsNotFound(true);
        setDetail({ [formName]: null });
      },
      showMsgSuccess: false,
      messageOn: (e) =>
        setMessage({
          showModal: true,
          data: e,
        }),
    });
  };

  const selectData = async ({
    path,
    search,
    cb = (e) => {},
    loadingVar,
    label = "name",
    value = "code",
    otherParams = {},
    withCode = false,
    onlyCode = false,
    otherUrl = true,
  }) => {
    await useFetch({
      url:
        path +
        objToParams({
          q: search,
          ...otherParams,
        }),
      useToken: true,
      method: "GET",
      otherUrl,
      validationDataOn: (e) => setValidation(e),
      loadingOn: (e) => setLoading({ [loadingVar]: e }),
      succesOn: (e) => {
        cb(
          e.map((e) => ({
            label: onlyCode
              ? e[value]
              : withCode
              ? e[value] + " - " + e[label]
              : e[label],
            value: e[value],
          }))
        );
      },
      showMsgSuccess: false,
      messageOn: (e) =>
        setMessage({
          showModal: true,
          data: e,
        }),
    });
  };

  const sendData = async ({
    path,
    id,
    req = {},
    formName,
    booleanData = ["is_active"],
    imgData = [],
    multiImgData = [],
    withoutId = false,
    onSuccess = () => {},
  }) => {
    const hasFile = imgData.length > 0 || multiImgData.length > 0;
    let data = req;

    resetValidation();

    // replace boolean
    if (booleanData.length) {
      data = {
        ...data,
        ...objBooleanTrans(objChanger(req, { only: booleanData })),
      };
    }

    // replace img
    if (imgData.length) {
      data = {
        ...objChanger(data, { except: imgData }),
        ...pictureBooleanTrans(objChanger(req, { only: imgData })),
      };
    }

    // replace multi img
    if (multiImgData.length) {
      data = {
        ...objChanger(data, { except: multiImgData }),
        ...multiPictureBooleanTrans(objChanger(req, { only: multiImgData })),
      };
    }

    await useFetch({
      url: path + (id || withoutId ? "/" + id : ""),
      useToken: true,
      data,
      hasFile,
      method: id || withoutId ? "PUT" : "POST",
      validationDataOn: (e) => setValidation(e),
      loadingOn: (e) => setLoading({ [L_POST]: e }),
      succesOn: (e) => {
        deleteDetail(formName);
        resetParams();
        navigate(location.pathname);
        onSuccess(e);
      },
      showMsgSuccess: true,
      messageOn: (e) =>
        setMessage({
          showModal: true,
          data: e,
        }),
    });
  };

  const customPath = async (path, method = "GET") => {
    let res;
    await useFetch({
      path,
      useToken: true,
      method,
      showMsgSuccess: false,
      messageOn: (e) => {
        setMessage({
          showModal: true,
          data: e,
        });
      },
      succesOn: (e) => (res = e),
    });

    return res;
  };

  return {
    getData,
    getMenuData,
    getHeroData,
    getFeedsData,
    deleteData,
    deleteMultiData,
    generateData,
    sendData,
    detailData,
    selectData,
    customPath,
  };
}

export default DefaultAction;

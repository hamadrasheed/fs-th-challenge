// import {
//   getToken,
//   resetAuth,
//   setAuthValidation,
// } from "../redux/reducers/authReducer";
import authStore from "../store/authStore";
import validationStore from "../store/validationStore";
import { DEFAULT_URL_API, OTHER_URL_API } from "../vars/api";
import { TOKEN_KEY } from "../vars/localStorage";

let setup = {
  method: "POST", // *GET, POST, PUT, DELETE, etc.
  mode: "cors", // no-cors, *cors, same-origin
  cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
  credentials: "same-origin", // include, *same-origin, omit
  headers: {
    // "Content-Type": "application/json",
    Accept: "application/json",
    // 'Content-Type': 'application/x-www-form-setUrlencoded',
  },
  redirect: "follow", // manual, *follow, error
  referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-setUrl
};

const tokenType = "Bearer ";

function FetchHelper() {
  const { token, resetAuthData } = authStore((state) => state);
  const { setValidation } = validationStore((state) => state);

  const useFetch = async ({
    url = null,
    useToken = false,
    method = "GET",
    data,
    updateHeaders = {},
    hasFile = false,
    showMsgSuccess = true,
    downloadFile = false,
    otherUrl = false,
    validationDataOn = (e) => {},
    accessableOn = (e) => {},
    succesOn = (e) => {},
    messageOn = (e) => {},
    loadingOn = (e) => {},
    otherOn = (e) => {},
    notFoundOn = () => {},
  }) => {
    let newSetup = setup;
    const setUrl = (otherUrl ? OTHER_URL_API() : DEFAULT_URL_API()) + url;
    let newData;
    let newMethod = method;

    let statusOk = false;
    let statusValidation = false;
    let statusError = false;
    let statusUnauthorized = false;
    let statuNotFound = false;
    let statusServer = false;
    let status = null;

    // when post (has file convert to form data)
    if (
      data &&
      ["POST", "PUT"].includes(method.toUpperCase()) &&
      hasFile &&
      !(data instanceof FormData)
    ) {
      let formData = new FormData();

      Object.keys(data).map((key) => {
        if (data[key] || ["number", "boolean"].includes(typeof data[key])) {
          formData.append(key, data[key]);
        }
      });

      if (method.toUpperCase() == "PUT") {
        newMethod = "POST";
        formData.append("_method", "PUT");
      }

      newData = formData;

      // newSetup = {
      //   ...newSetup,
      //   headers: {
      //     ...newSetup.headers,
      //     "Content-Type": "multipart/form-data; boundary=something",
      //   },
      // };
    } else {
      newSetup = {
        ...newSetup,
        headers: {
          ...newSetup.headers,
          "Content-Type": "application/json",
        },
      };
    }

    // parse JSON
    if (data && ["POST", "PUT"].includes(method.toUpperCase()) && !hasFile)
      newData = JSON.stringify(data);

    // set method
    newSetup = {
      ...newSetup,
      method: newMethod,
    };

    // has token
    if (useToken && token)
      newSetup = {
        ...newSetup,
        headers: {
          ...newSetup.headers,
          Authorization: tokenType + token,
        },
      };

    //set data
    if (data)
      newSetup = {
        ...newSetup,
        body: newData,
      };

    // update headers
    if (updateHeaders)
      newSetup = {
        ...newSetup,
        headers: { ...newSetup.headers, ...updateHeaders },
      };

    //download files
    if (downloadFile)
      newSetup = newSetup = {
        ...newSetup,
        headers: { ...newSetup.headers, Accept: "*/*" },
      };

    loadingOn(true);
    validationDataOn({});

    await fetch(setUrl, newSetup)
      .then((response) => {
        if ([200, 201, 202].includes(response.status)) statusOk = true;
        else if (response.status == 422) statusValidation = true;
        else statusError = true;

        if (response.status == 401) statusUnauthorized = true;

        statuNotFound = response.status == 404;

        if (response.status >= 500) statusServer = true;

        status = response.status;
        return response.json();
      })
      .then((res) => {
        let timeout;
        // when authenticated
        if (statusUnauthorized || statusServer) {
          localStorage.removeItem(TOKEN_KEY);
          setValidation({ password: ["Unauthenticated"] });
          resetAuthData();
          location.replace("/signin");
          return;
        }
        if (statusOk) succesOn(res.result);
        if (res?.permissions) accessableOn(res.permissions);
        if (statusValidation) validationDataOn(res.meta);
        if ((statusError || (statusOk && showMsgSuccess)) && !statuNotFound)
          messageOn(res.message, statusOk, res.result);

        if (statuNotFound) notFoundOn();
        otherOn(res, status);
        timeout = setTimeout(() => {
          loadingOn(false);
          clearTimeout(timeout);
        }, 300);
      })
      .catch((er) => {
        messageOn({
          title: "ERROR!",
          subtitle: er.message,
          status: "error",
        });
        loadingOn(false);
      });
  };

  async function getFileData(url) {
    const setUrl = DEFAULT_URL_API() + url;
    let name = "file";
    const headers = {
      headers: {
        Authorization: tokenType + token,
      },
    };
    await fetch(setUrl, headers)
      .then((res) => {
        name = getFileNameFromContentDisposition(res.headers);
        return res.blob();
      })
      .then((data) => {
        var a = document.createElement("a");
        a.href = window.URL.createObjectURL(data);
        a.download = name;
        a.click();
      });
  }

  function getFileNameFromContentDisposition(headers) {
    return (
      headers
        .get("Content-disposition")
        ?.split("filename=")[1]
        .replace('"', "")
        .replace('.pdf"', ".pdf") ?? ""
    );
  }
  return {
    useFetch,
    getFileData,
  };
}

export default FetchHelper;

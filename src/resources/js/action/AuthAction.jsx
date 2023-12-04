import FetchHelper from "../helpers/FetchHelper";
import authStore from "../store/authStore";
import loadingStore from "../store/loadingStore";
import messageStore from "../store/messageStore";
import validationStore from "../store/validationStore";
import { A_CHECK, A_FORGOT, A_RESET, A_SIGNIN, A_SIGNOUT, A_SIGNUP } from "../vars/api";
import { L_CHECK, L_FORGOT, L_RESET, L_SIGNIN, L_SIGNUP } from "../vars/loading";

function AuthAction() {
  const { token, resetAuthData, setAuthData } = authStore((state) => state);
  const { setValidation } = validationStore((state) => state);
  const {
    setLoading,
    setModal: setModalLoading,
    resetLoading,
  } = loadingStore((state) => state);
  const { setMessage } = messageStore((state) => state);
  const { useFetch } = FetchHelper();

  const checkAPI = async () => {
    await useFetch({
      url: A_CHECK,
      useToken: true,
      loadingOn: (e) => setLoading({ [L_CHECK]: e }),
      succesOn: (e) => setAuthData({ ...e, token }),
      showMsgSuccess: false,
    });
  };

  const signinAPI = async (data) => {
    await useFetch({
      url: A_SIGNIN,
      data,
      method: "POST",
      validationDataOn: (e) => setValidation(e),
      loadingOn: (e) => setLoading({ [L_SIGNIN]: e }),
      succesOn: (e) => setAuthData(e),
      showMsgSuccess: false,
      messageOn: (e) =>
        setMessage({
          showModal: true,
          data: e,
        }),
    });
  };

  const signupAPI = async (data) => {
    await useFetch({
      url: A_SIGNUP,
      data,
      method: "POST",
      validationDataOn: (e) => setValidation(e),
      loadingOn: (e) => setLoading({ [L_SIGNUP]: e }),
      succesOn: (e) => setAuthData(e),
      showMsgSuccess: true,
      messageOn: (e) =>
        setMessage({
          showModal: true,
          data: e,
          redirect: "/signin",
          cannotClose: true,
          force: true,
          buttonText: "Back to Sign In page",
        }),
    });
  };

  const forgotAPI = async (data) => {
    await useFetch({
      url: A_FORGOT,
      data,
      method: "POST",
      loadingOn: (e) => {
        if (!e) return resetLoading();
        setModalLoading({ show: true, message: "Send Request" });
        setLoading({ [L_FORGOT]: true });
      },

      validationDataOn: (e) => setValidation(e),
      showMsgSuccess: true,
      messageOn: (e) =>
        setMessage({
          showModal: true,
          data: e,
          redirect: "/signin",
          cannotClose: true,
          force: true,
          buttonText: "Back to Sign In page",
        }),
    });
  };

  const resetPasswordAPI = async (data) => {
    await useFetch({
      url: A_RESET,
      data,
      method: "POST",
      loadingOn: (e) => setLoading({ [L_RESET]: e }),
      validationDataOn: (e) => setValidation(e),
      showMsgSuccess: true,
      messageOn: (e, ok) => {
        if (ok)
          setMessage({
            showModal: true,
            data: e,
            redirect: "/signin",
            cannotClose: true,
            force: true,
            buttonText: "Back to Sign In page",
          });
        else {
          setMessage({
            showModal: true,
            data: e,
          });
        }
      },
    });
  };

  const signoutAPI = async (data) => {
    await useFetch({
      url: A_SIGNOUT,
      data,
      method: "POST",
      useToken: true,
      validationDataOn: (e) => setValidation(e),
      loadingOn: (e) => setLoading({ [L_CHECK]: e }),
      succesOn: (e) => resetAuthData(),

      showMsgSuccess: false,
      messageOn: (e) =>
        setMessage({
          showModal: true,
          data: e,
        }),
    });
  };

  return {
    checkAPI,
    signinAPI,
    signupAPI,
    forgotAPI,
    signoutAPI,
    resetPasswordAPI,
  };
}

export default AuthAction;

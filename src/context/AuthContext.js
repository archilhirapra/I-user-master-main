// ** React Imports
import { createContext, useEffect, useState } from "react";

// ** Next Import
import { useRouter } from "next/router";

// ** Axios
import axios from "axios";

// ** Config
import authConfig from "src/configs/auth";

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  isInitialized: false,
  loginInit: () => Promise.resolve(),
  resendOtp: () => Promise.resolve(),
  verifyOtp: () => Promise.resolve(),
  forgotPassword: () => Promise.resolve(),
  verifyOtpforgotPassword: () => Promise.resolve(),
  mobileLoginInit: () => Promise.resolve(),

  registerByEmail: () => Promise.resolve(),

  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  setIsInitialized: () => Boolean,
  register: () => Promise.resolve(),
  refreshAuth: () => Promise.resolve(),

  googleLogin: () => Promise.resolve(),
};
const AuthContext = createContext(defaultProvider);

const AuthProvider = ({ children }) => {
  const [refresh, setRefresh] = useState(0)

  // ** States
  const [user, setUser] = useState(defaultProvider.user);
  const [loading, setLoading] = useState(defaultProvider.loading);
  const [isInitialized, setIsInitialized] = useState(
    defaultProvider.isInitialized
  );

  // ** Hooks
  const router = useRouter();
  useEffect(() => {

    const initAuth = async () => {
      setIsInitialized(true);
      const storedToken =
        "Bearer " + window.localStorage.getItem(authConfig.storageTokenKeyName);

      if (storedToken) {
        setLoading(true);
        await axios
          .get(authConfig.meEndpoint, {
            headers: {
              Authorization: storedToken,
            },
          })
          .then(async (response) => {
            setLoading(false);
            setUser({ ...response.data.data.data });
          })
          .catch(() => {
            localStorage.removeItem("userData");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("accessToken");
            setUser(null);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    };
    initAuth();
  }, [refresh]);













  const refreshAuth = () => {
    setRefresh(refresh + 1)
  }














  const handleLoginInitial = (params, userData) => {
    const data = [];
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Origin": "*",
    };
    axios
      .post(authConfig.loginEndpoint, params, { headers: headers })
      .then(async (res) => {
        // window.localStorage.setItem(authConfig.storageTokenKeyName, res.data.accessToken)
        data["message"] = "success";
        data["data"] = res;
        userData(data);
      })
      .catch((err) => {

        if (err.response.status == 400) {
          data["message"] = "failed";
          data["type"] = 0; /* show in email field */
          data["error"] = err.response.data;
          userData(data);
        } else if (err.response.status == 404) {
          data["message"] = "failed";
          data["type"] = 0; /* show in email field */
          data["error"] = err.response.data;
          userData(data);
        } else if (err.response.status == 401) {
          data["message"] = "failed";
          data["type"] = 1; /* show in password field */
          data["error"] = err.response.data;
          userData(data);
        } else {

          data["message"] = "network-error";
          data["type"] = 0; /* show in email field */
          data["error"] = "some thing went wrong";
          userData(data);
        }
      });
  };
  const handleResendOtp = (params, otpData) => {
    const data = [];
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    axios
      .post(authConfig.resendOtpEndpoint, params, { headers: headers })
      .then(async (res) => {
        // window.localStorage.setItem(authConfig.storageTokenKeyName, res.data.accessToken)
        data["message"] = "success";
        data["data"] = res;
        otpData(data);
      })
      .catch((err) => {
        if (err.response.status == 401) {
          data["message"] = "failed";
          data["error"] = err.response.data;
          otpData(data);
        } else {
          data["message"] = "network-error";
          data["error"] = "some thing went wrong";
          otpData(data);
        }
      });
  };

  const handleVerifyOtp = (params, errorCallback) => {
    const data = [];
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    axios
      .post(authConfig.verifyOtpEndpoint, params, { headers: headers })
      .then(async (res) => {
        window.localStorage.setItem(
          authConfig.storageTokenKeyName,
          res.data.data.generatedToken
        );
      })
      .then(() => {
        axios
          .get(authConfig.meEndpoint, {
            headers: {
              Authorization:
                "Bearer " +
                window.localStorage.getItem(authConfig.storageTokenKeyName),
            },
          })
          .then(async (response) => {
            const returnUrl = router.query.returnUrl;
            setUser({ ...response.data.data.data });

            await window.localStorage.setItem(
              "userData",
              JSON.stringify(response.data.data.data)
            );


            if (response.data.data.data.name == '' || response.data.data.data.email == '' || response.data.data.data.mobileNo == '') {
              router.replace('/account/details')
            } else {

              if (returnUrl == undefined) {
                router.reload();
              } else {
                const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
                router.replace(redirectURL)
              }


            }
          });
      })
      .catch((err) => {
        if (err.response.status == 401) {
          data["message"] = "failed";
          data["type"] = 1; /* show in password field */
          data["error"] = err.response.data;
          errorCallback(data);
        } else {

          data["message"] = "network-error";
          data["type"] = 0; /* show in email field */
          data["error"] = "some thing went wrong";
          errorCallback(data);
        }
      });
  };
  const googleLogin = (params, errorCallback) => {
    const data = [];
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    axios
      .post(authConfig.googleLoginEndpoint, params, { headers: headers })
      .then(async (res) => {
        window.localStorage.setItem(
          authConfig.storageTokenKeyName,
          res.data.data.token
        );
      })
      .then(() => {
        axios
          .get(authConfig.meEndpoint, {
            headers: {
              Authorization:
                "Bearer " +
                window.localStorage.getItem(authConfig.storageTokenKeyName),
            },
          })
          .then(async (response) => {
            const returnUrl = router.query.returnUrl;
            setUser({ ...response.data.data.data });

            await window.localStorage.setItem(
              "userData",
              JSON.stringify(response.data.data.data)
            );


            if (response.data.data.data.name == '' || response.data.data.data.email == '' || response.data.data.data.mobileNo == '') {
              router.replace('/account/details')
            } else {

              if (returnUrl == undefined) {
                router.reload();
              } else {
                const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
                router.replace(redirectURL)
              }


            }
          });
      })
      .catch((err) => {
        if (err.response.status == 401) {
          data["message"] = "failed";
          data["type"] = 1; /* show in password field */
          data["error"] = err.response.data;
          errorCallback(data);
        } else {

          data["message"] = "network-error";
          data["type"] = 0; /* show in email field */
          data["error"] = "some thing went wrong";
          errorCallback(data);
        }
      });
  };

  const handleForgotPassword = (params, userData) => {
    const data = [];
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    axios
      .post(authConfig.resendOtpEndpoint, params, { headers: headers })
      .then(async (res) => {
        if (res.data.data.acknowledgement === true) {
          data["message"] = "success";
          data["data"] = res;
          userData(data);
        } else {
          data["message"] = "failed";
          data["data"] = res;
          userData(data);
        }
      })
      .catch((err) => {


        data["message"] = "network-error";
        data["type"] = 0; /* show in email field */
        data["error"] = "some thing went wrong";
        userData(data);
      });
  };

  const handleVerifyOtpforgotPassword = (params, userData) => {
    const data = [];
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    axios
      .post(authConfig.forgetSetPassword, params, { headers: headers })
      .then(async (res) => {
        router.replace("/?requireAuth=true");
        if (res.data.data.acknowledgement === true) {
          data["message"] = "success";
          data["data"] = res;
          userData(data);
        } else {
          data["message"] = "failed";
          data["data"] = res;
          userData(data);
        }
      })
      .catch((err) => {

        if (
          err.response.status == 410 ||
          err.response.status == 401 ||
          err.response.status == 500
        ) {
          data["message"] = "failed";
          // data['type'] = 0 /* show in email field */
          data["error"] = err.response.data;
          userData(data);
        } else {

          data["message"] = "network-error";
          // data['type'] = 0 /* show in email field */
          data["error"] = "some thing went wrong";
          userData(data);
        }
      });
  };

  const handleMobileLoginInitial = (params, userData) => {
    // console.log(params)
    // return
    const data = [];
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Origin": "*",
    };
    axios
      .post(authConfig.mobileLoginEndpoint, params, { headers: headers })
      .then(async (res) => {
        window.localStorage.setItem(
          authConfig.storageTokenKeyName,
          res.data.accessToken
        );
        data["message"] = "success";
        data["data"] = res;
        userData(data);
      })
      .catch((err) => {

        if (err.response.status == 400) {
          data["message"] = "failed";
          data["type"] = 0; /* show in email field */
          data["error"] = err.response.data;
          userData(data);
        } else {

          data["message"] = "network-error";
          data["type"] = 0; /* show in email field */
          data["error"] = "some thing went wrong";
          userData(data);
        }
      });
  };

  const handleRegisterByEmail = (params, userData) => {
    // console.log(params)
    // return
    const data = [];
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Origin": "*",
    };
    axios
      .post(authConfig.emaileRegisterEndpoint, params, { headers: headers })
      .then(async (res) => {
        window.localStorage.setItem(
          authConfig.storageTokenKeyName,
          res.data.accessToken
        );
        data["message"] = "success";
        data["data"] = res;
        userData(data);
      })
      .catch((err) => {

        if (err.response.status == 409) {
          data["message"] = "failed";
          data["type"] = 0; /* show in email field */
          data["error"] = err.response.data;
          userData(data);
        } else if (err.response.status == 404) {
          data["message"] = "failed";
          data["type"] = 0; /* show in email field */
          data["error"] = err.response.data;
          userData(data);
        } else if (err.response.status == 401) {
          data["message"] = "failed";
          data["type"] = 1; /* show in password field */
          data["error"] = err.response.data;
          userData(data);
        } else {

          data["message"] = "network-error";
          data["type"] = 0; /* show in email field */
          data["error"] = "some thing went wrong";
          userData(data);
        }
      });
  };

  const handleLogin = (params, errorCallback) => {
    axios
      .post(authConfig.loginEndpoint, params)
      .then(async (res) => {
        window.localStorage.setItem(
          authConfig.storageTokenKeyName,
          res.data.accessToken
        );
      })
      .then(() => {
        axios
          .get(authConfig.meEndpoint, {
            headers: {
              Authorization: window.localStorage.getItem(
                authConfig.storageTokenKeyName
              ),
            },
          })
          .then(async (response) => {
            const returnUrl = router.query.returnUrl;
            setUser({ ...response.data.userData });
            await window.localStorage.setItem(
              "userData",
              JSON.stringify(response.data.userData)
            );
            // const redirectURL =
            //   returnUrl && returnUrl !== "/" ? returnUrl : "/";
            // router.replace(redirectURL);
          });
      })
      .catch((err) => {
        if (errorCallback) errorCallback(err);
      });
  };

  const handleLogout = () => {
    setUser(null);
    setIsInitialized(false);
    window.localStorage.removeItem("userData");
    window.localStorage.removeItem(authConfig.storageTokenKeyName);
    router.push("/");
  };

  const handleRegister = (params, errorCallback) => {
    axios
      .post(authConfig.registerEndpoint, params)
      .then((res) => {
        if (res.data.error) {
          if (errorCallback) errorCallback(res.data.error);
        } else {
          handleLogin({ email: params.email, password: params.password });
        }
      })
      .catch((err) => (errorCallback ? errorCallback(err) : null));
  };

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    isInitialized,
    setIsInitialized,
    loginInit: handleLoginInitial,
    resendOtp: handleResendOtp,
    verifyOtp: handleVerifyOtp,
    forgotPassword: handleForgotPassword,
    verifyOtpforgotPassword: handleVerifyOtpforgotPassword,
    mobileLoginInit: handleMobileLoginInitial,

    registerByEmail: handleRegisterByEmail,

    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    refreshAuth: refreshAuth,

    googleLogin:googleLogin,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };

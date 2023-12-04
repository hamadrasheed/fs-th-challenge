import React, { useEffect, useMemo, useState } from "react";

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Preloader from "../components/others/Preloader";
import { L_CHECK } from "../vars/loading";
import loadingStore from "../store/loadingStore";
import authStore from "../store/authStore";
import paramsStore from "../store/paramsStore";
import { searchParamsToObj } from "../helpers/UrlHelper";

function AuthMiddleware() {
  const location = useLocation();
  const { pathname, search } = location;

  const navigate = useNavigate();

  const { loading: getLoading } = loadingStore((state) => state);
  const loading = useMemo(() => getLoading[L_CHECK], [getLoading]);

  const { token } = authStore((state) => state);
  const { setParams } = paramsStore((state) => state);

  const [moreTime, setMoreTime] = useState(true);

  // params trigger
  useEffect(() => {
    if (search.includes("=")) setParams(searchParamsToObj(search));
  }, [search]);

  useEffect(() => {
    if (loading) {
      setMoreTime(true);
    }
  }, [loading]);

  useEffect(() => {
    let timeout;
    if (moreTime) {
      timeout = setTimeout(() => setMoreTime(false), 1000);
    }
    return () => clearTimeout(timeout);
  }, [moreTime]);

  useEffect(() => {
    if (!loading) {
      const check0 = pathname.includes("signup");
      const check1 = pathname.includes("signin");
      const check2 = pathname.includes("forgot-password");
      const check3 = pathname.includes("reset-password");

      if (!check0 && !check1 && !check2 && !check3 && !token)
        navigate("/signin", { replace: true });

      if ((check0 || check1 || check2 || check3) && token)
        navigate("/", { replace: true });
    }
  }, [loading, token, pathname]);

  return loading || moreTime ? <Preloader /> : <Outlet />;
}

export default AuthMiddleware;

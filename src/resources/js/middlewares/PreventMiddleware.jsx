import React, { useEffect, useMemo, useState } from "react";

import { Outlet, useLocation } from "react-router-dom";
import Extend from "../components/layouts/Extend";
import dataStore from "../store/dataStore";

import loadingStore from "../store/loadingStore";
import multiSelectStore from "../store/multiSelectStore";
import paramsStore from "../store/paramsStore";
import validationStore from "../store/validationStore";
import { L_CHECK } from "../vars/loading";

function PreventMiddleware() {
  const { loading: getLoading, resetLoading } = loadingStore((state) => state);
  const loading = useMemo(() => getLoading[L_CHECK], [getLoading]);

  const { resetSelected } = multiSelectStore((state) => state);
  const { setIsNotFound } = dataStore((state) => state);
  const { resetValidation } = validationStore((state) => state);
  const { resetParams } = paramsStore((state) => state);

  const { pathname } = useLocation();

  const [isGuest, setIsGuest] = useState(true);

  useEffect(() => {
    if (!loading) {
      const check0 = pathname.includes("signup");
      const check1 = pathname.includes("signin");
      const check2 = pathname.includes("forgot-password");
      const check3 = pathname.includes("reset-password");

      setIsGuest(check0 || check1 || check2 || check3);
    }
    return () => {
      // unchecked selected
      resetSelected();
      resetValidation();
      resetParams();
      setIsNotFound(false);
      resetLoading();
    };
  }, [loading, pathname]);

  if (isGuest) return <Outlet />;

  return <Outlet />;
}

export default PreventMiddleware;

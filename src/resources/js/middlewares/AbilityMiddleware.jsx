import React from "react";
import { Outlet } from "react-router-dom";
import NotFound from "../action/alerts/NotFound";
import { objIncludes } from "../helpers/ObjHelper";
import authStore from "../store/authStore";

function AbilityMiddleware({ setAbilities = null }) {
  const { abilities } = authStore((state) => state);

  return abilities && objIncludes(abilities, setAbilities) ? (
    <Outlet />
  ) : (
    <NotFound />
  );
}

export default AbilityMiddleware;

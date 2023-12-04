import classNames from "classnames";
import React from "react";
import Col from "./Col";

function ColActive({
  active = false,
  classActive = "bg-emerald-100 !text-emerald-600",
  classInActive = "bg-rose-100 !text-rose-600",
  activeName = "Yes",
  inActiveName = "No",
}) {
  return (
    <Col
      align="center"
      className={classNames(
        "inline-flex font-medium rounded-full text-center px-2.5 py-0.5",
        {
          [classActive]: active,
          [classInActive]: !active,
        }
      )}
    >
      {active ? activeName : inActiveName}
    </Col>
  );
}

export default ColActive;

import classNames from "classnames";
import React from "react";
import { BsQuestion } from "react-icons/bs";
import { Link } from "react-router-dom";
import Tooltip from "../Tooltip";

function AvaButton({ name, photo, actionLink = null }) {
  return (
    <div
      className={classNames("m-1.5 rounded-full", {
        "flex items-center justify-center cursor-not-allowed": !name,
        "cursor-pointer": name && actionLink,
        "group hover:border hover:border-dashed hover:border-primary-50":
          actionLink,
      })}
    >
      <Tooltip content={name ?? "BOT"}>
        {/* photo */}
        {typeof name == "string" &&
          (actionLink ? (
            <Link to={actionLink} className="w-8 h-8">
              <img
                className="object-cover w-full h-full rounded-full group-hover:p-[2px]"
                src={photo}
                alt="Avatar"
              />
            </Link>
          ) : (
            <div className="w-8 h-8">
              <img
                className="object-cover w-full h-full rounded-full"
                src={photo}
                alt="Avatar"
              />
            </div>
          ))}
        {/* not found */}
        {!name && (
          <div className="flex items-center justify-center w-8 h-8 group-hover:w-7 group-hover:h-7 rounded-full bg-primary-50 opacity-70 group-hover:opacity-90">
            <BsQuestion className="text-xl text-white" />
          </div>
        )}
      </Tooltip>
    </div>
  );
}

export default AvaButton;

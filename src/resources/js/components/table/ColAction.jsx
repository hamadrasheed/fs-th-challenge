import classNames from "classnames";
import React from "react";
import { AiOutlineQrcode } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import {
  FaAngleDown,
  FaBan,
  FaRegCheckCircle,
  FaRegEdit,
  FaRegTrashAlt,
} from "react-icons/fa";
import {
  MdOutlinePublishedWithChanges, MdOutlineUnpublished,
} from "react-icons/md";
import { IoDuplicateOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import Tooltip from "../Tooltip";
import Col from "./Col";
import { useLocation } from "react-router-dom";

function ColAction({
  dataId,
  align = "center",
  className = "flex items-center justify-center gap-x-1",
  showTrash = false,

  infoLink,
  showInfo = false,

  duplicateLink,
  showDuplicate = false,

  editLink,
  showEdit = true,

  restoreEvent = (id) => {},
  showRestore = false,
  restoreDisabled = false,

  voidEvent = () => {},
  showVoid = false,
  voidDisabled = false,

  deleteEvent = (id) => {},
  showDelete = true,
  deleteDisabled = false,

  showExpanded = false,
  expandOpen = {},

  onApproval = (e) => {},
  showApproval = false,

  onRefuse = (e) => {},
  showRefuse = false,

  showQr = false,
  qrDisabled = false,
  qrEvent = () => {},
  setExpandOpen = (obj) => {},
}) {
  const { pathname } = useLocation();

  return (
    <Col align={align} className={className}>
      {/* restore */}
      {showRestore && (
        <button
          onClick={() => {
            if (!restoreDisabled) restoreEvent(dataId);
          }}
          className={classNames("group rounded-full", {
            "text-slate-400/50 hover:text-slate-400/50 cursor-not-allowed":
              restoreDisabled,
            "text-amber-500 hover:text-amber-600": !restoreDisabled,
          })}
        >
          <span className="sr-only">Restore</span>
          <Tooltip
            content={restoreDisabled ? "Restore Unavailable" : "Restore"}
            isDark={restoreDisabled}
            nowrap={!restoreDisabled}
          >
            <MdOutlinePublishedWithChanges className="w-5 h-5 fill-current" />
          </Tooltip>
        </button>
      )}

      {/* void */}
      {showVoid && (
        <button
          onClick={() => {
            if (!voidDisabled) voidEvent(dataId);
          }}
          className={classNames("group rounded-full", {
            "text-slate-400/50 hover:text-slate-400/50 cursor-not-allowed":
              voidDisabled,
            "text-rose-500 hover:text-rose-600": !voidDisabled,
          })}
        >
          <span className="sr-only">Void</span>
          <Tooltip
            content={voidDisabled ? "Void Unavailable" : "Void"}
            isDark={voidDisabled}
            nowrap={!voidDisabled}
          >
            <MdOutlineUnpublished className="w-5 h-5 fill-current" />
          </Tooltip>
        </button>
      )}

      {/* approval */}
      {showApproval && (
        <button
          onClick={() => onApproval(dataId)}
          className="group text-emerald-500 hover:text-emerald-600 rounded-full"
        >
          <span className="sr-only">Approve</span>
          <Tooltip content="Approve">
            <FaRegCheckCircle className="w-5 h-5 fill-current" />
          </Tooltip>
        </button>
      )}

      {/* refuse */}
      {showRefuse && (
        <button
          onClick={() => onRefuse(dataId)}
          className="group text-rose-500 hover:text-rose-600 rounded-full"
        >
          <span className="sr-only">Refuse</span>
          <Tooltip content="Refuse">
            <FaBan className="w-5 h-5 fill-current" />
          </Tooltip>
        </button>
      )}

      {/* info */}
      {!parseInt(showTrash) && showInfo && (
        <Link
          to={infoLink}
          className="group text-sky-400 hover:text-sky-500 rounded-full mr-1"
        >
          <span className="sr-only">Info</span>
          <Tooltip content="Info">
            <BsInfoCircle className="w-5 h-5 fill-current" />
          </Tooltip>
        </Link>
      )}

      {/* duplicate */}
      {!parseInt(showTrash) && showDuplicate && (
        <Link
          to={duplicateLink}
          className="group text-emerald-400 hover:text-emerald-500 rounded-full mr-1"
        >
          <span className="sr-only">Duplicate</span>
          <Tooltip content="Duplicate">
            <IoDuplicateOutline className="w-5 h-5 fill-current" />
          </Tooltip>
        </Link>
      )}

      {/* edit */}
      {!parseInt(showTrash) && showEdit && (
        <Link
          to={pathname + "?id=" + dataId}
          className="group text-amber-400 hover:text-amber-500 rounded-full"
        >
          <span className="sr-only">Edit</span>
          <Tooltip content="Edit">
            <FaRegEdit className="w-5 h-5 fill-current" />
          </Tooltip>
        </Link>
      )}

      {/* delete */}
      {!parseInt(showTrash) && showDelete && (
        <button
          onClick={() => {
            if (!deleteDisabled) deleteEvent(dataId);
          }}
          className={classNames("group rounded-full", {
            "text-slate-400/50 hover:text-slate-400/50 cursor-not-allowed":
              deleteDisabled,
            "text-rose-500 hover:text-rose-600": !deleteDisabled,
          })}
        >
          <span className="sr-only">Delete</span>
          <Tooltip
            content={deleteDisabled ? "Delete Unavailable" : "Delete"}
            isDark={deleteDisabled}
            nowrap={!deleteDisabled}
          >
            <FaRegTrashAlt className="w-5 h-5 fill-current" />
          </Tooltip>
        </button>
      )}

      {/* qr */}
      {showQr && (
        <button
          onClick={() => {
            qrEvent();
          }}
          className={classNames("group rounded-full", {
            "text-slate-400/50 hover:text-slate-400/50 cursor-not-allowed":
              qrDisabled,
            "text-blue-500 hover:text-blue-600": !qrDisabled,
          })}
        >
          <Tooltip
            content={qrDisabled ? "Qr Code Unavailable" : "Qr Code"}
            isDark={qrDisabled}
            nowrap={!qrDisabled}
          >
            <AiOutlineQrcode className="w-5 h-5 fill-current" />
          </Tooltip>
        </button>
      )}

      {/* expand */}
      {showExpanded && (
        <button
          className="group text-slate-400 hover:text-slate-500 rounded-full"
          aria-expanded={expandOpen[dataId]}
          onClick={() =>
            setExpandOpen({
              ...expandOpen,
              [dataId]: !expandOpen[dataId],
            })
          }
          aria-controls={`detail-${dataId}`}
        >
          <span className="sr-only">Detail</span>
          <Tooltip content="Detail">
            <FaAngleDown
              className={classNames("w-5 h-5 fill-current transform", {
                "rotate-180": expandOpen[dataId],
              })}
            />
          </Tooltip>
        </button>
      )}
    </Col>
  );
}

export default ColAction;

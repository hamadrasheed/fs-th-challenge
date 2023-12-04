import React from "react";
import { setDateFormat } from "../../helpers/DateHelper";
import AvaButton from "../button/AvaButton";
import Col from "./Col";

function ColUpdated({
    withTime = false,
    userName,
    userPhoto,
    updatedAt,
    detailLink = null,
    align = updatedAt ? "left" : "center",
    className = updatedAt ? "flex items-center" : null,
}) {
    return (
        <Col align={align} className={className}>
            {updatedAt ? (
                <>
                    <AvaButton
                        actionLink={detailLink}
                        name={userName}
                        photo={userPhoto}
                    />
                    <div className="pl-1">
                        {updatedAt &&
                            setDateFormat({
                                date: updatedAt,
                                withTime: withTime,
                            })}
                    </div>
                </>
            ) : (
                "-"
            )}
        </Col>
    );
}

export default ColUpdated;

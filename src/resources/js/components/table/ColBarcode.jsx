import JsBarcode from "jsbarcode";
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Col from "./Col";

function ColBarcode({
    barcode,
    topCode,
    topCodeLink = null,
    align = "left",
    className = "flex items-center flex-col",
}) {
    const targetRef = useRef();

    useEffect(() => {
        if (targetRef.current)
            JsBarcode(targetRef.current, barcode, {
                width: 1.25,
                height: 40,
            });
    }, [targetRef]);

    return (
        <Col align={align} className={className}>
            {topCodeLink ? (
                <div className="hover:border hover:border-dashed hover:rounded-lg hover:p-1 hover:border-primary-50">
                    <Link to={topCodeLink}>
                        {topCode && (
                            <div className="text-center">{topCode}</div>
                        )}
                        <svg ref={targetRef}></svg>
                    </Link>
                </div>
            ) : (
                <>
                    {topCode && <div className="text-center">{topCode}</div>}
                    <svg ref={targetRef}></svg>
                </>
            )}
        </Col>
    );
}

export default ColBarcode;

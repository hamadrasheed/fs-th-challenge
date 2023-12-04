import React from "react";
import Col from "./Col";
import classNames from "classnames";
import multiSelectStore from "../../store/multiSelectStore";

function ColCheckbox({
    id,
    can_delete = false,
    align = "center",
    className = "flex items-center",
}) {
    const {
        addSelected,
        removeSelected,
        selected: ids,
    } = multiSelectStore((state) => state);

    return (
        <Col align={align} className={className}>
            <input
                disabled={!can_delete}
                className={classNames("form-checkbox", {
                    "opacity-30 cursor-not-allowed": !can_delete,
                })}
                type="checkbox"
                checked={ids.includes(id)}
                onChange={(e) =>
                    e.target.checked ? addSelected([id]) : removeSelected(id)
                }
            />
        </Col>
    );
}

export default ColCheckbox;

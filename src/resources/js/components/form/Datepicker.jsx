import classNames from "classnames";
import React, { useEffect, useState, useRef } from "react";
import Flatpickr from "react-flatpickr";
import { currentMonthStartEndDate, formatDate } from "../../helpers/DateHelper";

function Datepicker({
  align,
  onChange = (e) => {},
  data: { dateStart, dateEnd },
  widthFull = false,
}) {
  const fp = useRef();
  const options = {
    mode: "range",
    static: true,
    monthSelectorType: "static",
    dateFormat: "M j, Y",
    defaultDate: currentMonthStartEndDate(),
    prevArrow:
      '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
    nextArrow:
      '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
    onReady: (selectedDates, dateStr, instance) => {
      instance.element.value = dateStr.replace("to", "-");
      const customClass = align ? align : "";
      instance.calendarContainer.classList.add(`flatpickr-${customClass}`);
      if (selectedDates.length < 2) return;
    },
    onChange: (selectedDates, dateStr, instance) => {
      instance.element.value = dateStr.replace("to", "-");

      if (selectedDates.length < 2) return;
      onChange(selectedDates.map((e) => formatDate(e)));
    },
    onClose: function (selectedDates, dateStr, instance) {
      if (!fp?.current?.flatpickr || selectedDates.length == 2) return;
      fp.current.flatpickr.setDate([new Date(dateStart), new Date(dateEnd)]);
    },
  };

  useEffect(() => {
    if (dateStart || dateEnd)
      fp.current.flatpickr.setDate([new Date(dateStart), new Date(dateEnd)]);
  }, [dateStart, dateEnd]);

  return (
    <div className="relative">
      <Flatpickr
        ref={fp}
        className={classNames(
          "form-input !pl-9 !text-slate-500 !hover:text-slate-600 !font-medium focus:border-slate-300",
          { "w-full": widthFull, "w-72": !widthFull }
        )}
        options={options}
      />
      <div className="absolute inset-0 right-auto flex items-center pointer-events-none">
        <svg
          className="w-4 h-4 fill-current text-slate-500 ml-3"
          viewBox="0 0 16 16"
        >
          <path d="M15 2h-2V0h-2v2H9V0H7v2H5V0H3v2H1a1 1 0 00-1 1v12a1 1 0 001 1h14a1 1 0 001-1V3a1 1 0 00-1-1zm-1 12H2V6h12v8z" />
        </svg>
      </div>
    </div>
  );
}

export default Datepicker;

export const currentMonthStartEndDate = (isString = false) => {
  let date = new Date();
  let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  if (isString) {
    firstDay = formatDate(firstDay);
    lastDay = formatDate(lastDay);
  }
  return [firstDay, lastDay];
};

export const formatDate = (date, useSlash = false) => {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return useSlash ? [day, month, year].join("/") : [year, month, day].join("-");
};

//TODO:: LOCALIZATION IMPLEMENTATION
export const setDateFormat = ({
  date,
  withTz = true,
  withWeekDay = false,
  withTime = false,
}) => {
  if (!date) date = new Date();
  const d = new Date(date);
  let opt = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour12: false,
  };
  if (withTz) opt = { ...opt, timeZone: "Asia/Jakarta" };
  if (withWeekDay) opt = { ...opt, weekday: "long", month: "long" };
  if (withTime) opt = { ...opt, hour: "numeric", minute: "numeric" };
  return new Intl.DateTimeFormat("en-US", opt).format(d);
};

export const lessThan = (prevDate, currDate = null) => {
  const prev = new Date(prevDate);
  const curr = currDate ? new Date(currDate) : new Date();

  return prev.getTime() < curr.getTime();
};

export const lessThanEqual = (prevDate, currDate = null) => {
  const prev = new Date(prevDate);
  const curr = currDate ? new Date(currDate) : new Date();

  return prev.getTime() <= curr.getTime();
};
export const greatestThan = (prevDate, currDate = null) => {
  const prev = new Date(prevDate);
  const curr = currDate ? new Date(currDate) : new Date();

  return prev.getTime() > curr.getTime();
};

export const greatestThanEqual = (prevDate, currDate = null) => {
  const prev = new Date(prevDate);
  const curr = currDate ? new Date(currDate) : new Date();

  return prev.getTime() >= curr.getTime();
};

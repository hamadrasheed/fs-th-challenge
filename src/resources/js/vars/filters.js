import { currentMonthStartEndDate } from "../helpers/DateHelper";

export const FILTER_DEFAULT = [
  {
    name: "only_active",
    label: "status",
    nullable: true,
    type: "radio",
    opts: [
      {
        value: 1,
        name: "Active",
      },
      {
        value: 0,
        name: "Inactive",
      },
    ],
  },
];

export const SELECTED_DEFAULT = {};

export const DATE_RANGE_DEFAULT = () => {
  const currentMonth = currentMonthStartEndDate(true);

  return {
    start_date_range: currentMonth[0],
    end_date_range: currentMonth[1],
  };
};

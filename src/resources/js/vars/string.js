export const CANNOT_UPDATE =
  "Data cannot be updated because has been used on transaction";

export const DELETE_CONFIRM_MESSAGE =
  "Are you sure to delete this? You won't be able to revert it!";
export const CONFIRM_MESSAGE = (
  action,
  name,
  isRevert = false,
  isData = false
) =>
  `Are you sure to ${action} this ${name}?` +
  (isRevert
    ? " You won’t be able to revert it!"
    : isData
    ? " All the data you entered will be gone and you won't be able to revert it!"
    : "");

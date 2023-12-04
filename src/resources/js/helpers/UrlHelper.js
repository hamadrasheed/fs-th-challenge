// ex searchparams=?foo=1&bar=2
export const searchParamsToObj = (searchparams) => {
  const search = searchparams.substring(1);
  return searchparams
    ? JSON.parse(
        '{"' +
          decodeURI(search)
            .replace(/"/g, '\\"')
            .replace(/&/g, '","')
            .replace(/=/g, '":"') +
          '"}'
      )
    : {};
};

export const objToParams = (obj = {}) => {
  const res = Object.keys(obj)
    .reduce((prev, curr) => {
      if (!obj[curr]) return prev;

      let i = -1;

      // single value
      if (typeof obj[curr] != "object")
        return [...prev, `${curr}=` + obj[curr]];

      // multi value
      return [
        ...prev,
        ...obj[curr].reduce((prev2, next2) => {
          i++;
          return [...prev2, `${curr}[${i}]=` + next2];
        }, []),
      ];
    }, [])
    .join("&");

  return res ? "?" + res : "";
};

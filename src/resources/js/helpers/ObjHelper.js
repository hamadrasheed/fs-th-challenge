export const objChanger = (
  obj,
  opt = {
    except: [],
    only: [],
    update: {},
  }
) => {
  let selection = obj;
  if (opt?.except && opt.except.length)
    selection = Object.keys(obj)
      .filter((e) => !opt.except.includes(e))
      .reduce((prev, curr) => ({ ...prev, [curr]: selection[curr] }), {});

  if (opt?.only && opt.only.length)
    selection = Object.keys(selection)
      .filter((e) => opt.only.includes(e))
      .reduce((prev, curr) => ({ ...prev, [curr]: selection[curr] }), {});

  if (opt?.update && Object.keys(opt.update).length)
    selection = { ...selection, ...opt.update };

  return selection;
};

export const objBooleanTrans = (obj) => {
  return Object.keys(obj).reduce(
    (prev, next) => ({ ...prev, [next]: obj[next] ? 1 : 0 }),
    {}
  );
};

export const pictureBooleanTrans = (obj) => {
  return Object.keys(obj)
    .filter((e) => obj[e].length)
    .reduce((prev, next) => ({ ...prev, [next]: obj[next][0] }), {});
};

export const multiPictureBooleanTrans = (obj) => {
  const multiPic = Object.keys(obj);
  let data = {};

  multiPic.forEach((key) => {
    let i = 0;

    if (e[key] && ["array", "object"].includes(typeof e[key]))
      e[key].forEach((dt) => {
        if (dt && dt[0]) {
          data = { ...data, [key + `[${i}]`]: dt[0] };
          i++;
        }
      });
  });

  return data;
};

export const objSelectTo = (obj, label = "name", value = "code") => {
  if (typeof obj !== "object" || !obj[value]) return undefined;
  return {
    label: obj[label],
    value: obj[value],
  };
};

export const objSelectFrom = (obj, code = "value", name = "label") => {
  if (typeof obj !== "object" || !obj[code]) return undefined;
  return {
    code: obj[code],
    name: obj[name],
  };
};

/*
 * compare two variable
 * @params array obj1
 * @params string|array obj2
 * @return boolean
 */
export const objIncludes = (obj1 = [], obj2 = null) => {
  let res = false;

  if (typeof obj2 == "object")
    for (const i in obj1) {
      if (obj2.includes(obj1[i])) {
        res = true;
        break;
      }
    }
  else if (typeof obj2 == "string") res = obj1.includes(obj2);

  return res;
};

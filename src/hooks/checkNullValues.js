export const checkNullValues = (user) => {
  let emptyValues = [];

  for (const key in user) {
    if (user[key] === "") {
      emptyValues.push(key);
    }
  }

  return emptyValues;
};

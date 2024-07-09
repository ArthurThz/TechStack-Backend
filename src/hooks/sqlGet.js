import { sql } from "../../db.js";

export const dbGetCall = async (query) => {
  if (!query) return;

  try {
    const response = await (sql + query);
    console.log(response);
    return;

    if (response.length === 0) {
      return { status: 204, message: "O post selecionado não existe!" };
    }

    return { status: 201, message: "OK", content: response };
  } catch (error) {
    console.error(error);
    return new Error(error);
  }
};

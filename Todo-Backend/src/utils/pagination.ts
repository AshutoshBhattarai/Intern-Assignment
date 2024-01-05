import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "./constants";

export const getPaginationOptions = (option: {
  page?: number;
  size?: number;
}) => {
  const { page = DEFAULT_PAGE, size = DEFAULT_PAGE_SIZE } = option;

  const offset = (page - 1) * size;

  return {
    limit: size,
    offset,
  };
};

import { DEFAULT_PAGE_SIZE } from "../constants";

const createResponseMeta = (total: number, options?: {}) => {
  return {
    total,
    totalPages: Math.ceil(total / DEFAULT_PAGE_SIZE),
    pageSize: DEFAULT_PAGE_SIZE,
    ...options
  };
};

export default createResponseMeta;

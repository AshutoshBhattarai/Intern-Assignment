import { DEFAULT_PAGE_SIZE } from "../constants";

// Generate Meta data for response from server takes total no. of data as total parameter
// Can provide additional object as parameters
const createResponseMeta = (total: number, options?: {}) => {
  return {
    total,
    totalPages: Math.ceil(total / DEFAULT_PAGE_SIZE),
    pageSize: DEFAULT_PAGE_SIZE,
    ...options,
  };
};

export default createResponseMeta;

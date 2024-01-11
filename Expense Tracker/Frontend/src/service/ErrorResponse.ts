import { HttpStatusCode } from "axios";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const showErrorResponse = (error: Error | any) => {
  if (
    error.response.status ===
    (HttpStatusCode.Forbidden ||
      HttpStatusCode.BadRequest ||
      HttpStatusCode.InternalServerError ||
      HttpStatusCode.NotFound ||
      HttpStatusCode.Unauthorized ||
      HttpStatusCode.NotAcceptable)
  ) {
    return error.response.data.message;
  }
};

export default showErrorResponse;

import { HttpStatusCode } from "axios";
import http from "./HttpClient";

const createGetRequest = async (url: string) => {
  const response = await http.get(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
  });
  if (response.status === HttpStatusCode.Ok) {
    const data = response.data;
    
    return {
      data: data.result,
      meta: data.meta,
    };
  }
};

export default createGetRequest;

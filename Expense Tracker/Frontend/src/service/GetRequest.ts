import { HttpStatusCode } from "axios";
import http from "./HttpClient";
import TokenService from "./TokenService";

const createGetRequest = async (url: string) => {
  const response = await http.get(url, {
    headers: {
      Authorization: `Bearer ${TokenService.getAccessToken()}`,
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

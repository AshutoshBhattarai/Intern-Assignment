import http from "./HttpClient";
import TokenService from "./TokenService";

const createDeleteRequest = async (url: string) => {
  const response = await http.delete(url, {
    headers: {
      Authorization: `Bearer ${TokenService.getAccessToken()}`,
    },
  });
  return response;
};

export default createDeleteRequest;

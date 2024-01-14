import TokenService from "./TokenService";

const accessToken = TokenService.getAccessToken();
const refreshToken = TokenService.getRefreshToken();

const validateToken = async () => {
  if (accessToken === "" && refreshToken === "") {
    window.location.href = "/views/Login/";
  }
};
validateToken();

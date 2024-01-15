import TokenService from "./TokenService";

const accessToken = TokenService.getAccessToken();
const refreshToken = TokenService.getRefreshToken();
// Check if token is available in local storage
// If not, redirect to login
const validateToken = async () => {
  if (accessToken === null || refreshToken === null) {
    window.location.href = "/views/Login/";
  }
};
validateToken();

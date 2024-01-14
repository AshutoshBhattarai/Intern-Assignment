import { HttpStatusCode } from "axios";
import http from "./HttpClient";

export default class TokenService {
  static setAccessToken(token: string) {
    localStorage.setItem("token", token);
  }
  static getAccessToken() {
    return localStorage.getItem("token");
  }
  static removeAccessToken() {
    localStorage.removeItem("token");
  }
  static setRefreshToken(token: string) {
    localStorage.setItem("refresh", token);
  }
  static getRefreshToken() {
    return localStorage.getItem("refresh");
  }
  static removeRefreshToken() {
    localStorage.removeItem("refresh");
  }

  static async getNewAccessToken() {
    const refreshToken = TokenService.getRefreshToken();
    const response = await http.post("/refresh", { refreshToken });
    if (response.status === HttpStatusCode.Accepted) {
      TokenService.setAccessToken(response.data.tokens.accessToken);
      TokenService.setRefreshToken(response.data.tokens.refreshToken);
    }
  }
}

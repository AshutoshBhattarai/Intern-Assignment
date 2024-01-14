import User from "../interfaces/User";
import http from "./HttpClient";
import TokenService from "./TokenService";

export default class UserService {
  static async getUsers() {
    const response = await http.get("/users/");
    return response.data as User[];
  }
  static async login(user: User) {
    const response = await http.post("/login", {
      email: user.email,
      password: user.password,
    });
    return response.data.message as string;
  }

  static async register(user: User) {
    const response = await http.post("/register", {
      username: user.username,
      email: user.email,
      password: user.password,
    });
    return response.data.message as string;
  }
  static async logout() {
    const response = await http.post(
      "/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${TokenService.getAccessToken()}`,
        },
      }
    );
    TokenService.removeAccessToken();
    TokenService.removeRefreshToken();
    return response.data.message as string;
  }
}

import dotenv from "dotenv";
dotenv.config();

const config = {
  serverPort: process.env.PORT || 5002,
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_SECRET_KEY,
    refreshTokenSecret: process.env.JWT_REFRESH_SECRET_KEY,
  },
};

export default config;

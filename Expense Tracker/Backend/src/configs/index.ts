import dotenv from "dotenv";
dotenv.config();

const config = {
  serverPort: process.env.PORT || 5005,
};
export default config;

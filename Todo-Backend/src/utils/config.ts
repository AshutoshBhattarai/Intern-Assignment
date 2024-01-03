import dotenv from "dotenv";
dotenv.config();

const config = {
  serverPort: process.env.PORT || 5002,
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_SECRET_KEY,
    refreshTokenSecret: process.env.JWT_REFRESH_SECRET_KEY,
  },
  database: {
    client: "pg",
    host: process.env.DATABASE_HOST!,
    port: Number(process.env.DATABASE_PORT!),
    user: process.env.DATABASE_USER!,
    password: process.env.DATABASE_PASSWORD!,
    database: process.env.DATABASE_NAME!,
  },
};

export default config;

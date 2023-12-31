import express, { Express } from "express";
import "reflect-metadata";
import config from "./configs";
import routes from "./routes";
import databaseConnection from "./database/connection";
const app: Express = express();
const PORT = config.serverPort;
databaseConnection();
// Middleware to parse request body
app.use(express.json());
// Middleware to parse url encoded request body
app.use(express.urlencoded({ extended: false }));
// Middleware to handle routes
app.use(routes);
// Server is running on port 5005
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

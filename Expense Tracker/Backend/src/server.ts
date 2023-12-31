import express, { Express } from "express";
import config from "./configs";
import routes from "./routes";

const app: Express = express();
const PORT = config.serverPort;

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

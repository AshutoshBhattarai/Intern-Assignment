import express, { Express, Request, Response } from "express";
import config from "./utils/config";
import routes from "./routes";
const app: Express = express();
const port = config.serverPort;

app.use(express.json());
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Hello World",
  });
});
app.use(routes);
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});

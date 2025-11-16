import express from "express";
import { config } from "dotenv";
import routerHandler from "./Utils/router.handler.js";
import connection from "./DB/connection.js";
config();

const app = express();
const port = process.env.PORT || 4000;

const bootstrap = () => {
  app.use(express.json());
  connection();

  routerHandler(app);

  app.listen(port, () => {
    console.log(`Server is running successfully on port ${port}`);
  });
};

export default bootstrap;

import "reflect-metadata";
import * as dotenv from 'dotenv';
import { createExpressServer } from "routing-controllers";
import { TokenController } from "./controllers/TokenController";

dotenv.config();

const app = createExpressServer({
  controllers: [TokenController],
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
import { logger } from "./consts/consts.ts";
import { Application, Context, Router } from "@oak/oak";
import { oakCors } from "@tajpouria/cors"
import userRouter from "./routes/user-routes.ts";
import groupRouter from "./routes/group-routes.ts";
import roleRouter from "./routes/role-routes.ts";
import { requestLogger } from "./middleware/logger.ts";
import { errorHandler } from "./middleware/error.ts";


logger.info("Deno microservice is running on http://localhost:4001");
const router = new Router();
router
  .all("(.*)", (ctx: Context) => {
    ctx.response.status = 404;
    ctx.response.body = "Not Found";
  });

const app = new Application();
app.use(errorHandler);
app.use(requestLogger);
app.use(oakCors({ origin: ["http://localhost:4000", "http://localhost:4002"] }));
app.use(userRouter.routes());
app.use(groupRouter.routes());
app.use(roleRouter.routes());
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 4001 });
import { Context, Router } from "@oak/oak";
import { logger } from "../consts/consts.ts";
import { CrudRole } from "../crud/role/crud.ts";

const roleRouter = new Router();

roleRouter
.get("/roles", async (ctx: Context) => {
    logger.info("Fetching all roles");
    ctx.response.body = await CrudRole.handleGetAll();
  });

export default roleRouter;

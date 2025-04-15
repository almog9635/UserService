import { Context, Router } from "@oak/oak";
import { logger } from "../consts/consts.ts";
import { CrudGroup } from "../crud/group/crud.ts";

const groupRouter = new Router();

groupRouter
.get("/groups", async (ctx) => {
    logger.info("Fetching all groups");
    ctx.response.body = await CrudGroup.handleGetAll();
  })
  .post("/group/create", async (ctx) => {
    logger.info("Creating group");
    ctx.response.body = await CrudGroup.handleCreate(ctx.request);
  })
  .delete("/group/delete/:id", async (ctx: Context) => {
    logger.info("Deleting group");
    ctx.response.body = await CrudGroup.handleDelete(ctx.request);
  })
  .put("/group/update/:id", async (ctx: Context) => {
    logger.info("Updating group");
    ctx.response.body = await CrudGroup.handleUpdate(ctx.request);
  })
  .get("/group/:id", async (ctx: Context) => {
        logger.info("Fetching group");
        ctx.response.body = await CrudGroup.handleGetById(ctx.request);
  });

  export default groupRouter;
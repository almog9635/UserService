import { Context, Router } from "@oak/oak";
import { CrudUser } from "../crud/user/crud.ts";
import { logger } from "../consts/consts.ts";

const userRouter = new Router();

userRouter
  .get("/users", async (ctx: Context) => {
    logger.info("get all users");
    ctx.response.body = await CrudUser.handleGetAll();
  })
  .get("/user/:id", async (ctx: Context) => {
    logger.info("Fetching user");
    ctx.response.body = await CrudUser.handleGetById(ctx.request);
  })
  .post("/login", async (ctx: Context) => {
    logger.info("Login request received");
    ctx.response.body = await CrudUser.handlelogin(ctx.request);
  })
  .post("/user/create", async (ctx: Context) => {
    logger.info("creating user");
    ctx.response.body = await CrudUser.handleCreate(ctx.request);
  })
  .delete("/user/:id", async (ctx: Context) => {
    logger.info("Deleting user");
    ctx.response.body = await CrudUser.handleDelete(ctx.request);
  })
  .put("/user/:id", async (ctx: Context) => {
    logger.info("Updating user");
    ctx.response.body = await CrudUser.handleUpdate(ctx.request)
  })
  .get("/users/group/:id", async (ctx) => {
    const { id } = ctx.params;
    logger.info(`Fetching all users by group id: ${id}`);
    ctx.response.body = await CrudUser.getAllByGroupId(parseInt(id, 10));
  });
  

export default userRouter;

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
  .get("/user/group/:id", async (ctx: Context) => {
    try{
      logger.info(`Fetching all users by group`);
      ctx.response.body = await CrudUser.handleUsersGroup(ctx.request);
      ctx.response.status = 200;
    } catch(error) {
      logger.error("Error fetching users by group ID", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal Server Error" };
    }
  })
  .get("/user/edit/:id", async (ctx: Context) => {
    try{
      logger.info(`fetching user to edit`);
      ctx.response.body = await CrudUser.handleEditUser(ctx.request);
      ctx.response.status = 200;
    } catch(error) {
      logger.error("Error fetching user by ID", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal Server Error" };
    }
  });

export default userRouter;

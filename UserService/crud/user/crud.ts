import { logger } from "../../consts/consts.ts";
import { userMutations } from "../../consts/mutation/user.ts";
import { queries } from "../../consts/quries.ts";
import { UserInput } from "../../input/user-input.ts";
import { User } from "../../entity/user.ts";
import { GraphQLFetcher } from "../../graphql-fetcher.ts";
import { CRUD } from "../crud.ts";
import { Request as OakRequest } from "@oak/oak";
import { Group } from "../../entity/group.ts";

export class CrudUser extends CRUD<UserInput, User> {
    
    public static async handleCreate(req: OakRequest): Promise<User> {
        try{
            const rawInput = await req.body.json();
            const userInput: UserInput = {
                firstName: rawInput.firstName,
                lastName: rawInput.lastName,
                password: rawInput.password,
                rank: rawInput.rank,
                serviceType: rawInput.serviceType,
                group: rawInput.group,
                roles: rawInput.roles,
            };
            for (const field of Object.keys(userInput)) {
                if (!userInput[field]) {
                    throw Error(`${field} is required`);
                }
            }

            if(!req.headers.has("User-Id")){
                throw Error("User-Id is required in the headers");
            }

            return new CrudUser().handleCreate(userInput, userMutations.addUser, req.headers);
        } catch(error){
            logger.error("Error in creating user", error);
            throw error;
        }
    }
        

    public static async handleDelete(req: OakRequest): Promise<boolean> {
        try{
            const url = new URL(req.url);
            const userId = url.pathname.split("/").pop();
            if (!userId) {
                const error = new Error("User ID is missing in the request");
                logger.error(error.message);

                throw error;
            }

            // const commander = await this.getById(parseInt(userId, 10));
            // logger.info("commander ", commander);
            // if(commander.group?.commander === parseInt(userId, 10)){
            //     logger.error("user is the commader of a group, cannot delete");

            //     throw new Error("user is the commader of a group, cannot delete");
            // }

            return new CrudUser().handleDelete(userId, userMutations.deleteUser);
        } catch(error){
            logger.error("error deleting user ", error);

            return false;
        }
        
    }

    public static async handleUpdate(req: OakRequest): Promise<User> {
        try{
            const url = new URL(req.url);
            const userId = url.pathname.split("/").pop();
            if (!userId) {
                const error = new Error("User ID is missing in the request");
                logger.error(error.message);

                throw error;
            }
            const rawInput = await req.body.json();
            logger.info("raw input ", rawInput);
            const userInput: UserInput = {
                id: userId,
                firstName: rawInput?.firstName,
                lastName: rawInput?.lastName,
                password: rawInput?.password,
                rank: rawInput?.rank,
                serviceType: rawInput?.serviceType,
                group: rawInput?.group,
                roles: rawInput?.roles,
            };

            logger.info("user input ", userInput);

            return new CrudUser().handleUpdate(userInput, userMutations.updateUser, req.headers);
        } catch(error){
            logger.error("error updating user ", error);

            throw error;
        }
    }
    
    public static async handleGetAll(): Promise<User[]> {

        return new CrudUser().handleGetAll(queries.getAllUsers);
    }

    public static async handleGetById(req : OakRequest): Promise<User> {
        try{
            const url = new URL(req.url);
            const userId = url.pathname.split("/").pop();
            if (!userId) {
                logger.error("User ID is missing in the request")

                throw new Error("User ID is required");
            }

            return new CrudUser().handleGetById(userId, queries.getUser)
        } catch(error){
            logger.error("user not found");

            throw error;
        }
    }

    public static async getById(id: string): Promise<User>{

        return new CrudUser().handleGetById(id, queries.getUser)
    }

    public static async getAllByGroupId(id : string): Promise<User[]> {
        try{
            const data = await GraphQLFetcher.fetchGraphQL<User[]>(queries.getAllUsersByGroupId, {id : id});
            if(!data){
                logger.error("no users found");

                throw new Error("no users exists in this group");
            } 
            logger.info("users found ", data);

           return data;
        }catch(error){
            logger.error("Error fetching users by group ID", error);

            throw error;
        }
    }

    public static async handlelogin(req : OakRequest): Promise<User> {
        try{
            const rawInput = await req.body.json();
            const { userId } = rawInput;
            const data = await GraphQLFetcher.fetchGraphQL<User>(queries.loginQuery, {id : userId});
            if(!data){
                logger.error("no user found");

                throw new Error("no user exists with this id");
            } 
            logger.info("user found ", data);

           return data;
        } catch(error){
            logger.error("Error fetching user by ID", error);

            throw error;
        }
    }

    public static async handleUsersGroup(req : OakRequest): Promise<User[]> {
        try{
            const url = new URL(req.url);
            const userId = url.pathname.split("/").pop();
            if (!userId) {
                logger.error("user ID is missing in the request")

                throw new Error("user ID is required");
            }
            const response = await GraphQLFetcher.fetchGraphQL<{users: [{group: Group}]}>(queries.getUsersGroup, {id : userId});
            if (!response || !response.users || !response.users[0] || !response.users[0].group) {
                throw new Error("No group found for this user");
            }
            logger.info(response);
            if(!response){
                logger.error("no user found");

                throw new Error("no user exists with this id");
            } 

            const users =  await this.getAllByGroupId(response.users[0].group.id);
            logger.info(users);
            return users;
        } catch(error){
            logger.error("Error fetching users by group ID", error);

            throw error;
        }
    }

    public static async handleEditUser(req : OakRequest): Promise<User> {
        try{
            const url = new URL(req.url);
            const userId = url.pathname.split("/").pop();
            if (!userId) {
                logger.error("User ID is missing in the request")

                throw new Error("User ID is required");
            }

            return await GraphQLFetcher.fetchGraphQL<User>(queries.editUser, {id : userId});
        } catch(error){
            logger.error("error updating user ", error);

            throw error;
        }
    }
}
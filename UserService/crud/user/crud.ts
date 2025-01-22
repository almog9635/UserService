import { logger } from "../../consts/consts.ts";
import { userMutations } from "../../consts/mutation/user-mutation.ts";
import { queries } from "../../consts/quries.ts";
import { UserInput } from "../../entity/user-input.ts";
import { User } from "../../entity/user.ts";
import { GraphQLFetcher } from "../../graphql-fetcher.ts";
import { CRUD } from "../crud.ts";
import { Request as OakRequest } from "@oak/oak";

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
                group: rawInput.group.name,
                roles: rawInput.roles?.map(({ id, ...role }: any) => role),
            };
            for (const field of Object.keys(userInput)) {
                if (!userInput[field]) {
                    throw Error(`${field} is required`);
                }
            }
        
            return new CrudUser().handleCreate(userInput, userMutations.addUser);
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

            return new CrudUser().handleDelete(parseInt(userId, 10), userMutations.deleteUser);
        } catch(error){
            logger.error("error deleting user ", error);

            return false;
        }
        
    }

    public static async handleUpdate(req: OakRequest): Promise<User> {
        try{
            const rawInput = await req.body.json();
            const userInput: UserInput = {
                id: rawInput.id,
                firstName: rawInput.firstName,
                lastName: rawInput.lastName,
                password: rawInput.password,
                rank: rawInput.rank,
                serviceType: rawInput.serviceType,
                group: {
                    name: rawInput.group.name
                },
                roles: rawInput.roles?.map(({ id, ...role }: any) => role),
            };
            for (const field of Object.keys(userInput)) {
                if (!userInput[field]) {
                    const error = new Error(`${field} is missing in the request`);
                    logger.error(error.message);

                    throw error;
                }
            }

            return new CrudUser().handleUpdate(userInput, userMutations.updateUser);
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

            return new CrudUser().handleGetById(parseInt(userId, 10), queries.getUser)
        } catch(error){
            logger.error("user not found");

            throw error;
        }
    }

    public static async getById(id: number): Promise<User>{

        return new CrudUser().handleGetById(id, queries.getUser)
    }

    public static async getAllByGroupId(id : number): Promise<User[]> {
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
}
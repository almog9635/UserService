import { logger } from "../../consts/consts.ts";
import { groupMutation } from "../../consts/mutation/group.ts";
import { queries } from "../../consts/quries.ts";
import { GroupInput } from "../../input/group-input.ts";
import { Group } from "../../entity/group.ts";
import { CRUD } from "../crud.ts";
import { CrudUser } from "../user/crud.ts";
import { Request as OakRequest } from "@oak/oak";
import { User } from "../../entity/user.ts";

export class CrudGroup extends CRUD<GroupInput, Group> {
    
    public static async handleCreate(req: OakRequest): Promise<Group> {
        try {
            const rawInput = await req.body.json();
            const groupInput: GroupInput = {
                name: rawInput.name,
                commander: rawInput.commander
            };

            if (groupInput.name === undefined) {
                throw new Error(`one of the fields is missing`);
            }

            return new CrudGroup().handleCreate(groupInput, groupMutation.addGroup, req.headers);
        } catch (error) {
            logger.error("Error creating group", error);
            throw error;
        }
    }

    public static async handleUpdate(req: OakRequest): Promise<Group> {
        try {
            const rawInput = await req.body.json();
            logger.info("rawInput", rawInput);
            const url = new URL(req.url);
            const groupId = url.pathname.split("/").pop();
            const groupInput: GroupInput = {
                id: groupId,
                name: rawInput.name,
                commander: rawInput.commander,
            };
            logger.info("groupInput", groupInput);

            if (!await this.checkfields(groupInput)) {
                throw new Error(`one of the fields is missing`);
            }

            logger.info("headers ", req.headers);

            return new CrudGroup().handleUpdate(groupInput, groupMutation.updateGroup, req.headers);
        } catch (error) {
            logger.error("Error updating group", error);
            throw error;
        }
    }

    public static async handleDelete(req: OakRequest): Promise<boolean> {
        try {
            const url = new URL(req.url);
            const groupId = url.pathname.split("/").pop();
            if (!groupId) {
                logger.error("group ID is missing in the OakRequest");
                throw new Error("group ID is required");
            }

            const users : Array<User> = await CrudUser.getAllByGroupId(groupId);

            if (users.length > 0) {
                logger.error("Group can not be deleted");
                throw new Error("Group can not be deleted");
            }

            return new CrudGroup().handleDelete(groupId, groupMutation.deleteGroup);
        } catch (error) {
            logger.error("Error deleting group", error);
            throw error;
        }
    }

    public static async handleGetAll(): Promise<Group[]> {
        try {

            return new CrudGroup().handleGetAll(queries.getAllGroups);
        } catch (error) {
            logger.error("Error fetching all groups", error);
            throw error;
        }
    }

    public static async handleGetById(req: OakRequest): Promise<Group> {
        try {
            const url = new URL(req.url);
            const groupId = url.pathname.split("/").pop();
            if (!groupId) {
                logger.error("group ID is missing in the OakRequest");
                throw new Error("User ID is required");
            }

            return new CrudGroup().handleGetById(groupId, queries.getGroup);
        } catch (error) {
            logger.error("Error fetching group by ID", error);
            throw error;
        }
    }

    private static async checkfields(groupInput: GroupInput): Promise<boolean> {
        try {
            for (const field of Object.keys(groupInput)) {
                if (!groupInput[field]) {
                    return false;
                }
            }
            if (groupInput.commander === undefined) {
                return false;
            }
            const commander = await CrudUser.getById(groupInput.commander);
            if (!commander) {
                return false;
            }

            return true;
        } catch (error) {
            logger.error("Error checking fields", error);
            throw error;
        }
    }
}
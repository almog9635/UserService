import { logger } from "../../consts/consts.ts";
import { groupMutation } from "../../consts/mutation/group-mutaion.ts";
import { queries } from "../../consts/quries.ts";
import { GroupInput } from "../../entity/group-input.ts";
import { Group } from "../../entity/group.ts";
import { CRUD } from "../crud.ts";
import { CrudUser } from "../user/crud.ts";
import { Request as OakRequest } from "@oak/oak";

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

            return new CrudGroup().handleCreate(groupInput, groupMutation.addGroup);
        } catch (error) {
            logger.error("Error creating group", error);
            throw error;
        }
    }

    public static async handleUpdate(req: OakRequest): Promise<Group> {
        try {
            const rawInput = await req.body.json();
            const groupInput: GroupInput = {
                id: rawInput.id,
                name: rawInput.name,
                commander: rawInput.commander,
            };

            if (!await this.checkfields(groupInput)) {
                throw new Error(`one of the fields is missing`);
            }

            return new CrudGroup().handleUpdate(groupInput, groupMutation.updateGroup);
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
            logger.info("deleting ", groupId);
            const users = await CrudUser.getAllByGroupId(parseInt(groupId, 10));
            if (users) {
                logger.error("Group can not be deleted");
                throw new Error("Group can not be deleted");
            }

            return new CrudGroup().handleDelete(parseInt(groupId, 10), groupMutation.deleteGroup);
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

            return new CrudGroup().handleGetById(parseInt(groupId, 10), queries.getGroup);
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
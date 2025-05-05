import { queries } from "../../consts/quries.ts";
import { RoleInput } from "../../input/role-input.ts";
import { Role } from "../../entity/role.ts";
import { CRUD } from "../crud.ts";

export class CrudRole extends CRUD<RoleInput, Role> {

    public static async handleGetAll() : Promise<Role[]> {
        
        return new CrudRole().handleGetAll(queries.getAllRoles);
    }
}
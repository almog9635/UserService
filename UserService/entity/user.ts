import { Group } from "./group.ts";
import { Role } from "./role.ts";

export interface User {
    id: string;
    firstName: string;
    password: string
    roles: Array<Role>;
    serviceType?: string;
    group?: Group;
    rank?: string;
    lastName?: string;

}
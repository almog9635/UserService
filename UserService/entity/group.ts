import { User } from "./user.ts";

export interface Group {
    id: string;
    name: string;
    commander: string;
    users: Array<User>;
}
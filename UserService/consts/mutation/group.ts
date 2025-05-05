import { gql } from "npm:graphql-request";
import { userFragment } from "../quries.ts";

export const groupMutation = {
    addGroup : gql`
    mutation AddGroup($input: GroupUpdate!) {
        createGroup(input: $input) {
            name
            commander
            {
                ...user
            }
        }
    }
        ${userFragment}
        `,

    updateGroup : gql`
    mutation UpdateGroup($input: GroupUpdate!) {
        updateGroup(input: $input) {
            id
            name
            commander
            {
                ...user
            }
        }
    }
        ${userFragment}
    `,

    deleteGroup : gql`
    mutation deleteGroup($id: ID!) {
        deleteGroup(id: $id) 
    }`,
}
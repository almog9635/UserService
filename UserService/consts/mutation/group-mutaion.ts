import { gql } from "npm:graphql-request";

export const groupMutation = {
    addGroup : gql`
    mutation AddGroup($input: GroupUpdate!) {
        addGroup(input: $input) {
            name
            commander
        }
    }`,

    updateGroup : gql`
    mutation UpdateGroup($input: GroupUpdate!) {
        updateGroup(input: $input) {
            id
            name
            commander
        }
    }`,

    deleteGroup : gql`
    mutation deleteGroup($id: ID!) {
        deleteGroup(id: $id) {
            id
            name
            commander
        }
    }`,
}
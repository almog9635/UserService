import { gql } from "https://deno.land/x/graphql_request@v4.1.0/mod.ts";

export const userMutations = {
    addUser: gql`
    mutation AddUser($input: UserUpdate!) {
        createUser(input: $input) {
            id
            firstName
            lastName
            roles {
                role{
                    name
                }
            }
            serviceType
            group {
                name
            }
        }
    }`,
    updateUser: gql`
    mutation UpdateUser($input: UserUpdate!) {
        updateUser(input: $input) {
            id
            firstName
            lastName
            roles {
                role{
                    name
                }
            }
            serviceType
            group {
                name
            }
        }
    }`,
    deleteUser: gql`
    mutation deleteUser($id: ID!) {
        deleteUser(id: $id)
    }`,
    
}
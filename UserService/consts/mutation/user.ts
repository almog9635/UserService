import { gql } from "npm:graphql-request";

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
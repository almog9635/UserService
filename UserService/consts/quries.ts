import { gql } from "npm:graphql-request";

export const userFragment = gql`
        fragment user on User {
            id
            firstName
            lastName
            serviceType
            rank
        }`;

export const queries = {
    getAllUsers: gql`
        query getAllUsers {
            getAllUsers {
                ...user
            }
        }
        ${userFragment}
    `,
    getUser: gql`
        query getUser($id: ID!) {
            users(input: {id: $id}) {
                ...user
                password
                group{
                    id
                    name
                    commander{
                        id
                    }
                }
                tasks {
                      completed
                      content
                      deadline
                      id
                      startDate
                }
                roles{
                    role{
                    id
                    name
                    }
                } 
            }
        }
        ${userFragment}
    `,
    editUser: gql`
        query editUser($id: ID!) {
            users(input: {id: $id}) {
                id
                firstName
                lastName
                password
                rank
                serviceType
                group{
                    id
                    name
                    commander{
                        id
                    }
                }
                roles{
                    role{
                    id
                    name
                    }
                } 
            }
                getAllGroups {
                    id
                    name
                }
                getAllRoles {
                    id
                    name
            }
        }`,
    loginQuery: gql`
        query loginQuery($id: ID!) {
            users(input: {id: $id}) {
                id
                firstName
                password
                 roles{
                    role{
                    id
                    name
                    }
                }
            }
        }
    `,

    getAllUsersByGroupId : gql`
        query getAllUsersByGroupId($id : ID!) {
            users(input : {group: {id : $id}}) {
                id
                firstName
                lastName    
            }
        }
    `,
    getUsersGroup : gql`
        query getUsersGroup($id : ID!) {
            users(input : {id : $id}) {
                group{
                    id
                    commander{
                        id
                    }
                    name
                }
            }
        }
    `,

    getAllRoles : gql`
        query {
            getAllRoles {
                id
                name
            }
    }`,

    // Group Queries
    getAllGroups : gql`
        query {
            getAllGroups {
                id
                name
                commander{
                    ...user
                }
            }
        }
        ${userFragment}
    `,

    getGroup : gql`
        query getGroup($id: ID!) {
            groups(input: {id: $id}) {
                id
                name
                commander {
                    ...user
                }
                users {
                    ...user
                    roles {
                       role {
                         id
                         name
                       }
                     }
                    tasks {
                      completed
                      content
                      deadline
                      id
                      startDate
                    }
                }
            }
        }
        ${userFragment}
    `,
};
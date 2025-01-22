import { logger } from "../consts/consts.ts";
import { GraphQLFetcher } from "../graphql-fetcher.ts";

export abstract class CRUD<T, D>{

    public async handleCreate(input: T, mutation : string): Promise<D>{

        logger.info("Creating " + typeof(input) +  " with input: ", input);
        const data = await GraphQLFetcher.fetchGraphQL<D>(mutation, { input: input });
        logger.info("Created : ", typeof(input) + " " + data);
        
        return data;
    }

    public async handleDelete(id: number, mutation: string): Promise<boolean>{

        logger.info("deleting ", id);
        const data = await GraphQLFetcher.fetchGraphQL<boolean>(mutation, {id : id});

        return data;
    }

    public async handleUpdate(input: T, mutation : string): Promise<D>{

        logger.info("Updating " + typeof(input) +  " with input: ", input);
        const data = await GraphQLFetcher.fetchGraphQL<D>(mutation, { input: input });
        logger.info("Updated : ", typeof(input) + " " + data);
        
        return data;
    }

    public async handleGetAll(query: string): Promise<D[]>{

        const data = await GraphQLFetcher.fetchGraphQL<D[]>(query);
        logger.info("Fetched all: ", data);

        return data;
    }

    public async handleGetById(id : number, query : string): Promise<D>{
        
        const data = await GraphQLFetcher.fetchGraphQL<D>(query, {id : id});
        logger.info("Fetched: ", data);

        return data;
    }
}
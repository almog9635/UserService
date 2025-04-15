import { logger } from "../consts/consts.ts";
import { GraphQLFetcher } from "../graphql-fetcher.ts";

export abstract class CRUD<T, D>{

    public async handleCreate(input: T, mutation : string, headers : Headers): Promise<D>{

        const creatorId = headers.get("User-Id");
        if(!creatorId){
            throw new Error("User-Id is required in the headers");
        }

        const data = await GraphQLFetcher.fetchGraphQL<D>(mutation, { input: input }, creatorId);

        return data;
    }

    public async handleDelete(id: string, mutation: string): Promise<boolean>{

        logger.info("deleting ", id);
        const data = await GraphQLFetcher.fetchGraphQL<boolean>(mutation, {id : id});

        return data;
    }

    public async handleUpdate(input: T, mutation : string, headers : Headers): Promise<D>{

        const modifierId = headers.get("User-Id");
        if(!modifierId){
            throw new Error("User-Id is required in the headers");
        }

        const data = await GraphQLFetcher.fetchGraphQL<D>(mutation, { input: input }, modifierId);
                
        return data;
    }

    public async handleGetAll(query: string): Promise<D[]>{

        const data = await GraphQLFetcher.fetchGraphQL<D[]>(query);
        logger.info("Fetched all: ", data);

        return data;
    }

    public async handleGetById(id : string, query : string): Promise<D>{
        
        const data = await GraphQLFetcher.fetchGraphQL<D>(query, {id : id});
        logger.info("Fetched: ", data);

        return data;
    }
}
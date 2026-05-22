import pg from "pg"
import pgvector from "pgvector/pg"
import "dotenv/config"

const vectorUrl=process.env.POSTGRESQL_CONNCETION_URI;
 const client=new pg.Client({connectionString:vectorUrl})

export const connectToDB=async ()=>{
    try {
        pgvector.registerType(client);
        await client.connect();
       
    } catch (error) {
        throw error
        

    }
}

export default client
import express, { Express, Request, Response } from 'express';
import { ApolloServer } from 'apollo-server'
import { PrismaClient } from '@prisma/client'

const fs = require('fs')
const path = require('path')
import dotenv from 'dotenv';

import Query from './resolvers/Query'

dotenv.config()

const resolvers = {
    Query
}

const prisma = new PrismaClient()

const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, '..', 'schema.graphql'), 'utf-8'
    ),
    resolvers,
    context: (req) => ({
        ...req,
        prisma
    })
})

server
    .listen({
        port: 4001
    })
    .then(({ url }) =>
        console.log(`Server is running on ${url}`)
    );

// const main = async () => {
//     const curruser = await prisma.user.findFirst({ where: { name: "Pankaj" } })
//     await prisma.user.update({
//         where: { id: curruser!.id },
//         data: { email: 'stuff' }
//     })
//     const allUsers = await prisma.user.findMany()
//     console.log(allUsers)
// }

// main()
//     .catch(e => {
//         throw e
//     })
//     // 5
//     .finally(async () => {
//         await prisma.$disconnect()
//     })


// dotenv.config();

// const PORT = process.env.PORT || 4000;
// const app: Express = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.get('/', (req: Request, res: Response) => {
//     res.send('<h1>Hello from the TypeScript world!</h1>');
// });

// app.listen(PORT, () => console.log(`Running on ${PORT} ⚡`));
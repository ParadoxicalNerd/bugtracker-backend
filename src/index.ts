import { ApolloServer, makeExecutableSchema } from 'apollo-server-express'
import { PrismaClient } from '@prisma/client'
import express from 'express'

const fs = require('fs')
const path = require('path')
import dotenv from 'dotenv';
import morgan from 'morgan'
import cors from 'cors'

import { resolvers } from './resolvers'

dotenv.config()

const prisma = new PrismaClient()

const app = express()

app.use(morgan('dev'))

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(cors())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// app.use('/graphql', (req, res, next) => {
//     console.log(req.body.query)
//     console.log(req.body.variables)
//     return next()
// })

app.use('/hi', (_, res) => {
    res.status(200)
    res.send("hello")
    prisma.project.findFirst().tickets
})

const typeDefs = fs.readFileSync(
    path.join(__dirname, '..', 'schema.graphql'), 'utf-8'
)

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: { prisma }
})

server.applyMiddleware({ app })

app.listen(4000, () => console.log("🚀 Server ready at: http://localhost:4000"))
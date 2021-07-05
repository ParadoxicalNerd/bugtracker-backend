"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const fs = require('fs');
const path = require('path');
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const resolvers_1 = require("./resolvers");
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const app = express_1.default();
app.use(morgan_1.default('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    extended: true
}));
app.use(cors_1.default());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use('/hi', (_, res) => {
    res.status(200);
    res.send("hello");
    prisma.project.findFirst().tickets;
});
const typeDefs = fs.readFileSync(path.join(__dirname, '..', 'schema.graphql'), 'utf-8');
const server = new apollo_server_express_1.ApolloServer({
    typeDefs,
    resolvers: resolvers_1.resolvers,
    context: { prisma }
});
server.applyMiddleware({ app });
app.listen(4000, () => console.log("🚀 Server ready at: http://localhost:4000"));
//# sourceMappingURL=index.js.map
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_server_1 = require("apollo-server");
var client_1 = require("@prisma/client");
var fs = require('fs');
var path = require('path');
var dotenv_1 = __importDefault(require("dotenv"));
var Query_1 = __importDefault(require("./resolvers/Query"));
dotenv_1.default.config();
var resolvers = {
    Query: Query_1.default
};
var prisma = new client_1.PrismaClient();
var server = new apollo_server_1.ApolloServer({
    typeDefs: fs.readFileSync(path.join(__dirname, '..', 'schema.graphql'), 'utf-8'),
    resolvers: resolvers,
    context: function (req) { return (__assign(__assign({}, req), { prisma: prisma })); }
});
server
    .listen({
    port: 4001
})
    .then(function (_a) {
    var url = _a.url;
    return console.log("Server is running on " + url);
});
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

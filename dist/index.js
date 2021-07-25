"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const fs = require("fs");
const path = require("path");
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const resolvers_1 = require("./resolvers");
const auth_1 = __importStar(require("./auth"));
dotenv_1.default.config();
const PORT = process.env.port || 4000;
exports.prisma = new client_1.PrismaClient();
const app = express_1.default();
app.use(morgan_1.default("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    extended: true,
}));
const corsAllowList = ["http://localhost:8080", "http://localhost:4000"];
const corsOptions = (req, cb) => {
    const options = {
        credentials: true,
    };
    if (corsAllowList.indexOf(req.headers.origin || "") !== -1) {
        options.origin = true;
    }
    else {
        options.origin = false;
    }
    cb(null, options);
};
app.use(cors_1.default(corsOptions));
const session = {
    secret: process.env.SESSION_SECRET,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 5,
    },
    resave: false,
    saveUninitialized: false,
    name: "session-id",
};
if (process.env.NODE_ENV == "production") {
    session.cookie = {
        domain: process.env.DOMAIN,
        secure: true,
    };
}
app.use(express_session_1.default(session));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(auth_1.default);
app.get("/app", auth_1.secured, (req, res, next) => {
    res.send("You made it!");
});
app.get("/failure", (req, res, next) => {
    res.send("Login unsuccessful");
});
app.use("/graphql", auth_1.secured, (req, res, next) => {
    next();
});
const typeDefs = fs.readFileSync(path.join(__dirname, "..", "schema.graphql"), "utf-8");
const server = new apollo_server_express_1.ApolloServer({
    typeDefs,
    resolvers: resolvers_1.resolvers,
    context: (expressContext) => ({ prisma: exports.prisma, req: expressContext.req }),
});
server.applyMiddleware({ app, cors: corsOptions });
app.use("/hi", (req, res) => {
    console.log(req.cookies);
    res.status(200);
    res.send({ message: "hello" });
});
app.listen(PORT, () => console.log("🚀 Server ready at: http://localhost:" + PORT));
//# sourceMappingURL=index.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const passport_auth0_1 = __importDefault(require("passport-auth0"));
const resolvers_1 = require("./resolvers");
const auth_1 = __importDefault(require("./auth"));
dotenv_1.default.config();
const PORT = process.env.port || 4000;
const prisma = new client_1.PrismaClient();
const app = express_1.default();
app.use(morgan_1.default("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    extended: true,
}));
app.use(cors_1.default());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
const session = {
    secret: process.env.SESSION_SECRET,
    cookie: {},
    resave: false,
    saveUninitialized: false,
};
app.use(express_session_1.default(session));
const strategyOptions = {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL,
};
const verificationFunction = (accessToken, refreshToken, extraParams, profile, done) => {
    done(null, profile);
};
const strategy = new passport_auth0_1.default(strategyOptions, verificationFunction);
passport_1.default.use(strategy);
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
passport_1.default.serializeUser((user, done) => done(null, user));
passport_1.default.deserializeUser((user, done) => done(null, user));
app.use(auth_1.default);
let _get_route = express_1.default().get("", (req, res, next) => { });
const secured = (req, res, next) => {
    if (req.user) {
        return next();
    }
    else {
        req.session.returnTo = req.originalUrl;
        res.redirect("/login?fromURL=" + req.originalUrl);
    }
};
app.get("/", (req, res, next) => {
    res.send('<form action="/app"> <input type="submit" value="Go to application" /> </form>');
});
app.get("/app", secured, (req, res, next) => {
    res.redirect("http://localhost:8080");
});
app.use("/graphql", secured, (res, req, next) => next());
const typeDefs = fs.readFileSync(path.join(__dirname, "..", "schema.graphql"), "utf-8");
const server = new apollo_server_express_1.ApolloServer({
    typeDefs,
    resolvers: resolvers_1.resolvers,
    context: { prisma },
});
server.applyMiddleware({ app });
app.use("/hi", (_, res) => {
    res.status(200);
    res.send("hello");
});
app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "../frontend/dist"), function (err) {
        if (err) {
            res.status(500).send(err);
        }
    });
});
app.listen(PORT, () => console.log("🚀 Server ready at: http://localhost:" + PORT));
//# sourceMappingURL=index.js.map
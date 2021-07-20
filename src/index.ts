import { ApolloServer, makeExecutableSchema } from "apollo-server-express";
import { PrismaClient } from "@prisma/client";
import express, { NextFunction } from "express";

const fs = require("fs");
const path = require("path");
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";

import expressSession from "express-session";
import passport from "passport";
import Auth0Strategy from "passport-auth0";

import { resolvers } from "./resolvers";
import authRouter from "./auth";

dotenv.config();

const PORT = process.env.port || 4000;

const prisma = new PrismaClient();

const app = express();

app.use(morgan("dev"));

// Body decoder
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

// CORS
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Session Config

// TODO: Replace with jwt
const session: expressSession.SessionOptions = {
    secret: process.env.SESSION_SECRET!,
    cookie: {},
    resave: false,
    saveUninitialized: false,
};

// TODO: Missing session.secure for production env

app.use(expressSession(session));

// Passport Config

const strategyOptions: Auth0Strategy.StrategyOption = {
    domain: process.env.AUTH0_DOMAIN!,
    clientID: process.env.AUTH0_CLIENT_ID!,
    clientSecret: process.env.AUTH0_CLIENT_SECRET!,
    callbackURL: process.env.AUTH0_CALLBACK_URL!,
};

const verificationFunction: Auth0Strategy.VerifyFunction = (
    accessToken,
    refreshToken,
    extraParams,
    profile,
    done
) => {
    done(null, profile);
};

const strategy = new Auth0Strategy(strategyOptions, verificationFunction);

passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user: Express.User, done) => done(null, user));

app.use(authRouter);

let _get_route = express().get("", (req, res, next) => {});

type get_route_type = Parameters<typeof _get_route>;

const secured = (req: get_route_type[0], res: get_route_type[1], next: get_route_type[2]) => {
    if (req.user) {
        return next();
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect("/login?fromURL="+req.originalUrl);
    }
};

app.get("/", (req, res, next) => {
    res.send('<form action="/app"> <input type="submit" value="Go to application" /> </form>');
});

app.get("/app", secured, (req, res, next) => {
    // console.log("----------------------");
    // console.log(req.user);
    // res.send("You made it!");
    res.redirect("http://localhost:8080");
});

// Graphql

// app.use('/graphql', (req, res, next) => {
//     console.log(req.body.query)
//     console.log(req.body.variables)
//     return next()
// })

app.use("/graphql", secured, (res, req, next) => next());

const typeDefs = fs.readFileSync(path.join(__dirname, "..", "schema.graphql"), "utf-8");

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: { prisma },
});

server.applyMiddleware({ app });

// Demo route
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

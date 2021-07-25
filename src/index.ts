import { ApolloServer, makeExecutableSchema } from "apollo-server-express";
import { PrismaClient } from "@prisma/client";
import express from "express";

const fs = require("fs");
const path = require("path");
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";

import expressSession from "express-session";
import passport from "passport";

import { resolvers } from "./resolvers";
import authRouter, { secured } from "./auth";

dotenv.config();

const PORT = process.env.port || 4000;

export const prisma = new PrismaClient();

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

const corsAllowList = ["http://localhost:8080", "http://localhost:4000"];

const corsOptions: cors.CorsOptionsDelegate<cors.CorsRequest> = (req, cb) => {
    const options: cors.CorsOptions = {
        credentials: true,
    };

    if (corsAllowList.indexOf(req.headers.origin || "") !== -1) {
        options.origin = true;
    } else {
        options.origin = false;
    }

    cb(null, options);
};

app.use(cors(corsOptions));

// Session Config

import Redis from "ioredis";

const RedisStore = require("connect-redis")(expressSession);
const redisClient = new Redis();

const session: expressSession.SessionOptions = {
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || "supersecretkey",
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 5, // Five minutes
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

app.use(expressSession(session));

// app.use(cookieParser());

// app.use(cookieParser(process.env.SESSION_SECRET));

// app.use(
//     expressSession({
//         secret: process.env.SESSION_SECRET!,
//         resave: false,
//         saveUninitialized: false,
//         rolling: true,
//         name: "session-id", // don't use the default session cookie name
//         // set your options for the session cookie
//         cookie: {
//             httpOnly: true,
//             maxAge: 60 * 60 * 1000, // 60 minutes
//             // recommended you use this setting in production if you have a well-known domain you want to restrict the cookies to.
//             // domain: 'your.domain.com',
//             // recommended you use this setting in production if your site is published using HTTPS
//             // secure: true,
//         },
//     })
// );

// TODO: Missing session.secure for production env

// app.use(expressSession(session));

// Passport Config

app.use(passport.initialize());
app.use(passport.session());

app.use(authRouter);

app.get("/app", secured, (req, res, next) => {
    res.send("You made it!");
});

app.get("/failure", (req, res, next) => {
    res.send("Login unsuccessful");
});

// app.get("/userid", secured, (req, res, next) => {
//     // @ts-expect-error
//     res.send(req.user.id);
// });

// Graphql

app.use("/graphql", secured, (req, res, next) => {
    // if (req.body.userID) {
    //     // @ts-expect-error
    //     req.body.userID = req.user.id;
    // }
    // console.log(req.isAuthenticated());
    // console.log(req.user);
    next();
});

const typeDefs = fs.readFileSync(path.join(__dirname, "..", "schema.graphql"), "utf-8");

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: (expressContext) => ({ prisma, req: expressContext.req }),
});

// CORS Fix: https://stackoverflow.com/a/54589681
server.applyMiddleware({ app, cors: corsOptions });

// Demo route
app.use("/hi", (req, res) => {
    console.log(req.cookies);
    res.status(200);
    res.send({ message: "hello" });
});

// app.use(express.static(path.join(__dirname, "..", "..", "/bugtracker-fronend/dist/")));

// app.get("/*", function (req, res) {
//     res.sendFile(path.join(__dirname, "..", "..", "/bugtracker-fronend/dist/"), function (err) {
//         if (err) {
//             res.status(500).send(err);
//         }
//     });
// });

app.listen(PORT, () => console.log("🚀 Server ready at: http://localhost:" + PORT));

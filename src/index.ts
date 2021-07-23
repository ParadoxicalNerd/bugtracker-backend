import { ApolloServer, makeExecutableSchema } from "apollo-server-express";
import { PrismaClient } from "@prisma/client";
import express, { NextFunction } from "express";

const fs = require("fs");
const path = require("path");
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

import expressSession from "express-session";
import passport from "passport";
import Auth0Strategy from "passport-auth0";

import { resolvers } from "./resolvers";
import authRouter, { secured } from "./auth";
import cookieSession from "cookie-session";

dotenv.config();

const PORT = process.env.port || 4000;

export const prisma = new PrismaClient();

const app = express();

// app.use((req, res, next) => {
//     console.log(req.headers);
//     next();
// });

app.use(morgan("dev"));

// Body decoder
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

// CORS
const corsOptions = {
    credentials: true,
    origin: "http://localhost:8080",
};

app.use(cors(corsOptions));
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "http://localhost:8080"); // Client which can access this
//     // res.header("Vary", "Origin");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.header("Access-Control-Allow-Credentials", "true");
//     next();
// });

// Session Config
const session: expressSession.SessionOptions = {
    secret: process.env.SESSION_SECRET!,
    cookie: {
        httpOnly: false,
        // domain: "localhost",
    },
    resave: false,
    saveUninitialized: false,
    name: "session-id",
};

app.use(expressSession(session));

app.use(cookieParser());

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

// app.use((req, res, next) => {
//     console.log(req.cookies);
//     next();
// });

// app.get("/", (req, res, next) => {
//     res.send('<form action="/app"> <input type="submit" value="Go to application" /> </form>');
// });

app.get("/app", secured, (req, res, next) => {
    // console.log("----------------------");
    // console.log(req.user);
    res.send("You made it!");
    // res.redirect("localhost:8080/home");
});

app.get("/failure", (req, res, next) => {
    res.send("Login unsuccessful");
});

// app.get("/userid", secured, (req, res, next) => {
//     // @ts-expect-error
//     res.send(req.user.id);
// });

// Graphql

// app.use('/graphql', (req, res, next) => {
//     console.log(req.body.query)
//     console.log(req.body.variables)
//     return next()
// })

app.use("/graphql", (req, res, next) => {
    // if (req.body.userID) {
    //     // @ts-expect-error
    //     req.body.userID = req.user.id;
    // }
    console.log(req.cookies);
    next();
});

const typeDefs = fs.readFileSync(path.join(__dirname, "..", "schema.graphql"), "utf-8");

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ prisma, req }),
});

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

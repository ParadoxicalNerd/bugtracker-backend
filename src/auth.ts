import express from "express";
import passport from "passport";
import querystring from "querystring";

import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.get(
    "/login",
    passport.authenticate("auth0", { scope: "openid email profile" }),
    (req, res, next) => {
        console.log("===>" + res.locals.returnTo);
        return res.redirect("/");
    }
);

router.get("/callback", (req, res, next) =>
    passport.authenticate("auth0", (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.redirect("/login");

        req.logIn(user, (err) => {
            if (err) return next(err);

            // @ts-ignore
            const returnTo = req.session.returnTo;
            // @ts-ignore
            delete req.session.returnTo;

            console.log(req);
            res.redirect(returnTo || "/");
        });

        // req.login(user, (err) => {
        //     if (err) return next(err);
        //     return res.redirect("/successRoute"); // Regardless of where logged in from, take to auth successful route
        // });
    })(req, res, next)
);

router.get("/logout", (req, res, next) => {
    req.logout();

    const logoutURL = new URL(`https://${process.env.AUTH0_DOMAIN}/v2/logout`);
    logoutURL.search = querystring.stringify({
        client_id: process.env.AUTH0_CLIENT_ID,
        returnTo: process.env.HOMEPAGE_URL,
    });

    // TODO: Fix redirect url error
    // @ts-expect-error
    res.redirect(logoutURL);
});

export default router;

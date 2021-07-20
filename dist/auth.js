"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const querystring_1 = __importDefault(require("querystring"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
router.get("/login", passport_1.default.authenticate("auth0", { scope: "openid email profile" }));
router.get("/callback", (req, res, next) => passport_1.default.authenticate("auth0", (err, user, info) => {
    if (err)
        return next(err);
    if (!user)
        return res.redirect("/login");
    req.logIn(user, (err) => {
        if (err)
            return next(err);
        const returnTo = req.session.returnTo;
        delete req.session.returnTo;
        console.log(returnTo);
        res.redirect(returnTo || "/");
    });
})(req, res, next));
router.get("/logout", (req, res, next) => {
    req.logout();
    const logoutURL = new URL(`https://${process.env.AUTH0_DOMAIN}/v2/logout`);
    logoutURL.search = querystring_1.default.stringify({
        client_id: process.env.AUTH0_CLIENT_ID,
        returnTo: process.env.HOMEPAGE_URL,
    });
    res.redirect(logoutURL);
});
exports.default = router;
//# sourceMappingURL=auth.js.map
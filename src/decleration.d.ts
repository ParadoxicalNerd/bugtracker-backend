import { Session } from "express-session";
import { ExtraVerificationParams } from "passport-auth0";

// Fix from https://github.com/DefinitelyTyped/DefinitelyTyped/issues/49941#issuecomment-748513261
declare module "express-session" {
    interface Session {
        returnTo?: string;
        user?: Express.User;
    }
}

import { Session } from 'express-session'

// Fix from https://github.com/DefinitelyTyped/DefinitelyTyped/issues/49941#issuecomment-748513261
declare module 'express-session' {
 interface Session {
    returnTo?: string;
  }
}

interface reees {
  id: string
}
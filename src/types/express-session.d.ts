// types/express-session/index.d.ts o types/global.d.ts
import "express-session";

declare module "express-session" {
  interface SessionData {
    user?: Express.User;
  }
}

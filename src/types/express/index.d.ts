import "express";

declare global {
  namespace Express {
    interface User {
        id: number,
        name: string,
        email: string,
        role: string,
      // add other custom properties if needed
    }
  }
}

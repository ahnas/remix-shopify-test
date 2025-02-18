import { createCookieSessionStorage } from "@remix-run/node";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    secrets: ["your-secret-key"],
    maxAge: 60 * 60 * 24, 
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;

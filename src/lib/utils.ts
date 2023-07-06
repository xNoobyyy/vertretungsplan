import { createCookieSessionStorage } from "solid-start"

export const storage = createCookieSessionStorage({
  cookie: {
    name: import.meta.env.VITE_COOKIE_TOKEN_KEY,
    secure: true,
    secrets: [import.meta.env.VITE_COOKIE_SECRET_KEY],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  }
})
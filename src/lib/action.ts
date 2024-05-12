import { action } from "@solidjs/router"
import { useSession } from "vinxi/http"

export const actionDarkMode = action(async (darkMode: boolean) => {
  "use server"
  const session = await useSession({
    password: process.env.SESSION_SECRET!,
  })
  await session.update(d => (d.darkMode = darkMode))
  return new Response("OK", { status: 200 })
})

export const actionSelected = action(async (value: string | undefined) => {
  "use server"
  const session = await useSession({
    password: process.env.SESSION_SECRET!,
  })
  await session.update(d => (d.selected = value))
  return new Response("OK", { status: 200 })
})
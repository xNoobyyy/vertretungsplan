import { action } from "@solidjs/router"
import { useSession } from "vinxi/http"

export const actionDarkMode = action(async (darkMode: boolean) => {
  "use server"
  const session = await useSession<{
    selected?: string
    darkMode?: boolean
  }>({
    password: process.env.SESSION_SECRET!,
  })
  await session.update({
    darkMode,
  })
  return new Response("OK", { status: 200 })
})

export const actionSelected = action(async (value: string | undefined) => {
  "use server"
  const session = await useSession<{
    selected?: string
    darkMode?: boolean
  }>({
    password: process.env.SESSION_SECRET!,
  })
  await session.update({
    selected: value,
  })
  return new Response("OK", { status: 200 })
})

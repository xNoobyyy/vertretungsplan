import { useSession } from "vinxi/http"

export const serverData = async () => {
  "use server"
  const session = await useSession({
    password: process.env.SESSION_SECRET!,
  })

  const selected = session.data.selected as string | undefined
  const darkMode = session.data.darkMode as boolean | undefined

  return { selected, darkMode }
}
import { useSession } from "vinxi/http"

export const serverData = async () => {
  "use server"

  console.log("debug serverData")

  const session = await useSession<{
    selected?: string | null
    darkMode?: boolean | null
  }>({
    password: process.env.SESSION_SECRET!,
  })

  console.log("debug", session.data)

  const selected = session.data.selected
  const darkMode = session.data.darkMode

  console.log("debug", selected, darkMode)

  return { selected, darkMode }
}
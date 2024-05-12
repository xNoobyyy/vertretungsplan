import { useSession } from "vinxi/http"

export const serverData = async () => {
  const session = await useSession<{
    selected?: string
    darkMode?: boolean
  }>({
    password: process.env.SESSION_SECRET!,
  })

  const selected = session.data.selected
  const darkMode = session.data.darkMode

  return { selected, darkMode }
}
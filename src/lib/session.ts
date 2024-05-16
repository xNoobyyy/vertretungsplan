import { getCookie, useSession } from "vinxi/http"

export const serverData = async () => {
  "use server"

  const selected = getCookie("selected")
  const darkMode = getCookie("darkMode") === "true"

  return { selected, darkMode }
}
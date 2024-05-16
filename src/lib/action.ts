import { action } from "@solidjs/router"
import { deleteCookie, setCookie, useSession } from "vinxi/http"

export const actionDarkMode = action(async (darkMode: boolean) => {
  "use server"
  setCookie("darkMode", darkMode ? "true" : "false")
})

export const actionSelected = action(async (value: string | undefined) => {
  "use server"
  if (value) {
    setCookie("selected", value)
  } else {
    deleteCookie("selected")
  }
})

import { A } from "@solidjs/router"

export default function NotFound() {
  return (
    <main class="text-3xl flex flex-col h-screen w-screen justify-center items-center">
      Error 404
      <A href="/" class="text-blue-600">Home</A>
    </main>
  )
}

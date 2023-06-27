import { For, Show, createResource, createSignal, onMount } from "solid-js"
import { createRouteData, useRouteData } from "solid-start"
import { DayData } from "~/lib/types"

export const routeData = () => {
  return createRouteData(fetchApi)
}

const getBaseURL = () => {
  if (import.meta.env.MODE === "development") {
    return "http://localhost:3000"
  } else {
    return "https://vertretungsplan-rose.vercel.app"
  }
}

const fetchApi = async () => {
  try {
    var response = (await (await fetch(`${getBaseURL()}/api/data`)).json()) as {
      day1: DayData
      day2: DayData
      slider: string
    }
  } catch (err) {
    console.log("debug", err)
    return undefined
  }

  console.log("420", response)

  return response
}

export const Home = () => {
  const data = useRouteData<typeof routeData>()

  const classes = [
    "7A",
    "7B",
    "7E",
    "7N",
    "8A",
    "8B",
    "8E",
    "8N",
    "9A",
    "9B",
    "9E",
    "9N",
    "10A",
    "10B",
    "10E",
    "10N",
    "11",
    "12",
  ]

  const [selected, setSelected] = createSignal("7A")

  return (
    <Show
      when={data.loading && !data()}
      fallback={
        <Show
          when={data.error}
          fallback={
            <>
              <header class="text-2xl font-bold m-8 text-[#424242] content-center items-center justify-center flex">
                <h1>Vertretungsplan</h1>
                <img
                  class="object-cover h-16 w-auto ml-6"
                  src="/paulsen-logo-dark.svg"
                  alt="Paulsen-Logo"
                />
              </header>
              <nav class="bg-[#eff4f6] shadow-dark">
                <div class="min-h-max flex flex-wrap justify-center items-center px-10 pt-6 pb-2">
                  <For each={classes}>
                    {(item) => (
                      <button
                        class={`w-14 h-9 shadow-lg shadow-[#bac5c5] m-1 ${
                          selected() === item
                            ? "bg-[#b2c6ce] shadow-[#516363]"
                            : ""
                        }`}
                        onclick={() => setSelected(item)}
                      >
                        {item}
                      </button>
                    )}
                  </For>
                </div>
                <div class="h-12 flex overflow-hidden select-none text-md">
                  <div class="flex-shrink-0 flex items-center justify-around min-w-full marquee pl-[100%]">
                    {data()?.slider}
                  </div>
                </div>
              </nav>
              <main class="h-full mt-12">
                <div class="">
                  <Show
                    when={
                      data()?.day1.data.find(
                        (value) => value.class === selected()
                      )?.data
                    }
                    fallback={
                      <div class="text-2xl text-center">
                        Keine Vertretungsplan Einträge!
                      </div>
                    }
                  >
                    <table class="">
                      <thead>
                        <tr>
                          <th class={"dt:min-w-[5vw] pt:w-[15%]"}>Info</th>
                          <th class={"dt:min-w-[5vw] pt:w-[15%]"}>Stunde</th>
                          <th class={"dt:min-w-[5vw] pt:w-[15%]"}>
                            Vertretung
                          </th>
                          <th class={"dt:min-w-[5vw] pt:w-[15%]"}>Fach</th>
                          <th class={"dt:min-w-[5vw] pt:w-[15%]"}>Raum</th>
                        </tr>
                      </thead>
                      <tbody>
                        <For
                          each={
                            data()?.day1.data.find(
                              (value) => value.class === selected()
                            )?.data
                          }
                        >
                          {(data) => (
                            <tr>
                              <td>{data.info}</td>
                              <td>{data.lesson}</td>
                              <td>{data.substitute}</td>
                              <td>{data.subject}</td>
                              <td>{data.room}</td>
                            </tr>
                          )}
                        </For>
                      </tbody>
                    </table>
                  </Show>
                </div>
              </main>
            </>
          }
        >
          <div class="flex w-screen h-screen justify-center items-center text-3xl font-mono">
            Error fetching data ...
          </div>
        </Show>
      }
    >
      <div class="flex w-screen h-screen justify-center items-center text-3xl font-mono">
        Fetching data ...
      </div>
    </Show>
  )
}

export default Home

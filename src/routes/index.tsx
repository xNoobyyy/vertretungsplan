// @refresh reload
import { For, Show, createSignal, onMount } from "solid-js"
import Header from "~/components/Header"
import { cache, createAsync, RouteDefinition, useAction } from "@solidjs/router"
import { actionDarkMode, actionSelected } from "~/lib/action"
import { serverData as sessionServerData } from "~/lib/session"
import { planData } from "~/lib/plan"

const loadData = cache(async () => {
  "use server"
  const plan = await planData()

  const serverData = await sessionServerData()

  console.log("weee", typeof serverData, serverData)

  return { plan, serverData }
}, "plan_data")

export const route = {
  load: () => loadData(),
} satisfies RouteDefinition

const Home = () => {
  const data = createAsync(() => loadData(), {
    deferStream: true,
  })

  const sendDarkMode = useAction(actionDarkMode)
  const sendSelected = useAction(actionSelected)

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

  const [selected, setSelected] = createSignal(data()?.serverData?.selected)
  const [darkMode, setDarkMode] = createSignal(
    data()?.serverData?.darkMode ?? false
  )

  onMount(() => {
    document.documentElement.classList.add(darkMode() ? "dark" : "light")
    document.documentElement.classList.remove(darkMode() ? "light" : "dark")
  })

  const toggleDarkMode = () => {
    setDarkMode(!darkMode())
    document.documentElement.classList.add(darkMode() ? "dark" : "light")
    document.documentElement.classList.remove(darkMode() ? "light" : "dark")
    sendDarkMode(darkMode())
  }

  const select = (selected: string) => {
    setSelected(selected)
    sendSelected(selected)
  }

  return (
    <Show
      when={data()?.plan}
      fallback={
        <div class="flex w-screen h-screen justify-center items-center text-3xl font-mono">
          Fetching data ...
        </div>
      }
    >
      {(plan) => (
        <Show
          when={!plan().error}
          fallback={
            <div class="flex w-screen h-screen justify-center items-center text-3xl font-mono">
              Error fetching data ... Vertretungsplan tot?
            </div>
          }
        >
          <>
            <Header toggleDarkMode={toggleDarkMode} />
            <nav class="bg-secondary dark:bg-secondary-dark shadow-dark px-4">
              <div class="flex h-full w-full items-center justify-center dt:gap-10 pt:flex-col pt:gap-0">
                <div class="min-h-max flex w-full flex-wrap justify-center items-center pt-6 pb-2">
                  <For each={classes}>
                    {(item) => (
                      <button
                        class={`w-12 min-w-fit rounded-[0.2rem] h-9 shadow-lg m-1 px-2 ${
                          selected() === item
                            ? "bg-primary dark:bg-primary-dark shadow-[#546d6d] dark:shadow-neutral-950"
                            : "bg-primary/25 dark:bg-primary-dark/20 shadow-[#bac5c5] dark:shadow-neutral-950/40"
                        }`}
                        onclick={() => select(item)}
                      >
                        {item}
                      </button>
                    )}
                  </For>
                </div>
              </div>
              <div class="h-12 flex select-none text-md overflow-x-hidden">
                <div
                  class={`flex-shrink-0 flex items-center justify-around marquee pl-[100%]`}
                >
                  {plan()?.slider}
                </div>
              </div>
            </nav>
            <main class="my-12 flex pt:flex-col dt:justify-center dt:gap-[10vw] pt:gap-10">
              <Show
                when={selected()}
                fallback={
                  <div class="flex w-screen h-[50vh] justify-center items-center font-mono text-3xl">
                    Wähle eine Klasse!
                  </div>
                }
              >
                {(sel) => (
                  <>
                    <div class="flex justify-center">
                      <div class="dt:w-[40vw] pt:w-[95vw]">
                        <div class="text-center text-2xl font-mono mb-10">
                          {plan()?.day1!.date}
                          <div class="text-xl">{plan()?.day2!.state}</div>
                        </div>
                        <Show
                          when={
                            plan()?.day1!.data.find(
                              (value) => value.class === sel()
                            )?.data
                          }
                          fallback={
                            <div class="text-2xl text-center">
                              Keine Vertretungsplan Einträge!
                            </div>
                          }
                        >
                          {(planData) => (
                            <table class="w-full">
                              <thead>
                                <tr class="grid-header-row">
                                  <th>Info</th>
                                  <th>Stunde</th>
                                  <th>Lehrer</th>
                                  <th>Fach</th>
                                  <th>Raum</th>
                                </tr>
                              </thead>
                              <tbody>
                                <For
                                  each={
                                    plan()?.day1!.data.find(
                                      (value) => value.class === sel()
                                    )?.data
                                  }
                                >
                                  {(data) => (
                                    <tr class="text-center grid-row">
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
                          )}
                        </Show>
                      </div>
                    </div>
                    <div class="h-[0.5px] w-screen bg-text my-10 dt:hidden" />
                    <div class="flex justify-center">
                      <div class="dt:w-[40vw] pt:w-[95vw]">
                        <div class="text-center text-2xl font-mono mb-10">
                          {plan()?.day2!.date}
                          <div class="text-xl">{plan()?.day2!.state}</div>
                        </div>
                        <Show
                          when={
                            plan()?.day2!.data.find(
                              (value) => value.class === sel()
                            )?.data
                          }
                          fallback={
                            <div class="text-2xl text-center">
                              Keine Vertretungsplan Einträge!
                            </div>
                          }
                        >
                          {(planData) => (
                            <table class="w-full">
                              <thead>
                                <tr class="grid-header-row">
                                  <th>Info</th>
                                  <th>Stunde</th>
                                  <th>Lehrer</th>
                                  <th>Fach</th>
                                  <th>Raum</th>
                                </tr>
                              </thead>
                              <tbody>
                                <For
                                  each={
                                    plan()?.day2!.data.find(
                                      (value) => value.class === sel()
                                    )?.data
                                  }
                                >
                                  {(data) => (
                                    <tr class="text-center grid-row">
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
                          )}
                        </Show>
                      </div>
                    </div>
                  </>
                )}
              </Show>
            </main>
          </>
        </Show>
      )}
    </Show>
  )
}

export default Home

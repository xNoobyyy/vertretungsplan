export type PlanItem = {
  lesson: string | undefined
  substitute: string | undefined
  subject: string | undefined
  room: string | undefined
  info: string | undefined
}

export type ClassData = {
  class: string
  data: PlanItem[]
}

export type DayData = {
  date: string
  data: ClassData[]
  state: string
}
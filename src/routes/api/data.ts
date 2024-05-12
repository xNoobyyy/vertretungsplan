import { load } from "cheerio"
import { json } from "solid-start"
import { ClassData, DayData, PlanItem } from "~/lib/types"
import https from "https"
import axios from "axios"

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
})

const extractClassDataFromTable = (htmlString: string): DayData => {
  const $ = load(htmlString)
  const tableRows = $(".mon_list tr")

  const classDataList: ClassData[] = []
  let currentClassData: ClassData | undefined

  tableRows.each((index, element) => {
    const tableCells = $(element).find("td")
    const isStartOfClass =
      tableCells.hasClass("list") && tableCells.hasClass("inline_header")

    if (isStartOfClass) {
      const className = tableCells.first().text().split(" ").at(0)!!.trim()
      currentClassData = {
        class: className,
        data: [],
      }
      classDataList.push(currentClassData)
    } else if (currentClassData) {
      const planItem: PlanItem = {
        lesson: checkNotAvailable(tableCells.eq(1).text().trim()),
        substitute: checkNotAvailable(tableCells.eq(2).text().trim()),
        subject: checkNotAvailable(
          isAvailable(tableCells.eq(4).text().trim())
            ? tableCells.eq(4).text().trim()
            : tableCells.eq(3).text().trim()
        ),
        room: checkNotAvailable(
          isAvailable(tableCells.eq(6).text().trim())
            ? tableCells.eq(6).text().trim()
            : tableCells.eq(5).text().trim()
        ),
        info: concatInfo(
          tableCells.eq(0).text().trim(),
          tableCells.eq(7).text().trim()
        ),
      }
      currentClassData.data.push(planItem)
    }
  })

  return {
    state: $("body").contents().first().text(),
    data: mergeData(classDataList),
    date: $(".mon_title").contents().first().text(),
  }
}

const mergeData = (classDataArray: ClassData[]): ClassData[] => {
  return classDataArray.filter(
    (classData) => !/^[GL]\d{2}.*$/.test(classData.class)
  )
}

const extractSliderData = (htmlString: string) => {
  return load(htmlString)(".html-marquee").text().trim()
}

const checkNotAvailable = (text: string) => {
  if (!isAvailable(text)) {
    return "---"
  } else {
    return text
  }
}

const isAvailable = (text: string) => {
  return !(
    text === "+" ||
    text === "" ||
    text === "&nbsp;" ||
    text === "---" ||
    text === "-"
  )
}

const concatInfo = (text1: string, text2: string) => {
  if (!isAvailable(text1) && !isAvailable(text2)) return "---"

  if (text1 === text2) {
    return text1
  }
  if (text2.includes(text1)) return text2

  if (!isAvailable(text1)) return text2
  if (!isAvailable(text2)) return text1

  return text1 + " | " + text2
}

// add some scraping thingy that saves the data on every state known (use a cron job in vercel to ping api?)
export const GET = async () => {
  try {
    var day1res = await axios({
      method: "GET",
      url: "https://www.pgb-info.de/joomla/images/sampledata/untis/Web/f1/subst_001.htm",
      httpsAgent: httpsAgent,
    })
  } catch (err) {
    console.log(err)
    return json({ error: "day1res not ok" })
  }

  try {
    var day2res = await axios({
      method: "GET",
      url: "https://www.pgb-info.de/joomla/images/sampledata/untis/Web/f2/subst_001.htm",
      httpsAgent: httpsAgent,
    })
  } catch (err) {
    console.log(err)
    return json({ error: "day2res not ok" })
  }

  try {
    var sliderres = await axios({
      method: "GET",
      url: "https://www.pgb-info.de/joomla/images/sampledata/untis/Web/ticker.htm",
      httpsAgent: httpsAgent,
    })
  } catch (err) {
    console.log(err)
    return json({ error: "sliderres not ok" })
  }

  if (day1res.status !== 200) {
    return json({ error: "day1res not ok" })
  }

  if (day2res.status !== 200) {
    return json({ error: "day2res not ok" })
  }

  if (sliderres.status !== 200) {
    return json({ error: "sliderres not ok" })
  }

  return json({
    day1: extractClassDataFromTable(await day1res.data as string),
    day2: extractClassDataFromTable(await day2res.data as string),
    slider: extractSliderData(await sliderres.data as string),
  })
}

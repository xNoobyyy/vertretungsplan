import { load } from "cheerio"
import { json } from "solid-start"
import { ClassData, DayData, PlanItem } from "~/lib/types"
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
        room: checkNotAvailable(tableCells.eq(6).text().trim()),
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
  const class11Index = classDataArray.findIndex((item) => item.class === "11")
  const class12Index = classDataArray.findIndex((item) => item.class === "12")

  if (class11Index !== -1 || class12Index !== -1) {
    const newData: PlanItem[] = []

    // Extract data from "11" element
    if (class11Index !== -1) {
      const class11Element = classDataArray[class11Index]
      newData.push(...class11Element.data)
      classDataArray.splice(class11Index, 1) // Remove the "11" element
    }

    // Extract data from "12" element
    if (class12Index !== -1) {
      const class12Element = classDataArray[class12Index]
      newData.push(...class12Element.data)
      classDataArray.splice(class12Index, 1) // Remove the "12" element
    }

    // Create "Oberstufe" element and merge the extracted data
    const oberstufeElement: ClassData = {
      class: "Oberstufe",
      data: newData,
    }
    classDataArray.push(oberstufeElement)
  }

  const oberstufeIndex = classDataArray.findIndex(
    (item) => item.class === "Oberstufe"
  )

  const oberstufeElement = classDataArray[oberstufeIndex]

  for (const classData of classDataArray) {
    if (/^[GL]\d{2}.*$/.test(classData.class) && classData !== oberstufeElement) {
      for (const planItem of classData.data) {
        planItem.subject = classData.class
        oberstufeElement.data.push(planItem)
      }
    }
  }

  // Remove elements with "G"/"L" followed by two numbers
  classDataArray = classDataArray.filter(
    (classData) => !/^[GL]\d{2}.*$/.test(classData.class)
  )

  return classDataArray
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
  return !(text === "+" || text === "" || text === "&nbsp;")
}

const concatInfo = (text1: string, text2: string) => {
  if (text1 === text2) {
    return text1
  }

  if (!isAvailable(text1) && !isAvailable(text2)) return "---"
  if (!isAvailable(text1)) return text2
  if (!isAvailable(text2)) return text1

  return text1 + " | " + text2
}

// add some scraping thingy that saves the data on every state known (use a cron job in vercel to ping api?)
export const GET = async () => {
  try {
    var day1res = await fetch(
      "https://www.pgb-info.de/joomla/images/sampledata/untis/Web/f1/subst_001.htm",
      {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
      }
    )
  } catch (err) {
    console.log(err)
    return json({ error: "day1res not ok" })
  }

  try {
    var day2res = await fetch(
      "https://www.pgb-info.de/joomla/images/sampledata/untis/Web/f2/subst_001.htm",
      {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
      }
    )
  } catch (err) {
    console.log(err)
    return json({ error: "day2res not ok" })
  }

  try {
    var sliderres = await fetch(
      "https://www.pgb-info.de/joomla/images/sampledata/untis/Web/ticker.htm",
      {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
      }
    )
  } catch (err) {
    console.log(err)
    return json({ error: "sliderres not ok" })
  }

  if (!day1res.ok) {
    return json({ error: "day1res not ok" })
  }

  if (!day2res.ok) {
    return json({ error: "day2res not ok" })
  }

  if (!sliderres.ok) {
    return json({ error: "sliderres not ok" })
  }

  return json({
    day1: extractClassDataFromTable(await day1res.text()),
    day2: extractClassDataFromTable(await day2res.text()),
    slider: extractSliderData(await sliderres.text()),
  })
}

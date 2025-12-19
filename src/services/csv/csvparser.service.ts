import Papa from "papaparse"

export function parseCsv<T>(csvUrl: string): Promise<T[]> {
    console.log("[parseCsv] CSV URL:", csvUrl)
    fetch(csvUrl)
  .then(res => {
    console.log("[parseCsv] Fetch status:", res.status)
    if (!res.ok) throw new Error("CSV fetch failed")
    return res.text()
  })
  .then(() => console.log("[parseCsv] CSV reachable"))
  .catch(err => {
    console.error("[parseCsv] CSV NOT reachable", err)
  })

return new Promise((resolve, reject) => {
//console.log("[parseCsv] START", csvUrl)
console.log("[parseCsv] promise executor entered")
console.log("[parseCsv] csvUrl =", csvUrl, typeof csvUrl)
console.log("[parseCsv] Papa:", Papa)
console.log("[parseCsv] calling Papa.parse now")
Papa.parse<T>(csvUrl, {
  download: true,
  header: true,
  skipEmptyLines: true,
  worker: false, 
  dynamicTyping: true,
  complete: (results) => {
    if (!results?.data) {
      reject(new Error("CSV parsing failed"))
      return
    }
    resolve(results.data)
    console.log("Final results data",results.data)
  },
  error: reject,
})
})

}

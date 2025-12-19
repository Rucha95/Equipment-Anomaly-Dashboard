import { useEffect, useState } from "react"
import { parseCsv } from "../services/csv/csvparser.service"

export function useCsvData<T>(
  csvPath: string,
  validator?: (row: Partial<T>) => row is T
) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)

    parseCsv<T>(csvPath)
      .then((res) => {
        if (!mounted) return

        if (validator) {
          const validated = res.filter(validator)
          const invalidRows = res.filter(r => !validator(r))

          if (invalidRows.length > 0) {
            console.warn("[CSV] Invalid rows:", invalidRows)
          }

          setData(validated)
        } else {
          setData(res)
        }
      })
      .catch((err) => {
        if (mounted) setError(err)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [csvPath, validator])

  return { data, loading, error }
}


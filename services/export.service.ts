import { apiClient } from "@/lib/api-client"

async function downloadCsv(path: string, filename: string, params?: Record<string, string>) {
  const response = await apiClient.get(path, {
    params,
    responseType: "blob",
  })
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", filename)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

export const exportService = {
  ipos: (params?: Record<string, string>) => downloadCsv("/export/ipos", "ipos.csv", params),
  money: (params?: Record<string, string>) =>
    downloadCsv("/export/money", "money.csv", params),
  repayments: (params?: Record<string, string>) =>
    downloadCsv("/export/repayments", "repayments.csv", params),
  complete: (params?: Record<string, string>) =>
    downloadCsv("/export/complete", "fintrack-export.csv", params),
}

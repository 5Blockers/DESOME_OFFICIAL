export const fromArray = async <T>(data: Array<number>): Promise<T> => {
  const blob: Blob = new Blob([new Uint8Array(data)], {
    type: "application/json; charset=utf-8",
  })
  return JSON.parse(await blob.text())
}

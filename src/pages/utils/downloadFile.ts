/**
 * Downloads a file Blob
 */
export const downloadFile = (file: Blob, fileName?: string) => {
  // Create a link and set the URL using `createObjectURL`
  const link = document.createElement('a')
  link.style.display = 'none'
  /**
   * @note `createObjectURL` has a blob limit of around 800mb
   */
  link.href = URL.createObjectURL(file)
  link.download = fileName || file.name

  // It needs to be added to the DOM so it can be clicked
  document.body.appendChild(link)
  link.click()

  // To make this work on Firefox we need to wait
  // a little while before removing it.
  setTimeout(() => {
    URL.revokeObjectURL(link.href)
    link.parentNode?.removeChild(link)
  }, 0)
}

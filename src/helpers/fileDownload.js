export const downloadFile = (blob, fileName) => {
  const element = document.createElement('a')
  document.body.appendChild(element)
  element.setAttribute('href', typeof blob === 'string' ? blob : window.URL.createObjectURL(blob))
  if (fileName) {
    element.setAttribute('download', fileName)
  }
  element.style.display = 'none'
  element.click()
  document.body.removeChild(element)
}

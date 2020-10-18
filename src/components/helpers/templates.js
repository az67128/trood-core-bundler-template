export const templateApplyValues = (template, args) => {
  return template.replace(/\{([^{}]+)\}/g, (m, key) => {
    return args[key] || m
  })
}

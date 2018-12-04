export const getQueryLinkPropsFunction = (location, match) => (fields = {}) => ({
  isActive: (linkMatch, linkLocation) => {
    if (!linkMatch) return false
    return Object.keys(fields).every(fieldName => {
      const fieldValue = fields[fieldName]
      if (fieldValue === undefined) return true
      return linkLocation.query[fieldName] === fieldValue.toString()
    })
  },
  replace: true,
  to: {
    pathname: match.url,
    query: {
      ...location.query,
      ...fields,
    },
  },
})

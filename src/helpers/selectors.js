const getDefaultPropName = name => name


const cache = {}

export const applySelectors = (name) => (state, selectors, getPropName = getDefaultPropName) => {
  if (typeof window !== 'undefined' && window.isSubmitting && cache[name]) {
    return cache[name]
  }
  const res = Object.keys(selectors).reduce((memo, key) => ({
    ...memo,
    [getPropName(key)]: selectors[key](state),
  }), {})

  cache[name] = res
  return res
}

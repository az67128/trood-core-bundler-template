const getDefaultPropName = name => name


export const applySelectors = (name) => (state, selectors, getPropName = getDefaultPropName) => {
  const res = Object.keys(selectors).reduce((memo, key) => ({
    ...memo,
    [getPropName(key)]: selectors[key](state),
  }), {})

  return res
}

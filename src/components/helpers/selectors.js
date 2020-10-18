const getDefaultPropName = name => name


export const applySelectors = () => (state, selectors, getPropName = getDefaultPropName) => {
  return Object.keys(selectors).reduce((memo, key) => ({
    ...memo,
    [getPropName(key)]: selectors[key](state),
  }), {})
}

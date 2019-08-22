import lodashGet from 'lodash/get'
import { isDefAndNotNull } from './def'


const allow = 'allow'
const deny = 'deny'

const checkRule = (key, rule, values) => {
  if (key === 'or' || key === 'and') {
    const arrayComparer = key === 'or' ? 'some' : 'every'
    return rule[arrayComparer](innerRule => {
      return Object.keys(innerRule).every(innerKey => checkRule(innerKey, innerRule[innerKey], values))
    })
  }

  if (isDefAndNotNull(rule.in)) return rule.in.some(item => checkRule(key, item, values))
  if (isDefAndNotNull(rule.not)) return !checkRule(key, rule.not, values)

  let keyValue = lodashGet(values, key)
  keyValue = (keyValue || {}).id || keyValue || key
  let ruleValue = lodashGet(values, rule)
  ruleValue = (ruleValue || {}).id || ruleValue || rule

  if (isDefAndNotNull(rule.lt)) return keyValue < ruleValue
  if (isDefAndNotNull(rule.gt)) return keyValue > ruleValue

  return keyValue === ruleValue
}

export const checkActionRule = (actionRule = {}, values = {}) => {
  const { result, rule = {} } = actionRule
  const ruleResult = Object.keys(rule).every(key => checkRule(key, rule[key], values))
  if (result === allow) return ruleResult
  if (result === deny) return !ruleResult
  return false
}

export const ruleChecker = ({
  rules = {},
  domain,
  resource,
  action,
  values = {},
} = {}) => {
  const domainResources = rules[domain] || {}
  const globalDefaultResolution = rules._defaultResolution
  const domainDefaultResolution = domainResources._defaultResolution
  const resourceActions = domainResources[resource] || {}
  const actionKeys = Object.keys(resourceActions).filter(key => {
    const regexp = new RegExp(key.replace('*', '.*'))
    return regexp.test(action)
  })
  const actionRules = actionKeys.reduce((memo, curr) => ([
    ...memo,
    ...resourceActions[curr],
  ]), [])
  if (!actionRules.length) {
    return domainDefaultResolution === allow || globalDefaultResolution === allow
  }
  return actionRules.some(actionRule => checkActionRule(actionRule, values))
}

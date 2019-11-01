import lodashGet from 'lodash/get'
import { isDefAndNotNull } from './def'


const allow = 'allow'
const any = '*'

const checkRule = (key, rule, values) => {
  if (rule === any) return true
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

export const getSuitableRuleResult = (actionRules = [], values = {}, defaultAccess = true) => {
  const suitableRule = actionRules.find(({ rule }) => {
    return Object.keys(rule).every(key => checkRule(key, rule[key], values))
  })
  if (suitableRule) {
    return {
      access: suitableRule.result === allow,
      mask: suitableRule.mask || [],
    }
  }
  return {
    access: defaultAccess,
    mask: [],
  }
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
  const defaultAccess = domainDefaultResolution === allow || globalDefaultResolution === allow
  const resourceActions = domainResources[resource] || {}
  const actionKeys = Object.keys(resourceActions).filter(key => {
    const regexp = new RegExp(key.replace('*', '.*'))
    return regexp.test(action)
  }).sort()
  const actionRules = actionKeys.reduce((memo, curr) => ([
    ...memo,
    ...resourceActions[curr],
  ]), [])
  const suitableRuleResult = getSuitableRuleResult(actionRules, values, defaultAccess)
  return suitableRuleResult
}

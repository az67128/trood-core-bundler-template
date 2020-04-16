import { connect } from 'react-redux'

import { applySelectors } from '$trood/helpers/selectors'

import { SERVICES_PROPS } from './constants'


const defaultMapToProps = () => {}
const defaultMergeProps = (stateProps, dispatchProps) => ({ ...stateProps, ...dispatchProps })
/**
 * Creates a HOC for adding a Trood service
 * @param {string|string[]} [service] - can be either service name, or service names array
 */
export default (
  service,
  stateToProps = defaultMapToProps,
  dispatchToProps = defaultMapToProps,
  mergeProps = defaultMergeProps,
  connectHoc = connect,
) => (WrapedComponent) => {
  const serviceNames = Array.from(new Set(Array.isArray(service) ? service : [service]))

  const servicesPropsSelectors = serviceNames.reduce((memo, serviceName) => ({
    ...memo,
    ...(SERVICES_PROPS[serviceName] && SERVICES_PROPS[serviceName].stateProps),
  }), {})

  const servicesActionsSelectors = serviceNames.reduce((memo, serviceName) => ({
    ...memo,
    ...(SERVICES_PROPS[serviceName] && SERVICES_PROPS[serviceName].dispatchProps),
  }), {})

  const wrapedStateToProps = (state, props) => {
    return {
      ...stateToProps(state, props),
      ...applySelectors('withServiceStateToProps')(state, servicesPropsSelectors),
    }
  }

  const wrapedDispatchToProps = (dispatch) => {
    return {
      ...dispatchToProps(dispatch),
      ...applySelectors('withServiceDispatchToProps')(dispatch, servicesActionsSelectors),
    }
  }

  return connectHoc(wrapedStateToProps, wrapedDispatchToProps, mergeProps)(WrapedComponent)
}

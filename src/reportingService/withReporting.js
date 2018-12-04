import React, { PureComponent } from 'react'
import { createSelector } from 'reselect'

import { getReportingLoadingPropName } from './constants'

import { getDisplayName } from '$trood/helpers/react'


export default (reportPropName, selectors, queryFunction) => (WrappedComponent) => {
  const memoizedQuery = createSelector(selectors, queryFunction)

  return class extends PureComponent {
    static displayName = `withReporting(${getDisplayName(WrappedComponent)})`

    constructor(props) {
      super(props)
      this.prevQuery = undefined

      this.calculateReport = this.calculateReport.bind(this)
    }

    componentDidMount() {
      this.calculateReport()
    }

    componentDidUpdate() {
      this.calculateReport()
    }

    calculateReport() {
      const currentQuery = memoizedQuery(this.props)
      if (this.prevQuery !== currentQuery) {
        this.props.reportingActions.getReportByQuery(reportPropName, currentQuery)
        this.prevQuery = currentQuery
      }
    }

    render() {
      const {
        reportingServiceData,
        ...other
      } = this.props

      const reportLoadingPropName = getReportingLoadingPropName(reportPropName)
      return (
        <WrappedComponent {...{
          ...other,
          reportingServiceData,
          [reportPropName]: reportingServiceData[reportPropName] || [],
          [reportLoadingPropName]: reportingServiceData[reportLoadingPropName],
        }} />
      )
    }
  }
}

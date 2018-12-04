import { api, forms } from 'redux-restify'

import { getReportingId, getReportingLoadingPropName } from './constants'

import { REPORTING_API_NAME } from '$trood/reportingApiUrlSchema'


const ReportingRequests = {}

export const getReportByQuery = (reportName, query) => (dispatch) => {
  const loadingPropName = getReportingLoadingPropName(reportName)
  if (ReportingRequests[reportName]) {
    ReportingRequests[reportName].abort()
  }
  dispatch(forms.actions.reportingServiceDataForm.changeField(loadingPropName, true))
  dispatch(api.actions.callPost({
    url: '',
    apiName: REPORTING_API_NAME,
    urlHash: getReportingId(reportName),
    query: {
      reportName,
    },
    data: query._query,
    convertToCamelCase: false,
    onXhrReady: (xhr) => {
      ReportingRequests[reportName] = xhr
    },
  })).then(res => {
    dispatch(forms.actions.reportingServiceDataForm.changeSomeFields({
      [reportName]: res.data,
      [loadingPropName]: false,
    }))
  })
}

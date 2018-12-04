// TODO by @deylak fix this module exports and refactor, now for some reason we can't import default as usual
// eslint-disable-next-line import/no-named-default
import { default as ReportingQueryBuilderModule } from 'druid-query'

import * as actions from './actions'

export withReporting from './withReporting'
export * from './constants'
export const ReportingQueryBuilder = ReportingQueryBuilderModule

export default { actions }

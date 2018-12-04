import { JOURNAL_API_NAME, JOURNALS_ENDPOINT } from '$trood/journalApiUrlSchema'


export default {
  apiName: JOURNAL_API_NAME,
  endpoint: JOURNALS_ENDPOINT,
  defaults: {
    id: undefined,
    alias: undefined,
    historyRecordKey: undefined,
    name: undefined,
    type: undefined,
    historyRecordActor: undefined,
    saveDiff: undefined,
  },
  pagination: false,
}

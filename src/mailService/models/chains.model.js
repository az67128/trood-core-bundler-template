import { MAIL_API_NAME, CHAINS_ENDPOINT } from '$trood/mailApiUrlSchema'


export default {
  apiName: MAIL_API_NAME,
  endpoint: CHAINS_ENDPOINT,
  defaults: {
    chain: undefined,
    total: undefined,
    unread: undefined,
    last: undefined,
    first: undefined,
    chainSubject: undefined,
    contacts: [],
  },
  idField: 'chain',
}

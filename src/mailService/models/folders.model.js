import { RestifyForeignKey } from 'redux-restify'

import { MAIL_API_NAME, FOLDERS_ENDPOINT } from '$trood/mailApiUrlSchema'


export default {
  apiName: MAIL_API_NAME,
  endpoint: FOLDERS_ENDPOINT,
  defaults: {
    id: undefined,
    name: undefined,
    mailbox: new RestifyForeignKey('mailboxes'),
  },
  pagination: false,
}

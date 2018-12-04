import { RestifyForeignKey, RestifyForeignKeysArray } from 'redux-restify'

import { MAIL_API_NAME, MAILS_ENDPOINT } from '$trood/mailApiUrlSchema'


export default {
  apiName: MAIL_API_NAME,
  endpoint: MAILS_ENDPOINT,
  defaults: {
    id: undefined,
    mailbox: new RestifyForeignKey('mailboxes'),
    subject: undefined,
    body: undefined,
    encoded: undefined,
    fromAddress: [],
    to: [],
    bcc: [],
    isRead: undefined,
    outgoing: undefined,
    inReplyTo: new RestifyForeignKey('mails'),
    replies: [],
    folder: new RestifyForeignKey('folders'),
    attachments: new RestifyForeignKeysArray('files'),
    createdAt: undefined,
    chain: undefined,
  },
}

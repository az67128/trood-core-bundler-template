import { MAIL_API_NAME } from '$trood/mailApiUrlSchema'

import { formatAttachedMail } from '../constants'


export default {
  apiName: MAIL_API_NAME,
  model: 'mails',
  defaults: {
    id: undefined,
    mailbox: undefined,
    subject: '',
    body: '',
    encoded: true,
    fromAddress: [],
    to: [],
    bcc: [],
    inReplyTo: undefined,
    folder: undefined,
    attachments: [],
  },
  mapServerDataToIds: true,
  deleteOnSubmit: true,
  transformBeforeSubmit: mail => ({
    ...mail,
    body: `${mail.body}${formatAttachedMail(mail.attachedMail)}`,
    attachedMail: undefined,
  }),
}

import { MAIL_API_NAME } from '$trood/mailApiUrlSchema'


export default {
  apiName: MAIL_API_NAME,
  model: 'mailboxes',
  defaults: {
    id: undefined,
    name: undefined,
    email: undefined,
    password: undefined,
    imapHost: undefined,
    imapPort: undefined,
    imapSecure: undefined,
    smtpHost: undefined,
    smtpPort: undefined,
    smtpSecure: undefined,
    secure: undefined,
    shared: undefined,
  },
  deleteOnSubmit: true,
}

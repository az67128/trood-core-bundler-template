import { MAIL_API_NAME, MAILBOXES_ENDPOINT } from '$trood/mailApiUrlSchema'


export default {
  apiName: MAIL_API_NAME,
  endpoint: MAILBOXES_ENDPOINT,
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
    active: undefined,
    shared: undefined,
  },
  pagination: false,
}

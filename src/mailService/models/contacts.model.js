import { RestifyForeignKey } from 'redux-restify'

import { MAIL_API_NAME, CONTACTS_ENDPOINT } from '$trood/mailApiUrlSchema'


export default {
  apiName: MAIL_API_NAME,
  endpoint: CONTACTS_ENDPOINT,
  defaults: {
    id: undefined,
    folder: new RestifyForeignKey('folders'),
    email: undefined,
    name: undefined,
  },
}

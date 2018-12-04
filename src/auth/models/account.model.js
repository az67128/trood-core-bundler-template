import { RestifyForeignKey } from 'redux-restify'

import {
  AUTH_API_NAME,
  ACCOUNT_ENDPOINT,
} from '$trood/authApiUrlSchema'


export default {
  apiName: AUTH_API_NAME,
  endpoint: ACCOUNT_ENDPOINT,
  defaults: {
    id: undefined,
    login: undefined,
    created: undefined,
    status: undefined,
    active: undefined,
    role: new RestifyForeignKey('role'),
  },
}

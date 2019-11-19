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
    password: undefined,
    status: undefined,
    active: undefined,
    role: undefined,
    language: undefined,
    profile: undefined,
  },
}

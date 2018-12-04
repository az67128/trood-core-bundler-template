import {
  AUTH_API_NAME,
  RECOVERY_ENDPOINT,
} from '$trood/authApiUrlSchema'


export default {
  apiName: AUTH_API_NAME,
  endpoint: RECOVERY_ENDPOINT,
  defaults: {
    login: undefined,
    token: undefined,
    password: undefined,
    passwordConfirmation: undefined,
  },
}

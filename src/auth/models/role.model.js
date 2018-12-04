import {
  AUTH_API_NAME,
  ROLE_ENDPOINT,
} from '$trood/authApiUrlSchema'


export default {
  apiName: AUTH_API_NAME,
  endpoint: ROLE_ENDPOINT,
  defaults: {
    id: undefined,
    permissions: undefined,
    status: undefined,
  },
}

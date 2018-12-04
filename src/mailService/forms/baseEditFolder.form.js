import { MAIL_API_NAME } from '$trood/mailApiUrlSchema'


export default {
  apiName: MAIL_API_NAME,
  model: 'folders',
  defaults: {
    id: undefined,
    name: undefined,
  },
  deleteOnSubmit: true,
}

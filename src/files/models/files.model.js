import { FILE_API_NAME, FILES_ENDPOINT } from '$trood/fileApiUrlSchema'


export default {
  apiName: FILE_API_NAME,
  endpoint: FILES_ENDPOINT,
  defaults: {
    id: undefined,
    fileUrl: undefined,
    filename: undefined,
    originFilename: undefined,
    ready: undefined,
    size: undefined,
    type: undefined,
    mimetype: undefined,
    metadata: {
      mp3: undefined,
      length: undefined,
      large: undefined,
      medium: undefined,
      small: undefined,
      xlarge: undefined,
      resized: {
        thumb: undefined,
      },
    },
  },
}

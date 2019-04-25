import get from 'lodash/get'

import systemConfig from '$trood/config'


export default {
  defaults: {
    selectedLocale: get(systemConfig, ['services', 'locale', 'defaultLocale']),
  },
}

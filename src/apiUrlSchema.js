import { CRUD_ACTIONS } from 'redux-restify'

import { snakeToCamel, camelToLowerSnake } from '$trood/helpers/namingNotation'


export const DEFAULT_ALLOWED_NO_TOKEN_ENDPOINTS = [
  /.*/,
]

export const API_TYPE_CUSTODIAN = 'CUSTODIAN'

export const API_TYPES = {
  [API_TYPE_CUSTODIAN]: {
    getEntityUrl: ({
      apiHost,
      apiPrefix,
      modelEndpoint,
      entityId,
      crudAction,
      specialAction,
    }) => {
      let requestType = entityId ? 'single' : 'bulk'
      if (crudAction !== CRUD_ACTIONS.read) {
        requestType = specialAction || 'single'
      }
      const url = `${apiHost}${apiPrefix}${requestType}/${modelEndpoint}${entityId ? `/${entityId}` : ''}`
      if (crudAction === CRUD_ACTIONS.read || crudAction === CRUD_ACTIONS.delete) return url
      return {
        url: `${url}?depth=3`,
        method: crudAction === CRUD_ACTIONS.update ? 'post' : 'put',
      }
    },
    getPaginationQuery: (query, page, pageSize) => {
      const limitStr = `limit(${(page - 1) * pageSize},${pageSize})`
      return {
        ...query,
        q: query.q ? `${query.q},${limitStr}` : limitStr,
      }
    },
    transformArrayResponse: response => ({
      data: response.data,
      count: response.totalCount,
    }),
    transformEntityResponse: response => {
      // TODO by @deylak one more custodian hack, cause for update requests it doesn't send this format
      if (typeof response.data === 'object' && typeof response.status === 'string') {
        return {
          data: response.data,
        }
      }
      return {
        data: response,
      }
    },
    getGenericModel: (fieldValue) => ({
      modelType: snakeToCamel(fieldValue._object || 'undefined'),
      model: fieldValue,
    }),
    getGenericFormField: (fieldValue) => ({
      _object: camelToLowerSnake(fieldValue._object || 'unedfined'),
      id: fieldValue.id,
    }),
  },
}

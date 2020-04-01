import memoizeOne from 'memoize-one'
import deepEqual from 'deep-equal'
import { api, forms } from 'redux-restify'

import { getToken } from '$trood/storage'

import mainConfig from '$trood/config'


export const getAuthData = state => {
  return forms.selectors.authDataForm.getForm(state)
}

export const getIsHasAuthData = state => {
  const authData = getAuthData(state)
  return !!authData.id
}

export const getIsAuthenticated = () => {
  const token = getToken()
  return !!token && token !== 'null'
}

export const getProfileId = state => {
  return forms.selectors.authDataForm.getField('profile')(state)
}

export const getProfile = state => {
  const { profile } = (mainConfig.services || {}).auth || {}
  if (!profile) return {}
  const profileId = getProfileId(state)
  return api.selectors.entityManager[profile].getEntities(state).getById(profileId)
}

export const getProfileIsLoading = state => {
  const { profile } = (mainConfig.services || {}).auth || {}
  if (!profile) return false
  const profileId = getProfileId(state)
  return api.selectors.entityManager[profile].getEntities(state).getIsLoadingById(profileId)
}

const getActiveAccountWrap = (authData, profile) => ({
  ...authData,
  abac: undefined,
  profile,
})
const memoizedGetActiveAccountWrap = memoizeOne(getActiveAccountWrap, (a, b) => {
  if (a[0] !== b[0]) return false
  return deepEqual(a[1], b[1])
})

export const getActiveAccount = state => {
  const authData = getAuthData(state)
  const profile = getProfile(state)
  return memoizedGetActiveAccountWrap(authData, profile)
}

export const getPermissions = state => {
  return forms.selectors.authDataForm.getField('abac')(state)
}

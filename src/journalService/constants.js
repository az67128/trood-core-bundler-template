import React from 'react'
import { defineMessages } from 'react-intl'

import { intlObject } from '$trood/localeService'
import { ICONS_TYPES } from '$trood/components/TIcon'


export const HISTORY_ACTION_CREATE = 'create'
export const HISTORY_ACTION_UPDATE = 'update'
export const HISTORY_ACTION_DELETE = 'remove'
export const HISTORY_BASE_OBJECT = 'baseObject'

export const HISTORY_ACTIONS = {
  [HISTORY_ACTION_CREATE]: HISTORY_ACTION_CREATE,
  [HISTORY_ACTION_UPDATE]: HISTORY_ACTION_UPDATE,
  [HISTORY_ACTION_DELETE]: HISTORY_ACTION_DELETE,
  [HISTORY_BASE_OBJECT]: HISTORY_BASE_OBJECT,
}

export const messages = defineMessages({
  created: {
    id: 'journalService.created',
    defaultMessage: 'Created',
  },
  changed: {
    id: 'journalService.changed',
    defaultMessage: 'Changed',
  },
  removed: {
    id: 'journalService.removed',
    defaultMessage: 'Removed',
  },
  system: {
    id: 'journalService.system',
    defaultMessage: 'System',
  },
})

export const HISTORY_ACTIONS_DICT = {
  [HISTORY_ACTION_CREATE]: (objectName, modelName) => (
    <React.Fragment>
      <span>{intlObject.intl.formatMessage(messages.created)}</span>
      <span>{objectName.toLowerCase()}</span>
      {
        modelName &&
        <span>{modelName}</span>
      }
    </React.Fragment>
  ),
  [HISTORY_ACTION_UPDATE]: (objectName, modelName) => (
    <React.Fragment>
      <span>{intlObject.intl.formatMessage(messages.changed)}</span>
      <span>{objectName.toLowerCase()}</span>
      {
        modelName &&
        <span>{modelName}</span>
      }
    </React.Fragment>
  ),
  [HISTORY_ACTION_DELETE]: (objectName, modelName) => (
    <React.Fragment>
      <span>{intlObject.intl.formatMessage(messages.removed)}</span>
      <span>{objectName.toLowerCase()}</span>
      {
        modelName &&
        <span>{modelName}</span>
      }
    </React.Fragment>
  ),
  [HISTORY_BASE_OBJECT]: (objectName, modelName) => (
    <React.Fragment>
      <span>{objectName}</span>
      {
        modelName &&
        <span>{modelName}</span>
      }
    </React.Fragment>
  ),
}

export const HISTORY_ACTIONS_ICONS = {
  [HISTORY_ACTION_CREATE]: ICONS_TYPES.plus,
  [HISTORY_ACTION_UPDATE]: ICONS_TYPES.edit,
  [HISTORY_ACTION_DELETE]: ICONS_TYPES.trashBin,
}

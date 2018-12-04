import { ICONS_TYPES } from '$trood/components/TIcon'


export const HISTORY_ACTION_CREATE = 'create'
export const HISTORY_ACTION_UPDATE = 'update'

export const HISTORY_ACTIONS = {
  [HISTORY_ACTION_CREATE]: HISTORY_ACTION_CREATE,
  [HISTORY_ACTION_UPDATE]: HISTORY_ACTION_UPDATE,
}

export const HISTORY_ACTIONS_DICT = {
  [HISTORY_ACTION_CREATE]: (objectName) => `Объект "${objectName}" создан`,
  [HISTORY_ACTION_UPDATE]: (objectName) => `Объект "${objectName}" изменен:`,
}

export const HISTORY_ACTIONS_ICONS = {
  [HISTORY_ACTION_CREATE]: ICONS_TYPES.plus,
  [HISTORY_ACTION_UPDATE]: ICONS_TYPES.edit,
}

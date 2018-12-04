import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import classNames from 'classnames'

import { api, RestifyField, RestifyForeignKey, RESTIFY_CONFIG } from 'redux-restify'

import style from './index.css'

import TIcon, { ICONS_TYPES } from '$trood/components/TIcon'
import SmartDate, { SMART_DATE_FORMATS } from '$trood/components/SmartDate'

import {
  HISTORY_ACTIONS,
  HISTORY_ACTIONS_DICT,
  HISTORY_ACTIONS_ICONS,
} from '../../constants'

import { capitalize, camelToHuman, snakeToCamel } from '$trood/helpers/namingNotation'


class HistoryEntryBrickView extends PureComponent {
  static propTypes = {
    className: PropTypes.string,

    model: PropTypes.object,
  }

  static defaultProps = {
    className: '',
  }

  render() {
    const {
      className,

      model,
    } = this.props

    if (model.action === HISTORY_ACTIONS.update && !model.diff) return null

    const currentModelType = snakeToCamel(model.journalId)
    const currentModelConfig = RESTIFY_CONFIG.registeredModels[currentModelType]
    // @deylak I'm not sure, is this a crucial hack
    // Important that that state won't be observed,
    // so no updates will occure, when entities changes, but this is no big deal,
    // cause we have subscribed to restify api state
    // We could not pass every restify entities to the history, so we can get all linked entities
    const state = RESTIFY_CONFIG.store.getState()
    const diffKeys = Object.keys(model.diff)
    const currentDiff = diffKeys.map(fieldName => {
      let newValue = model.diff[fieldName].update
      let prevValue = model.revision[fieldName]

      const currentFieldConfig = currentModelConfig.defaults[fieldName]
      let fieldVerboseName = camelToHuman(fieldName)
      if (currentFieldConfig instanceof RestifyField && currentFieldConfig.verboseName) {
        fieldVerboseName = currentFieldConfig.verboseName
      }
      fieldVerboseName = capitalize(fieldVerboseName)

      if (currentFieldConfig instanceof RestifyForeignKey) {
        // Get linked entities, so we can display them
        const currentEntities = api.selectors.entityManager[currentFieldConfig.modelType].getEntities(state)
        newValue = currentEntities.getById(newValue)
        prevValue = currentEntities.getById(prevValue)
        // Check, if model has toNode function
        const currentFieldModelConfig = RESTIFY_CONFIG.registeredModels[currentFieldConfig.modelType]
        if (typeof currentFieldModelConfig.toNode === 'function') {
          newValue = currentFieldModelConfig.toNode(newValue)
          prevValue = currentFieldModelConfig.toNode(prevValue)
        } else {
          // Try some default model representations
          newValue = newValue.title || newValue.name || newValue.id
          prevValue = prevValue.title || prevValue.name || prevValue.id
        }
      }

      return (
        <div className={style.diffEntry} key={fieldName}>
          <div className={style.fieldName}>{fieldVerboseName}</div>
          <div className={style.diffFields}>
            <div className={style.fieldValue}>{prevValue}</div>
            <TIcon {...{
              type: ICONS_TYPES.arrowWithTail,
              className: style.updateIcon,
              rotate: 180,
              size: 15,
            }} />
            <div className={style.fieldValue}>{newValue}</div>
          </div>
        </div>
      )
    })

    const isMultipleEntryAction = model.action === HISTORY_ACTIONS.update && diffKeys.length > 1

    return (
      <div {...{
        className: classNames(style.root, className),
      }} >
        <TIcon {...{
          type: HISTORY_ACTIONS_ICONS[model.action],
          className: style.icon,
        }} />
        <div className={style.content}>
          <div className={isMultipleEntryAction ? style.multipleEntyAction : style.action}>
            <div className={style.actionType}>{HISTORY_ACTIONS_DICT[model.action](currentModelConfig.name)}</div>
            {currentDiff}
          </div>
        </div>
        <SmartDate {...{
          className: style.date,
          date: model.ts,
          format: SMART_DATE_FORMATS.fullWithTime,
        }} />
      </div>
    )
  }
}

const stateToProps = (state, props) => ({
  ...props,
  // We should rerender for every api change, so we don't miss some object updates(nested entities loaded for ex)
  restifyState: state.api,
})

export default connect(stateToProps)(HistoryEntryBrickView)

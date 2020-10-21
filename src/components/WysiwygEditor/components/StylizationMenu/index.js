import React from 'react'
import classNames from 'classnames'

import StyleButton from '../StyleButton'
import StyleColorPicker from '../StyleColorPicker'

import { intlObject } from '$trood/localeService'
import { messages } from '../../constants'

import style from './index.css'

const StylizationMenu = ({
  className,
  inlineStyles = [],
  textColorStyles = [],
  backgroundColorStyles = [],
  editorState = {},
  onToggle = () => {},
}) => {
  return (
    <div className={classNames(style.root, className)}>
      {inlineStyles.map(type => (
        <StyleButton {...{
          ...type,
          editorState,
          key: type.style,
          onToggle,
        }} />
      ))}
      {!!textColorStyles.length &&
        <StyleColorPicker {...{
          placeholder: intlObject.intl.formatMessage(messages.textColor),
          colorStyles: textColorStyles,
          editorState,
          onToggle,
        }} />
      }
      {!!backgroundColorStyles.length &&
        <StyleColorPicker {...{
          placeholder: intlObject.intl.formatMessage(messages.backgroundColor),
          colorStyles: backgroundColorStyles,
          editorState,
          onToggle,
        }} />
      }
    </div>
  )
}

export default StylizationMenu

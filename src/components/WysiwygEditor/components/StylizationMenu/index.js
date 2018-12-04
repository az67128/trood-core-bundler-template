import React from 'react'
import classNames from 'classnames'

import StyleButton from '../StyleButton'
import StyleColorPicker from '../StyleColorPicker'

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
          placeholder: 'Цвет текста',
          colorStyles: textColorStyles,
          editorState,
          onToggle,
        }} />
      }
      {!!backgroundColorStyles.length &&
        <StyleColorPicker {...{
          placeholder: 'Цвет фона',
          colorStyles: backgroundColorStyles,
          editorState,
          onToggle,
        }} />
      }
    </div>
  )
}

export default StylizationMenu

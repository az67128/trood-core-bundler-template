import React from 'react'
import classNames from 'classnames'

import FileBrickView from '../FileBrickView'

import { LIST_TYPES } from './constants'

import style from './index.css'

const FileListView = ({
  className,
  type = LIST_TYPES.horizontal,
  files = [],
}) => (
  <div className={classNames(style.root, style[type], className)}>
    {files.map(model => (
      <FileBrickView {...{
        key: model.id,
        className: style.file,
        model,
      }} />
    ))}
  </div>
)

export default FileListView

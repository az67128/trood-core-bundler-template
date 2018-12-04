import React from 'react'
import classNames from 'classnames'

import { FILE_API_HOST } from '$trood/fileApiUrlSchema'
import { formatSize } from '$trood/helpers/format'

import TIcon, { ICONS_TYPES } from '$trood/components/TIcon'

import style from './index.css'

const FileBrickView = ({
  className,
  model = {},
}) => {
  return (
    <a {...{
      className: classNames(style.root, className),
      href: `${FILE_API_HOST}${model.fileUrl}`,
      download: true,
      target: '_blank',
      rel: 'nofollow noopener',
    }}>
      <TIcon {...{
        size: 24,
        type: ICONS_TYPES.doc,
      }} />
      <div className={style.info}>
        <div className={style.name}>
          {model.originFilename}
        </div>
        <div className={style.size}>
          {formatSize(model.size)}
        </div>
      </div>
    </a>
  )
}

export default FileBrickView

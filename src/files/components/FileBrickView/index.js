import React from 'react'
import classNames from 'classnames'

import { FILE_API_HOST } from '$trood/fileApiUrlSchema'
import { formatSize } from '$trood/helpers/format'

import TIcon, { ICONS_TYPES } from '$trood/components/TIcon'

import style from './index.css'

const FileBrickView = ({
  className,
  model = {},
  filesActions = {},
}) => {
  let href = model.fileUrl
  if (!/^https?:\/\//.test(href)) {
    href = `${FILE_API_HOST}${href}`
  }
  const canOpen = filesActions.canOpenFile(model)
  return (
    <div className={classNames(style.root, className)}>
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
      <div className={style.controls}>
        {canOpen &&
          <TIcon {...{
            className: style.control,
            size: 18,
            type: ICONS_TYPES.search,
            onClick: () => filesActions.openFile(model),
          }} />
        }
        <a {...{
          className: style.control,
          href,
          download: true,
          target: '_blank',
          rel: 'nofollow noopener',
        }}>
          <TIcon {...{
            size: 18,
            type: ICONS_TYPES.arrowWithTail,
            rotate: -90,
          }} />
        </a>
      </div>
    </div>
  )
}

export default FileBrickView

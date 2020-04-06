import React from 'react'
import classNames from 'classnames'

import { FILE_API_HOST } from '$trood/fileApiUrlSchema'
import { formatSize } from '$trood/helpers/format'

import { FILE_TYPES } from '../../constants'

import TIcon, { ICONS_TYPES } from '$trood/components/TIcon'
import LoadingIndicator from '$trood/components/LoadingIndicator'

import style from './index.css'

const FileBrickView = ({
  className,
  model = {},
  isLoading,
  filesActions = {},
}) => {
  let href = model.fileUrl
  if (!/^(https?:)?\/\//.test(href)) {
    href = `${FILE_API_HOST}${href}`
  }
  let resizedHref = ((model.metadata || {}).resized || {}).thumb
  if (!resizedHref) resizedHref = href
  if (!/^(https?:)?\/\//.test(resizedHref)) {
    resizedHref = `${FILE_API_HOST}${resizedHref}`
  }
  const canOpen = filesActions.canOpenFile(model)

  let icon = (
    <TIcon {...{
      size: 24,
      className: style.icon,
      type: ICONS_TYPES.doc,
    }} />
  )

  if (model.type === FILE_TYPES.image) {
    icon = (
      <div {...{
        className: style.image,
        style: {
          backgroundImage: `url(${resizedHref})`,
        },
      }} />
    )
  }

  if (isLoading) {
    return (
      <div {...{
        className: classNames(style.root, className),
        'data-cy': `${model.$modelType}BrickView_${model.id}`,
      }}>
        {icon}
        <LoadingIndicator className={style.info} size={24} />
      </div>
    )
  }

  return (
    <div className={classNames(style.root, className)}>
      {icon}
      <div className={style.info}>
        <div className={style.name}>
          {model.originFilename}
        </div>
        <div className={style.size}>
          {formatSize(model.size)}
        </div>
      </div>
      <div className={style.controls}>
        {
          canOpen &&
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

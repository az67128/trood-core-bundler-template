import React from 'react'

import TIcon, { ICONS_TYPES } from '$trood/components/TIcon'

import styles from './index.css'


const DownloadButton = ({
  file: {
    fileUrl,
  },
}) => (
  <a {...{
    className: styles.root,
    href: fileUrl,
    target: '_blank',
    download: true,
  }}>
    <TIcon {...{
      size: 20,
      type: ICONS_TYPES.arrowWithTail,
      rotate: -90,
    }} />
  </a>
)

export default DownloadButton

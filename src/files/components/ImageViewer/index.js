import React from 'react'

import styles from './index.css'

const ImageViewer = ({ file: { fileUrl } }) => (
  <div {...{
    className: styles.root,
    style: {
      backgroundImage: `url(${fileUrl})`,
    },
  }} />
)

export default ImageViewer
export * from './components'

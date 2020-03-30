import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import classNames from 'classnames'

import style from './index.css'

import ImageViewer from '../ImageViewer'

import LoadingIndicator from '$trood/components/LoadingIndicator'
import TIcon from '$trood/components/TIcon'
import { ICONS_TYPES } from '$trood/components/TIcon/constants'

import {
  FILE_SOURCE_PROP_TYPE,
  IMAGE_FILE_FORMAT_REGEXP,
  FILE_TYPES,
  defineFormatByName,
} from '../../constants'

import { WHOLE_STRING_UUID_REGEXP } from 'constants'


const isInt = value => value === parseInt(value, 10)

const mapSourcesToDefaultFormat = (sources, filesEntities) => {
  return sources.map((source, index) => {
    const id = `$${index}` // No ocassional indecies collisions with ids
    if (typeof source === 'string') {
      return {
        file: source,
        id,
      }
    }
    let fileUrl
    if (typeof source.file === 'string') {
      if (source.file.match(WHOLE_STRING_UUID_REGEXP)) {
        fileUrl = filesEntities.getById(source.file).file
      } else {
        fileUrl = source.file
      }
    } else {
      fileUrl = source.file && source.file.file
    }
    return {
      ...source,
      id: source.id || id,
      file: fileUrl || '',
    }
  })
}

class TFilesGallery extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    filesEntities: PropTypes.object.isRequired,
    sources: PropTypes.arrayOf(FILE_SOURCE_PROP_TYPE),
    defaultOpenedImage: (props, propName, componentName) => {
      if (props[propName] === undefined) return undefined
      const nameCondition = props.sources.includes(props[propName])
      const indexCondition = isInt(props[propName]) && props[propName] < props.sources.length
      if (!nameCondition && !indexCondition) {
        return new Error(`
          Invalid prop ${propName} with value ${props[propName]} supplied to ${componentName}!
          Expected source file name or index in sources collection.
        `)
      }
      return undefined
    },
    isDeleteLoading: PropTypes.bool,
    onRemoveFile: PropTypes.func,

    // React element for rendering sources
    // Component provides theese props for template:
    // * openImageAction - open current source in ImageViewer
    // * removeFileAction - simple callback for passed onRemoveFile func
    // * source - unmodified source from sources
    // * format - file format object
    // * mapedSource - default mapped source, useful for files api mapping
    // * isDeleteLoading - is delete request is in process
    // * other props, passed to galery
    ItemTemplate: PropTypes.func,

    itemClassName: PropTypes.string,
  }

  static defaultProps = {
    className: '',
    sources: [],
    isDeleteLoading: false,
  }

  constructor(props) {
    super(props)
    const sources = mapSourcesToDefaultFormat(props.sources, props.filesEntities)
    this.state = {
      sources,
      openedImage: isInt(props.defaultOpenedImage) ? sources[props.defaultOpenedImage] : props.defaultOpenedImage,
    }

    this.openImage = this.openImage.bind(this)
    this.closeImage = this.closeImage.bind(this)
    this.getNextToSourceIndex = this.getNextToSourceIndex.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (this.props.sources !== prevProps.sources) {
      this.setState({ sources: mapSourcesToDefaultFormat(this.props.sources, this.props.filesEntities) })
    }
  }

  getNextToSourceIndex(index, direction = 1) {
    const {
      sources,
    } = this.state
    const incrementIndex = i => (sources.length + i + direction) % sources.length
    let newIndex = incrementIndex(index)
    while (sources[newIndex] && !sources[newIndex].file.match(IMAGE_FILE_FORMAT_REGEXP) && newIndex !== index) {
      newIndex = incrementIndex(newIndex)
    }
    return sources[newIndex]
  }

  openImage(source) {
    this.setState({ openedImage: source })
  }

  closeImage() {
    this.setState({ openedImage: null })
  }

  render() {
    const {
      className,

      onRemoveFile,
      isDeleteLoading,

      ItemTemplate,
      itemClassName,

      children,

      ...other
    } = this.props
    const {
      sources,
      openedImage,
    } = this.state

    const removeFileComp = (source, i) => (
      <div className={style.deleteIconContainer}>
        {isDeleteLoading &&
          <LoadingIndicator {...{
            size: 30,
            className: style.deleteIcon,
          }} />
        }
        {!isDeleteLoading &&
          <TIcon {...{
            size: 30,
            className: style.deleteIcon,
            type: ICONS_TYPES.trashBin,
            onClick: e => {
              e.stopPropagation()
              onRemoveFile(source, i)
            },
          }} />
        }
      </div>
    )

    return (
      <div className={classNames(style.root, className)}>
        {sources.map((source, i) => {
          const format = defineFormatByName(source.file)
          if (ItemTemplate) {
            return (
              <div key={i} className={style.templateWrapper}>
                <ItemTemplate {...{
                  className: itemClassName,
                  openImageAction: () => this.openImage(source),
                  removeFileComp: onRemoveFile && removeFileComp(source, i),
                  removeFileAction: onRemoveFile && (() => onRemoveFile(source, i)),
                  source: this.props.sources[i],
                  mapedSource: source,
                  isDeleteLoading,
                  format,
                  ...other,
                }} />
              </div>
            )
          }

          if (format.type === FILE_TYPES.image) {
            return (
              <div {...{
                className: classNames(style.imageContainer, itemClassName),
                key: i,
                onClick: () => this.openImage(source),
              }}>
                {onRemoveFile && removeFileComp(source, i)}
                <img src={source.file} alt={i} />
              </div>
            )
          }

          return (
            <a
              key={i}
              download
              href={source.file}
              className={classNames(style.iconContainer, itemClassName)}>
              <img src={`/static/${format.type}.png`} alt={i} />
              {format.type === FILE_TYPES.common &&
                <span className={style.iconFormat}>{format.ext}</span>
              }
            </a>
          )
        })}
        {children}
        <ImageViewer
          show={!!openedImage}
          onNext={() => this.openImage(this.getNextToSourceIndex(sources.map(s => s.id).indexOf(openedImage.id)))}
          onPrev={() => this.openImage(this.getNextToSourceIndex(sources.map(s => s.id).indexOf(openedImage.id), -1))}
          closeAction={() => this.closeImage()}
        >
          {openedImage &&
            <img src={openedImage.file} alt={openedImage.file} />
          }
        </ImageViewer>
      </div>
    )
  }
}

export default TFilesGallery

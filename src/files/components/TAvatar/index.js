import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { browserHistory } from 'react-router'
import classNames from 'classnames'

import style from './index.css'
import { DEFAULT_SIZE } from './constants'

import TFileInput from '../TFileInput'
import TAvatarEditor from '../TAvatarEditor'
import TIcon from '$trood/components/TIcon'
import { ICONS_TYPES } from '$trood/components/TIcon/constants'

import { UUID_REGEXP } from '$trood/mainConstants'

import { FILE_API_HOST } from '$trood/fileApiUrlSchema'


const avatarUUIDRegExp = new RegExp(`^${UUID_REGEXP.source}$`)

class TAvatar extends PureComponent {
  static propTypes = {
    label: PropTypes.node,
    defaultAvatar: PropTypes.string,
    host: PropTypes.string,
    avatar: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
    linkTo: PropTypes.string,
    size: PropTypes.number,
    round: PropTypes.bool,
    editable: PropTypes.bool,
    canClear: PropTypes.bool,
    onChange: PropTypes.func,
    className: PropTypes.string,
    labelClassName: PropTypes.string,
    filesEntities: PropTypes.object,
  }

  static defaultProps = {
    size: DEFAULT_SIZE,
    defaultAvatar: '/static/img/defaultAvatar.png',
    host: FILE_API_HOST,
    round: false,
    editable: false,
    canClear: false,
    onChange: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {}
    this.setEditFile = this.setEditFile.bind(this)
    this.setNewAvatar = this.setNewAvatar.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.avatar !== nextProps.avatar && typeof nextProps.avatar !== 'object') {
      this.setState({ newAvatar: undefined, editFile: undefined })
    }
  }

  setEditFile(value) {
    if (!value) return this.setState({ editFile: undefined })
    const reader = new FileReader()
    reader.onload = file => this.setState({ editFile: file.target.result })
    reader.readAsDataURL(value)
    return true
  }

  setNewAvatar(value = {}) {
    const returnedVal = { ...value, imgFile: value.imgFile || null }
    this.setState({ newAvatar: value.imgDataURL, editFile: undefined })
    this.props.onChange(returnedVal)
  }

  render() {
    const {
      label,
      defaultAvatar,
      host,
      size,
      round,
      editable,
      canClear,
      className,
      labelClassName,
      linkTo,
      filesEntities,
    } = this.props

    const {
      newAvatar,
      editFile,
    } = this.state

    let {
      avatar,
    } = this.props
    if (avatar && typeof avatar === 'object') {
      avatar = this.props.avatar.fileUrl
    }
    if (avatar && (avatarUUIDRegExp.test(avatar) || Number.isInteger(avatar))) {
      avatar = filesEntities.getById(avatar).fileUrl
    }
    if (avatar && !avatar.match(/https?:\/\//)) {
      avatar = host + avatar
    }
    return (
      <div {...{
        className: classNames(style.root, className),
        style: {
          width: size,
          cursor: linkTo && 'pointer',
        },
        onClick: linkTo && (() => browserHistory.push(linkTo)),
      }}>
        {label &&
          <div className={classNames(style.label, labelClassName)}>
            {label}
          </div>
        }
        <div {...{
          className: classNames(style.avatarBox, { [style.round]: round }),
          style: { height: size },
        }}>
          {canClear && editable && !!(newAvatar || avatar) &&
            <TIcon {...{
              type: ICONS_TYPES.clear,
              className: style.clear,
              onClick: () => this.setNewAvatar(),
            }} />
          }
          <img src={newAvatar || avatar || defaultAvatar} alt="avatar" />
        </div>
        {editable &&
          <TFileInput {...{
            key: `${avatar}${editFile}FileInput`,
            className: style.uploadButton,
            label: <div className={style.uploadLabel}>Загрузить</div>,
            onChange: (values) => this.setEditFile(values[0]),
          }} />
        }
        {editable && editFile &&
          <TAvatarEditor {...{
            key: `${avatar}${editFile}AvatarInput`,
            image: editFile,
            onClose: () => this.setEditFile(),
            onSubmit: this.setNewAvatar,
          }} />
        }
      </div>
    )
  }
}

export default TAvatar

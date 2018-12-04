import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import Modal from 'react-modal'

import style from './index.css'

import { ICONS_TYPES } from '$trood/components/TIcon/constants'
import TIcon from '$trood/components/TIcon'

import { KEY_CODES } from 'constants'


const defx = () => {}

class ImageViewer extends PureComponent {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    closeAction: PropTypes.func,
    onPrev: PropTypes.func,
    onNext: PropTypes.func,
    shouldCloseOnOverlayClick: PropTypes.bool,
    children: PropTypes.node,
  }

  static defaultProps = {
    closeAction: defx,
    onPrev: defx,
    onNext: defx,
    shouldCloseOnOverlayClick: false,
  }

  constructor(props) {
    super(props)

    this.actionsDict = {
      [KEY_CODES.esc]: props.closeAction,
      [KEY_CODES.arrowLeft]: props.onPrev,
      [KEY_CODES.arrowRight]: props.onNext,
    }

    this.keyDown = this.keyDown.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.actionsDict = {
      [KEY_CODES.esc]: nextProps.closeAction,
      [KEY_CODES.arrowLeft]: nextProps.onPrev,
      [KEY_CODES.arrowRight]: nextProps.onNext,
    }
  }

  keyDown(event) {
    if (this.actionsDict[event.keyCode]) {
      this.actionsDict[event.keyCode]()
    }
  }

  render() {
    const {
      show,
      closeAction,
      onPrev,
      onNext,
      children,
      shouldCloseOnOverlayClick,
    } = this.props

    return (
      <Modal {...{
        isOpen: show !== false,
        onRequestClose: closeAction,
        shouldCloseOnOverlayClick,
        className: style.root,
        overlayClassName: style.overlay,
        onAfterOpen: () => this.modal.focus(),
        contentLabel: 'Modal',
      }}>
        <div {...{
          className: style.root,
          ref: el => {
            this.modal = el
            return undefined
          },
          tabIndex: '-1',
          onKeyDown: event => this.keyDown(event),
        }} >
          <div className={style.prev} onClick={onPrev}>
            &lt;
          </div>
          {React.Children.map(children, (child, i) => (
            <div className={style.imageWrapper} key={i}>
              <TIcon {...{
                type: ICONS_TYPES.clear,
                className: style.close,
                onClick: closeAction,
              }} />
              {child}
            </div>
          ))}
          <div className={style.next} onClick={onNext}>
            &gt;
          </div>
        </div>
      </Modal>
    )
  }
}

export default ImageViewer

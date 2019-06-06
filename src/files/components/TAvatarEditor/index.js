import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import classNames from 'classnames'

import style from './index.css'
import modalsStyle from '$trood/styles/modals.css'

import { DEFAULT_SIZE, DEFAULT_TYPE, DEFAULT_FILL_COLOR, TYPES_EXT, DEFAULT_ZOOM, MIN_ZOOM } from './constants'
import ImageDataConverter from '$trood/helpers/imageDataConverter'

import TButton from '$trood/components/TButton'
import TRange from '$trood/components/TRange'


const isBase64 = (str = '') => {
  const regEx = /^\s*data:image[a-z/\\]*;base64,.*$/i
  return !!str.match(regEx)
}

class TAvatarEditor extends PureComponent {
  static propTypes = {
    image: PropTypes.string.isRequired,
    returnImgType: PropTypes.oneOf(Object.keys(TYPES_EXT)),
    fillColor: (props, propName, componentName) => {
      if (/#[0-9A-F]{6}/.test(props[propName])) return null
      return new Error(`Invalid prop '${propName}' supplied to '${componentName}'. Validation failed.`)
    },
    width: PropTypes.number,
    height: PropTypes.number,
  }

  static defaultProps = {
    returnImgType: DEFAULT_TYPE,
    fillColor: DEFAULT_FILL_COLOR,
    width: DEFAULT_SIZE,
    height: DEFAULT_SIZE,
  }

  constructor(props) {
    super(props)
    this.state = {
      dragging: false,
      image: {},
      mouse: {
        x: undefined,
        y: undefined,
      },
      zoom: DEFAULT_ZOOM,
      minZoom: MIN_ZOOM,
    }
    this.listeners = {}

    this.bindEvents = this.bindEvents.bind(this)
    this.unbindEvents = this.unbindEvents.bind(this)
    this.fitImageToCanvas = this.fitImageToCanvas.bind(this)
    this.prepareImage = this.prepareImage.bind(this)
    this.mouseDownListener = this.mouseDownListener.bind(this)
    this.preventSelection = this.preventSelection.bind(this)
    this.mouseUpListener = this.mouseUpListener.bind(this)
    this.mouseMoveListener = this.mouseMoveListener.bind(this)
    this.boundedCoords = this.boundedCoords.bind(this)
    this.addImageToCanvas = this.addImageToCanvas.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.handleZoomUpdate = this.handleZoomUpdate.bind(this)
  }

  componentDidMount() {
    this.prepareImage(this.props.image)
    this.listeners = {
      mousemove: e => this.mouseMoveListener({ x: e.clientX, y: e.clientY }),
      touchmove: e => this.mouseMoveListener({ x: e.touches[0].clientX, y: e.touches[0].clientY }),
      mouseup: e => this.mouseUpListener(e),
      mousedown: e => this.mouseDownListener(e),
    }
    document.onselectstart = e => this.preventSelection(e)
  }

  componentDidUpdate() {
    this.unbindEvents()
    this.bindEvents()
    const context = this.canvas.getContext('2d')
    context.clearRect(0, 0, this.props.width, this.props.height)
    this.addImageToCanvas(context, this.state.image)
  }

  componentWillUnmount() {
    this.unbindEvents()
  }

  onSubmit() {
    const imgDataURL = this.toDataURL()
    // convert base64 to imgFile
    const imgFile = (new ImageDataConverter(imgDataURL)).dataURItoBlob()
    // end convert
    this.props.onSubmit({ imgDataURL, imgFile })
    this.props.closeAction()
  }

  bindEvents() {
    const { canvas } = this
    window.addEventListener('mousemove', this.listeners.mousemove, false)
    canvas.addEventListener('touchmove', this.listeners.touchmove, false)
    window.addEventListener('mouseup', this.listeners.mouseup, false)
    canvas.addEventListener('touchend', this.listeners.mouseup, false)
    canvas.addEventListener('mousedown', this.listeners.mousedown, false)
    canvas.addEventListener('touchstart', this.listeners.mousedown, false)
  }

  unbindEvents() {
    const { canvas } = this
    window.removeEventListener('mousemove', this.listeners.mousemove, false)
    canvas.removeEventListener('touchmove', this.listeners.touchmove, false)
    window.removeEventListener('mouseup', this.listeners.mouseup, false)
    canvas.removeEventListener('touchend', this.listeners.mouseup, false)
    canvas.removeEventListener('mousedown', this.listeners.mousedown, false)
    canvas.removeEventListener('touchstart', this.listeners.mousedown, false)
  }

  fitImageToCanvas(width, height) {
    const canvasAspectRatio = this.props.height / this.props.width
    const imageAspectRatio = height / width
    let scaleRatio = canvasAspectRatio > imageAspectRatio ? height / this.props.height : width / this.props.width
    scaleRatio = scaleRatio < 1 ? 1 : Math.floor(scaleRatio * 1000) / 1000
    this.setState({ maxZoom: scaleRatio })
    return { width: width / scaleRatio, height: height / scaleRatio }
  }

  prepareImage(imageUri) {
    const img = new Image()
    if (!isBase64(imageUri)) img.crossOrigin = 'anonymous'
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const scaledImage = this.fitImageToCanvas(img.width, img.height)
      scaledImage.resource = img
      scaledImage.x = 0
      scaledImage.y = 0
      this.setState({ dragging: false, image: scaledImage })
    }
    img.src = imageUri
  }

  mouseDownListener() {
    this.setState({
      image: this.state.image,
      dragging: true,
      mouse: {
        x: undefined,
        y: undefined,
      },
    })
  }

  preventSelection(e) {
    if (this.state.dragging) {
      e.preventDefault()
      return false
    }
    return true
  }

  mouseUpListener() {
    this.setState({ dragging: false })
  }

  mouseMoveListener(e) {
    if (!this.state.dragging) return
    const newImage = this.state.image

    if (this.state.mouse.x && this.state.mouse.y) {
      const dx = this.state.mouse.x - e.x
      const dy = this.state.mouse.y - e.y
      const bounded = this.boundedCoords(this.state.image.x, this.state.image.y, dx, dy)
      newImage.x = bounded.x
      newImage.y = bounded.y
    }

    this.setState({
      image: newImage,
      mouse: {
        x: e.x,
        y: e.y,
      },
    })
  }

  handleZoomUpdate(value) {
    this.setState({ zoom: value })
  }

  boundedCoords(x, y, dx, dy) {
    const newX = x - dx
    const newY = y - dy

    const scaledWidth = this.state.image.width * this.state.zoom
    const dw = (scaledWidth - this.state.image.width) / 2
    const rightEdge = this.props.width

    let x1
    if (newX - dw > 0) x1 = dw
    else if (newX < (-scaledWidth + rightEdge)) x1 = rightEdge - scaledWidth
    else x1 = newX

    const scaledHeight = this.state.image.height * this.state.zoom
    const dh = (scaledHeight - this.state.image.height) / 2
    const bottomEdge = this.props.height

    let y1
    if (newY - dh > 0) y1 = dh
    else if (newY < (-scaledHeight + bottomEdge)) y1 = bottomEdge - scaledHeight
    else y1 = newY

    return { x: x1, y: y1 }
  }

  addImageToCanvas(context, image) {
    if (!image.resource) return

    const context1 = context
    context1.save()
    context1.globalCompositeOperation = 'destination-over'
    const scaledWidth = this.state.image.width * this.state.zoom
    const scaledHeight = this.state.image.height * this.state.zoom

    let x = image.x - (scaledWidth - this.state.image.width) / 2
    let y = image.y - (scaledHeight - this.state.image.height) / 2

    x = Math.min(x, 0)
    y = Math.min(y, 0)
    y = scaledHeight + y >= this.props.height ? y : (y + (this.props.height - (scaledHeight + y)))
    x = scaledWidth + x >= this.props.width ? x : (x + (this.props.width - (scaledWidth + x)))
    y = this.props.height < scaledHeight ? y : (this.props.height - scaledHeight) / 2
    x = this.props.width < scaledWidth ? x : (this.props.width - scaledWidth) / 2

    context1.drawImage(image.resource, x, y, image.width * this.state.zoom, image.height * this.state.zoom)
    context1.fillStyle = this.props.fillColor
    context1.fillRect(0, 0, this.props.width, this.props.height)
    context1.restore()
  }

  toDataURL() {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.width = this.props.width
    canvas.height = this.props.height

    this.addImageToCanvas(context, {
      resource: this.state.image.resource,
      x: this.state.image.x,
      y: this.state.image.y,
      height: this.state.image.height,
      width: this.state.image.width,
    })

    return canvas.toDataURL(this.props.returnImgType, 0.75)
  }

  render() {
    const { width, height } = this.props

    return (
      <div className={style.root}>
        <div className={classNames(modalsStyle.root, style.avatarConteiner)}>
          <canvas {...{
            className: style.canvas,
            ref: (node) => {
              this.canvas = node
            },
            width,
            height,
          }} />
          {
            this.state.maxZoom > this.state.minZoom &&
            <TRange {...{
              className: style.range,
              onChange: (value) => this.handleZoomUpdate(value),
              min: this.state.minZoom,
              max: this.state.maxZoom,
              step: 0.01,
              defaultValue: 1,
            }} />
          }
        </div>
        <div className={modalsStyle.buttonsContainer}>
          <TButton {...{
            className: modalsStyle.button,
            onClick: this.onSubmit,
            label: 'Save',
          }} />
        </div>
      </div>
    )
  }
}

export default TAvatarEditor

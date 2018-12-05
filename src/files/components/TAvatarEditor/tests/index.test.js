/* eslint-disable max-len */
import React from 'react'
import { mount } from 'enzyme'
import jasmineEnzyme from 'jasmine-enzyme'

import TAvatarEditor from '../'
import { DEFAULT_SIZE } from '../constants'


const imgBase64 = 'data:image/gif;base64,R0lGODlhAQABAAAAACw='

let onClose
let onSubmit

describe('<TAvatarEditor />', () => {
  beforeEach(() => {
    jasmineEnzyme()
    onClose = jasmine.createSpy('onClose')
    onSubmit = jasmine.createSpy('onSubmit')
  })

  it('renders normally', () => {
    const props = {
      image: imgBase64,
    }
    const wrapper = mount(<TAvatarEditor {...props} />)
    expect(wrapper.find('TModal')).toBePresent()
    expect(wrapper.ref('canvas')).toBePresent()
    wrapper.setProps({ modal: false })
    expect(wrapper.find('TModal')).not.toBePresent()
    expect(wrapper.ref('canvas')).toBePresent()
  })

  it('has close and submit buttons with callbacks', () => {
    const props = {
      image: imgBase64,
      modal: false,
      onClose,
      onSubmit,
    }
    const wrapper = mount(<TAvatarEditor {...props} />)
    const buttons = wrapper.find('button')
    expect(buttons.length).toBe(2)
    buttons.at(0).simulate('click')
    buttons.at(1).simulate('click')
    expect(onClose).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalled()
  })

  it('setup canvas size', () => {
    const props = {
      image: imgBase64,
    }
    const wrapper = mount(<TAvatarEditor {...props} />)
    expect(wrapper.ref('canvas').prop('width')).toBe(DEFAULT_SIZE)
    expect(wrapper.ref('canvas').prop('height')).toBe(DEFAULT_SIZE)
    wrapper.setProps({ width: 128, height: 96 })
    expect(wrapper.ref('canvas').prop('width')).toBe(128)
    expect(wrapper.ref('canvas').prop('height')).toBe(96)
  })
})

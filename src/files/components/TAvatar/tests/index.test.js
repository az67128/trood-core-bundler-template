import React from 'react'
import { mount } from 'enzyme'
import jasmineEnzyme from 'jasmine-enzyme'

import TAvatar from '../'


const imgLink = 'http://clubtone.net/avatar/78/987424.jpg'
const imgBase64 = 'data:image/gif;base64,R0lGODlhAQABAAAAACw='

describe('<TAvatar />', () => {
  beforeEach(() => {
    jasmineEnzyme()
  })

  it('renders normally', () => {
    const props = {
      avatar: imgLink,
    }
    const wrapper = mount(<TAvatar {...props} />)
    expect(wrapper.find('img').prop('src')).toBe(imgLink)
    wrapper.instance().setNewAvatar({ imgDataURL: imgBase64 })
    expect(wrapper.find('img').prop('src')).toBe(imgBase64)
  })

  it('is editable/not editable', () => {
    const props = {
      avatar: imgLink,
    }
    const wrapper = mount(<TAvatar {...props} />)
    expect(wrapper.find('TButton')).not.toBePresent()
    wrapper.setProps({ editable: true })
    expect(wrapper.find('TButton')).toBePresent()
  })

  it('is in edit mode', () => {
    const props = {
      avatar: imgLink,
      editable: true,
    }
    const wrapper = mount(<TAvatar {...props} />)
    expect(wrapper.find('TAvatarEditor')).not.toBePresent()
    wrapper.setState({ editFile: imgBase64 })
    expect(wrapper.find('TAvatarEditor')).toBePresent()
    wrapper.setState({ editFile: undefined })
    expect(wrapper.find('TAvatarEditor')).not.toBePresent()
  })
})

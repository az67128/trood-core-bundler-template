import React from 'react'
import { mount } from 'enzyme'
import jasmineEnzyme from 'jasmine-enzyme'

import { addDotToStyles } from '$trood/helpers/tests'

import TSelect from '../'
import style from '../index.css'


const dotStyle = addDotToStyles(style)

const selectItems = count => (new Array(count).fill(0)).map((a, b) => ({
  value: b,
  label: `item ${b}`,
}))

let onChange

describe('<TSelect />', () => {
  beforeEach(() => {
    jasmineEnzyme()
    onChange = jasmine.createSpy('onChange')
  })

  it('has correct count items', () => {
    const wrapper = mount(<TSelect {...{
      items: selectItems(5),
    }} />)
    expect(wrapper.find('li').length).toBe(5)
    wrapper.setProps({ items: selectItems(100) })
    expect(wrapper.find('li').length).toBe(100)
  })

  it('has onChange event', () => {
    const wrapper = mount(<TSelect {...{
      onChange,
      items: selectItems(5),
    }} />)
    expect(onChange).not.toHaveBeenCalled()
    wrapper.instance().select(0)
    expect(onChange).toHaveBeenCalled()
  })
})

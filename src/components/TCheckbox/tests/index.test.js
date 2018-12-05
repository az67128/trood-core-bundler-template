import React from 'react'
import { mount } from 'enzyme'
import { addDotToStyles } from '$trood/helpers/tests'
import jasmineEnzyme from 'jasmine-enzyme'

import TCheckbox from '../'
import { LABEL_POSITION_TYPES } from '../../internal/EnchancedSwitch/constants'
import TIcon from '$trood/components/TIcon'
import style from '../index.css'


const dotStyle = addDotToStyles(style)

const ERROR_TEXT = 'some error'
const EMPTY_STRING = ''
const REACT_ELEMENT = <TIcon type="rub" />

let onChange

describe('<TCheckbox />', () => {
  beforeEach(() => {
    jasmineEnzyme()
    onChange = jasmine.createSpy('onChange')
  })

  it('changes value of checked/unchecked prop correctly', () => {
    const props = {
      onChange,
    }
    const wrapper = mount(<TCheckbox {...props} />)
    expect(onChange).not.toHaveBeenCalled()
    wrapper.find('input').simulate('change')
    expect(onChange).toHaveBeenCalled()
    expect(wrapper.find('input').prop('checked')).toBe(false)
    wrapper.setProps({ value: true })
    expect(wrapper.find('input').prop('checked')).toBe(true)
    wrapper.setProps({ value: false })
    expect(wrapper.find('input').prop('checked')).toBe(false)
  })

  it('has disabled prop', () => {
    const wrapper = mount(<TCheckbox />)
    expect(wrapper.prop('disabled')).toBe(false)
    wrapper.setProps({ disabled: true })
    expect(wrapper.find('input').prop('disabled')).toBe(true)
  })

  it('has type prop that set the className of .checkboxCustom', () => {
    const wrapper = mount(<TCheckbox />)
    wrapper.setProps({ type: LABEL_POSITION_TYPES.right })
    expect(wrapper.find(dotStyle.checkboxCustom)).toHaveClassName(dotStyle.right)
    wrapper.setProps({ type: LABEL_POSITION_TYPES.left })
    expect(wrapper.find(dotStyle.checkboxCustom)).toHaveClassName(dotStyle.left)
  })

  it('displays its errors correctly', () => {
    const wrapper = mount(<TCheckbox />)
    wrapper.setProps({ error: ERROR_TEXT })
    expect(wrapper.find(dotStyle.errorBox)).not.toHaveClassName(dotStyle.errorBoxHidden)
    expect(wrapper.find(dotStyle.errorMsg).isEmpty()).toBe(false)
    expect(wrapper.find(dotStyle.errorMsg).text()).toMatch(ERROR_TEXT)
    expect(wrapper.prop('error')).toEqual(ERROR_TEXT)

    wrapper.setProps({ error: EMPTY_STRING })
    expect(wrapper.find(dotStyle.checkboxCustom)).toHaveClassName(dotStyle.checkboxCustomError)
    expect(wrapper.find(dotStyle.errorMsg).text()).toMatch(EMPTY_STRING)
    expect(wrapper.prop('error')).toEqual(EMPTY_STRING)

    wrapper.setProps({ error: undefined })
    expect(wrapper.find(dotStyle.errorBoxHidden)).not.toHaveClassName(dotStyle.errorBox)
  })

  it('renders a component in .label', () => {
    const props = {
      label: REACT_ELEMENT,
    }
    const wrapper = mount(<TCheckbox {...props} />)
    expect(wrapper.find(dotStyle.label).containsMatchingElement(REACT_ELEMENT)).toEqual(true)
  })
})

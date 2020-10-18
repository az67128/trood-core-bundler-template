import React from 'react'
import { mount } from 'enzyme'
import jasmineEnzyme from 'jasmine-enzyme'

import { addDotToStyles } from '$trood/helpers/tests'

import TIcon from '../'
import style from '../index.css'

import { ICONS_TYPES, LABEL_POSITION_TYPES, ROTATE_TYPES, ROTATE_VALUES } from '../constants'


const dotStyle = addDotToStyles(style)
const iconsTypes = Object.keys(ICONS_TYPES)
const rotateTypes = [1, 100, 200].concat(Object.values(ROTATE_TYPES))
const labelPositionTypes = Object.values(LABEL_POSITION_TYPES)

let onClick

describe('<TIcon />', () => {
  beforeEach(() => {
    jasmineEnzyme()
    onClick = jasmine.createSpy('onClick')
  })

  iconsTypes.forEach(type => {
    it(`renders correctly with type ${type} and without label`, () => {
      const props = {
        type,
      }
      const wrapper = mount(<TIcon {...props} />)
      labelPositionTypes.forEach(labelPosition =>
        expect(wrapper.find(dotStyle[labelPosition])).not.toBePresent())
    })

    labelPositionTypes.forEach(labelPosition =>
      rotateTypes.forEach(rotate => {
        it(`renders correctly with type ${type}, label, labelPosition ${labelPosition} and rotate ${rotate}`, () => {
          const props = {
            type,
            rotate,
            labelPosition,
            label: 'label',
          }
          const wrapper = mount(<TIcon {...props} />)
          expect(wrapper.find('svg')).toBePresent()
          expect(wrapper.find(dotStyle.svgWrapper)).toBePresent()
          expect(wrapper.find(dotStyle[labelPosition])).toBePresent()
          const expectedRotate = typeof rotate === 'string' ? ROTATE_VALUES[rotate] : rotate
          expect(wrapper.find(dotStyle.svgWrapper)).toHaveStyle('transform', `rotate(${expectedRotate}deg)`)
        })
      }))

    it('has onClick event', () => {
      const props = {
        type,
        onClick,
      }
      const wrapper = mount(<TIcon {...props} />)
      wrapper.simulate('click')
      expect(onClick).toHaveBeenCalled()
    })
  })
})

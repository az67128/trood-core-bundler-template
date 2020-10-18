import React from 'react'
import TIcon from '../'

import { ICONS_TYPES, ROTATE_TYPES, LABEL_POSITION_TYPES } from '../constants'


const iconsTypes = Object.keys(ICONS_TYPES)
const rotateTypes = Object.values(ROTATE_TYPES)
const labelPositionTypes = Object.values(LABEL_POSITION_TYPES)

const Test = () => (
  <div>
    <style>
      {`.iconsTestClass {
        margin-left: 20px;
        color: green;
      }`}
    </style>
    {iconsTypes.map((type, i) =>
      labelPositionTypes.map((labelPosition, j) => {
        return (
          <div
            key={i * 10 + j}
            style={{
              display: 'flex',
              paddingTop: 20,
            }}
          >
            {rotateTypes.map(rotate => (
              <TIcon {...{
                key: rotate,
                size: 20,
                className: 'iconsTestClass',
                type,
                rotate,
                label: type,
                labelPosition,
              }} />
            ))}
          </div>
        )
      }))}
  </div>
)

export default Test

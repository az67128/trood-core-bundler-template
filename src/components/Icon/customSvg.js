import React from 'react'
import BaseComponent from 'core/BaseComponent'
import { Component } from 'core/pageStore'


const CustomSvg = ({
  svgNodes = [],
  svgViewBox = [512, 512],
  ...other
}) => {
  const nodesStore = Component.create({ nodes: svgNodes })
  return (
    <svg viewBox={`0 0 ${svgViewBox[0]} ${svgViewBox[1] || svgViewBox[0]}`} {...other}>
      <BaseComponent component={nodesStore} />
    </svg>
  )
}

export default CustomSvg

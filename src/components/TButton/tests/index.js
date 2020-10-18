import React from 'react'
import Comp from '../'

const prs = [{
  label: 'Label',
}, {
  label: 'Very very very very very very very long label',
}, {
  label: 'Thin',
  thin: true,
}, {
  label: 'Disabled',
  disabled: true,
}, {
  label: 'White',
  color: 'white',
}, {
  label: 'Grey',
  color: 'grey',
}, {
  label: 'Thin White',
  color: 'white',
  thin: true,
}, {
  label: 'Thin Grey',
  color: 'grey',
  thin: true,
}]

export default () => {
  return (
    <div>
      {prs.map((pr, i) => (<Comp key={i} {...pr} />))}
    </div>
  )
}

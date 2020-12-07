import React from 'react'
import PropTypes from 'prop-types'

import './index.css'


const Container = ({
  children,
  className = '',
  fluid = false,
  bddmark = 'контейнер',
  ...other
}) => (
  <div
    {...other}
    className={`aa-Container ${!fluid ? 'aa-Container_withMaxWidth':''} ${className}`}
    bddmark={bddmark}
  >
    {children}
  </div>
)

Container.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.array]).isRequired,
  className: PropTypes.string,
  fluid: PropTypes.bool,
  bddmark: PropTypes.string,
}

export default Container

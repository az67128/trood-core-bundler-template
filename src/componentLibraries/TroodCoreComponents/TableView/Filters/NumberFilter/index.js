import React, { useRef, useEffect } from 'react'
import TLabel from '$trood/components/TLabel'
import TInput, { INPUT_TYPES } from '$trood/components/TInput'
import { intlObject } from '$trood/localeService'
import { messages } from '../../constants'
import basePageLayout from '$trood/styles/basePageLayout.css'
import style from '../style.css'

const NumberFilter = ({ value = {}, label, onChange }) => {
  const internaValue = useRef(value)

  useEffect(() => {
    internaValue.current = value
  }, [value])

  return (
    <div className={basePageLayout.blockFilter}>
      <TLabel label={label} />
      <div className={style.numberFilter}>
        <TInput
          {...{
            className: style.numberFilterMin,
            placeholder: intlObject.intl.formatMessage(messages.min),
            onChange: (val) => onChange({ ...internaValue.current, min: val }),
            value: value.min || '',
            type: INPUT_TYPES.number,
          }}
        />
        <TInput
          {...{
            placeholder: intlObject.intl.formatMessage(messages.max),
            onChange: (val) => onChange({ ...internaValue.current, max: val }),
            value: value.max || '',
            type: INPUT_TYPES.number,
          }}
        />
      </div>
    </div>
  )
}

export default NumberFilter

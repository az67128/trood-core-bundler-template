import styled from 'styled-components'

import Context from './Context'

import Row from './Grids/Row'
import Cell from './Grids/Cell'
import Container from './Grids/Container'

import Button from './Button'
import Checkbox from './Checkbox'
import DateTimePicker from './DateTimePicker'
import Icon from './Icon'
import Input from './Input'
import List from './List'
import Modal from './Modal'
import Label from './Label'
import Spacer from './Spacer'
import { Link } from 'react-router-dom'
import { Switch } from 'react-router-dom'
import Route from './Route'
import Remote from './Remote'

const components = {
  Context,

  Row,
  Cell,
  Container,

  Button,
  Checkbox,
  DateTimePicker,
  Icon,
  Input,
  List,
  Link,
  Modal,
  Switch,
  Route,
  Label,
  Spacer,
  Remote,
}

export default Object.keys(components).reduce((memo, key) => ({
  ...memo,
  [key]: styled(components[key])`${(props = {}) => props.style || ''}`,
}), {})
